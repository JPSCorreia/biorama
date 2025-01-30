import { makeObservable, observable, runInAction } from "mobx";
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
            if (!this.currentStore){
                this.currentStore = storeData.store;
            }

            this.storeRating = storeData?.rating || null;
            this.storeAddresses = storeData?.addresses || [];
            this.storeProducts = storeData?.products || [];
            this.storeReviews = storeData?.reviews || [];
            this.storeGalleries = storeData?.galleries || [];
        });
    }

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
