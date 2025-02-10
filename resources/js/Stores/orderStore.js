import { action, makeObservable, observable, runInAction } from "mobx";
import axios from "axios";
import { makePersistable } from "mobx-persist-store";

class OrderStore {
    orders = [];
    statuses = [];
    stores = [];
    currentOrder = null;
    totalOrders = 0;
    searchTerm = "";
    sortField = "id";
    sortOrder = "asc";
    successMessage = "";
    errorMessage = "";
    statusesLoading = false;
    currentPage = 1;
    totalPages = 1;

    constructor() {
        makeObservable(this, {
            orders: observable,
            stores:observable,
            statuses: observable,
            currentOrder: observable,
            totalOrders: observable,
            searchTerm: observable,
            successMessage: observable,
            errorMessage: observable,
            fetchOrdersByStore: action,
            statusesLoading: observable,
            fetchOrders: action,
            fetchStatuses: action,
            updateProductQuantity: action,
            removeProduct: action,
            updateOrderStatus: action,
            getUpdatedTotal: action,
            saveOrderChanges: action,
            resetMessages: action,
            sortOrders: action,
            searchOrders: action,
            cancelOrder:action,
            fetchVendorStores:action,

        });

        makePersistable(this, {
            name: "OrderStore",
            properties: ["orders", "currentOrder"],
            storage: window.sessionStorage,
        });

        this.fetchStatuses();  // Carregar status ao inicializar
    }

    async fetchStatuses() {
        if (this.statuses.length > 0 || this.statusesLoading) return;  // Prevenir chamadas duplicadas

        this.statusesLoading = true;
        try {
            const response = await axios.get('/dashboard/statuses');
            runInAction(() => {
                this.statuses = response.data;
            });
        } catch (error) {
            console.error('Erro ao buscar status:', error);
        } finally {
            this.statusesLoading = false;
        }
    }

    fetchOrders = async (searchTerm = "", page = 1, limit = 10) => {
        try {
            const response = await axios.get(`/dashboard/orders`, {
                params: { search: searchTerm, page, limit },
            });

            runInAction(() => {
                this.orders = response.data.data;
                this.searchTerm = searchTerm;
                this.totalOrders = response.data.total;
                this.totalPages = response.data.last_page;
                this.currentPage = response.data.current_page;
            });
        } catch (error) {
            console.error("Erro ao buscar encomendas:", error);
        }
    };

    fetchOrdersByStore = async (storeId, searchTerm = "", page = 1, limit = 10, sortField = "id", sortOrder = "asc") => {
        try {
            const response = await axios.get(`/dashboard/stores/${storeId}/orders`, {
                params: { search: searchTerm, page, limit, sortField, sortOrder },
            });
            runInAction(() => {
                this.orders = response.data.data;
                console.log("response",response);
                this.totalPages = response.data.last_page;
                this.currentPage = response.data.current_page;
            });
        } catch (error) {
            console.error("Erro ao buscar encomendas por loja:", error);
        }
    };


    async fetchVendorStores() {
        try {
            const response = await axios.get(`/dashboard/vendor/stores`);
            runInAction(() => {
                console.log("Lojas recebidas:", response.data);  // Verificação
                this.stores = response.data;
            });
        } catch (error) {
            console.error("Erro ao buscar lojas:", error);
        }
    }


    updateProductQuantity(orderId, productId, quantity) {
        if (quantity <= 0) {
            runInAction(() => {
                this.errorMessage = "A quantidade deve ser maior que 0.";
            });
            return;
        }

        const order = this.orders.find(order => order.id === orderId);
        const product = order.products.find(product => product.id === productId);

        if (product) {
            product.pivot.quantity = quantity;
        }
    }

    removeProduct(orderId, productId) {
        const order = this.orders.find(order => order.id === orderId);
        if (!order.removedProducts) {
            order.removedProducts = [];
        }

        // Adicionar o produto à lista de produtos removidos
        order.removedProducts.push(productId);
        order.products = order.products.filter(product => product.id !== productId);

        console.log("Produtos removidos:", order.removedProducts);  // Verificação
    }

    updateOrderStatus(orderId, newStatusId) {
        const order = this.orders.find(order => order.id === orderId);
        if (order) {
            order.statuses_id = newStatusId;
        }
    }

    getUpdatedTotal(orderId) {
        const order = this.orders.find(order => order.id === orderId);
        return order.products.reduce((total, product) => {
            return total + product.pivot.quantity * product.pivot.price;
        }, 0);
    }

    async saveOrderChanges(orderId) {
        const order = this.orders.find(order => order.id === orderId);

        if (order.products.length === 0) {
            runInAction(() => {
                this.errorMessage = "Não é possível salvar uma encomenda sem produtos.";
            });
            return;
        }

        // Verificar e garantir que `removedProducts` esteja no payload
        const payload = {
            statuses_id: order.statuses_id,
            total: this.getUpdatedTotal(orderId),
            products: order.products.map(product => ({
                id: product.id,
                quantity: product.pivot.quantity,
                price: product.pivot.price,
                discount: product.pivot.discount || 0,
                final_price: product.pivot.final_price || 0,
            })),
            removedProducts: order.removedProducts || [],  // Incluindo produtos removidos
        };

        console.log("Payload a enviar:", payload);  // Verificação

        try {
            const response = await axios.put(`/dashboard/orders/${orderId}`, payload);

            runInAction(() => {
                const updatedOrder = response.data.order;
                const orderIndex = this.orders.findIndex(order => order.id === updatedOrder.id);

                if (orderIndex !== -1) {
                    this.orders[orderIndex] = updatedOrder;
                }

                this.successMessage = response.data.message;
                this.errorMessage = "";
            });
        } catch (error) {
            runInAction(() => {
                this.errorMessage = "Erro ao salvar alterações.";
                this.successMessage = "";
            });
        }
    }

    resetMessages() {
        this.successMessage = "";
        this.errorMessage = "";
        this.orders.forEach(order => {
            order.removedProducts = [];
        });
    }

    sortOrders(field) {
        if (this.sortField === field) {
            this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
        } else {
            this.sortField = field;
            this.sortOrder = "asc";
        }

        runInAction(() => {
            this.orders = [...this.orders].sort((a, b) => {
                const valueA = field === "total" ? parseFloat(a[field] || 0) : (a[field] || "").toString().toLowerCase();
                const valueB = field === "total" ? parseFloat(b[field] || 0) : (b[field] || "").toString().toLowerCase();

                if (this.sortOrder === "asc") {
                    return valueA > valueB ? 1 : -1;
                } else {
                    return valueA < valueB ? 1 : -1;
                }
            });
        });
    }

    searchOrders = (searchTerm) => {
        this.fetchOrders(searchTerm, 1);
    };

    cancelOrder = async (orderId) => {
        try {
            const response = await axios.put(`/dashboard/orders/${orderId}/cancel`);
            runInAction(() => {
                const order = this.orders.find(order => order.id === orderId);
                if (order) {
                    order.statuses_id = response.data.statuses_id;  // Atualiza o status localmente
                    console.log("response", response);
                    this.successMessage = "Encomenda cancelada com sucesso.";

                }
            });
        } catch (error) {
            runInAction(() => {
                this.errorMessage = "Erro ao cancelar a encomenda.";
            });
        }
    };

    changePage = (newPage) => {
        this.currentPage = newPage;
        this.fetchOrders(this.searchTerm, newPage);
    };
}

export const orderStore = new OrderStore();
