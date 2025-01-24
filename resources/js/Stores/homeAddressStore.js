import {
    action,
    computed,
    makeObservable,
    observable,
    runInAction,
} from "mobx";
import { makePersistable } from "mobx-persist-store";
import axios from "axios";

class HomeAddressStore {
    // Observable state properties
    addresses = []; // Array to store user addresses

    /**
     * Initializes the HomeAddressStore with MobX observables and persistence
     */
    constructor() {
        makeObservable(this, {
            addresses: observable,
            addAddress: action,
            deleteAddress: action,
            updateAddress: action,
            setPrimaryAddress: action,
            unsetPrimaryAddress: action,
            updatePrimaryAddress: action,
            checkDuplicatePostalCode: action,
            clearAddresses: action,
            addressCount: computed,
        });
        makePersistable(this, {
            name: "homeAddressStore",
            properties: ["addresses"],
            storage: window.sessionStorage,
        });
    }

    /**
     * Validates required fields for an address
     * @param {Object} address - Address object to validate
     * @throws {Error} If any required field is missing
     */
    validateAddress(address) {
        if (!address.address_name)
            throw new Error("O campo address_name é obrigatório.");
        if (!address.street_address)
            throw new Error("O campo street_address é obrigatório.");
        if (!address.city) throw new Error("O campo city é obrigatório.");
        if(!address.number) throw new Error("O campo number é obrigatório.");
        if (!address.postal_code)
            throw new Error("O campo postal_code é obrigatório.");
        return true;
    }

    /**
     * Fetches addresses from backend if not already loaded
     */
    fetchAddresses = action(async () => {
        if (this.addresses.length > 0) return;
        try {
            const response = await axios.get("/get-moradas");
            runInAction(() => {
                this.addresses = response.data;
            });
        } catch (error) {
            console.error("Erro ao carregar as moradas:", error);
        }
    });

    /**
     * Adds a new address to the store
     * If the new address is primary, updates other addresses accordingly
     */
    addAddress = action((address) => {
        try {
            this.validateAddress(address);
            this.checkIfHavePrimaryAddress(address.is_primary);

            runInAction(() => {
                this.addresses.push(address);
            });
        } catch (error) {
            console.error("Erro na validação:", error.message);
        }
    });

    /**
     * Checks if the address is primary and updates other addresses accordingly
     * @type {function(*): void}
     */
    checkIfHavePrimaryAddress = action((value) => {
        if (value) {
            runInAction(() => {
                this.addresses = this.addresses.map((existingAddress) => ({
                    ...existingAddress,
                    is_primary: false,
                }));
            });
        }
    });

    /**
     * Deletes an address by ID from both store and backend
     */
    deleteAddress = action(async (id) => {
        try {
            const response = await axios.delete(`/apagar-morada/${id}`);
            if (response.status === 200) {
                runInAction(() => {
                    this.addresses = this.addresses.filter(
                        (address) => address.id !== id,
                    );
                });
            }
        } catch (error) {
            console.error("Erro ao apagar a morada:", error);
        }
    });

    /**
     * Updates specific fields of an address by ID
     */
    updateAddress(id, updatedAddress) {
        // Se a morada editada for favorita, desmarcar outras favoritas
        if (updatedAddress.is_primary) {
            this.addresses = this.addresses.map(address => ({
                ...address,
                is_primary: address.id === id, // Apenas a morada editada será favorita
            }));
        } else {
            // Atualizar normalmente
            this.addresses = this.addresses.map(address =>
                address.id === id ? { ...address, ...updatedAddress } : address
            );
        }
    }

    /**
     * Sets an address as primary and updates backend
     */
    setPrimaryAddress = action(async (id) => {
        runInAction(() => {
            this.addresses = this.addresses.map((address) => ({
                ...address,
                is_primary: address.id === id,
            }));
        });

        try {
            await axios.patch(`/morada/${id}/set-morada-fav`);
        } catch (error) {
            console.error(
                "Erro ao sincronizar a morada favorita no backend:",
                error,
            );
        }
    });

    /**
     * Removes primary status from an address
     */
    unsetPrimaryAddress = action(async (existingPrimaryId) => {
        try {
            await axios.put(`/editar-morada/${existingPrimaryId}`, {
                is_primary: false,
            });

            runInAction(() => {
                this.addresses = this.addresses.map((address) =>
                    address.id === existingPrimaryId
                        ? { ...address, is_primary: false }
                        : address,
                );
            });
        } catch (error) {
            console.error(
                "Erro ao atualizar a morada antiga como não favorita:",
                error,
            );
        }
    });

    /**
     * Updates primary address by unsetting the current primary and setting a new one
     */
    updatePrimaryAddress = action(async (newPrimaryId) => {
        const existingPrimary = this.addresses.find(
            (address) => address.is_primary,
        );

        if (existingPrimary) {
            await this.unsetPrimaryAddress(existingPrimary.id);
        }

        await this.setPrimaryAddress(newPrimaryId);
    });

    /**
     * Checks for duplicate postal codes, excluding a specific address ID
     */
    checkDuplicatePostalCode(postalCode, excludeId = null) {
        return this.addresses.some(
            (address) =>
                address.postal_code === postalCode && address.id !== excludeId,
        );
    }

    /**
     * Clears all addresses from the store
     */
    clearAddresses = action(() => {
        this.addresses = [];
    });

    /**
     * Computed property that returns the total number of addresses
     */
    get addressCount() {
        return this.addresses.length;
    }
}

export const homeAddressStore = new HomeAddressStore();
