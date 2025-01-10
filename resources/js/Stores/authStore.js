import { makeAutoObservable } from "mobx";
import {homeAddressStore} from "@/Stores/homeAddressStore.js";

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

    clearAuth() {
        this.isAuthenticated = false;
        this.user = null;
    }

}

export const authStore = new AuthStore();
