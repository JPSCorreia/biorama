import {action, makeObservable, observable, runInAction} from "mobx";
import axios from "axios";
import {makePersistable} from "mobx-persist-store";

class VendorStore {

    //Atributos da classe
    vendors = null;
    currentVendor=null;
    companyDetails = null;
    companyContacts =[];
    companyAddresses =[];

    constructor() {
        makeObservable(this, {
            vendors: observable,
            currentVendor: observable,
            companyDetails: observable,
            companyContacts: observable,
            companyAddresses: observable,
            fetchVendor: action,
            checkIfVendorIsCompany: action,
            fetchCompanyDetails: action,
            updateCompany: action,
            updateCompanyAddress: action,
            updateCompanyContact: action,
            clearVendorData: action,
        });

        makePersistable({
            name:"vendorStore",
            properties:["vendors", "currentVendor", "companyDetails"],
            storage: window.localStorage,
        });
    }


    // Ação para carregar a lista de vendors
    fetchVendor = async () => {
        try {
            const response = await axios.get("/vendors");
            runInAction(() => {
                this.vendors = response.data;
            });
            console.log("Vendors Carregados:", this.vendors);
        } catch (error) {
            console.error("Erro ao carregar vendors:", error);
        }
    };

// Ação para verificar se o vendor é uma empresa
    checkIfVendorIsCompany = async (userId) => {
        try {
            // Faz a requisição para buscar o vendor associado ao userId
            const response = await axios.get(`/vendors/user/${userId}`);
            const vendor = response.data;

            if (!vendor) {
                console.log("Nenhum vendor encontrado para este usuário.");
                return { isVendor: false, isCompany: false };
            }

            // Verifica o campo is_company
            const isCompany = vendor.is_company === 1; // Verifica se é uma empresa
            console.log(`O vendor associado ao userId ${userId} ${isCompany ? "é" : "não é"} uma empresa.`);

            return { isVendor: true, isCompany };
        } catch (error) {
            console.error("Erro ao verificar se o vendor é empresa:", error);
            return { isVendor: false, isCompany: false };
        }
    };

    //Acção para obter ta informação da empresa
    fetchCompanyDetails = async (vendorId) =>{
        try {
            const response = await axios.get(`companies?vendor_id${vendorId}`);
            const company =  response.data;
            runInAction(() => {
                this.companyDetails = response.data;
            });

            this.fetchCompanyContacts(company.id);
            this.fetchCompanyAddresses(company.id);

            console.log("Informação da empresa carregadas:", this.companyDetails);
        }catch (error){
            console.log("Erro a carregar informação da empresa:", error)
        }
    };

    //Ação para caregar os contactos da impresa por id
    fetchCompanyContacts = async (companyId) =>{
        try {
            const response = await axios.get(`/company_contacts?company_id =${companyId}`);
            runInAction(() => {
                this.companyContacts = response.data;
            });
            console.log("Contatos da empresa carregados:", this.companyContacts);
        }catch (error){
            console.log("Erro a carregar contatos da empresa:", error);
        }
    };

    //Ação parra carregar moradas da empresa por id
    fetchCompanyAddresses = async (companyId) => {
        try {
            const response = await axios.get(`/company_addresses?company_id=${companyId}`);
            runInAction(() => {
                this.companyAddresses = response.data;
            });

            console.log("Endereços da empresa carregados:", this.companyAddresses);
        } catch (error) {
            console.error("Erro ao carregar endereços da empresa:", error);
        }
    };

    //Função para actualizar os dados da Empresa por id
    updateCompany = async (companyId, updatedData) => {
        try {
            const response = await axios.put(`/companies/${companyId}`, updatedData);
            runInAction(() => {
                this.companyDetails = {...this.companyDetails, ...updatedData};
            });

            console.log("Informação atualizada com sucesso:", response.data);
        }catch (error){
            console.log("Erro a actulizar dados", error);
        }
    };

    //Função para actualizar a morada da empresa
    updateCompanyAddress = async (addressId, updatedData) => {
        try {
            const response = await axios.put(`/company_addresses/${addressId}`, updatedData);
            runInAction(() => {
                // Atualiza o endereço no estado local
                this.companyAddresses = this.companyAddresses.map((address) =>
                    address.id === addressId ? { ...address, ...updatedData } : address
                );
            });

            console.log("Endereço da empresa atualizado com sucesso:", response.data);
        } catch (error) {
            console.error("Erro ao atualizar endereço da empresa:", error);
        }
    };

    //Função para actualizar os contactos
    updateCompanyContact = async (contactId, updatedData) => {
        try {
            const response = await axios.put(`/company_contacts/${contactId}`, updatedData);
            runInAction(() => {
                // Atualiza o contato no estado local
                this.companyContacts = this.companyContacts.map((contact) =>
                    contact.id === contactId ? { ...contact, ...updatedData } : contact
                );
            });

            console.log("Contato da empresa atualizado com sucesso:", response.data);
        } catch (error) {
            console.error("Erro ao atualizar contato da empresa:", error);
        }
    };

    // Limpar dados do fornecedor atual
    clearVendorData() {
        this.currentVendor = null;
        this.companyDetails = null;
        this.companyContacts = [];
        this.companyAddresses = [];
    }

}

export const vendorStore = new VendorStore();
