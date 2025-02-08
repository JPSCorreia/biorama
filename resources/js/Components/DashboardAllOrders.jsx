import React, {useEffect} from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Pagination, TextField, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { orderStore } from "@/Stores/orderStore.js";

const DashboardAllOrders = observer(({ orders, onViewOrder, onEditOrder }) => {
    useEffect(() => {
        orderStore.fetchOrders();  // Buscar as encomendas ao carregar
    }, []);

    const handleSort = (field) => {
        orderStore.sortOrders(field);
    };

    const handleCancelOrder = (orderId) => {
            orderStore.cancelOrder(orderId);
            orderStore.fetchOrders();
    };

    const isOrderCancelled = (order) => order.statuses_id === 5;


    return (
        <Box sx={{ padding: 2 }}>
            {/* Barra Superior */}
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
                backgroundColor: "green",
                padding: 2,
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
            }}>
                <Typography variant="h5" sx={{ color: "white" }}>Encomendas</Typography>

                {/* Campo de pesquisa */}
                <TextField
                    label="Pesquisar por email ou ID da encomenda"
                    variant="outlined"
                    sx={{
                        width: "300px",
                        backgroundColor: "white",
                        borderRadius: "8px"
                    }}
                    onChange={(e) => orderStore.searchOrders(e.target.value)}
                />
            </Box>

            {/* Tabela de encomendas */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                                Nº Da Encomenda {orderStore.sortField === "id" ? (orderStore.sortOrder === "asc" ? "↑" : "↓") : ""}
                            </TableCell>
                            <TableCell onClick={() => handleSort("user.first_name")} style={{ cursor: "pointer" }}>
                                Nome {orderStore.sortField === "user.first_name" ? (orderStore.sortOrder === "asc" ? "↑" : "↓") : ""}
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
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.user?.first_name + " " + order.user?.last_name || "N/A"}</TableCell>
                                <TableCell>{order.user?.email || "N/A"}</TableCell>
                                <TableCell>{order.status?.name || "N/A"}</TableCell>
                                <TableCell>{parseFloat(order.total || 0).toFixed(2)} €</TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <Button variant="outlined" onClick={() => onViewOrder(order)} sx={{ mr: 1 }}>
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
                                                    backgroundColor: isOrderCancelled(order) ? "transparent" : "rgba(255, 0, 0, 0.1)",  // Leve fundo vermelho ao hover se não estiver desativado
                                                }
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

            {/* Paginação */}
            {orderStore.totalPages > 1 && (
                <Pagination
                    count={orderStore.totalPages}
                    page={orderStore.currentPage}
                    onChange={(e, value) => orderStore.changePage(value)}
                    sx={{ marginTop: 2 }}
                />
            )}
        </Box>
    );
});

export default DashboardAllOrders;
