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
            this.stores = storesData;
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

    // Cria uma nova loja e o endereço associado
    async createStore(storeData) {
        console.log("store Data antes do processamento", storeData);

        try {
            // Cria uma cópia dos dados a serem enviados
            const processedData = { ...storeData };

            // Verifica se o array de imagens está vazio
            if (!storeData.images || storeData.images.length === 0) {
                delete processedData.images; // Remove o campo se não houver imagens
            }

            console.log("Dados processados para envio", processedData);

            // Envia os dados para o backend usando o Inertia Router
            const response = await axios.post("/create/store", processedData);
            console.log("resposta:", response.data);
            if (response.data.success) {
                console.log("Loja criada com sucesso:", response.data);
            }
            return {success:true};
        } catch (error) {
            console.error("Erro inesperado ao criar a loja Front End:", error.message);
            return { success: false, message: error.message };
        }
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
