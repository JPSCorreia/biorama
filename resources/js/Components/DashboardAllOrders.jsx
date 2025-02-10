import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Pagination, TextField, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { orderStore } from "@/Stores/orderStore.js";

/**
 * DashboardAllOrders Component
 * Displays a list of orders with sorting, searching, and pagination functionalities.
 *
 * @param {Array} orders - List of orders to display.
 * @param {Function} onViewOrder - Function to handle viewing an order.
 * @param {Function} onEditOrder - Function to handle editing an order.
 */
const DashboardAllOrders = observer(({ orders, onViewOrder, onEditOrder,  }) => {
    // Fetch orders on component mount
    useEffect(() => {
        orderStore.fetchOrders();
    }, []);

    /**
     * Handles sorting orders by a specific field.
     * @param {string} field - The field to sort by.
     */
    const handleSort = (field) => {
        orderStore.sortOrders(field);
    };

    /**
     * Cancels an order and refreshes the order list.
     * @param {number} orderId - The ID of the order to cancel.
     */
    const handleCancelOrder = (orderId) => {
        orderStore.cancelOrder(orderId);
        orderStore.fetchOrders();
    };

    /**
     * Checks if an order is cancelled.
     * @param {Object} order - The order to check.
     * @returns {boolean} - True if the order is cancelled, false otherwise.
     */
    const isOrderCancelled = (order) => order.statuses_id === 5;
            console.log("order", orders);
    return (
        <Box sx={{ padding: 2 }}>
            {/* Top bar with title and search field */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 2,
                    backgroundColor: "green",
                    padding: 2,
                    borderRadius: "12px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                }}
            >
                <Typography variant="h5" sx={{ color: "white" }}>Orders</Typography>

                {/* Search field */}
                <TextField
                    label="Search by email or order ID"
                    variant="outlined"
                    sx={{
                        width: "300px",
                        backgroundColor: "white",
                        borderRadius: "8px"
                    }}
                    onChange={(e) => orderStore.searchOrders(e.target.value)}
                />
            </Box>

            {/* Orders table */}
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
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>
                                    {new Date(order?.created_at).toLocaleDateString("pt-PT", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric"
                                    })}
                                </TableCell>
                                <TableCell>{order.user?.first_name + " " + order.user?.last_name || "N/A"}</TableCell>
                                <TableCell>{order.user?.email || "N/A"}</TableCell>
                                <TableCell>{order.status?.name || "N/A"}</TableCell>
                                <TableCell>{parseFloat(order.total || 0).toFixed(2)} €</TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <Button variant="outlined" onClick={() => onViewOrder(order)} sx={{ mr: 1 }}>
                                            View
                                        </Button>
                                        <Button variant="outlined" color="primary" onClick={() => onEditOrder(order)}>
                                            Edit
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
                                                    backgroundColor: isOrderCancelled(order) ? "transparent" : "rgba(255, 0, 0, 0.1)"  // Light red background on hover if not disabled
                                                }
                                            }}
                                        >
                                            {isOrderCancelled(order) ? "Cancelled" : "Cancel"}
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
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
