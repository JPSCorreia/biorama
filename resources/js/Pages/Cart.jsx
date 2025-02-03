import { observer } from "mobx-react";
import { cartStore } from "../Stores";
import {
    Delete as DeleteIcon,
    AddShoppingCartSharp as AddShoppingCartSharpIcon,
    ShoppingCartSharp,
} from "@mui/icons-material";
import { CartList } from "../Components";
import { Box, Button, Typography, IconButton, Tooltip } from "@mui/material";

const Cart = observer(() => {
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
                        ({cartStore.totalQuantity} artigos)
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
                        border: "1px solid blue",
                    }}
                >
                    {/* List of items in the cart */}
                    <CartList />
                    <Box
                        sx={{
                            mt: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            border: "1px solid #ccc",
                            width: "40%",
                            p: 3,
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
                            <Typography variant="h5">
                                Subtotal: €{cartStore.totalPrice}
                            </Typography>
                            <Box>
                                {/* Button to clear the cart */}
                                <Tooltip title="Limpar carrinho">
                                    <IconButton
                                        variant="outlined"
                                        sx={{ mr: 2 }}
                                        color="delete"
                                        onClick={cartStore.clearCart}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                                {/* Button to go to the checkout page */}
                                <Button
                                    variant="outlined"
                                    startIcon={<ShoppingCartSharp />}
                                >
                                    Comprar
                                </Button>
                            </Box>
                        </Box>
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
