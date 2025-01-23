import { action, makeObservable, observable, runInAction } from "mobx";
import axios from "axios";
import { makePersistable } from "mobx-persist-store";

class VendorStore {
    // Observable state properties
    vendors = null;
    currentVendor = null;
    companyDetails = null;
    companyContacts = [];
    companyAddresses = [];

    /**
     * Initializes the AlertStore with MobX observables and persistence
     */
    constructor() {
        makeObservable(this, {
            vendors: observable,
            currentVendor: observable,
            companyDetails: observable,
            companyContacts: observable,
            companyAddresses: observable,
            setVendorData: action,
            updateVendorName: action,
            updateVendorInfo: action,
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

    // Action to set initial vendor data received from controller
    setVendorData(vendorData) {
        console.log("Dados do vendor recebidos na store:", vendorData);
        runInAction(() => {
            this.currentVendor = vendorData;
            this.companyDetails = vendorData.company;
            this.companyContacts = vendorData.company.addresses;
            this.companyAddresses = vendorData.company.contacts;
        });
    }

    // Function to retrieve Vendor ID
    getVendorId() {
        return this.currentVendor?.id || null;
    }

    // Function to update Vendor's name
    updateVendorName = async (updatedData) => {
        const vendorId = this.getVendorId();

        if (!vendorId) {
            console.error("Erro: ID do Vendor não encontrado.");
            return;
        }
        try {

            await axios.patch(
                `/dashboard/vendor/name/${vendorId}`,
                updatedData,
            );

            runInAction(() => {
                if (updatedData.first_name) {
                    this.currentVendor.first_name = updatedData.first_name;
                }
                if (updatedData.last_name) {
                    this.currentVendor.last_name = updatedData.last_name;
                }
            });
        } catch (error) {
            console.error(
                "Erro ao atualizar o nome do vendor no vendor Store:",
                error,
            );
        }
    };

    // Function to update remaining Vendor information
    updateVendorInfo = async (updatedData) => {
        const vendorId = this.getVendorId();

        if (!vendorId) {
            console.error("ID do Vendor não encontrado!");
            return;
        }

        try {
            const response = await axios.patch(
                `/dashboard/vendor/info/${vendorId}`,
                updatedData,
            );
            this.currentVendor = response.data.vendor;
        } catch (error) {
            console.error("Erro ao atualizar os dados do Vendor!", error);
        }
    };

    // Function to update Company data and its relations (contacts and addresses)
    updateCompanyAndRelations = async (updatedData) => {
        if (!this.companyDetails?.id) {
            console.error("Erro: ID da Company não encontrado.");
            return;
        }

        try {
            const response = await axios.put(
                `/dashboard/company/${this.companyDetails.id}`,
                updatedData,
            );

            runInAction(() => {
                const { companyDetails, companyContacts, companyAddresses } =
                    response.data;

                this.companyDetails = companyDetails;
                this.companyContacts = companyContacts || [];
                this.companyAddresses = companyAddresses || [];
            });

        } catch (error) {
            console.error(
                "Erro ao atualizar informações da empresa e suas relações:",
                error,
            );
        }
    };

    // Clear current vendor data
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
