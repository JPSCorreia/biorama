import { makeAutoObservable } from "mobx";
import axios from "axios";

class NearbyShopStore {
    nearbyStores = [];
    allStores = [];
    bestProducts = [];
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

            this.setAllStores(response.data.allStores);
            this.setNearbyStores(response.data.nearbyStores);

            if (response.data.nearbyStores) {
                // Mapeia as lojas e junta os produtos num único array
                const allBestProducts = response.data.nearbyStores.flatMap(
                    (store) => store.bestProducts || [],
                );

                // Atualiza o estado do MobX corretamente
                this.setBestProducts(allBestProducts);
            }
        } catch (err) {
            this.error = "Erro ao buscar lojas próximas.";
            console.error(
                "Erro ao buscar lojas próximas:",
                err.response?.data?.message || err.message,
            );
        } finally {
            this.setLoading(false);
        }
    }
    setBestProducts(products) {
        this.bestProducts = [...products]; // Atualiza garantindo a reatividade
    }

    setNearbyStores(stores) {
        this.nearbyStores = stores;
    }

    setAllStores(stores) {
        this.allStores = stores;
    }

    setLoading(status) {
        this.loading = status;
    }
}

export const nearbyShopStore = new NearbyShopStore();
