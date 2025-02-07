import { configurePersistable } from "mobx-persist-store";
import { appStore } from "./appStore";
import { authStore } from "./authStore";
import { cartStore } from "./cartStore";
import { alertStore } from "./alertStore";
import { homeAddressStore } from "./homeAddressStore";
import { vendorRegistrationStore } from "./vendorRegistrationStore.js";
import { vendorStore } from "./vendorsStore.js";
import { shopStore } from "./shopStore.js";
import { hoverStore } from "./hoverStore.js";
import {productStore} from "./productStore.js"
import {orderStore} from "./orderStore.js";

// Mobx-persist-store default configuration for all stores
configurePersistable({
    storage: window.sessionStorage,
    jsonify: true,
    debugMode: false,
});

// Export all stores
export {
    appStore,
    authStore,
    cartStore,
    alertStore,
    homeAddressStore,
    hoverStore,
    vendorRegistrationStore,
    vendorStore,
    shopStore,
    productStore,
    orderStore,
};
