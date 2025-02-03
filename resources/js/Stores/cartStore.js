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
    cart = []; // Array to store cart items

    /**
     * Initializes the CartStore with MobX observables and persistence
     */
    constructor() {
        makeObservable(this, {
            cart: observable,
            addItem: action,
            deleteItem: action,
            clearCart: action,
            totalQuantity: computed,
            totalPrice: computed,
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
     * If it's a new item, adds it as a new entry
     * @param {Object} item - The item to add (must contain all necessary properties)
     */
    addItem = action((item) => {
        runInAction(() => {
            const existingItem = this.cart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity ?? 1;
            } else {
                this.cart.push({ ...item, quantity: item.quantity ?? 1 });
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
     * Decrements the quantity of an item
     * If quantity becomes 0, removes the item completely
     * @param {number} id - The ID of the item to remove
     */
    deleteItem = action((id) => {
        runInAction(() => {
            const itemIndex = this.cart.findIndex((item) => item.id === id);
            if (itemIndex !== -1) {
                if (this.cart[itemIndex].quantity > 1) {
                    this.cart[itemIndex].quantity -= 1;
                } else {
                    this.cart.splice(itemIndex, 1);
                }
            }
        });
    });


    /**
     * Computed property that returns the total number of items in the cart
     * @returns {number} The sum of all item quantities
     */
    get totalQuantity() {
        return this.cart.reduce((total, item) => total + (item.quantity ?? 1), 0);
    }

    /**
     * Computed property that returns the total price of items in the cart
     * @returns {number} The total cost of all items
     */
    get totalPrice() {
        return this.cart.reduce((total, item) => total + item.price * (item.quantity ?? 1), 0);
    }
}

export const cartStore = new CartStore();
