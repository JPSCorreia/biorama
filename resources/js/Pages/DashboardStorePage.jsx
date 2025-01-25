import {observer} from "mobx-react";
import {usePage} from "@inertiajs/react";
import {Box, Paper, Typography, useMediaQuery, useTheme} from "@mui/material";
import DashboardStoresCard from "@/Components/DashboardStoresCard";
import {shopStore} from "@/Stores/index.js";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const DashboardStorePage = observer(() => {
    const {stores} = usePage().props; // Carrega as lojas do backend
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    // Verifica se há menos de 3 lojas e adiciona espaços vazios para completar
    const displayedStores = [...shopStore.stores];
    while (displayedStores.length < 3) {
        displayedStores.push(null); // Adiciona um espaço vazio
    }

    return (
        <Paper
            elevation={4}
            sx={{
                p: 2,
                width: isSmallScreen ? "100%" : "80%",
                m: "auto",
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                height: "100%",
                borderRadius: "10px",
            }}
        >

            {/* Faz o loop para renderizar as Cards */}
            {stores.map((store) => (
                <DashboardStoresCard key={store.id} store={store} />
            ))}
            {stores.length < 3 && (
                <Box
                    onClick={() => console.log("Abrir modal para adicionar loja")}
                    sx={{
                        maxWidth: 300, // Igual ao card
                        width: "100%", // Ajusta ao espaço disponível
                        borderRadius: "16px", // Cantos arredondados iguais ao card
                        overflow: "hidden", // Mesma propriedade para garantir consistência
                        boxShadow: 3, // Sombra igual ao card
                        margin: "auto", // Centraliza horizontalmente
                        mt: 5, // Mesma margem superior do card
                        minHeight: 500, // Altura mínima garantida igual ao card
                        display: "flex", // Exibe o conteúdo em um layout flexível
                        flexDirection: "column", // Alinha conteúdo em coluna
                        alignItems: "center", // Centraliza o conteúdo horizontalmente
                        justifyContent: "center", // Centraliza o conteúdo verticalmente
                        backgroundColor: "#f5f5f5", // Fundo cinza claro
                        border: "2px dashed #9e9e9e", // Borda estilizada
                        cursor: "pointer", // Indica que é clicável
                        transition: "all 0.3s ease", // Suaviza as animações
                        "&:hover": {
                            backgroundColor: "#e0e0e0", // Fundo mais escuro no hover
                            transform: "scale(1.05)", // Leve aumento no hover
                        },
                    }}
                >
                    <AddCircleIcon
                        sx={{
                            fontSize: 40, // Tamanho do ícone
                            color: "#757575", // Cor do ícone
                        }}
                    />
                    <Typography
                        sx={{
                            mt: 2, // Margem superior para separar do ícone
                            fontWeight: "bold", // Negrito no texto
                            color: "#757575", // Cor do texto
                            textAlign: "center", // Centraliza o texto
                        }}
                    >
                        Adicionar Loja
                    </Typography>
                </Box>
            )}


        </Paper>
    );
});

export default DashboardStorePage;
