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
import { cartStore } from "../../Stores";
import { router } from "@inertiajs/react";

const ReviewConfirmationList = observer(() => {
    const theme = useTheme();
    const smallerThanSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const smallerThanLarge = useMediaQuery(theme.breakpoints.down("lg"));


    return (
< Box
    sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: smallerThanSmall ? "100%" : "100%",
        maxHeight: "425px",
        minHeight: "425px",
        height: "100%",
        pt: 2,
        bgcolor: "background.paper",
    }}
>
    {/* Adicionar scroll apenas à lista de lojas */}
    < Box
        sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            maxHeight: "350px",
            paddingRight: "10px", // Evita que o scroll corte o conteúdo
        }}
    >
        {Object.keys(cartStore.storeTotals).map(
            (storeId, index, arr) => {
                const subtotal = Number(cartStore.storeTotals[storeId] || 0);
                const shipping = Number(cartStore.shippingCosts[storeId] || 0);
                const total = subtotal + shipping;

                return (
                    < Box key={storeId} sx={{ mb: 2 }}>
                        <Typography
                            variant="subtitle1"
                            color="terciary"
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            {cartStore.cart[storeId]?.[0]?.store?.name || `Loja ${storeId}`}
                        </Typography>
                        < Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                            <Typography variant="body2">Produtos:</Typography>
                            <Typography variant="body2">€{subtotal.toFixed(2)}</Typography>
                        </ Box>
                        < Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2">Custos de envio:</Typography>
                            <Typography variant="body2">€{shipping.toFixed(2)}</Typography>
                        </ Box>
                        < Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                            <Typography variant="body2">Total:</Typography>
                            <Typography variant="body2" sx={{ color: "terciary" }}>
                                €{total.toFixed(2)}
                            </Typography>
                        </ Box>
                        {index !== arr.length - 1 && <Divider sx={{ my: 3 }} />}
                    </ Box>
                );
            }
        )}
    <Divider sx={{ width: "100%", mt: 1, mb: 2 }} />

    </ Box>


    < Box
        sx={{
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: smallerThanSmall ? "column" : "row",
            alignItems: "center",
            width: "100%",
        }}
    >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Total:{" "}
            <Typography component="span" variant="h5" color="terciary" sx={{ fontWeight: "bold" }}>
                €{cartStore.grandTotal}
            </Typography>
        </Typography>
    </ Box>
</ Box>

    );
});

export default ReviewConfirmationList;
