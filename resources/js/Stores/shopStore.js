import {action, makeObservable, observable, runInAction} from "mobx";
import { makePersistable } from "mobx-persist-store";
import { router } from "@inertiajs/react";
import axios from "axios";

class ShopStore {
    stores = []; // Lista de todas as lojas
    currentStore = null; // Loja atualmente selecionada
    storeRating = null; // Rating da loja selecionada
    storeAddresses = null; // Endereços da loja selecionada
    storeProducts = null; // Produtos da loja selecionada
    storeReviews = null; // Avaliações da loja selecionada
    storeGalleries = null; // Galerias da loja selecionada

    constructor() {
        makeObservable(this, {
            stores: observable,
            currentStore: observable,
            storeRating: observable,
            storeAddresses: observable,
            storeProducts: observable,
            storeReviews: observable,
            storeGalleries: observable,
            DeleteStore:action,
        });

        makePersistable(this, {
            name: "shopStore",
            properties: ["stores", "currentStore"],
            storage: window.sessionStorage, // Dados persistem na sessão
        });
    }




    // Define os dados das lojas
    setStoresData(storesData) {
        runInAction(() => {
            if (!this.stores[0] ) {
                this.stores = storesData;
            }
        });
    }

    // Define os dados da loja selecionada
    setStoreData(storeData) {
        runInAction(() => {
                this.currentStore = storeData;


            this.storeRating = storeData?.rating || null;
            this.storeAddresses = storeData?.addresses || [];
            this.storeProducts = storeData?.products || [];
            this.storeReviews = storeData?.reviews || [];
            this.storeGalleries = storeData?.galleries || [];
        });
    }

    fetchStores = async () => {
        try {
            const response = await axios.get('/dashboard/stores/list');
            this.setStoreData(response.data.stores)

            console.log("response", response.data.stores)
        } catch (error) {
            console.error('Erro ao carregar as lojas do vendedor:', error);
        }
    };

    // Cria uma nova loja e o endereço associado
    async createStore(storeData) {

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

    navigateToStore(storeId) {
        router.get(`/dashboard/store/${storeId}`); // Rota dinâmica para exibir informações da loja
    }

    async updateStore(storeId, updatedData) {
        console.log("shop store no updated store", updatedData);
        try {
            const response = await axios.post(`/stores/${storeId}/update`, updatedData);

            if (response.data.success) {
                runInAction(() => {
                    // Atualiza o estado local com os dados retornados
                    this.currentStore = response.data.store;
                    console.log("informação devolvida", response.data.store)
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

    async addreview(reviewData) {
        try {
            const response = await axios.post("/addreview", reviewData);
            if (response.status === 200) {
                runInAction(() => {
                    this.storeReviews.push(reviewData);
                });
                return { success: true };
            }
        } catch (error) {
            console.error("Erro ao adicionar avaliação:", error);
            return { success: false, error };
        }
    }

    DeleteStore = async (storeId) => {
        try {
            const response = await axios.delete(`/dashboard/store/${storeId}`);
            console.log("response.data", response.data)
            if (response.data.success) {
                this.stores = response.data.stores;

                // Redireciona para /dashboard/stores
                const navigate = (path) => {
                    router.visit(path, {
                        preserveState: true,
                        preserveScroll: true,
                    });
                };

                navigate('/dashboard/stores');
            }
        } catch (error) {
            console.error('Erro ao apagar a loja:', error);
        }
    };

    // Limpa os dados da loja atual
    clearStoreData() {
        runInAction(() => {
            this.currentStore = null;
            this.storeRating = null;
            this.storeAddresses = null;
            this.storeProducts = null;
            this.storeReviews = null;
            this.storeGalleries = null;
        });
    }

    // Limpa todas as lojas
    clearAllStores() {
        runInAction(() => {
            this.stores = [];
            this.clearStoreData();
        });
    }
}

export const shopStore = new ShopStore();
