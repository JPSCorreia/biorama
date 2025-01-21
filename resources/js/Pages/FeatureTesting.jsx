import { observer } from "mobx-react";
import { Box, Typography, Button, Paper } from "@mui/material";
import axios from "axios";
import backgroundImage from "../../images/background.jpg";

const FeatureTesting = observer(() => {
    const sendInvoice = async (order) => {
        try {
            // Call the API
            const response = await axios.post("/send-invoice", {
                order,
                user: { email: "jpscorreia.dev@gmail.com" }, // Email de teste
            });

            // Feedback
            alert(response.data.message);
        } catch (error) {
            console.error("Erro ao enviar a fatura:", error);

            if (error.response) {
                alert(
                    `Erro: ${error.response.data.message || "Ocorreu um erro inesperado."}`,
                );
            } else {
                alert(
                    "Erro ao enviar a fatura. Verifica a tua conexão ou tenta novamente.",
                );
            }
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                marginTop: "88px !important",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Typography variant="h3" gutterBottom>
                Feature Testing
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ width: "250px" }}
                onClick={() =>
                    sendInvoice({ name: "Teste Cliente", total: 123.45 })
                }
            >
                Send Invoice
            </Button>
            <Box
    sx={{
        display: "flex",
        mt: 2,
        backgroundColor: "white",
        width: "100%",
        height: "500px",
        justifyContent: "center",
        alignItems: "center",
        border: "2px solid red",
        backgroundImage: `url(${backgroundImage})`,
        position: "relative",  // Ensures absolute positioning inside the container
    }}
>
    <Paper
        sx={{
            width: "90%",
            height: "90%",
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            position: "absolute",
            bottom: "-45%",  // Moves the Paper half outside the Box
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: 8,  // Elevation effect
        }}
        elevation={8}
    >
        <Typography variant="h4">Feature Testing</Typography>
    </Paper>
</Box>

        </Box>
    );
});

export default FeatureTesting;
