import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Pagination,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { orderStore } from '@/Stores/orderStore.js';

const DashboardStoreOrdersTable = observer(({ storeName, storeId, onViewOrder, onEditOrder }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        orderStore.fetchOrdersByStore(storeId, searchTerm, currentPage, itemsPerPage);
    }, [storeId, searchTerm, currentPage, itemsPerPage]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (field) => {
        orderStore.sortOrders(field);
    };

    const handleCancelOrder = (orderId) => {
        orderStore.cancelOrder(orderId).then(() => {
            orderStore.fetchOrdersByStore(storeId, searchTerm, currentPage, itemsPerPage);
        });
    };

    const isOrderCancelled = (order) => order.statuses_id === 5;

    return (
        <Box sx={{ padding: 2 }}>
            {/* Título Dinâmico */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'green',
                    padding: 2,
                    borderRadius: '12px',
                    marginBottom: 2,
                    color: 'white',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography variant="h5">Encomendas da Loja {storeName}</Typography>

                {/* Campo de Pesquisa */}
                <TextField
                    label="Pesquisar por nome, email ou ID"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    variant="outlined"
                    sx={{ width: 300, backgroundColor: 'white', borderRadius: '8px' }}
                />
            </Box>

            {orderStore.orders.length === 0 ? (
                <Typography variant="h6" sx={{ textAlign: 'center', color: 'grey.600' }}>
                    Sem Encomendas
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                                    Nº da Encomenda {orderStore.sortField === "id" ? (orderStore.sortOrder === "asc" ? "↑" : "↓") : ""}
                                </TableCell>
                                <TableCell onClick={() => handleSort("created_at")} style={{ cursor: "pointer" }}>
                                    Data {orderStore.sortField === "created_at" ? (orderStore.sortOrder === "asc" ? "↑" : "↓") : ""}
                                </TableCell>
                                <TableCell onClick={() => handleSort("user.first_name")} style={{ cursor: "pointer" }}>
                                    Nome  {orderStore.sortField === "user.first_name" ? (orderStore.sortOrder === "asc" ? "↑" : "↓") : ""}
                                </TableCell>
                                <TableCell onClick={() => handleSort("user.email")} style={{ cursor: "pointer" }}>
                                    Email {orderStore.sortField === "user.email" ? (orderStore.sortOrder === "asc" ? "↑" : "↓") : ""}
                                </TableCell>
                                <TableCell onClick={() => handleSort("status.name")} style={{ cursor: "pointer" }}>
                                    Estado {orderStore.sortField === "status.name" ? (orderStore.sortOrder === "asc" ? "↑" : "↓") : ""}
                                </TableCell>
                                <TableCell onClick={() => handleSort("total")} style={{ cursor: "pointer" }}>
                                    Total (€) {orderStore.sortField === "total" ? (orderStore.sortOrder === "asc" ? "↑" : "↓") : ""}
                                </TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderStore.orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>
                                        {new Date(order.created_at).toLocaleDateString("pt-PT", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric"
                                        })}
                                    </TableCell>
                                    <TableCell>{`${order.user?.first_name || ''} ${order.user?.last_name || ''}`}</TableCell>
                                    <TableCell>{order.user?.email || 'N/A'}</TableCell>
                                    <TableCell>{order.status?.name || 'N/A'}</TableCell>
                                    <TableCell>{parseFloat(order.total || 0).toFixed(2)} €</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button variant="outlined" onClick={() => onViewOrder(order)}>
                                                Ver
                                            </Button>
                                            <Button variant="outlined" color="primary" onClick={() => onEditOrder(order)}>
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                disabled={isOrderCancelled(order)}
                                                onClick={() => handleCancelOrder(order.id)}
                                                sx={{
                                                    borderColor: isOrderCancelled(order) ? "grey.400" : "red",
                                                    color: isOrderCancelled(order) ? "grey.600" : "red",
                                                    cursor: isOrderCancelled(order) ? "not-allowed" : "pointer",
                                                    '&:hover': {
                                                        backgroundColor: isOrderCancelled(order) ? "transparent" : "rgba(255, 0, 0, 0.1)",
                                                    },
                                                }}
                                            >
                                                {isOrderCancelled(order) ? "Cancelada" : "Cancelar"}
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Paginação */}
            {orderStore.totalPages > 1 && (
                <Pagination
                    count={orderStore.totalPages}
                    page={currentPage}
                    onChange={(e, value) => setCurrentPage(value)}
                    sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
                />
            )}
        </Box>
    );
});

export default DashboardStoreOrdersTable;
