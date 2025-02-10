import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Tab,
    Tabs,
    Grid,
} from "@mui/material";
import {router, usePage} from "@inertiajs/react";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { alertStore } from "../Stores";
import StoreCardPesquisa from "../Components/StoreCardPesquisa"; // Importa o componente correto

const SearchPage = observer(() => {
    // Obtém os resultados da pesquisa do Inertia props
    const { searchResults = {} } = usePage().props;

    // Separa os resultados da pesquisa em diferentes categorias
    const { products = [], stores = [] } = searchResults;

    // Estado para controlar a aba ativa
    const [activeTab, setActiveTab] = useState(0);

    // Função para alternar entre as abas
    const handleSearchTab = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Efeito para resetar alertas ao navegar na página
    useEffect(() => {
        const handleNavigate = () => {
            alertStore.reset();
        };

        if (typeof router?.on === "function") {
            router.on("navigate", handleNavigate);

            return () => {
                if (typeof router?.off === "function") {
                    router.off("navigate", handleNavigate);
                }
            };
        }
    }, []);

    return (
        <Container maxWidth="lg">
            <Box sx={{ marginTop: 4 }}>
                {/* Título da página */}
                <Typography variant="h4" gutterBottom>
                    Resultados da Pesquisa
                </Typography>

                {/* Abas para alternar entre produtos e lojas */}
                <Tabs
                    value={activeTab}
                    onChange={handleSearchTab}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    sx={{ marginBottom: 3 }}
                >
                    <Tab label="Lojas" />
                </Tabs>

                {/* Exibir lojas encontradas */}
                {activeTab === 0 && (
                    <Box>
                        {stores.length > 0 ? (
                            <Grid container spacing={3} sx={{mb:4}}>
                                {stores.map((store) => (
                                    <Grid item key={store.id} xs={12} sm={6} md={4}>
                                        <StoreCardPesquisa store={store} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography>Nenhuma loja encontrada.</Typography>
                        )}
                    </Box>
                )}
            </Box>
        </Container>
    );
});

export default SearchPage;
