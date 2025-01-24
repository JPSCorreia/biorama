import {
    action,
    computed,
    makeObservable,
    observable,
    runInAction,
} from "mobx";
import { makePersistable } from "mobx-persist-store";

class CartStore {
    // Observable state properties
    cart = []; // Array to store cart items with their id, name and quantity

    /**
     * Initializes the CartStore with MobX observables and persistence
     */
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
            storage: window.sessionStorage,
        });
    }

    /**
     * Adds an item to the cart
     * If the item already exists, increases its quantity
     * If it's a new item, adds it with a new ID
     * @param {string} name - The name of the item
     * @param {number} quantity - The quantity to add
     */
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

    /**
     * Removes all items from the cart
     */
    clearCart = action(() => {
        this.cart = [];
    });

    /**
     * Decrements the quantity of an item at the specified index
     * If quantity becomes 0, removes the item completely
     * @param {number} index - The index of the item in the cart array
     */
    deleteItem = action((index) => {
        runInAction(() => {
            if (this.cart[index].quantity > 1) {
                this.cart[index].quantity -= 1;
            } else {
                this.cart.splice(index, 1);
            }
        });
    });

    /**
     * Computed property that returns the total number of items in the cart
     * @returns {number} The sum of all item quantities
     */
    get total() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
}

export const cartStore = new CartStore();
