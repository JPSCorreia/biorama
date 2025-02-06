import { action, makeObservable, observable, runInAction } from "mobx";
import axios from "axios";
import { makePersistable } from "mobx-persist-store";

class OrderStore {
    orders = [];
    currentOrder = null;
    totalOrders = 0;
    searchTerm = "";

    constructor() {
        makeObservable(this, {
            orders: observable,
            currentOrder: observable,
            totalOrders: observable,
            searchTerm: observable,
            fetchOrders: action,
            fetchOrderDetails: action,
            cancelOrder: action,
            clearOrders: action,
        });

        makePersistable(this, {
            name: "OrderStore",
            properties: ["orders", "currentOrder"],
            storage: window.sessionStorage,
        });
    }

    // Buscar todas as encomendas (ou com pesquisa)
    fetchOrders = async (searchTerm = "") => {
        try {
            const response = await axios.get(`/dashboard/orders`, {
                params: { search: searchTerm },
            });
            runInAction(() => {
                this.orders = response.data;
                this.searchTerm = searchTerm;
                this.totalOrders = response.data.length;
            });
        } catch (error) {
            console.error("Erro ao buscar encomendas:", error);
        }
    };

    // Buscar detalhes de uma encomenda específica
    fetchOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`/dashboard/orders/${orderId}`);
            runInAction(() => {
                this.currentOrder = response.data;
            });
        } catch (error) {
            console.error("Erro ao buscar detalhes da encomenda:", error);
        }
    };

    // Cancelar uma encomenda
    cancelOrder = async (orderId) => {
        try {
            await axios.post(`/dashboard/orders/${orderId}/cancel`);
            runInAction(() => {
                this.orders = this.orders.filter((order) => order.id !== orderId);
                if (this.currentOrder && this.currentOrder.id === orderId) {
                    this.currentOrder = null;
                }
            });
            console.log("Encomenda cancelada com sucesso!");
        } catch (error) {
            console.error("Erro ao cancelar a encomenda:", error);
        }
    };

    // Limpar encomendas
    clearOrders() {
        runInAction(() => {
            this.orders = [];
            this.currentOrder = null;
            this.searchTerm = "";
            this.totalOrders = 0;
        });
    }
}

export const orderStore = new OrderStore();
