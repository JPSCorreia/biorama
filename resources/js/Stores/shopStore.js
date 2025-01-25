import {action, makeObservable, observable, runInAction} from "mobx";

class ShopStore {
    stores = []; // Lista de lojas

    constructor() {
        makeObservable(this, {
            stores: observable, // Tornar observável
            setStoreData: action, // Ação para atualizar as lojas
        });
    }

    // Define os dados das lojas
    setStoreData(storeData) {
        runInAction(() => {
            this.stores = storeData; // Atualiza a lista de lojas
        });
    }
}

export const shopStore = new ShopStore();
