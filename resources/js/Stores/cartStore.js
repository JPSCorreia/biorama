import {
    action,
    computed,
    makeObservable,
    observable,
    runInAction,
} from "mobx";
import { makePersistable } from "mobx-persist-store";

class CartStore {
    cart = {};
    shippingCosts = {};

    constructor() {
        makeObservable(this, {
            cart: observable,
            shippingCosts: observable,
            addItem: action,
            deleteItem: action,
            removeAllOfItem: action,
            clearCart: action,
            clearStore: action,
            setShippingCost: action,
            totalQuantity: computed,
            totalPrice: computed,
            storeTotals: computed,
            grandTotal: computed,
        });
        makePersistable(this, {
            name: "cartStore",
            properties: ["cart"],
            storage: window.localStorage,
        });
    }

    addItem = action((item) => {
        runInAction(() => {
            const storeId = item.store.id;
            if (!this.cart[storeId]) {
                this.cart[storeId] = [];
            }
            const existingItem = this.cart[storeId].find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity ?? 1;
            } else {
                this.cart[storeId].push({ ...item, quantity: item.quantity ?? 1 });
            }
        });
    });

    deleteItem = action((storeId, id) => {
        runInAction(() => {
            if (!this.cart[storeId]) return;
            const itemIndex = this.cart[storeId].findIndex((item) => item.id === id);
            if (itemIndex !== -1) {
                if (this.cart[storeId][itemIndex].quantity > 1) {
                    this.cart[storeId][itemIndex].quantity -= 1;
                } else {
                    this.cart[storeId].splice(itemIndex, 1);
                }
            }
            if (this.cart[storeId].length === 0) {
                delete this.cart[storeId];
                delete this.shippingCosts[storeId]; // Remover custos de envio
            }
        });
    });

    removeAllOfItem = action((storeId, id) => {
        runInAction(() => {
            if (!this.cart[storeId]) return;
            this.cart[storeId] = this.cart[storeId].filter(item => item.id !== id);
            if (this.cart[storeId].length === 0) {
                delete this.cart[storeId];
                delete this.shippingCosts[storeId]; // Remover custos de envio
            }
        });
    });

    clearStore = action((storeId) => {
        runInAction(() => {
            delete this.cart[storeId];
            delete this.shippingCosts[storeId]; // Garantir que remove os custos de envio
        });
    });

    clearCart = action(() => {
        runInAction(() => {
            this.cart = {};
            this.shippingCosts = {}; // Limpar custos de envio também
        });
    });

    get totalQuantity() {
        return Object.values(this.cart).flat().reduce((total, item) => total + (item.quantity ?? 1), 0);
    }

    get totalPrice() {
        return Object.values(this.cart).flat().reduce((total, item) =>
            total + item.price * (item.quantity ?? 1) * (1 - (item.discount ?? 0) / 100),
        0).toFixed(2);
    }

    get storeTotals() {
        const totals = {};
        for (const storeId in this.cart) {
            if (!Array.isArray(this.cart[storeId])) continue;
            totals[storeId] = this.cart[storeId].reduce((total, item) =>
                total + item.price * (item.quantity ?? 1) * (1 - (item.discount ?? 0) / 100),
            0);
        }
        return totals;
    }

    setShippingCost = action((storeId, cost) => {
        runInAction(() => {
            this.shippingCosts[storeId] = cost;
        });
    });

    get grandTotal() {
        const subtotal = Object.values(this.storeTotals).reduce((sum, subtotal) => sum + subtotal, 0);
        const shippingTotal = Object.values(this.shippingCosts).reduce((sum, cost) => sum + Number(cost || 0), 0);
        return (subtotal + shippingTotal).toFixed(2);
    }
}

export const cartStore = new CartStore();
