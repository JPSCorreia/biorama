import {action, makeObservable, observable, runInAction} from "mobx";
import axios from "axios";
import {makePersistable} from "mobx-persist-store";

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
        runInAction(() => {
            if (!this.currentVendor  ) {
                this.currentVendor = vendorData;
            }
            this.companyDetails = vendorData.company;
            this.companyContacts = vendorData.company.contacts;
            this.companyAddresses = vendorData.company.addresses;
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
            const response = await axios.patch(`/dashboard/vendor/name/${vendorId}`, updatedData);

            runInAction(() => {
                if (updatedData.first_name) {
                    this.currentVendor.first_name = updatedData.first_name;
                }
                if (updatedData.last_name) {
                    this.currentVendor.last_name = updatedData.last_name;
                }
            });
        } catch (error) {
            console.error("Erro ao atualizar o nome do vendor no vendor Store:", error);
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
            const response = await axios.patch(`/dashboard/vendor/info/${vendorId}`, updatedData);

            // Atualizar as propriedades do currentVendor individualmente
            runInAction(() => {
                Object.keys(response.data.vendor).forEach((key) => {
                    this.currentVendor[key] = response.data.vendor[key];
                });
            });

            console.log("Vendor atualizado com sucesso:", response.data);
            console.log("Vendor atualizado localmente:", this.currentVendor);
        } catch (error) {
            console.error("Erro ao atualizar os dados do Vendor!", error);
        }
    };

    // Function to update Company data and its relations (contacts and addresses)
    updateCompanyAndRelations = async (updatedData) => {
        if (!this.companyDetails?.id) {
            console.error("Erro: ID da empresa não encontrado!");
            return;
        }

        try {
            // Consolida os dados em um único payload
            const payload = {
                name: updatedData.name,
                nif: updatedData.nif,
                founded_at: updatedData.founded_at,
                sector: updatedData.sector,
                email: updatedData.email,
                website: updatedData.website,
                phone: updatedData.phone,
                street: updatedData.street,
                number: updatedData.number,
                postal_code: updatedData.postal_code,
                district: updatedData.district,
                country: updatedData.country,
                description: updatedData.description,
            };

            // Envia os dados para o backend
            const response = await axios.put(`/dashboard/vendor/company/info/${this.companyDetails.id}`, payload);

            // Atualizar os campos individuais na store
            runInAction(() => {
                const companyDetails = response.data.company;
                const companyContacts = response.data.company.contacts;
                const companyAddresses = response.data.company.addresses;
                console.log("Responsedata:",  response.data);
                console.log("Companycontacts:",companyAddresses );

                // Atualiza companyDetails
                if (companyDetails) {
                    if (companyDetails.name) this.currentVendor.company.name = companyDetails.name;
                    if (companyDetails.nif) this.currentVendor.company.nif = companyDetails.nif;
                    if (companyDetails.founded_at) this.currentVendor.company.founded_at = companyDetails.founded_at;
                    if (companyDetails.sector) this.currentVendor.company.sector = companyDetails.sector;
                    if (companyDetails.description) this.currentVendor.company.description = companyDetails.description;
                }

                // Atualiza companyContacts
                if (companyContacts) {
                    if (companyContacts.email) this.currentVendor.company.contacts.email = companyContacts.email;
                    if (companyContacts.website) this.currentVendor.company.contacts.website = companyContacts.website;
                    if (companyContacts.phone) this.currentVendor.company.contacts.phone = companyContacts.phone;
                }

                // Atualiza companyAddresses
                if (companyAddresses) {
                    if (companyAddresses.street) this.currentVendor.company.addresses.street = companyAddresses.street;
                    if (companyAddresses.number) this.currentVendor.company.addresses.number = companyAddresses.number;
                    if (companyAddresses.postal_code) this.currentVendor.company.addresses.postal_code = companyAddresses.postal_code;
                    if (companyAddresses.district) this.currentVendor.company.addresses.district = companyAddresses.district;
                    if (companyAddresses.country) this.currentVendor.company.addresses.country = companyAddresses.country;
                }
            });

            console.log("Informações da empresa e suas relações atualizadas com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar informações da empresa e suas relações:", error);
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
    }
}

export const vendorStore = new VendorStore();
