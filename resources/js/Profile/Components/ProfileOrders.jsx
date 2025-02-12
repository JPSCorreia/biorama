import {
    Paper,
    Typography,
    Box,
    useMediaQuery,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Pagination,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";

const ProfileOrders = () => {
    const theme = useTheme();
    const smallerThanLg = useMediaQuery(theme.breakpoints.down("lg"));
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [page, setPage] = useState(1);
    const itemsPerPage = 3; // Número de encomendas por página

    useEffect(() => {
        axios
            .get("/encomendas-user")
            .then((response) => {
                setOrders(response.data);
                setTimeout(() => {
                    setLoading(false);
                }, 250);
            })
            .catch((error) => {
                console.error("Erro ao buscar encomendas", error);
                setLoading(false);
            });
    }, []);

    const toggleExpand = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    // Cálculo da paginação
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const paginatedOrders = orders.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage,
    );

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
                ml: smallerThanLg ? 0 : 4,
                maxWidth: smallerThanLg ? "100%" : "75%",
                flexGrow: 1,
            }}
        >
            <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 2, width: "100%" }}
            >
                Encomendas
            </Typography>
            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "500px",
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <Paper
                    elevation={4}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        justifyContent: "start",
                        p: 3,
                        borderRadius: "8px",
                    }}
                >
                    <Box>
                        {paginatedOrders.length > 0 ? (
                            paginatedOrders.map((order) => (
                                <Box
                                    key={order.id}
                                    sx={{
                                        marginBottom: 3,
                                        border: "2px solid #e0e0e0",
                                        padding: 2,
                                        borderRadius: "8px",
                                    }}
                                >
                                    {/* Informações da Encomenda */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <Typography variant="h6">
                                                Encomenda #{order.id}
                                            </Typography>
                                            <Typography>
                                                Data:{" "}
                                                {order.created_at
                                                    ? new Date(
                                                          order.created_at,
                                                      ).toLocaleDateString()
                                                    : "Data não disponível"}
                                            </Typography>
                                            <Typography>
                                                Status: {order.status.name}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{ marginTop: 1 }}
                                                onClick={() =>
                                                    toggleExpand(order.id)
                                                }
                                            >
                                                {expandedOrders[order.id]
                                                    ? "Ver menos"
                                                    : "Mostrar mais"}
                                            </Button>
                                        </Box>
                                    </Box>

                                    {/* Se a encomenda estiver expandida, mostrar os detalhes */}
                                    {expandedOrders[order.id] && (
                                        <Box
                                            sx={{
                                                marginTop: 2,
                                                borderRadius: "8px",
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ fontWeight: "bold" }}
                                            >
                                                Detalhes:
                                            </Typography>
                                            <Typography>
                                                Morada: {order.street_name},{" "}
                                                {order.city},{" "}
                                                {order.postal_code}
                                            </Typography>
                                            <Typography>
                                                Telefone: {order.phone_number}
                                            </Typography>
                                            <Typography>
                                                Total: {order.total}€
                                            </Typography>

                                            {/* 🛒 Tabela de Produtos */}
                                            {order.order_store_products.length >
                                            0 ? (
                                                <TableContainer
                                                    component={Box}
                                                    sx={{ marginTop: 1 }}
                                                >
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <b>
                                                                        Produto
                                                                    </b>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <b>
                                                                        Quantidade
                                                                    </b>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <b>
                                                                        Preço
                                                                        Unitário
                                                                        (€)
                                                                    </b>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <b>
                                                                        Preço
                                                                        Total
                                                                        (€)
                                                                    </b>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {order.order_store_products.map(
                                                                (
                                                                    orderProduct,
                                                                ) => {
                                                                    // Encontrar o produto correspondente na lista de produtos
                                                                    const product =
                                                                        order.products.find(
                                                                            (
                                                                                p,
                                                                            ) =>
                                                                                p.id ===
                                                                                orderProduct.product_id,
                                                                        );

                                                                    return (
                                                                        <TableRow
                                                                            key={
                                                                                orderProduct.id
                                                                            }
                                                                        >
                                                                            <TableCell>
                                                                                {product
                                                                                    ? product.name
                                                                                    : "Produto não encontrado"}
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                {
                                                                                    orderProduct.quantity
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                {parseFloat(
                                                                                    orderProduct.price,
                                                                                ).toFixed(
                                                                                    2,
                                                                                )}

                                                                                €
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                {parseFloat(
                                                                                    orderProduct.final_price,
                                                                                ).toFixed(
                                                                                    2,
                                                                                )}

                                                                                €
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                },
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            ) : (
                                                <Typography
                                                    sx={{ marginTop: 1 }}
                                                >
                                                    Nenhum produto encontrado.
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Typography>
                                Não há encomendas disponíveis.
                            </Typography>
                        )}
                    </Box>

                    {/* 🔹 Paginação 🔹 */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 3,
                        }}
                    >
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            shape="rounded"
                        />
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default ProfileOrders;
