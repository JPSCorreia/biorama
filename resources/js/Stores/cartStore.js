import {
    action,
    computed,
    makeObservable,
    observable,
    runInAction,
} from "mobx";
import { makePersistable } from "mobx-persist-store";

class CartStore {
    // Em vez de um array, agora é um objeto onde cada chave é uma store.id e o valor é um array de produtos
    cart = {};

    constructor() {
        makeObservable(this, {
            cart: observable,
            addItem: action,
            deleteItem: action,
            removeAllOfItem: action,
            clearCart: action,
            clearStore: action,
            totalQuantity: computed,
            totalPrice: computed,
            storeTotals: computed, // Cálculo dos totais por loja
        });
        makePersistable(this, {
            name: "cartStore",
            properties: ["cart"],
            storage: window.localStorage,
        });
    }

    /**
     * Adiciona um item ao carrinho, agrupando por store.id
     */
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

    /**
     * Remove uma unidade de um item do carrinho
     */
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

            // Se a loja não tiver mais produtos, remove a chave da store
            if (this.cart[storeId].length === 0) {
                delete this.cart[storeId];
            }
        });
    });

    /**
     * Remove todos os itens de um produto específico
     */
    removeAllOfItem = action((storeId, id) => {
        runInAction(() => {
            if (!this.cart[storeId]) return;

            this.cart[storeId] = this.cart[storeId].filter(item => item.id !== id);

            // Se a loja ficar vazia, remove a chave
            if (this.cart[storeId].length === 0) {
                delete this.cart[storeId];
            }
        });
    });

    /**
     * Limpa todos os produtos de uma loja específica
     */
    clearStore = action((storeId) => {
        runInAction(() => {
            delete this.cart[storeId];
        });
    });

    /**
     * Limpa todo o carrinho
     */
    clearCart = action(() => {
        this.cart = {};
    });

    /**
     * Retorna o número total de produtos no carrinho
     */
    get totalQuantity() {
        return Object.values(this.cart).flat().reduce((total, item) => total + (item.quantity ?? 1), 0);
    }

    /**
     * Retorna o preço total considerando descontos
     */
    get totalPrice() {
        return Object.values(this.cart).flat().reduce((total, item) =>
            total + item.price * (item.quantity ?? 1) * (1 - (item.discount ?? 0) / 100),
        0).toFixed(2);
    }

    /**
     * Retorna um objeto com os totais de cada loja
     */
    get storeTotals() {
        const totals = {};
        for (const storeId in this.cart) {
            if (!Array.isArray(this.cart[storeId])) continue; // Garante que é um array
            totals[storeId] = this.cart[storeId].reduce((total, item) =>
                total + item.price * (item.quantity ?? 1) * (1 - (item.discount ?? 0) / 100),
            0).toFixed(2);
        }
        return totals;
    }
}

export const cartStore = new CartStore();
