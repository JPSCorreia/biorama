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
            // Verifica se `personalFormik` está disponível
            if (!this.personalFormik) {
                console.error("Erro: Formulário pessoal não foi encontrado.");
                return;
            }

            const personalValues = {
                ...(this.personalFormik?.values || {}), // Garante que não dá erro caso `personalFormik` seja `null`
                user_id: authStore.user?.id // Garante que `authStore.user` existe antes de acessar `id`
            };

            // Primeira requisição: Envia os dados pessoais
            const responseVendor = await axios.post("/registar-vendedor-dados-pessoais", personalValues);

            console.log("Resposta do servidor para os dados pessoais:", responseVendor);

            // Se o utilizador escolheu registar-se como empresa, faz a segunda requisição
            if (this.isCompany && this.companyFormik && responseVendor) {

                // Segunda requisição: Envia os dados da empresa
                router.post("/registar-vendedor-dados-empresa", {
                    ...this.companyFormik.values,
                }, {
                    headers: {
                        Authorization: `Bearer ${authStore.user.token}`, // Garante que o token está presente
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    onSuccess: () => {
                        console.log("Empresa registada com sucesso!");
                    },
                    onError: (errors) => {
                        console.error("Erro ao registar empresa:", errors);
                    }
                });

                //console.log("Resposta do servidor para os dados da empresa:", responseCompany);
            }

            console.log("Registo concluído com sucesso!");

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
