import { Typography } from "@mui/material";
import {usePage} from "@inertiajs/react";
import DashboardAllOrders from "@/Components/DashboardAllOrders.jsx";
import {useEffect, useState} from "react";
import {orderStore} from "@/Stores/orderStore.js";
import {observer} from "mobx-react";

const Orders = observer(() => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        orderStore.fetchOrders(currentPage, itemsPerPage);
    }, [currentPage]);

    return (
        <div>
            <DashboardAllOrders
                orders={orderStore.orders}
                onPageChange={setCurrentPage}
            />
        </div>
    );
});


export default Orders;
