import { observer } from "mobx-react";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";

const FeatureTesting = observer(() => {
    const sendInvoice = async (order) => {
        try {
            // Call the API
            const response = await axios.post('/send-invoice', {
                order,
                user: { email: 'jpscorreia.dev@gmail.com' }, // Email de teste
            });

            // Feedback
            alert(response.data.message);
        } catch (error) {
            console.error('Erro ao enviar a fatura:', error);

            if (error.response) {
                alert(`Erro: ${error.response.data.message || 'Ocorreu um erro inesperado.'}`);
            } else {
                alert('Erro ao enviar a fatura. Verifica a tua conexão ou tenta novamente.');
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
                alignItems: "center"
            }}
        >
            <Typography variant="h3" gutterBottom>
                Feature Testing
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ width: "250px"}}
                onClick={() => sendInvoice({ name: "Teste Cliente", total: 123.45 })}
            >
                Send Invoice
            </Button>
        </Box>
    );
});

export default FeatureTesting;
