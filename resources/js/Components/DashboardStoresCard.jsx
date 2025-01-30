import { observer } from "mobx-react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Typography,
    Avatar,
    Rating,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { fixImagePath } from "../utils/utils.js";
import { shopStore } from "@/Stores/index.js";

const DashboardStoresCard = observer(({ store, user }) => {
    // Pega a primeira imagem da galeria como fundo e a segunda como perfil
    const backgroundImage =
        fixImagePath(store?.galleries[0].image_link) ||
        "https://www.france-voyage.com/visuals/photos/frutas-vermelhas-7713_w1400.webp";
    const profileImage =
        fixImagePath(user?.image_profile) ||
        "https://img.freepik.com/free-photo/sideways-black-person-looking-away_23-2148749548.jpg?t=st=1738098181~exp=1738101781~hmac=37201112c86819d842272cc0f3c10da8c78de0e39ee9a77845680f10018abde5&w=1800";

    // Limita a descrição a 150 caracteres
    const truncatedDescription =
        store?.description?.length > 150
            ? `${store.description.slice(0, 150)}...`
            : store?.description || "Sem Descrição";

    return (
        <Card
            sx={{
                maxWidth: 300,
                width: "100%",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: 3,
                margin: "auto",
                mt: 5,
                minHeight: 500,
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}
        >
            {/* Imagem de fundo */}
            <CardMedia
                component="img"
                sx={{
                    height: 160,
                    width: "100%",
                    objectFit: "cover",
                }}
                image={backgroundImage}
                alt="Não encontrou a imagem"
            />

            {/* Avatar Circular no Centro */}
            <Box
                sx={{
                    position: "absolute",
                    top: 100, // Ajusta a posição do avatar
                    left: "50%",
                    transform: "translate(-50%, 0%)",
                    zIndex: 2,
                    borderRadius: "50%",
                    border: "4px solid white",
                    width: 90,
                    height: 90,
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                }}
            >
                <Avatar src={profileImage} sx={{ width: 76, height: 76 }} />
            </Box>

            {/* Conteúdo do Card */}
            <CardContent sx={{ textAlign: "center", pt: 6 }}>
                <Typography variant="h6" fontWeight="bold" noWrap>
                    {store?.name || "Loja sem Nome"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {store?.addresses?.[0]?.city || "Sem Cidade"}
                </Typography>
            </CardContent>

            <Divider
                sx={{
                    height: "1px",
                    background:
                        "linear-gradient(to right, transparent, #000, transparent)",
                    border: "none",
                    mb: 2,
                }}
            />

            {/* Informações */}
            <CardContent>
                <Box sx={{ marginBottom: 2 }}>
                    {/* Descrição */}
                    <Box sx={{ marginBottom: "2rem", minHeight: "100px" }}>
                        <Typography fontWeight="bold">Descrição:</Typography>
                        <Typography
                            sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {truncatedDescription}
                        </Typography>
                    </Box>

                    {/* Rating */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            marginBottom: 2,
                            gap: 9,
                        }}
                    >
                        <Box>
                            <Typography fontWeight="bold">Rating:</Typography>
                            <Rating
                                value={store?.rating || 0}
                                precision={0.5} // Permite meio ponto (exemplo: 4.5 estrelas)
                                readOnly
                            />
                        </Box>

                        <Box sx={{ textAlign: "right", mt: "auto" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                // Navegação ao clicar no botão
                                onClick={() =>
                                    shopStore.navigateToStore(store.id)
                                }
                                sx={{
                                    borderRadius: "50%",
                                    width: 50,
                                    height: 50,
                                    minWidth: 0,
                                    padding: 0,
                                }}
                            >
                                <RemoveRedEyeIcon />
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Botão de Visualizar */}
            </CardContent>
        </Card>
    );
});

export default DashboardStoresCard;
