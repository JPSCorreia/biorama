import React from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    useTheme,
    useMediaQuery,
} from "@mui/material";

const DashboardShowOrderModal = ({ order, isOpen, onClose }) => {

    const theme = useTheme();
    const smallerThanSmall = useMediaQuery(theme.breakpoints.down("sm"));

    if (!order) return null;

    const calculateDiscount = (price, discount) => {
        return (price * (discount / 100)).toFixed(2);
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflowY: "auto",
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    p: 4,
                    borderRadius: 2,
                    width: smallerThanSmall ? "100%" : "60%",
                    overflowY: "auto",
                }}
            >
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Detalhes da Encomenda #{order.id}
                </Typography>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Informações do Cliente:
                    </Typography>
                    <Typography variant="body2">
                        Nome: {order.user?.first_name} {order.user?.last_name}
                    </Typography>
                </Box>
                {/* Informações de Contacto */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Contactos:
                    </Typography>
                    <Typography variant="body2">
                        Email: {order.user?.email}
                    </Typography>
                    <Typography variant="body2">
                        Telefone: {order.phone_number}
                    </Typography>
                </Box>

                {/* Morada */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Morada:
                    </Typography>
                    <Typography variant="body2">
                        {order.street_name}, {order.city}, {order.postal_code}
                    </Typography>
                </Box>

                {/* Tabela de produtos */}
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Produto</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Preço Unitário (€)</TableCell>
                                <TableCell>Desconto (%)</TableCell>
                                <TableCell>Valor Desconto (€)</TableCell>
                                <TableCell>Total (€)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>
                                        {product.pivot.quantity}
                                    </TableCell>
                                    <TableCell>
                                        {parseFloat(
                                            product.pivot.price,
                                        ).toFixed(2)}{" "}
                                        €
                                    </TableCell>
                                    <TableCell>
                                        {product.pivot.discount} %
                                    </TableCell>
                                    <TableCell>
                                        {calculateDiscount(
                                            product.pivot.price,
                                            product.pivot.discount,
                                        )}{" "}
                                        €
                                    </TableCell>
                                    <TableCell>
                                        {(
                                            product.pivot.quantity *
                                            (product.pivot.price -
                                                calculateDiscount(
                                                    product.pivot.price,
                                                    product.pivot.discount,
                                                ))
                                        ).toFixed(2)}{" "}
                                        €
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Total da encomenda */}
                <Typography variant="h6" sx={{ mt: 3, fontWeight: "bold", alignSelf: "flex-end" }}>
                    Total da Encomenda: {parseFloat(order.total).toFixed(2)} €
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignSelf: "flex-end",
                        mb: 2,
                    }}
                >
                    <Typography>
                        Estado: {order.status?.name || "Desconhecido"}
                    </Typography>
                </Box>
                <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
                >
                    <Button variant="contained" onClick={onClose}>
                        Fechar
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default DashboardShowOrderModal;
