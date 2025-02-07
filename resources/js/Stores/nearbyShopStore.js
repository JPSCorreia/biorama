import { makeAutoObservable, toJS } from "mobx";
import axios from "axios";

class NearbyShopStore {
    nearbyStores = [];
    allStores = [];
    mostNearOrderProducts = [];
    highestNearDiscountProduct = [];
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchNearbyStores(latitude, longitude, radius) {
        // Evitar que seja chamado repetidamente
        if (this.loading) return;

        this.loading = true;
        this.error = null;

        try {
            const response = await axios.get("/stores/nearby", {
                params: { latitude, longitude, radius },
            });

            this.allStores = response.data.allStores || [];
            this.nearbyStores = response.data.nearbyStores || [];
            this.mostNearOrderProducts = response.data.mostNearOrderProducts || [];
            this.highestNearDiscountProduct = response.data.highestNearDiscountProduct || [];

            console.log("Fetched stores:", toJS(this.nearbyStores));

        } catch (err) {
            this.error = "Erro ao buscar lojas próximas.";
            console.error("Erro ao buscar lojas próximas:", err.response?.data?.message || err.message);
        } finally {
            this.loading = false;
        }
    }
}

export const nearbyShopStore = new NearbyShopStore();
