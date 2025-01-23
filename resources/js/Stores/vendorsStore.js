import { action, makeObservable, observable, runInAction } from "mobx";
import axios from "axios";
import { makePersistable } from "mobx-persist-store";

class VendorStore {
    // Atributos da classe
    vendors = null;
    currentVendor = null;
    companyDetails = null;
    companyContacts = [];
    companyAddresses = [];


    constructor() {
        makeObservable(this, {
            vendors: observable,
            currentVendor: observable,
            companyDetails: observable,
            companyContacts: observable,
            companyAddresses: observable,
            setVendorData: action,
            updateVendorName: action,
            updateVendorInfo:action,
            updateCompanyAndRelations: action,
            getVendorId: action,
            clearVendorData: action,
        });

        makePersistable(this, {
            name: "vendorStore",
            properties: ["vendors", "currentVendor", "companyDetails"],
            storage: window.sessionStorage,
        });
    }

    // Ação para definir os dados iniciais do vendor recebidos do controlador
    setVendorData(vendorData) {
        console.log("Dados do vendor recebidos na store:", vendorData);
        runInAction(() => {
            this.currentVendor = vendorData;
            this.companyDetails = vendorData.company;
            this.companyContacts = vendorData.company.addresses;
            this.companyAddresses = vendorData.company.contacts;
        });
        console.log("Vendor depois de atualizado", this.currentVendor);
        console.log("Dados do vendor inicializados:", vendorData);
    }

    // Função para recuperar o ID do Vendor
    getVendorId() {
        console.log("Current vendor", this.currentVendor);
        console.log("Current vendor id:  ", this.currentVendor);
        return this.currentVendor?.id || null;
    }


    // Função para atualizar o nome do Vendor
    updateVendorName = async (updatedData) => {
        const vendorId = this.getVendorId();

        if (!vendorId) {
            console.error("Erro: ID do Vendor não encontrado.");
            return;
        }
        try {
            const response = await axios.patch(`/dashboard/vendor/name/${vendorId}`, updatedData);

            runInAction(() => {
                if (updatedData.first_name) {
                    this.currentVendor.first_name = updatedData.first_name;
                }
                if (updatedData.last_name) {
                    this.currentVendor.last_name = updatedData.last_name;
                }
            });
            console.log("Nome do vendor atualizado com sucesso:", response.data);
            console.log("UpdateData:", updatedData);
        } catch (error) {
            console.error("Erro ao atualizar o nome do vendor no vendor Store:", error);
        }
    };

    //Função para actulizar restantes infos do Vendor
    updateVendorInfo = async (updatedData) => {
        const vendorId = this.getVendorId();

        if (!vendorId) {
            console.error("ID do Vendor não encontrado!");
            return;
        }
        console.log("Vendor store antes de actualizar:", this.currentVendor)

        try {
            const response = await axios.patch(`/dashboard/vendor/info/${vendorId}`, updatedData);
            this.currentVendor = response.data.vendor;
            console.log("Dados do Vendor atualizados com sucesso:", response.data);
        } catch (error) {
            console.error("Erro ao atualizar os dados do Vendor!", error);
        }
    };


    // Função para atualizar os dados da Company e suas relações (contacts e addresses)
    updateCompanyAndRelations = async (updatedData) => {
        if (!this.companyDetails?.id) {
            console.error("Erro: ID da Company não encontrado.");
            return;
        }

        try {
            const response = await axios.put(`/dashboard/company/${this.companyDetails.id}`, updatedData);

            runInAction(() => {
                const { companyDetails, companyContacts, companyAddresses } = response.data;

                this.companyDetails = companyDetails;
                this.companyContacts = companyContacts || [];
                this.companyAddresses = companyAddresses || [];
            });

            console.log("Informações da empresa e suas relações atualizadas com sucesso:", response.data);
        } catch (error) {
            console.error("Erro ao atualizar informações da empresa e suas relações:", error);
        }
    };

    // Limpar dados do fornecedor atual
    clearVendorData() {
        runInAction(() => {
            this.currentVendor = null;
            this.companyDetails = null;
            this.companyContacts = [];
            this.companyAddresses = [];
        });
        console.log("Dados do vendor limpos.");
    }
}

export const vendorStore = new VendorStore();
