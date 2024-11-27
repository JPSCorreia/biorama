import {
    action,
    computed,
    makeObservable,
    observable,
    runInAction,
} from "mobx";
import { makePersistable } from "mobx-persist-store";

class CartStore {
    cart = [];

    constructor() {
        makeObservable(this, {
            cart: observable,
            addItem: action,
            deleteItem: action,
            clearCart: action,
            total: computed,
        });
        makePersistable(this, {
            name: "cartStore",
            properties: ["cart"],
            storage: window.localStorage,
        });
    }

    addItem = action((name, quantity) => {
        const newItem = {
            id:
                this.cart.length > 0
                    ? this.cart[this.cart.length - 1].id + 1
                    : 1,
            name,
            quantity,
        };
        runInAction(() => {
            if (this.cart.find((item) => item.name === name)) {
                this.cart.find((item) => item.name === name).quantity +=
                    quantity;
            } else {
                this.cart.push(newItem);
            }
        });
    });

    clearCart = action(() => {
        this.cart = [];
    });

    deleteItem = action((index) => {
        runInAction(() => {
            if (this.cart[index].quantity > 1) {
                this.cart[index].quantity -= 1;
            } else {
                this.cart.splice(index, 1);
            }
        });
    });

    get total() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
}

export const cartStore = new CartStore();
