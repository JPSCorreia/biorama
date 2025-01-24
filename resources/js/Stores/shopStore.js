import {makeObservable, observable, runInAction} from "mobx";
import {makePersistable} from "mobx-persist-store";

class ShopStore{
    stores = [];
    currentStore = null;

    constructor() {
        makeObservable(this, {
            stores: observable,
            currentStore:observable,
        });

        makePersistable(this, {
            name:"shopStore",
            properties:["stores", "currentStore"],
            storage: window.sessionStorage,
        });
    }
    setStoreData(storeData){
        runInAction(() => {
            if (!this.currentStore){
                this.currentStore = storeData
            }
        })

    }
    clearStoreData(){
        runInAction(() =>{
           this.stores =[];
           this.currentStore = null;
        });
    }
}
export const shopStore = new ShopStore();
