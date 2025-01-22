import { observer } from "mobx-react";
import { Box, Typography, Button, Paper } from "@mui/material";
import axios from "axios";
import backgroundImage from "../../images/background.jpg";

// Component for feature testing in development
const FeatureTesting = observer(() => {
    // Function to send an invoice via API request
    const sendInvoice = async (order) => {
        try {
            // Make a POST request to the server with order and user details
            const response = await axios.post("/send-invoice", {
                order,
                user: { email: "jpscorreia.dev@gmail.com" }, // Test email
            });

            // Provide feedback to the user
            alert(response.data.message);
        } catch (error) {
            console.error("Erro ao enviar a fatura:", error);
            // Handle API error responses and network issues
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

            {/* Button to trigger the sendInvoice function with test data */}
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

            {/* Container with a background image and bordered styling */}
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
                    position: "relative",
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
                        bottom: "-45%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        boxShadow: 8,
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
