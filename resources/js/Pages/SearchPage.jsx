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
import { alertStore } from "../Stores";

const SearchPage = observer(() => {
    // Get search results from Inertia page props
    const { searchResults = {} } = usePage().props;

    // Split search results into different categories
    const { products = [], stores = [], vendors = [] } = searchResults;

    // State to control the active tab
    const [activeTab, setActiveTab] = useState(0); // Estate para controlar a aba ativa

    // Function to handle tab changes
    const handleSearchTab = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Function to render a table with given data and column headers
    const renderTable = (data, columns) => (
        <TableContainer component={Paper}>
            <Table>
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

    // Effect to reset alert store on page navigation
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

    return (
        <Container maxWidth="lg">
            <Box sx={{ marginTop: 4 }}>
                {/* Page Title */}
                <Typography variant="h4" gutterBottom>
                    Resultados da Pesquisa
                </Typography>

                {/* Tabs to switch between products, stores, and vendors */}
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

                {/* Conditional rendering based on selected tab */}
                {activeTab === 0 && (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Produtos Encontrados
                        </Typography>
                        {products.length > 0
                            ? renderTable(products, ["Nome"]) // Render products table
                            : "Nenhum produto encontrado."}
                    </Box>
                )}
                {activeTab === 1 && (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Lojas Encontradas
                        </Typography>
                        {stores.length > 0
                            ? renderTable(stores, ["Nome", "Localização"]) // Render stores table
                            : "Nenhuma loja encontrada."}
                    </Box>
                )}
                {activeTab === 2 && (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Vendedores Encontrados
                        </Typography>
                        {vendors.length > 0
                            ? renderTable(vendors, ["Nome", "Email", "Contato"]) // Render vendors table
                            : "Nenhum vendedor encontrado."}
                    </Box>
                )}
            </Box>
        </Container>
    );
});

export default SearchPage;
