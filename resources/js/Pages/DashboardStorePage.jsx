import {observer} from "mobx-react";
import {usePage} from "@inertiajs/react";
import {Paper, useMediaQuery, useTheme} from "@mui/material";
import {DashboardStoresCard} from "@/Components/index.js";
import {shopStore} from "../Stores";

const DashboardStorePage  = observer(()=>{
    const {user} = usePage().props;
    //shopStore.setStoresData(user.vendor.stores);
    shopStore.setStoreData(user.vendor.stores[0]);
    // Seleciona a primeira loja
    console.log("Auth", user);
    console.log("User vendor store", shopStore.currentStore);
    const store = shopStore.currentStore;
    console.log("Adress:", store.addresses[0] );


    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    return(
        <Paper elevation={4}
               sx={{
                       p: 2,
                       width: isSmallScreen ? "100%" : "80%",
                       m: "auto",
                       display: "flex",
                       flexDirection: "column",
                       height: "100%",
                       borderRadius: "10px",
               }}>
        <DashboardStoresCard
        store={store}
        />
        </Paper>
    )
})

export default DashboardStorePage;
