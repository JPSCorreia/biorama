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
                setTimeout(() => {
                    router.visit("/dashboard/lojas", { preserveState: true, preserveScroll: true });
                }, 50);
            }
        } catch (error) {
            console.error("Erro ao apagar a loja:", error);
        }
    });

    updateStore = action(async (id, updatedStore) => {
        try {
            const response = await axios.post(
                `/dashboard/lojas/editar/${id}`,
                updatedStore,
            );

            if (response.data.success) {
                runInAction(() => {
                    const storeIndex = this.stores.findIndex(
                        (store) => store.id === id
                    );

                    if (storeIndex !== -1) {
                        const store = this.stores[storeIndex];

                        // Atualizar os campos principais da loja
                        this.stores[storeIndex] = {
                            ...store,
                            name: updatedStore.name ?? store.name,
                            phone_number: updatedStore.phone_number ?? store.phone_number,
                            description: updatedStore.description ?? store.description,
                            email: updatedStore.email ?? store.email,
                        };

                        // Garantir que existe pelo menos um endereço
                        if (!store.addresses || store.addresses.length === 0) {
                            store.addresses = [{}];
                        }

                        // Atualizar os dados do endereço
                        const address = { ...store.addresses[0] };

                        if (updatedStore.city) {
                            address.city = updatedStore.city;
                        }

                        if (updatedStore.street_address) {
                            address.street_address = updatedStore.street_address;
                        }

                        if (updatedStore.postal_code) {
                            address.postal_code = updatedStore.postal_code;
                        }

                        if (updatedStore.coordinates) {
                            const [latitude, longitude] = updatedStore.coordinates
                                .split(",")
                                .map(coord => coord.trim());

                            address.latitude = latitude;
                            address.longitude = longitude;
                        }

                        // Atualizar a referência completa da loja no array
                        this.stores[storeIndex] = {
                            ...this.stores[storeIndex],
                            addresses: [address],
                        };
                    }
                });
                return { success: true };
            } else {
                console.error(
                    "Erro ao atualizar a loja:",
                    response.data.message
                );
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error("Erro ao enviar atualização da loja:", error);
            return { success: false, error };
        }
    });

        // Cria uma nova loja e o endereço associado
        async OldCreateStore(storeData) {

            try {
                const processedData = { ...storeData };

                if (!storeData.image_link || storeData.image_link.length === 0) {
                    delete processedData.image_link; // Remove o campo se não houver imagens
                }

                // Envia os dados para o backend
                const response = await axios.post("/create/store", processedData);

                if (response.data.success) {
                    console.log("Loja criada com sucesso:", response.data);
                }
                this.stores = response.data.stores;

                return { success: true };
            } catch (error) {
                console.error("Erro inesperado ao criar a loja Front End:", error.message);
                return { success: false, message: error.message };
            }
        }


    // updateStore = action(async (id, updatedStore) => {
    //     try {
    //         const response = await axios.post(
    //             `/dashboard/lojas/editar/${id}`,
    //             updatedStore,
    //         );

    //         if (response.data.success) {
    //             runInAction(() => {
    //                 const storeIndex = this.stores.findIndex(
    //                     (store) => store.id === id,
    //                 );

    //                 console.log(updatedStore)

    //                 if (storeIndex !== -1) {
    //                     this.stores[storeIndex] = {
    //                         ...this.stores[storeIndex],
    //                         ...updatedStore,
    //                     };
    //                 }
    //             });
    //             return { success: true };
    //         } else {
    //             console.error(
    //                 "Erro ao atualizar a loja:",
    //                 response.data.message,
    //             );
    //             return { success: false, message: response.data.message };
    //         }
    //     } catch (error) {
    //         console.error("Erro ao enviar atualização da loja:", error);
    //         return { success: false, error };
    //     }
    // });

}

export const shopStore = new ShopStore();
