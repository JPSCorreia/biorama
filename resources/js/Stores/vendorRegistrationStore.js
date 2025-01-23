import {makeObservable, observable, action, runInAction} from "mobx";
import {makePersistable} from "mobx-persist-store";
import axios from "axios";

class VendorRegistrationStore {
    vendor = {
        user_id: "",
        first_name: "",
        last_name: "",
        email: "",
        nif: "",
        phone: "",
        date_of_birth: "",
        image_profile: "",
        is_company: false,
    }; // Informações do utilizador autenticado e que deseja ser vendedor
    isCompany = false; // Define se o utilizador vai registar uma empresa
    vendorFormValid = false; // Validação do formulário do utilizador

    company = {
        name: "",
        nif: "",
        phone: "",
        email: "",
        street: "",
        number: "",
        postal_code: "",
        district: "",
        country: "",
    }; // Dados da empresa, caso aplicável
    companyFormValid = false; // Validação do formulário da empresa

    store = {
        name: "",
        phone: "",
        email: "",
        description: "",
        rating: 0.0,
        coordinates: "",
        store_images: []
    }; // Dados da loja
    storeFormValid = false; // Validação do formulário da loja

    products = []; // Lista de produtos
    productsFormValid = false; // Validação do formulário dos produtos

    constructor() {
        makeObservable(this, {
            vendor: observable,
            isCompany: observable,
            vendorFormValid: observable,

            company: observable,
            companyFormValid: observable,

            store: observable,
            storeFormValid: observable,

            products: observable,
            productsFormValid: observable,

            initializeVendor: action,
            updateVendor: action,
            setIsCompany: action,
            setVendorFormValid: action,

            updateCompany: action,
            setCompanyFormValid: action,

            updateStore: action,
            setStoreFormValid: action,

            addProduct: action,
            setProductFormValid: action,

            submit: action,
        });
        makePersistable(this, {
            name: "vendorRegistrationStore",
            properties: ["vendor", "isCompany", "company", "store", "products"],
            storage: window.sessionStorage,
        });

    }

    // Ação para inicializar o utilizador
    initializeVendor(vendorData) {
        this.vendor = vendorData;
    }

    // Ações para definir a validade dos formulários
    setVendorFormValid(value) {
        this.vendorFormValid = value
    }

    setCompanyFormValid(value) {
        this.companyFormValid = value
    }

    setStoreFormValid(value) {
        this.storeFormValid = value
    }

    setProductFormValid(value) {
        this.productsFormValid = value
    }

    // Ação para atualizar os dados do utilizador
    updateVendor(data) {
        this.user = { ...this.user, ...data };
    }

    // Ação para definir se é empresa
    setIsCompany(isCompany) {
        this.isCompany = isCompany;
        this.vendor["is_company"] = isCompany; // Atualiza o valor no objeto de utilizador
        if (!isCompany) {
            this.companyFormValid = false; // Redefine a validade do formulário de empresa
            this.vendor["is_company"] = false; // Atualiza o valor no objeto de utilizador
        }
    }


    // Ação para atualizar os dados da empresa
    updateCompany(data) {
        if (this.vendor["is_company"]) {
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
