import {observer} from "mobx-react";
import { useState } from "react";
import { Box, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HomeProductCard from "./HomeProductCard";

const HomeBestSellers = observer(({products}) => {
    // Estado para a página atual
    const [page, setPage] = useState(1);
    const itemsPerPage = 4;

    // Calcula a quantidade total de páginas
    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Seleciona os produtos da página atual
    const visibleProducts = products.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    // Para responsividade com Material UI
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    return (
        <Box sx={{ width: "100%", mb: 1 }}>
            <Typography
                variant="h4"
                sx={{ fontWeight: 800, mb: 2, color: "primary.title", textAlign: "center" }}
            >
                DESTAQUES
            </Typography>

            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* Botão para página anterior */}
                <IconButton
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    <ArrowBackIosIcon />
                </IconButton>

                <Box
                    sx={{
                        display: "grid",
                        // Ajusta o grid conforme o tamanho da tela
                        gridTemplateColumns: isSmallScreen
                            ? "repeat(1, 1fr)"
                            : isMediumScreen
                                ? "repeat(2, 1fr)"
                                : "repeat(4, 1fr)",
                        gap: 2,
                        width: "95%",
                    }}
                >
                    {visibleProducts.map(product => (
                        <Box
                            key={product.id}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "415px",
                            }}
                        >
                            <HomeProductCard product={product} sx={{ width: "100%" }} />
                        </Box>
                    ))}
                </Box>

                {/* Botão para próxima página */}
                <IconButton
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
        </Box>
    );
});

export default HomeBestSellers;
