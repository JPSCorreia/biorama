import { useEffect } from "react";
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
    Select,
    MenuItem,
    Alert,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { orderStore } from "@/Stores/index.js";

const DashboardOrderEditModal = observer(({ order, isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            orderStore.fetchStatuses(); // Garantir que os status estão carregados
            orderStore.resetMessages(); // Limpar mensagens ao abrir o modal
        }
    }, [isOpen]);

    if (!order) return null;

    const statusValue = orderStore.statuses.some(status => status.id === order.statuses_id) 
        ? order.statuses_id 
        : '';

    const handleSubmit = async () => {
        const orderData = {
            statuses_id: order.statuses_id,
        };
        await orderStore.saveOrderChanges(order.id, orderData);
    };

    // Calcular o desconto por produto
    const calculateDiscountValue = (price, discount) => {
        return (price * (discount / 100)).toFixed(2);
    };

    const calculateFinalPrice = (price, discount, quantity) => {
        const discountValue = price * (discount / 100);
        return ((price - discountValue) * quantity).toFixed(2);
    };
    // Calcular o preço final por produto considerando o desconto
    const calculateTotal = () => {
        return order.products
            .reduce((total, product) => {
                const finalPrice = calculateFinalPrice(
                    product.pivot.price,
                    product.pivot.discount,
                    product.pivot.quantity,
                );
                return total + parseFloat(finalPrice);
            }, 0)
            .toFixed(2);
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    width: "100vw", // Padrão para ocupar toda a largura
                    height: "100vh", // Padrão para ocupar toda a altura
                    overflowY: "auto", // Adiciona rolagem se necessário

                    "@media (min-width: 900px)": {
                        width: "900px", // Largura fixa em ecrãs grandes
                        height: "auto", // Ajusta altura ao conteúdo em ecrãs grandes
                    },
                }}
            >
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Editar Encomenda #{order.id}
                </Typography>

                {/* Mensagens de erro e sucesso */}
                {orderStore.errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {orderStore.errorMessage}
                    </Alert>
                )}
                {orderStore.successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {orderStore.successMessage}
                    </Alert>
                )}

                {/* Alterar o estado */}
                <Select
                    fullWidth
                    value={statusValue}
                    onChange={(e) =>
                        orderStore.updateOrderStatus(order.id, e.target.value)
                    }
                    sx={{ mb: 3 }}
                >
                    {orderStore.statuses.map((status) => (
                        <MenuItem key={status.id} value={status.id}>
                            {status.name}
                        </MenuItem>
                    ))}
                </Select>

                {/* Tabela de produtos */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Produto</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Preço Unitário (€)</TableCell>
                                <TableCell>Desconto (%)</TableCell>
                                <TableCell>Valor Desconto (€)</TableCell>
                                <TableCell>Preço Final (€)</TableCell>
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
                                        {product.pivot.discount || 0} %
                                    </TableCell>
                                    <TableCell>
                                        {calculateDiscountValue(
                                            product.pivot.price,
                                            product.pivot.discount,
                                        )}{" "}
                                        €
                                    </TableCell>
                                    <TableCell>
                                        {calculateFinalPrice(
                                            product.pivot.price,
                                            product.pivot.discount,
                                            product.pivot.quantity,
                                        )}{" "}
                                        €
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h6" sx={{ mt: 3 }}>
                    Total {calculateTotal()} €
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 3,
                    }}
                >
                    <Button variant="outlined" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Guardar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
});

export default DashboardOrderEditModal;
