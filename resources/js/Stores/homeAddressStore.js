import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store";
import axios from "axios";

class HomeAddressStore {
    addresses = [];

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

    validateAddress(address){
        if (!address.address_name) throw new Error("O campo address_name é obrigatório.");
        if (!address.street_address) throw new Error("O campo street_address é obrigatório.");
        if (!address.city) throw new Error("O campo city é obrigatório.");
        if (!address.postal_code) throw new Error("O campo postal_code é obrigatório.");
        return true;
    };

    // Carregar moradas do backend
    fetchAddresses = async () => {
        if (this.addresses.length > 0) return;
        try {
            const response = await axios.get("/get-moradas");
            this.addresses = response.data;
            console.log("Moradas carregadas com sucesso!", this.addresses);
        } catch (error) {
            console.error("Erro ao carregar as moradas:", error);
        }
    };

    addAddress = action((address) => {
        try {
            // Valida a estrutura do endereço
            this.validateAddress(address);

            // Verifica se a nova morada está definida como favorita
            if (address.is_primary) {
                // Atualiza qualquer morada existente para não ser favorita
                runInAction(() => {
                    this.addresses = this.addresses.map((existingAddress) => ({
                        ...existingAddress,
                        is_primary: false,
                    }));
                });
            }

            // Adiciona a nova morada
            runInAction(() => {
                this.addresses.push(address);
            });

            console.log("Morada adicionada com sucesso:", address);
        } catch (error) {
            console.error("Erro na validação:", error.message);
        }
    });

    deleteAddress = action(async (id) => {
        try {
            const response = await axios.delete(`/apagar-morada/${id}`);
            if (response.status === 200) {
                runInAction(() => {
                    this.addresses = this.addresses.filter((address) => address.id !== id);
                });
                console.log('Morada Apagada com sucesso');
            }
        } catch (error) {
            console.error('Erro ao apagar a morada:', error);
        }
    });

    updateAddress = action((id, updatedData) => {
        runInAction(() => {
            const index = this.addresses.findIndex((address) => address.id === id);
            if (index !== -1) {
                this.addresses[index] = {
                    ...this.addresses[index], // Mantém os dados atuais da morada
                    ...updatedData, // Atualiza apenas os campos fornecidos
                };
            }
        });
    });

    setPrimaryAddress = action(async (id) => {
        // Atualiza localmente
        runInAction(() => {
            this.addresses = this.addresses.map((address) => ({
                ...address,
                is_primary: address.id === id, // Apenas uma morada será marcada como favorita
            }));
        });

        //Sincroniza automaticamente com o backend
        try {
            const response = await axios.patch(`/morada/${id}/set-morada-fav`);
            if (response.status === 200) {
                console.log("Morada favorita atualizada no backend com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao sincronizar a morada favorita no backend:", error);
        }
    });

    unsetPrimaryAddress = action(async(existingPrimaryId) => {
        // Atualiza a morada antiga para não ser favorita
        try {
            await axios.put(`/atualizar-morada/${existingPrimaryId}`, {
                is_primary: false,
            });

            runInAction(() => {
                this.addresses = this.addresses.map((address) =>
                    address.id === existingPrimaryId
                        ? { ...address, is_primary: false }
                        : address
                );
            });

            console.log("Morada antiga atualizada para não favorita.");
        } catch (error) {
            console.error("Erro ao atualizar a morada antiga como não favorita:", error);
        }
    });

    updatePrimaryAddress = action(async(newPrimaryId) => {
        const existingPrimary = this.addresses.find((address) => address.is_primary);

        if (existingPrimary) {
            await this.unsetPrimaryAddress(existingPrimary.id);
        }

        await this.setPrimaryAddress(newPrimaryId);
    });

    checkDuplicatePostalCode(postalCode, excludeId = null) {
        // Verifica se existe outra morada com o mesmo código postal, excluindo o ID especificado
        return this.addresses.some(
            (address) => address.postal_code === postalCode && address.id !== excludeId
        );
    }

    clearAddresses = action(() => {
        this.addresses = [];
    });

    get addressCount() {
        return this.addresses.length;
    }
}

export const homeAddressStore = new HomeAddressStore();
