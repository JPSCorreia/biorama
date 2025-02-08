import React, { useEffect, useState } from 'react';
import { Box, Paper } from "@mui/material";
import DashboardAllOrdersCard from "@/Components/DashboardAllOrdersCard.jsx";
import DashboardStoreOrderCard from "@/Components/DashboardStoreOrderCard.jsx";
import DashboardAllOrders from "@/Components/DashboardAllOrders.jsx";
import DashboardStoreOrdersTable from "@/Components/DashboardStoreOrdersTable.jsx";
import DashboardShowOrderModal from "@/Components/DashboardShowOrderModal.jsx";
import DashboardOrderEditModal from "@/Components/DashboardOrderEditModal.jsx";
import { orderStore } from "@/Stores/orderStore.js";
import { observer } from "mobx-react";

const Orders = observer(() => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [viewingAllOrders, setViewingAllOrders] = useState(true);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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
        <Paper elevation={4}
               sx={{
                   p: 2,
                   width: "80%",
                   m: "auto",
                   display: "flex",
                   flexDirection: "column",
                   gap: 2,
                   borderRadius: "10px",
                   overflow: "hidden",
                   backgroundColor: "rgba(255, 255, 255, 0.9)",
                   position: "relative", // Adiciona posição relativa ao Paper
               }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                    <DashboardAllOrdersCard
                        totalOrders={orderStore.totalOrders}
                        onViewAllOrders={handleViewAllOrders}
                    />
                </Box>

                {orderStore.stores.length > 0 && orderStore.stores.map((store) => (
                    <Box key={store.id} sx={{ flex: '1 1 300px', minWidth: 300 }}>
                        <DashboardStoreOrderCard
                            store={store}
                            onViewStoreOrders={() => handleViewStoreOrders(store)}
                        />
                    </Box>
                ))}
            </Box>

            <Box sx={{ marginTop: 4 }}>
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
            </Box>

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
        </Paper>
    );
});

export default Orders;
