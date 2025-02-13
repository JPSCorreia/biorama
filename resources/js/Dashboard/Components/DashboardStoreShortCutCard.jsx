import { observer } from "mobx-react";
import {
    Box,
    Rating,
    Paper,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

const DashboardStoreShortCutCard = observer(
    ({ store, onProductClick, onReviewClick, handleNavigateToOrders, highlightProductList, highlightReviewList }) => {
        const theme = useTheme();
        const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Lógica para dispositivos móveis
        const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));

        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: isSmallScreen ? "column" : "row", // Coluna no telemóvel, linha no desktop
                    gap: smallerThanMedium? 2 : 5,
                    justifyContent: "space-between", // Espaçamento entre os cards
                    width: "100%",
                }}
            >
                {/* Card - Produtos */}
                <Paper
                    onClick={onProductClick} // Ação ao clicar
                    elevation={4}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "150px",
                        flex: "1 1 25%", // Ocupa 25% da largura
                        borderRadius: "12px",
                        overflow: "hidden",
                        position: "relative",
                        cursor: "pointer", // Indica que é clicável
                        transition: "transform 0.3s",
                        boxShadow: highlightProductList
                        ? `0px 0px 20px ${theme.palette.primary.main}`
                        : "",
                        width: "100%",
                        "&:hover": {
                            transform: "scale(1.05)", // Efeito de hover
                        },
                    }}
                >
                    {/* Barra lateral verde */}
                    <Box
                        sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "5px",
                            backgroundColor: theme.palette.primary.main,
                        }}
                    ></Box>

                    {/* Conteúdo do card */}
                    <Box sx={{ textAlign: "center", padding: "16px" }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ marginBottom: "8px" }}
                        >
                            Produtos
                        </Typography>
                        <StorefrontIcon
                            fontSize="large"
                            sx={{ color: theme.palette.primary.main }}
                        />
                    </Box>
                </Paper>

                {/* Card - Encomendas */}
                <Paper
                    onClick={handleNavigateToOrders}
                    elevation={4}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "150px",
                        flex: "1 1 25%",
                        borderRadius: "12px",
                        overflow: "hidden",
                        position: "relative",
                        cursor: "pointer",
                        transition: "transform 0.3s",
                        "&:hover": {
                            transform: "scale(1.05)",
                        },
                    }}
                >
                    {/* Barra lateral verde */}
                    <Box
                        sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "5px",
                            backgroundColor: theme.palette.primary.main,
                        }}
                    ></Box>

                    {/* Conteúdo do card */}
                    <Box sx={{ textAlign: "center", padding: "16px" }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ marginBottom: "8px" }}
                        >
                            Encomendas
                        </Typography>
                        <ShoppingBasketIcon
                            fontSize="large"
                            sx={{ color: theme.palette.primary.main }}
                        />
                    </Box>
                </Paper>

                {/* Card - Reviews */}
                <Paper
                    onClick={onReviewClick}
                    elevation={4}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "150px",
                        flex: "1 1 25%",
                        borderRadius: "12px",
                        overflow: "hidden",
                        position: "relative",
                        cursor: "pointer",
                        transition: "transform 0.3s",
                        boxShadow: highlightReviewList
                        ? `0px 0px 20px ${theme.palette.primary.main}`
                        : "",
                        "&:hover": {
                            transform: "scale(1.05)",
                        },
                    }}
                >
                    {/* Barra lateral verde */}
                    <Box
                        sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "5px",
                            backgroundColor: theme.palette.primary.main,
                        }}
                    ></Box>

                    {/* Conteúdo do card */}
                    <Box sx={{ textAlign: "center", padding: "16px" }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ marginBottom: "8px" }}
                        >
                            Reviews
                        </Typography>
                        <Rating
                            value={store.reviews.reduce((sum, review) => sum + review.rating, 0) / (store.reviews.length || 1)}
                            precision={0.5} // Permite meio ponto (exemplo: 4.5 estrelas)
                            readOnly
                        />
                    </Box>

                </Paper>

            </Box>
        );
    },
);

export default DashboardStoreShortCutCard;
