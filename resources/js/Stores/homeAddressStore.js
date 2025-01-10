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
            this.validateAddress(address); // Validação
            console.log("Validação bem-sucedida:", address);
            runInAction(() => {
                this.addresses.push(address);
            });
        } catch (error) {
            console.error("Erro na validação:", error.message);
        }
    });


    deleteAddress = action((id) => {
        runInAction(() => {
            this.addresses = this.addresses.filter((address) => address.id !== id);
        });
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

    setPrimaryAddress = action((id) => {
        // Atualiza localmente
        runInAction(() => {
            this.addresses = this.addresses.map((address) => ({
                ...address,
                is_primary: address.id === id, // Apenas uma morada será marcada como favorita
            }));
        });

        // Sincroniza automaticamente com o backend
        this.syncPrimaryAddress(id);
    });

    syncPrimaryAddress = async (id) => {
        try {
            const response = await axios.patch(`/morada/${id}/set-morada-fav`);
            if (response.status === 200) {
                console.log("Morada favorita atualizada no backend com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao sincronizar a morada favorita no backend:", error);
        }
    };


    clearAddresses = action(() => {
        this.addresses = [];
    });

    get addressCount() {
        return this.addresses.length;
    }
}

export const homeAddressStore = new HomeAddressStore();
