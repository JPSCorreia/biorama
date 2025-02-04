import { observer } from "mobx-react";
import { cartStore } from "../Stores";
import { useState } from "react";
import {
    Delete as DeleteIcon,
    AddShoppingCartSharp as AddShoppingCartSharpIcon,
    ShoppingCartSharp,
} from "@mui/icons-material";
import { CartList, CartPaymentIcons } from "../Components";
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
} from "@mui/material";

const Cart = observer(() => {
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
                        sx={{ mr: 2 }}
                        color="delete"
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
                height: "100%",
                width: "100%",
                marginTop: "88px !important",
                marginBottom: "5%",
            }}
        >
            {/* Title for the cart page */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                >
                    Carrinho de compras
                </Typography>
                {cartStore.totalQuantity ? (
                    <Typography variant="h7" gutterBottom sx={{ ml: 1 }}>
                        ({cartStore.totalQuantity}{" "}
                        {cartStore.totalQuantity === 1 ? "artigo" : "artigos"})
                    </Typography>
                ) : (
                    ""
                )}
            </Box>

            {/* Conditional rendering if there are any items in the cart or not*/}
            {cartStore.totalQuantity ? (
                <Box
                    sx={{
                        mt: 1,
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                    }}
                >
                    {/* List of items in the cart */}
                    <CartList />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            border: "1px solid #ccc",
                            borderRadius: 4,
                            width: "400px",
                            // minHeight: "400px",
                            height: "100%",
                            ml: 1,
                            p: 3,
                            mt: 7,
                        }}
                    >

                        <Box
                            sx={{
                                mt: 3,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <Typography variant="h6">
                                Total: €{cartStore.totalPrice}
                            </Typography>
                            <Box>
                                {/* Button to clear the cart */}
                                <ClearCartButton />
                                {/* Button to go to the checkout page */}
                                <Button
                                    variant="outlined"
                                    color="terciary"
                                    startIcon={<ShoppingCartSharp />}
                                >
                                    Comprar
                                </Button>
                            </Box>
                        </Box>
                        <CartPaymentIcons />
                    </Box>
                </Box>
            ) : (
                // Message if the cart is empty
                <Box
                    sx={{
                        mt: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        O teu carrinho de compras está vazio
                    </Typography>
                </Box>
            )}
        </Box>
    );
});

export default Cart;
