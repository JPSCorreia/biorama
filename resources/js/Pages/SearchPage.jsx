import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { usePage, router } from "@inertiajs/react";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { alertStore } from "../Stores/alertStore";

const SearchPage = observer(() =>{
    const {searchResults = {} } = usePage().props;
    const {products = [], stores = [], vendors = []} = searchResults;  // cconst para dividir o resultado da pesquisa em 3 categorias diferentes
    const handleSearchTab = (event, newValue) =>{
        setActiveTab(newValue);
    }; // Metodo para Constrolar as tabs de resultados
    const [activeTab, setActiveTab] = useState(0); // Estate para controlar a aba ativa

    const renderTable = (data, columns) =>(

        <TableContainer component={Paper}>
            <Table>
                {console.log('Teste')}
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column}>{column}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            {Object.values(item).map((value, i) => (
                                <TableCell key={i}>{value}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    useEffect(() => {
        // Reset alert store on navigation
        const handleNavigate = () => {
            alertStore.reset();
        };

        // Add navigation event listener
        if (typeof router?.on === "function") {
            router.on("navigate", handleNavigate);

            return () => {
                // Remove navigation event listener on cleanup
                if (typeof router?.off === "function") {
                    router.off("navigate", handleNavigate);
                }
            };
        }
    }, []);


    return(
        <Container maxWidth="lg">
            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Resultados da Pesquisa
                </Typography>

                {/* Abas para alternar entre Produtos, Lojas e Vendedores */}
                <Tabs
                    value={activeTab}
                    onChange={handleSearchTab}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    sx={{ marginBottom: 3 }}
                >
                    <Tab label="Produtos" />
                    <Tab label="Lojas" />
                    <Tab label="Vendedores" />
                </Tabs>

                {/* Renderização Condicional das Abas */}
                {activeTab === 0 && (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Produtos Encontrados
                        </Typography>
                        {products.length > 0
                            ? renderTable(products, ["Nome"])
                            : "Nenhum produto encontrado."}
                    </Box>
                )}
                {activeTab === 1 && (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Lojas Encontradas
                        </Typography>
                        {stores.length > 0
                            ? renderTable(stores, ["Nome", "Localização"])
                            : "Nenhuma loja encontrada."}
                    </Box>
                )}
                {activeTab === 2 && (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Vendedores Encontrados
                        </Typography>
                        {vendors.length > 0
                            ? renderTable(vendors, ["Nome", "Email", "Contato"])
                            : "Nenhum vendedor encontrado."}
                    </Box>
                )}
            </Box>
        </Container>
    );
});

export default SearchPage;
