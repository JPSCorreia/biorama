import {observer} from "mobx-react";
import {Box, Container, Paper} from "@mui/material";
import {usePage} from "@inertiajs/react";
import {shopStore} from "@/Stores/index.js";
import {DashboardShowStoreInfo} from "@/Components/index.js";
import {useEffect} from "react";

const DashboardShowStore = observer(() => {
    // Obtém os dados da loja inicial e do usuário
    const { store: initialStore, auth: { user } } = usePage().props;

    useEffect(() => {
        // Apenas define os dados da loja se eles não estiverem já configurados corretamente
        if (!shopStore.currentStore || shopStore.currentStore.id !== initialStore.id) {
            shopStore.setStoreData(initialStore);
        }
    }, [initialStore]);

    const store = shopStore.currentStore;

    console.log("Props:", initialStore);
    console.log("Current Store:", store);
    return (
        <Box>
            <DashboardShowStoreInfo store={store} user={user}/>
        </Box>

    )
})
export default DashboardShowStore;
