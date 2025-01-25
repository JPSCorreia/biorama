import {observer} from "mobx-react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Divider, IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const DashboardStoresCard = observer(({store}) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Verifica se o ecrã é pequeno

    // Limita a descrição a 150 caracteres
    const truncatedDescription =
        store?.description?.length > 150
            ? `${store.description.slice(0, 150)}...`
            : store?.description;

    return (
        <Card
            sx={{
                maxWidth: 300, // Reduz a largura máxima do card
                width: "100%",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: 3,
                margin: "auto",
                mt: 5,
                minHeight: 500, // Altura mínima garantida
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Cabeçalho */}
            <CardContent>
                <Typography variant="h6" component="div" fontWeight="bold" noWrap>
                    {store?.name || "Loja sem Nome"}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        color: "#aaa",
                        whiteSpace: "nowrap", // Evita quebra de linha
                        overflow: "hidden", // Esconde texto excedente
                        textOverflow: "ellipsis", // Adiciona reticências (...)
                    }}
                >
                    {store?.addresses[0]?.city || "Sem Cidade"}
                </Typography>
            </CardContent>

            {/* Imagem */}
            <CardMedia
                component="img"
                sx={{
                    height: 150, // Altura fixa para a imagem
                    width: "95%", // Largura proporcional
                    margin: "0 auto",
                    borderRadius: "8px",
                    pb: 2,
                }}
                image="https://www.france-voyage.com/visuals/photos/frutas-vermelhas-7713_w1400.webp" // URL de exemplo
                alt="Imagem da Loja"
            />

            <Divider
                sx={{
                    height: "1px",
                    background: "linear-gradient(to right, transparent, #000, transparent)",
                    border: "none",
                }}
            />

            {/* Informações */}
            <CardContent>
                <Box sx={{ marginBottom: 2 }}>
                    {/* Descrição */}
                    <Box
                        sx={{
                            marginBottom: "1rem", // Espaço entre a descrição e os outros elementos
                        }}
                    >
                        <Typography fontWeight="bold">Descrição:</Typography>
                        <Typography
                            sx={{
                                display: "-webkit-box", // Ativa o line-clamp
                                WebkitLineClamp: 3, // Define o máximo de 3 linhas
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {truncatedDescription || "Sem Descrição"}
                        </Typography>
                    </Box>

                    {/* Rating */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            marginBottom: 2, // Garante separação entre o rating e o botão
                        }}
                    >
                        <Typography fontWeight="bold">Rating:</Typography>
                        <Typography>{store?.rating || "Sem Avaliação"}</Typography>
                    </Box>
                </Box>

                {/* Botão */}

                <Box sx={{ textAlign: "right", mt: "auto" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            borderRadius: "50%", // Garante bordas arredondadas
                            width: 50, // Largura fixa (igual à altura)
                            height: 50, // Altura fixa (igual à largura)
                            minWidth: 0, // Remove o comportamento padrão de largura mínima
                            padding: 0, // Remove padding interno
                        }}
                    >
                        <RemoveRedEyeIcon />
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
});

export default DashboardStoresCard;
