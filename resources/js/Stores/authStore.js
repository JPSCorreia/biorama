import { action, makeObservable, observable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { vendorStore, cartStore, homeAddressStore } from "./";
import axios from "axios";

class AuthStore {
    // Observable properties for user data and authentication status
    user = null; // User data
    isAuthenticated = false; // Authentication status

    /**
     * Initializes the AuthStore with MobX observables and persistence
     */
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

    /**
     * Updates authentication state and user data
     * Also triggers address fetch if user is authenticated
     * @param {Object} auth - Authentication object containing user data
     */
    updateAuth(auth) {
        this.isAuthenticated = !!auth?.user;
        this.user = auth?.user || null;
        if (this.isAuthenticated) {
            homeAddressStore.addresses = homeAddressStore.fetchAddresses(); // Fetch user addresses if authenticated
        } else {
            homeAddressStore.clearAddresses(); // Clear addresses if not authenticated
            vendorStore.clearVendorData(); // Clear vendor data if not authenticated
            cartStore.clearCart(); // Clear cart data if not authenticated
        }
    }

    /**
     * Updates user profile data via API
     * @param {Object} data - Updated user data to be submitted
     * @returns {Promise<void>}
     */
    submitDataUser = async (data) => {
        try {
            const response = await axios.post(`/editar-perfil/${this.user.id}`, data);
            // Envia os dados para o servidor
            await axios.post(`/editar-perfil/${this.user.id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Necessário para processar ficheiros
                },
            });
            this.setUser(response.data.user);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    setUser = action((updatedUser) => {
        this.user = updatedUser;
    });

    /**
     * Clears authentication state and user data
     */
    clearAuth() {
        this.isAuthenticated = false;
        this.user = null;
    }
}

export const authStore = new AuthStore();
