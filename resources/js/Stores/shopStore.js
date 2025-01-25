import { makeObservable, observable, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store";

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
