import { observer } from "mobx-react";
import { Box } from "@mui/material";
import { usePage } from "@inertiajs/react";
import { shopStore } from "@/Stores/index.js";
import { DashboardShowStoreInfo } from "@/Components/index.js";
import { useEffect } from "react";

const Store = observer(() => {
    // Get initial store data and the authenticated user
    const {
        store: initialStore,
        auth: { user },
    } = usePage().props;
    /**
     * Set the store data in the shopStore only if it is not already set
     * or if the current store ID does not match the initial store ID.
     */
    useEffect(() => {
        // Apenas define os dados da loja se eles não estiverem já configurados corretamente
        if (
            !shopStore.currentStore ||
            shopStore.currentStore.id !== initialStore.id
        ) {
            shopStore.setStoreData(initialStore);
        }
    }, [initialStore]);
    // Get the current store from the shopStore
    const store = shopStore.currentStore;

    return (
        <Box sx={{ pt: "2%" }}>
            {/* Display detailed store information */}
            <DashboardShowStoreInfo store={store} user={user} />
        </Box>
    );
});

export default Store;
