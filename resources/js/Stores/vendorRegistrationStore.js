import {makeObservable, observable, action, runInAction} from "mobx";
import {makePersistable} from "mobx-persist-store";
import axios from "axios";

class VendorRegistrationStore {
    user = null; // Informações do utilizador vindas do AuthStore
    isCompany = false; // Define se o utilizador vai registar uma empresa
    company = null; // Dados da empresa, caso aplicável
    store = null; // Dados da loja
    products = []; // Lista de produtos
    currentFormValid = true; // Validação do formulário
    constructor() {
        makeObservable(this, {
            user: observable,
            isCompany: observable,
            company: observable,
            store: observable,
            products: observable,
            currentFormValid: observable,

            initializeUser: action,
            updateUser: action,
            setIsCompany: action,
            updateCompany: action,
            updateStore: action,
            addProduct: action,
            setFormValid: action,
            submit: action,
        });
        makePersistable(this, {
            name: "vendorRegistrationStore",
            properties: ["user", "isCompany", "company", "store", "products"],
            storage: window.sessionStorage,
        });

    }

    // Ação para inicializar o utilizador
    initializeUser(userData) {
        this.user = userData;
    }

    // Ação para atualizar os dados do utilizador
    updateUser(data) {
        this.user = {...this.user, ...data};
    }

    // Ação para definir se é empresa
    setIsCompany(value) {
        this.isCompany = value;
        if (!value) this.company = null; // Limpa os dados da empresa se não for empresa
    }

    // Ação para atualizar os dados da empresa
    updateCompany(data) {
        if (this.isCompany) {
            this.company = {...this.company, ...data};
        }
    }

    // Ação para atualizar os dados da loja
    updateStore(data) {
        this.store = {...this.store, ...data};
    }

    // Ação para adicionar um produto
    addProduct(product) {
        this.products.push(product);
    }

    // Ação para definir a validade do formulário
    setFormValid(value) {
        this.currentFormValid = value
    }

    // Método para enviar os dados ao servidor

    async submit() {
        try {
            if (!this.user || !this.store) throw new Error("Dados incompletos");

            // 1. Atualizar o utilizador (incluindo isCompany e role)
            await axios.post("/users/update", {
                ...this.user,
                isCompany: this.isCompany,
            });

            // 2. Criar empresa, se aplicável
            if (this.isCompany && this.company) {
                await axios.post("/companies", this.company);
            }

            // 3. Criar loja
            const storeResponse = await axios.post("/stores", this.store);

            // 4. Adicionar produtos
            if (this.products.length > 0) {
                await axios.post(`/stores/${storeResponse.data.id}/products`, {
                    products: this.products,
                });
            }

            // Limpa a store após submissão bem-sucedida
            runInAction(() => {
                this.user = null;
                this.isCompany = false;
                this.company = null;
                this.store = null;
                this.products = [];
            });

            return true;
        } catch (error) {
            console.error("Erro ao submeter os dados:", error);
            throw error;
        }
    }
}

export const vendorRegistrationStore = new VendorRegistrationStore();
