import { action, makeObservable, observable, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { router } from "@inertiajs/react";
import axios from "axios";

class ShopStore {
    stores = []; // Lista de todas as lojas

    constructor() {
        makeObservable(this, {
            stores: observable,
            fetchStores: action,
            addStore: action,
            updateStore: action,
            deleteStore: action,
        });

        makePersistable(this, {
            name: "shopStore",
            properties: ["stores"],
            storage: window.sessionStorage,
        });
    }

    validateStore(store) {
        if (!store.name) throw new Error("O campo _name é obrigatório.");
        if (!store.phone_number)
            throw new Error("O campo phone_number é obrigatório.");
        if (!store.email) throw new Error("O campo email é obrigatório.");
        if (!store.description)
            throw new Error("O campo description é obrigatório.");
        return true;
    }

    fetchStores = action(async () => {
        try {
            const response = await axios.get("/dashboard/lojas/listar");
            runInAction(() => {
                this.stores = response.data.stores;
            });
        } catch (error) {
            console.error("Erro ao carregar as lojas:", error);
        }
    });

    addStore = action((store) => {
        try {
            // this.validateStore(store);
            runInAction(() => {
                this.stores.push(store);
            });
        } catch (error) {
            console.error("Erro na validação:", error.message);
        }
    });

    deleteStore = action(async (storeId) => {
        try {
            const response = await axios.delete(`/dashboard/lojas/${storeId}`);
            if (response.data.success) {
                runInAction(() => {
                    this.stores = this.stores.filter(
                        (store) => store.id !== storeId,
                    );
                });
                router.visit("/dashboard/lojas", {
                    preserveState: true,
                    preserveScroll: true,
                });
            }
        } catch (error) {
            console.error("Erro ao apagar a loja:", error);
        }
    });

    updateStore = action((id, updatedStore) => {
        try {

            // this.validateStore(updatedStore); // Validação dos dados da loja

            runInAction(() => {
                const storeIndex = this.stores.findIndex(
                    (store) => store.id === id,
                );
                if (storeIndex !== -1) {
                    this.stores[storeIndex] = {
                        ...this.stores[storeIndex],
                        ...updatedStore,
                    };
                } else {
                    console.warn(`Loja com ID ${id} não encontrada.`);
                }
            });
        } catch (error) {
            console.error("Erro na validação ou atualização:", error.message);
        }
    });

    async oldUpdateStore(storeId, updatedData) {
        try {
            const response = await axios.post(`/dashboard/lojas/editar/${storeId}`, updatedData);

            if (response.data.success) {
                runInAction(() => {
                    // Atualiza o estado local com os dados retornados
                    this.currentStore = response.data.store;
                });
                return { success: true };
            } else {
                console.error("Erro ao atualizar a loja:", response.data.message);
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error("Erro ao enviar atualização da loja:", error);
            return { success: false, error };
        }
    }

}

export const shopStore = new ShopStore();
