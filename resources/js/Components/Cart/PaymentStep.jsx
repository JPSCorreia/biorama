import { Box, Button, Radio, Typography } from "@mui/material";

const PaymentStep = ({ selectedPayment, setSelectedPayment }) => {
    const paymentMethods = ["Cartão de Crédito", "MB WAY", "PayPal"];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {paymentMethods.map((method, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                    <Radio checked={selectedPayment === method} onChange={() => setSelectedPayment(method)} />
                    <Typography>{method}</Typography>
                </Box>
            ))}
        </Box>
    );
};

export default PaymentStep;
