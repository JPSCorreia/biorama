import {makeAutoObservable, runInAction} from "mobx";
import {homeAddressStore} from "./homeAddressStore.js";

class AuthStore {
    user = null;
    isAuthenticated = false;

    constructor() {
        makeAutoObservable(this);
    }

    updateAuth(auth) {
        this.isAuthenticated = !!auth?.user;
        this.user = auth?.user || null;
        this.user === null ? homeAddressStore.clearAddresses() : homeAddressStore.fetchAddresses();
    }

    updateUserData(updatedData) {
        runInAction(() => {
            if (this.user) {
                this.user = { ...this.user, ...updatedData }; // Atualiza os dados do utilizador
                console.log(this.user);
            }
        });
    }

    clearAuth() {
        this.isAuthenticated = false;
        this.user = null;
    }

}

export const authStore = new AuthStore();
