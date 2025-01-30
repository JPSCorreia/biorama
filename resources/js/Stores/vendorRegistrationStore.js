import { makeObservable, observable, action, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store";
import axios from "axios";
import {router} from "@inertiajs/react"
import {authStore} from "../Stores";

class VendorRegistrationStore {
    // Observable state properties
    vendorFormik = null // Vendor form
    isCompany = false; // Boolean to check if the vendor is a company
    companyFormik = null; // Company form
    storeFormik = null; // Formik para detalhes da loja
    productFormik = null; // Formik para criação de produtos


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
            getStoreFormik: action,

            productFormik: observable,
            setProductFormik: action,
            getProductFormik: action,



            submitStep1: action,

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

    getStoreFormik() {
        return this.storeFormik;
    }

    setProductFormik(formik) {
        this.productFormik = formik;
    }

    getProductFormik() {
        return this.productFormik;
    }

}

export const vendorRegistrationStore = new VendorRegistrationStore();
