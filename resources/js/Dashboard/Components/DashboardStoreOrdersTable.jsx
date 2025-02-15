import React, { useEffect, useState } from "react";
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
    Pagination,
    InputBase,
    useTheme,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { orderStore } from "@/Stores/orderStore.js";
import SearchIcon from "@mui/icons-material/Search";
import { alpha } from "@mui/material/styles";

const DashboardStoreOrdersTable = observer(
    ({ storeName, storeId, onViewOrder, onEditOrder }) => {
        const [searchTerm, setSearchTerm] = useState("");
        const [sortField, setSortField] = useState("id");
        const [sortOrder, setSortOrder] = useState("asc");
        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 10;

        const theme = useTheme();
        const smallerThanSmall = useMediaQuery(theme.breakpoints.down("sm"));

        useEffect(() => {
            orderStore.fetchOrdersByStore(
                storeId,
                searchTerm,
                currentPage,
                itemsPerPage,
            );
        }, [storeId, searchTerm, currentPage, itemsPerPage]);

        const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);
        };

        const handleSort = (field) => {
            orderStore.sortOrders(field);
        };

        const handleCancelOrder = (orderId) => {
            orderStore.cancelOrder(orderId).then(() => {
                orderStore.fetchOrdersByStore(
                    storeId,
                    searchTerm,
                    currentPage,
                    itemsPerPage,
                );
            });
        };

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
                            {storeName}
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
                                    transition:
                                        theme.transitions.create("width"),
                                },
                            }}
                            placeholder="Pesquisar..."
                            value={searchTerm}
                            onChange={handleSearchChange}
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

                {orderStore.orders.length === 0 ? (
                    <Typography
                        variant="h6"
                        sx={{ textAlign: "center", color: "grey.600" }}
                    >
                        Sem Encomendas
                    </Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 3, display: "flex", borderRadius: "8px" }}>
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
                                        onClick={() =>
                                            handleSort("user.first_name")
                                        }
                                        style={{ cursor: "pointer" }}
                                    >
                                        Nome{" "}
                                        {orderStore.sortField ===
                                        "user.first_name"
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
                                        onClick={() =>
                                            handleSort("status.name")
                                        }
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
                                {orderStore.orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>
                                            {new Date(
                                                order.created_at,
                                            ).toLocaleDateString("pt-PT", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell>{`${order.user?.first_name || ""} ${order.user?.last_name || ""}`}</TableCell>
                                        <TableCell>
                                            {order.user?.email || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {order.status?.name || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {parseFloat(
                                                order.total || 0,
                                            ).toFixed(2)}{" "}
                                            €
                                        </TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                                            >
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() =>
                                                        onViewOrder(order)
                                                    }
                                                >
                                                    Ver
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() =>
                                                        onEditOrder(order)
                                                    }
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    disabled={isOrderCancelled(
                                                        order,
                                                    )}
                                                    onClick={() =>
                                                        handleCancelOrder(
                                                            order.id,
                                                        )
                                                    }
                                                    sx={{
                                                        width: "90px",
                                                        borderColor:
                                                            isOrderCancelled(
                                                                order,
                                                            )
                                                                ? "grey.400"
                                                                : "red",
                                                        color: isOrderCancelled(
                                                            order,
                                                        )
                                                            ? "grey.600"
                                                            : "red",
                                                        cursor: isOrderCancelled(
                                                            order,
                                                        )
                                                            ? "not-allowed"
                                                            : "pointer",
                                                        "&:hover": {
                                                            backgroundColor:
                                                                isOrderCancelled(
                                                                    order,
                                                                )
                                                                    ? "transparent"
                                                                    : "rgba(255, 0, 0, 0.1)",
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
                )}

                {/* Paginação */}
                {orderStore.totalPages > 1 && (
                    <Pagination
                        count={orderStore.totalPages}
                        page={currentPage}
                        onChange={(e, value) => setCurrentPage(value)}
                        sx={{
                            my: 2
                        }}
                    />
                )}
            </Box>
        );
    },
);

export default DashboardStoreOrdersTable;
