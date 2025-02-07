import { Box, Typography, Divider } from "@mui/material";
import { cartStore } from "../../Stores";

const ReviewStep = ({ selectedAddress, selectedPayment }) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">Morada de Envio</Typography>
            <Typography>{selectedAddress || "Nenhuma morada selecionada"}</Typography>
            <Divider />

            <Typography variant="h6">Método de Pagamento</Typography>
            <Typography>{selectedPayment || "Nenhum método selecionado"}</Typography>
            <Divider />

            <Typography variant="h6">Resumo da Compra</Typography>
            <Typography>Subtotal: €{cartStore.totalPrice}</Typography>
            <Typography>Custo de Envio: €{Object.values(cartStore.shippingCosts).reduce((a, b) => a + b, 0).toFixed(2)}</Typography>
            <Typography fontWeight="bold">Total: €{cartStore.grandTotal}</Typography>
        </Box>
    );
};

export default ReviewStep;
