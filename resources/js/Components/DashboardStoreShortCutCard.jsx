import { observer } from "mobx-react";
import {Box, Container, Rating, Typography, useMediaQuery} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

const DashboardStoreShortCutCard = observer(({store, onProductClick, onReviewClick, handleNavigateToOrders  }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Lógica para dispositivos móveis

    return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row', // Coluna no telemóvel, linha no desktop
                    gap: 6,
                    justifyContent: 'space-between', // Espaçamento entre os cards
                    width:"100%"
                }}
            >
                {/* Card - Produtos */}
                <Box
                    onClick={onProductClick} // Ação ao clicar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '150px',
                        flex: '1 1 25%', // Ocupa 25% da largura
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer', // Indica que é clicável
                        transition: 'transform 0.3s',
                        width:"100%",
                        '&:hover': {
                            transform: 'scale(1.05)', // Efeito de hover
                        },
                    }}
                >
                    {/* Barra lateral verde */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '5px',
                            backgroundColor: '#27AE60',
                        }}
                    ></Box>

                    {/* Conteúdo do card */}
                    <Box sx={{ textAlign: 'center', padding: '16px' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                            Produtos
                        </Typography>
                        <StorefrontIcon fontSize="large" sx={{ color: '#27AE60' }} />
                    </Box>
                </Box>

                {/* Card - Encomendas */}
                <Box
                    onClick={handleNavigateToOrders}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '150px',
                        flex: '1 1 25%',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'transform 0.3s',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                    }}
                >
                    {/* Barra lateral verde */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '5px',
                            backgroundColor: '#27AE60',
                        }}
                    ></Box>

                    {/* Conteúdo do card */}
                    <Box sx={{ textAlign: 'center', padding: '16px' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                            Encomendas
                        </Typography>
                        < ShoppingBasketIcon fontSize="large" sx={{ color: '#27AE60' }} />
                    </Box>
                </Box>

                {/* Card - Reviews */}
                <Box
                    onClick={onReviewClick}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '150px',
                        flex: '1 1 25%',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'transform 0.3s',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                    }}
                >
                    {/* Barra lateral verde */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '5px',
                            backgroundColor: '#27AE60',
                        }}
                    ></Box>

                    {/* Conteúdo do card */}
                    <Box sx={{ textAlign: 'center', padding: '16px' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                            Reviews
                        </Typography>
                        <Rating
                            value={Number(store?.rating) || 0}
                            precision={0.5} // Permite meio ponto (exemplo: 4.5 estrelas)
                            readOnly
                        />
                    </Box>
                </Box>
            </Box>
    );
});

export default DashboardStoreShortCutCard;
