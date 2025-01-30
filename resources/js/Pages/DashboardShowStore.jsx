import {observer} from "mobx-react";
import {Paper} from "@mui/material";
import {usePage} from "@inertiajs/react";
import {shopStore} from "@/Stores/index.js";
import {DashboardShowStoreInfo} from "@/Components/index.js";

const DashboardShowStore = observer(() =>{
    console.log("Props:", usePage().props.store);
    shopStore.setStoreData(usePage().props.store);
    const user = usePage().props.auth.user;

    const store = shopStore.currentStore;
    console.log("Current Strore", shopStore.currentStore);
    return(

            <DashboardShowStoreInfo store ={store} user ={user}/>

    )
})
export default DashboardShowStore;
