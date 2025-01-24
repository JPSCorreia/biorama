import { action, makeObservable, observable, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { homeAddressStore } from "./homeAddressStore.js";
import axios from "axios";

class AuthStore {
    user = null;
    isAuthenticated = false;

    constructor() {
        makeObservable(this, {
            user: observable,
            isAuthenticated: observable,
            updateAuth: action,
            clearAuth: action,
            submitDataUser: action,
        });
        makePersistable(this, {
            name: "authStore",
            properties: ["user", "isAuthenticated"],
            storage: window.sessionStorage,
        });
    }

    updateAuth(auth) {
        this.isAuthenticated = !!auth?.user;
        this.user = auth?.user || null;
        if (this.isAuthenticated) {
            console.log(this.user);
            homeAddressStore.addresses = homeAddressStore.fetchAddresses(); // Faz o fetch das informações do user se autenticado
        } else {
            homeAddressStore.clearAddresses(); // Limpa moradas se não autenticado
        }
    }
    submitDataUser = async (data) => {
        try {
            const response = await axios.post(`/editar-perfil/${this.user.id}`, data);
            // Envia os dados para o servidor
            await axios.post(`/editar-perfil/${this.user.id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Necessário para processar ficheiros
                },
            });
            this.user = response.data.user;
            console.log("User atualizado com sucesso", this.user);
        } catch (error) {
            console.error("Erro ao atualizar o user:", error);
        }
    };

    clearAuth() {
        this.isAuthenticated = false;
        this.user = null;
    }
}

export const authStore = new AuthStore();
