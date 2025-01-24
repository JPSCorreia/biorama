import { makeObservable, observable, action, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store";
import axios from "axios";

class VendorRegistrationStore {
    // Observable state properties
    isCompany = false; // Defines if the user will register a company
    vendorFormValid = false; // Vendor form validation status
    companyFormValid = false; // Company form validation status
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
    }; // Vendor data
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
    }; // Company data, if applicable
    store = {
        name: "",
        phone: "",
        email: "",
        description: "",
        rating: 0.0,
        coordinates: "",
        store_images: [],
    }; // Store data
    storeFormValid = false; // Store form validation status

    products = []; // Products list
    productsFormValid = false; // Products form validation status

    /**
     * Initializes the VendorRegistrationStore with MobX observables and persistence
     */
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

    // Action to initialize user
    initializeVendor(vendorData) {
        this.vendor = vendorData;
    }

    // Actions to set form validation status
    setVendorFormValid(value) {
        this.vendorFormValid = value;
    }
    setCompanyFormValid(value) {
        this.companyFormValid = value;
    }
    setStoreFormValid(value) {
        this.storeFormValid = value;
    }
    setProductFormValid(value) {
        this.productsFormValid = value;
    }

    // Action to update user data
    updateVendor(data) {
        this.user = { ...this.user, ...data };
    }

    // Action to set company status
    setIsCompany(isCompany) {
        this.isCompany = isCompany;
        this.vendor["is_company"] = isCompany; // Updates the value in the user object
        if (!isCompany) {
            this.companyFormValid = false; // Resets company form validation
            this.vendor["is_company"] = false; // Updates the value in the user object
        }
    }

    // Action to update company data
    updateCompany(data) {
        if (this.vendor["is_company"]) {
            this.company = { ...this.company, ...data };
        }
    }

    // Action to update store data
    updateStore(data) {
        this.store = { ...this.store, ...data };
    }

    // Action to add a product
    addProduct(product) {
        this.products.push(product);
    }

    // Method to submit data to server
    async submit() {
        try {
            if (!this.user || !this.store) throw new Error("Incomplete data");

            // 1. Update user (including isCompany and role)
            await axios.post("/users/update", {
                ...this.user,
                isCompany: this.isCompany,
            });

            // 2. Create company if applicable
            if (this.isCompany && this.company) {
                await axios.post("/companies", this.company);
            }

            // 3. Create store
            const storeResponse = await axios.post("/stores", this.store);

            // 4. Add products
            if (this.products.length > 0) {
                await axios.post(`/stores/${storeResponse.data.id}/products`, {
                    products: this.products,
                });
            }

            // Clear store after successful submission
            runInAction(() => {
                this.user = null;
                this.isCompany = false;
                this.company = null;
                this.store = null;
                this.products = [];
            });

            return true;
        } catch (error) {
            console.error("Error submitting data:", error);
            throw error;
        }
    }
}

export const vendorRegistrationStore = new VendorRegistrationStore();
