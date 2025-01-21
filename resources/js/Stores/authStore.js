import {action, makeObservable, observable, runInAction} from "mobx";
import {makePersistable} from "mobx-persist-store";
import {homeAddressStore} from "./homeAddressStore.js";
import axios from "axios";
import {usePage} from "@inertiajs/react";

class AuthStore {
    user = null;
    isAuthenticated = false;

    constructor() {
        makeObservable(this, {
            user: observable,
            isAuthenticated: observable,

            updateAuth: action,
            clearAuth: action,
            updateUserData: action,
            submitDataUser: action,
        });
        makePersistable(this, {
            name: "authStore",
            properties: ["user", "isAuthenticated"],
            storage: window.sessionStorage,
        });
    }

    updateAuth(auth) {
        if (auth?.user) {
            this.isAuthenticated = true;
            this.user = auth.user;
            homeAddressStore.addresses = homeAddressStore.fetchAddresses();
        } else if (!this.isAuthenticated) {
            this.isAuthenticated = false;
            this.user = null;
            homeAddressStore.clearAddresses();
        }
    }



    updateUserData(updatedData) {
        runInAction(() => {
            if (this.user) {
                this.user = { ...this.user, ...updatedData }; // Atualiza os dados do utilizador
                console.log("User da Store que foi atualizado: ", this.user);
            }
            this.submitDataUser(updatedData); // Submete os dados do utilizador
        });
    }
    submitDataUser = async (data) => {
        try {
            await axios.post(`/editar-perfil/${this.user.id}`, data);
            console.log("User atualizado com sucesso", this.user);
        } catch (error) {
            console.error("Erro ao atualizar o user:", error);
        }
    }

    clearAuth() {
        this.isAuthenticated = false;
        this.user = null;
    }

}

export const authStore = new AuthStore();
