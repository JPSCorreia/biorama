import { configurePersistable } from 'mobx-persist-store';
import { appStore } from "./appStore";
import { authStore } from "./authStore";
import { cartStore } from "./cartStore";
import { alertStore } from "./alertStore";
import { homeAddressStore } from "./homeAddressStore";
import { vendorRegistrationStore } from "./vendorRegistrationStore.js";
import { vendorStore } from "./vendorsStore.js";

// Mobx-persist-store default configuration for all stores
configurePersistable({
    storage: window.sessionStorage,
    jsonify: true,
    debugMode: false,
});

// Export all stores
export { appStore, authStore, cartStore, alertStore, homeAddressStore, vendorRegistrationStore, vendorStore };
