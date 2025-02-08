import React, { useState, useMemo } from "react";
import { Typography, Box, Pagination } from "@mui/material";
import { StoreProductCard } from "../";

const StoreProductsContainer = ({ products, vendor, store }) => {
    // 'products' agora é um array simples com todos os produtos
    const [page, setPage] = useState(1);
    const itemsPerPage = 10; // Quantos produtos por página

    // Calcula o total de páginas com base no tamanho do array
    const totalPages = useMemo(() => {
        return Math.ceil(products?.length / itemsPerPage) || 0;
    }, [products, itemsPerPage]);

    // Seleciona os produtos para a página atual
    const currentProducts = useMemo(() => {
        if (!products) return [];
        const startIndex = (page - 1) * itemsPerPage;
        return products.slice(startIndex, startIndex + itemsPerPage);
    }, [products, page, itemsPerPage]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Box sx={{ borderRadius: "10px", mt: 2, mb: 1 }}>
            <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: "bold" }}>
                Os nossos produtos
            </Typography>
            <Box
                sx={{
                    mt: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* Renderiza os produtos da página atual */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    {currentProducts?.length ? (
                        currentProducts.map((product) => (
                            <StoreProductCard
                                key={product.id}
                                product={product}
                                vendor={vendor}
                                store={store}
                            />
                        ))
                    ) : (
                        <p>Nenhum produto disponível.</p>
                    )}
                </Box>
                {/* Componente de paginação do Material UI */}
                <Box sx={{ mt: 3 }}>
                    <Pagination
                        count={totalPages}           // Total de páginas calculado
                        page={page}                  // Página atual
                        onChange={handlePageChange}  // Atualiza a página ao clicar
                        color="primary"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default StoreProductsContainer;
