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
    const [itemsPerPage, setItemsPerPage] = useState(10); // Inicializar o limite corretamente
    const [viewingAllOrders, setViewingAllOrders] = useState(true);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // Armazenar o termo de pesquisa

    useEffect(() => {
        orderStore.fetchOrders(searchTerm, currentPage, itemsPerPage);
        orderStore.fetchVendorStores();
    }, [currentPage, itemsPerPage, searchTerm]);

    const handleViewAllOrders = () => {
        setViewingAllOrders(true);
        setSelectedStore(null);
        setSearchTerm("");  // Reiniciar a pesquisa ao alternar para todas as encomendas
        orderStore.fetchOrders("", currentPage, itemsPerPage);
    };

    const handleViewStoreOrders = (storeId) => {
        setViewingAllOrders(false);
        setSelectedStore(storeId);
        setSearchTerm(""); // Reiniciar a pesquisa ao alternar para encomendas de uma loja específica
        orderStore.fetchOrdersByStore(storeId, currentPage, itemsPerPage);
    };

    const handleSearchOrders = (term) => {
        setSearchTerm(term);
        if (viewingAllOrders) {
            orderStore.fetchOrders(term, currentPage, itemsPerPage);
        } else if (selectedStore) {
            orderStore.fetchOrdersByStore(selectedStore, currentPage, itemsPerPage);
        }
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
        <Paper sx={{ padding: 2 }}>
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
                            onViewStoreOrders={() => handleViewStoreOrders(store.id)}
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
                        onSearch={handleSearchOrders}  // Corrigir a pesquisa
                    />
                ) : (
                    <DashboardStoreOrdersTable
                        storeName={selectedStore?.name}
                        orders={orderStore.orders}
                        onViewOrder={handleViewOrder}
                        onEditOrder={handleEditOrder}
                        onSearch={handleSearchOrders}
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
