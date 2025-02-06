import {
    Box,
    Button,
    Typography,
    IconButton,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useTheme,
    useMediaQuery,
    Divider,
} from "@mui/material";
import { Delete as DeleteIcon, ShoppingCartSharp } from "@mui/icons-material";
import { observer } from "mobx-react";
import { useState } from "react";
import { cartStore, shopStore } from "../../Stores";
import { CartPaymentIcons } from "../../Components";

const CartSidebar = observer(() => {
    const theme = useTheme();
    const smallerThanSmall = useMediaQuery(theme.breakpoints.down("sm"));

    function ClearCartButton() {
        const [open, setOpen] = useState(false);

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
        };

        const handleConfirm = () => {
            cartStore.clearCart();
            setOpen(false);
        };

        return (
            <>
                <Tooltip title="Limpar carrinho">
                    <IconButton
                        variant="outlined"
                        color="error"
                        onClick={handleClickOpen}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Limpar carrinho
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Tem a certeza de que deseja remover todos os
                            produtos do seu carrinho de compras?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleConfirm} color="error" autoFocus>
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: 4,
                minWidth: smallerThanSmall ? "100%" : "500px",
                minHeight: "402px",
                height: "100%",
                ml: smallerThanSmall ? 0 : 4,
                p: 3,
                pt: 2,
                mt: 7,
                bgcolor: "background.paper",
                boxShadow: 3,
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Detalhes do Pedido
            </Typography>
            <Divider sx={{ width: "100%", mb: 2 }} />
            <Box sx={{ width: "100%" }}>
                {Object.keys(cartStore.storeTotals).map(
                    (storeId, index, arr) => {
                        const subtotal = Number(
                            cartStore.storeTotals[storeId] || 0,
                        );
                        const shipping = Number(
                            cartStore.shippingCosts[storeId] || 0,
                        );
                        const total = subtotal + shipping;

                        return (
                            <Box key={storeId} sx={{ mb: 2 }}>
                                <Typography
                                    variant="subtitle1"
                                    color="terciary"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "terciary",
                                    }}
                                >
                                    {cartStore.cart[storeId]?.[0]?.store
                                        ?.name || `Loja ${storeId}`}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mt: 1,
                                    }}
                                >
                                    <Typography variant="body2">
                                        Produtos:
                                    </Typography>
                                    <Typography variant="body2">
                                        €{subtotal.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography variant="body2">
                                        Custos de envio:
                                    </Typography>
                                    <Typography variant="body2">
                                        €{shipping.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <Typography variant="body2">
                                        Total:
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "terciary" }}
                                    >
                                        €{total.toFixed(2)}
                                    </Typography>
                                </Box>
                                {index !== arr.length - 1 && (
                                    <Divider sx={{ my: 2 }} />
                                )}
                            </Box>
                        );
                    },
                )}
            </Box>

            <Divider sx={{ width: "100%", mb: 2 }} />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: smallerThanSmall ? "column" : "row",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Total:{" "}
                    <Typography
                        component="span"
                        variant="h5"
                        color="terciary"
                        sx={{ fontWeight: "bold" }}
                    >
                        €{cartStore.grandTotal}
                    </Typography>
                </Typography>
                <Box sx={{ mt: smallerThanSmall ? 1 : 0 }}>
                    <ClearCartButton />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCartSharp />}
                        sx={{ ml: 2 }}
                    >
                        Comprar
                    </Button>
                </Box>
            </Box>
            <Divider sx={{ width: "100%", my: 2 }} />

            <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                Métodos de pagamento disponíveis no próximo passo
            </Typography>
            <CartPaymentIcons />
        </Box>
    );
});

export default CartSidebar;
