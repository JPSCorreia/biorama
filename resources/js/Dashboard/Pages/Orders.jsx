import React, { useEffect, useState } from 'react';
import {Box, Paper, Typography, useTheme} from "@mui/material";
import { DashboardAllOrders, DashboardAllOrdersCard, DashboardStoreOrderCard, DashboardStoreOrdersTable, DashboardShowOrderModal, DashboardOrderEditModal } from "../Components/";
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
        <Box sx={{
                   width: "95%",
                   m: "auto",
                   display: "flex",
                   flexDirection: "column",
                   gap: 2,
                   borderRadius: "10px",
                   overflow: "hidden",
               }}>
            <Box></Box>
            <Box sx={{
                    width: "100%",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    padding: "12px 24px",
                    borderRadius: "8px",
                    textAlign: "left",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    boxShadow: 3,
                    zIndex: 2,
                }}
            >
                <Typography variant="h4" fontWeight="bold" >
                    Encomendas
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap', // Permite quebra de linha quando necessário
                    justifyContent: 'center', // Centraliza os itens horizontalmente
                    width: '100%',
                    padding: '20px',
                }}>
                <Box
                    sx={{
                        flex: '1 1 100%', // 100% no layout mobile
                        minWidth: '100%',
                        '@media (min-width: 600px)': {
                            flex: '1 1 45%', // 45% da largura se houver espaço suficiente
                            minWidth: '45%',
                        },
                        '@media (min-width: 900px)': {
                            flex: '1 1 30%', // 30% para 3 cards ou mais em telas maiores
                            minWidth: '30%',
                        },
                    }}
                >
                    <DashboardAllOrdersCard
                        totalOrders={orderStore.totalOrders}
                        onViewAllOrders={handleViewAllOrders}
                    />
                </Box>

                {orderStore.stores.length > 0 &&
                    orderStore.stores.map((store) => (
                        <Box
                            key={store.id}
                            sx={{
                                flex: '1 1 100%', // Mobile: ocupa toda a largura
                                minWidth: '100%',
                                '@media (min-width: 600px)': {
                                    flex: '1 1 45%', // 2 cards por linha em telas médias
                                    minWidth: '45%',
                                },
                                '@media (min-width: 900px)': {
                                    flex: '1 1 30%', // 3 cards por linha em telas grandes
                                    minWidth: '30%',
                                },
                            }}
                        >
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
        </Box>
    );
});

export default Orders;
