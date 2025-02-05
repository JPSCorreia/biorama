import { makeObservable, observable, action } from "mobx";
import { makePersistable } from "mobx-persist-store";
import axios from "axios";
import {authStore} from "../Stores";

class VendorRegistrationStore {
    // Observable state properties
    vendorFormik = null // Vendor form
    isCompany = false; // Boolean to check if the vendor is a company
    companyFormik = null; // Company form
    storeFormik = null; // Formik para detalhes da loja
    products = [];
    store_id = null;


    /**
     * Initializes the VendorRegistrationStore with MobX observables and persistence
     */
    constructor() {
        makeObservable(this, {
            vendorFormik: observable,
            setPersonalFormik: action,
            isCompany: observable,
            setIsCompany: action,
            companyFormik: observable,
            setCompanyFormik: action,

            storeFormik: observable,
            setStoreFormik: action,
            setStoreImages: action,

            products: observable,
            setProduct: action,
            store_id: observable,



            submitStep1: action,
            submitStep2: action,
            submitStep3: action,

        });
        makePersistable(this, {
            name: "vendorRegistrationStore",
            properties: ["vendorFormik"],
            storage: window.sessionStorage,
        });
    }

    setPersonalFormik(formik) {
        this.personalFormik = formik;
    }

    setIsCompany(value) {
        this.isCompany = value;
    }


    setCompanyFormik(formik) {
        this.companyFormik = formik;
    }

    // Action to initialize user
    async submitStep1() {
        try {
            if (!this.personalFormik) {
                console.error("Erro: Formulário pessoal não foi encontrado.");
                return;
            }



            // Primeira requisição: Envia os dados pessoais
            const responseVendor = await axios.post("/registar-vendedor-dados-pessoais", {
                ...(this.personalFormik?.values || {}),
                user_id: authStore.user?.id
            });

            if (this.isCompany && this.companyFormik) {
                console.log("Vendedor registado com sucesso!", responseVendor.data.user.vendor);

                this.companyFormik.values.vendor_id = responseVendor.data.user.vendor.id;
                console.log("Enviando dados da empresa:", this.companyFormik.values);
                try {
                    const responseCompany = await axios.post(`/registar-vendedor-dados-empresa/${responseVendor.data.user.vendor.id}`, {
                        ...(this.companyFormik?.values || {}),
                    });

                    console.log("Empresa registada com sucesso!", responseCompany);
                } catch (error) {
                    console.error("Erro ao registar empresa:", error.response?.data || error);
                }
            }

        } catch (error) {
            console.error("Erro ao enviar os formulários:", error);
        }
    }


    setStoreFormik(formik) {
        this.storeFormik = formik;
    }

    setStoreImages(images) {
        images.forEach((image, index) => {
            this.storeFormik.values.image_link[index] = image;
        });
    }

    async submitStep2() {
        console.log("Enviando dados da loja:", this.storeFormik.values);
        try {
            if (!this.storeFormik) {
                console.error("Erro: Formulário de loja não foi encontrado.");
                return;
            }

            // Primeira requisição: Envia os dados da loja
            const responseStore = await axios.post("/registar-vendedor-loja", {
                ...(this.storeFormik?.values || {}),
            });

            this.store_id = responseStore.data.store.id;
            console.log("Loja registada com sucesso!", responseStore.data.store.id);

            console.log("Loja registada com sucesso!", responseStore.data.store);

        } catch (error) {
            console.error("Erro ao enviar os formulários:", error);
        }
    }

    setProduct(product) {
        this.products.push(product);
    }

    async submitStep3(data) {
        console.log("Enviando dados do Produto:", data);
        try {
            if (!data) {
                console.error("Erro: Formulário de produtos não foi encontrado.");
                return;
            }

            console.log("Enviando dados dos produtos:", data);
            // Primeira requisição: Envia os dados dos produtos
            const responseProduct = await axios.post(`/registar-vendedor-produto/${this.store_id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (responseProduct.data.product) {
                this.setProduct(responseProduct.data.product);
            }
            console.log("Product -> ", this.products);

        } catch (error) {
            console.error("Erro ao enviar os formulários:", error);
        }
    }

}

export const vendorRegistrationStore = new VendorRegistrationStore();
