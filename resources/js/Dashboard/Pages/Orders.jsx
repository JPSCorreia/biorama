import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, useTheme, useMediaQuery } from "@mui/material";
import {
    DashboardAllOrders,
    DashboardAllOrdersCard,
    DashboardStoreOrderCard,
    DashboardStoreOrdersTable,
    DashboardShowOrderModal,
    DashboardOrderEditModal,
} from "../Components/";
import { orderStore } from "@/Stores/orderStore.js";
import { observer } from "mobx-react";

const Orders = observer(() => {
    const theme = useTheme();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [viewingAllOrders, setViewingAllOrders] = useState(true);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const smallerThanLarge = useMediaQuery(theme.breakpoints.down("lg"));

    useEffect(() => {
        orderStore.fetchOrders(searchTerm, currentPage, itemsPerPage);
        orderStore.fetchVendorStores();
    }, [currentPage, itemsPerPage, searchTerm]);

    const handleViewAllOrders = () => {
        setViewingAllOrders(true);
        setSelectedStore(null);
        setSearchTerm("");
        orderStore.fetchOrders("", currentPage, itemsPerPage);
    };

    const handleViewStoreOrders = (store) => {
        setViewingAllOrders(false);
        setSelectedStore(store);
        setSearchTerm("");
        orderStore.fetchOrdersByStore(store.id, "", currentPage, itemsPerPage);
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setViewModalOpen(true);
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setEditModalOpen(true);
    };

    const handleSaveOrder = async () => {
        await orderStore.fetchOrders(searchTerm, currentPage, itemsPerPage);
        setEditModalOpen(false);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                mt: 4,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* Header Section */}
            <Paper
                elevation={4}
                sx={{
                    width: "96%",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    padding: 2,
                    borderRadius: "8px",
                }}
            >
                <Typography variant="h4" fontWeight="bold">
                    Encomendas
                </Typography>
            </Paper>

            <Box
                sx={{
                    display: "flex",
                    my: 4,
                    gap: 2,
                    flexWrap: "wrap", // Permite quebra de linha quando necessário
                    justifyContent: "center", // Centraliza os itens horizontalmente
                    width: "100%",
                }}
            >
                <DashboardAllOrdersCard
                    totalOrders={orderStore.totalOrders}
                    onViewAllOrders={handleViewAllOrders}
                />
                {orderStore.stores.length > 0 &&
                    orderStore.stores.map((store) => (
                        <DashboardStoreOrderCard
                            store={store}
                            onViewStoreOrders={() =>
                                handleViewStoreOrders(store)
                            }
                        />
                    ))}
            </Box>

                {viewingAllOrders ? (
                    <DashboardAllOrders
                        orders={orderStore.orders}
                        onPageChange={setCurrentPage}
                        onViewOrder={handleViewOrder}
                        onEditOrder={handleEditOrder}
                    />
                ) : (
                    <DashboardStoreOrdersTable
                        storeName={selectedStore?.name}
                        storeId={selectedStore?.id}
                        onViewOrder={handleViewOrder}
                        onEditOrder={handleEditOrder}
                        totalPages={orderStore.totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                )}

            <DashboardShowOrderModal
                order={selectedOrder}
                isOpen={isViewModalOpen}
                onClose={() => setViewModalOpen(false)}
            />

            <DashboardOrderEditModal
                order={selectedOrder}
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={handleSaveOrder}
            />
        </Box>
    );
});

export default Orders;
