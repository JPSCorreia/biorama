import { configurePersistable } from 'mobx-persist-store';
import { appStore } from "./appStore";
import { authStore } from "./authStore";
import { cartStore } from "./cartStore";

// Configuração do mobx-persist-store
configurePersistable({
    storage: window.localStorage,
    jsonify: true,
    debugMode: false,
});

// NÃO persista o authStore para não interferir com o "Manter-me ligado" do Laravel
// Remova qualquer configuração de persistable do authStore

// Exporte os stores
export { appStore, authStore, cartStore };
