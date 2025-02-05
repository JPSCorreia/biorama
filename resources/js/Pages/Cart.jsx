import { observer } from "mobx-react";
import { cartStore } from "../Stores";
import { AlertBox, CartList, CartSidebar } from "../Components";
import {
    Box,
    Button,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { homeAddressStore } from "../Stores";


const Cart = observer(() => {

    const theme = useTheme();
    const smallerThanLarge = useMediaQuery(theme.breakpoints.down("lg"));

    useEffect(() => {
        homeAddressStore.fetchAddresses();
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                marginTop: "15px !important",
                marginBottom: "5%",
            }}
        >
            <AlertBox />
            {/* Title for the cart page */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                    variant={smallerThanLarge? "h7" : "h4"}
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
                        flexDirection: smallerThanLarge ? "column" : "row",
                        width: "100%",
                    }}
                >
                    {/* List of items in the cart */}
                    <CartList />

                    {/* Cart sidebar */}
                    <CartSidebar />
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
