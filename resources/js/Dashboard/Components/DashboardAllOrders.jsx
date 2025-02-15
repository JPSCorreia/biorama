import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Pagination,
    InputBase,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { orderStore } from "@/Stores/orderStore.js";
import SearchIcon from "@mui/icons-material/Search";
import { alpha } from "@mui/material/styles";

/**
 * DashboardAllOrders Component
 * Displays a list of orders with sorting, searching, and pagination functionalities.
 *
 * @param {Array} orders - List of orders to display.
 * @param {Function} onViewOrder - Function to handle viewing an order.
 * @param {Function} onEditOrder - Function to handle editing an order.
 */
const DashboardAllOrders = observer(({ orders, onViewOrder, onEditOrder }) => {
    const theme = useTheme();
    const smallerThanSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch orders on component mount
    useEffect(() => {
        orderStore.fetchOrders();
    }, []);

    useEffect(() => {
        orderStore.fetchOrders(searchTerm);
    }, [searchTerm]);

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

    return (
        <Box
            sx={{
                width: "96%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* Top bar with title and search field */}
            <Paper
                elevation={4}
                sx={{
                    display: "flex",
                    justifyContent: smallerThanSmall
                        ? "center"
                        : "space-between",
                    alignItems: "center",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    width: "100%",
                }}
            >
                {!smallerThanSmall && (
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        Todas as Lojas
                    </Typography>
                )}
                <Box
                    sx={{
                        position: "relative",
                        borderRadius: theme.shape.borderRadius,
                        backgroundColor: alpha(
                            theme.palette.common.white,
                            0.15,
                        ),
                        "&:hover": {
                            backgroundColor: alpha(
                                theme.palette.common.white,
                                0.25,
                            ),
                        },
                        display: "flex",
                        // flexGrow: 1, // Ocupa todo o espaço restante
                        width: smallerThanSmall ? "90%" : "250px",
                        borderRadius: "8px",
                    }}
                >
                    <InputBase
                        sx={{
                            color: "inherit", // Herda a cor do tema atual
                            width: "100%",
                            "& .MuiInputBase-input": {
                                padding: theme.spacing(1, 1, 1, 0),
                                paddingRight: `calc(1em + ${theme.spacing(4)})`, // Espaço para o ícone
                                paddingLeft: theme.spacing(2), // Espaçamento inicial
                                transition: theme.transitions.create("width"),
                            },
                        }}
                        placeholder="Pesquisar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        inputProps={{ "aria-label": "search" }}
                    />
                    {/* Ícone de lupa à direita */}
                    <IconButton
                        type="submit"
                        sx={{
                            position: "absolute",
                            right: 0,
                            color: "white",
                        }}
                    >
                        <SearchIcon />
                    </IconButton>
                </Box>
            </Paper>

            {/* Orders table */}
            <TableContainer
                component={Paper}
                sx={{ mt: 3, display: "flex", borderRadius: "8px" }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                onClick={() => handleSort("id")}
                                style={{ cursor: "pointer" }}
                            >
                                Nº{" "}
                                {orderStore.sortField === "id"
                                    ? orderStore.sortOrder === "asc"
                                        ? "↑"
                                        : "↓"
                                    : ""}
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort("created_at")}
                                style={{ cursor: "pointer" }}
                            >
                                Data{" "}
                                {orderStore.sortField === "created_at"
                                    ? orderStore.sortOrder === "asc"
                                        ? "↑"
                                        : "↓"
                                    : ""}
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort("user.first_name")}
                                style={{ cursor: "pointer" }}
                            >
                                Nome{" "}
                                {orderStore.sortField === "user.first_name"
                                    ? orderStore.sortOrder === "asc"
                                        ? "↑"
                                        : "↓"
                                    : ""}
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort("user.email")}
                                style={{ cursor: "pointer" }}
                            >
                                Email{" "}
                                {orderStore.sortField === "user.email"
                                    ? orderStore.sortOrder === "asc"
                                        ? "↑"
                                        : "↓"
                                    : ""}
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort("status.name")}
                                style={{ cursor: "pointer" }}
                            >
                                Estado{" "}
                                {orderStore.sortField === "status.name"
                                    ? orderStore.sortOrder === "asc"
                                        ? "↑"
                                        : "↓"
                                    : ""}
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort("total")}
                                style={{ cursor: "pointer" }}
                            >
                                Total (€){" "}
                                {orderStore.sortField === "total"
                                    ? orderStore.sortOrder === "asc"
                                        ? "↑"
                                        : "↓"
                                    : ""}
                            </TableCell>
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>
                                    {new Date(
                                        order?.created_at,
                                    ).toLocaleDateString("pt-PT", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </TableCell>
                                <TableCell>
                                    {order.user?.first_name +
                                        " " +
                                        order.user?.last_name || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {order.user?.email || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {order.status?.name || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {parseFloat(order.total || 0).toFixed(2)} €
                                </TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => onViewOrder(order)}
                                        >
                                            Ver
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={() => onEditOrder(order)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            disabled={isOrderCancelled(order)}
                                            onClick={() =>
                                                handleCancelOrder(order.id)
                                            }
                                            sx={{
                                                width: "90px",
                                                borderColor: isOrderCancelled(
                                                    order,
                                                )
                                                    ? "grey.400"
                                                    : "red",
                                                color: isOrderCancelled(order)
                                                    ? "grey.600"
                                                    : "red",
                                                cursor: isOrderCancelled(order)
                                                    ? "not-allowed"
                                                    : "pointer",
                                                "&:hover": {
                                                    backgroundColor:
                                                        isOrderCancelled(order)
                                                            ? "transparent"
                                                            : "rgba(255, 0, 0, 0.1)", // Light red background on hover if not disabled
                                                },
                                            }}
                                        >
                                            {isOrderCancelled(order)
                                                ? "Cancelada"
                                                : "Cancelar"}
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
                    color="primary"
                    count={orderStore.totalPages}
                    page={orderStore.currentPage}
                    onChange={(e, value) => orderStore.changePage(value)}
                    sx={{ my: 2 }}
                />
            )}
        </Box>
    );
});

export default DashboardAllOrders;
