import { observer } from "mobx-react";
import { cartStore } from "../Stores";
import {
    Delete as DeleteIcon,
    AddShoppingCartSharp as AddShoppingCartSharpIcon,
    ShoppingCartSharp,
} from "@mui/icons-material";
import { CartList } from "../Components";
import { Box, Button, Typography } from "@mui/material";

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
            <Typography variant="h3" gutterBottom>
                Carrinho de Compras
            </Typography>

            {/* Conditional rendering if there are any items in the cart or not*/}
            {cartStore.totalQuantity ? (
                // Container for the list of items in the cart
                <Box
                    sx={{
                        mt: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                    }}
                >
                    {/* List of items in the cart */}
                    <CartList />
                    <Box sx={{ mt: 3, display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%"  }}>
                        <Typography variant="h5">
                            Subtotal: €{cartStore.totalPrice}
                        </Typography>
                        <Box>
                            {/* Button to clear the cart */}
                            <Button
                                variant="outlined"
                                sx={{ mr: 2 }}
                                color="delete"
                                onClick={cartStore.clearCart}
                                startIcon={<DeleteIcon />}
                            >
                                Limpar Carrinho
                            </Button>
                            {/* Button to go to the checkout page */}
                            <Button
                                variant="contained"
                                startIcon={<ShoppingCartSharp />}
                            >
                                Comprar
                            </Button>
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
