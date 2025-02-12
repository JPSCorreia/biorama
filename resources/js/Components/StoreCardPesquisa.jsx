import { observer } from 'mobx-react-lite';
import {Card, CardContent, Typography, Button, Box, useTheme, useMediaQuery, IconButton} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import {useState} from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import {hoverStore} from "@/Stores/index.js";
import {router} from "@inertiajs/react";
import ReactMarkdown from "react-markdown";
import {truncateDescription} from "@/utils/utils.js";
import LocationOnIcon from "@mui/icons-material/LocationOn";
const StoreCardPesquisa = observer(({store}) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isHovered = hoverStore.hoveredStoreId === store.id;
    const [previewIndex, setPreviewIndex] = useState(0);

    return (
        <Card
            sx={{
                width: 380,
                height: 480,
                boxShadow: isHovered ? 8 : 3,
                borderRadius: "10px",
                overflow: "hidden",
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                transform: isHovered ? "scale(1.015)" : "scale(1)",
                backgroundColor: theme.palette.background.paper,
                cursor: "pointer",
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
            key={store.id}
            onClick={() => router.visit(`/loja/${store.id}`)}
            onMouseEnter={() => hoverStore.setHoveredStore(store.id)}
            onMouseLeave={() => hoverStore.setHoveredStore(null)}
        >
            {/* Carrossel de Imagens - 50% do Card */}
            <Box sx={{ height: "40%", overflow: "hidden", position: "relative" }}>
                <Carousel
                    autoPlay={false}
                    indicators={false}
                    navButtonsAlwaysVisible={true}
                    index={previewIndex}
                    onChange={(index) => setPreviewIndex(index)}
                    sx={{
                        width: "100%",
                        height: "100%",
                        "& .MuiButtonBase-root": {
                            backgroundColor: "rgba(0, 0, 0, 0.3) !important",
                            color: "#fff",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            opacity: 0.8,
                            transition: "opacity 0.3s ease-in-out",
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.5) !important",
                            },
                        },
                        "& .MuiSvgIcon-root": {
                            fontSize: "1.8rem",
                        },
                    }}
                >
                    {store.galleries.length > 0 ? (
                        store.galleries.map((img, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: "100%",
                                    height: "180px",
                                    backgroundImage: `url(${img.image_link})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}
                            />
                        ))
                    ) : (
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                backgroundImage: "url('/images/default-store.jpg')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                    )}
                </Carousel>
            </Box>

            {/* Informações da Loja - 50% do Card */}
            <CardContent
                sx={{
                    textAlign: "left",
                    p: 2,
                    pt:0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    overflow: "hidden",
                    height: "60%",

                }}
            >
                <Box>
                    {/* Nome da Loja */}
                    <Typography
                        fontWeight="bold"
                        variant="h5"
                        sx={{
                            color: theme.palette.primary.main,
                            textTransform: "capitalize",
                        }}
                    >
                        {store.name}
                    </Typography>
                </Box>
                <Box>
                    {/* Descrição */}
                    <Box
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            height: "110px",
                            fontSize: 14,
                        }}
                    >
                        <ReactMarkdown>
                            {truncateDescription(store.description, 90, 150)}
                        </ReactMarkdown>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        mb: 2,
                        mt: 2,
                    }}
                >
                    {/* Endereço */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <LocationOnIcon sx={{ color: theme.palette.primary.main, fontSize: "1.2rem" }} />
                        <Typography variant="body2" color="text.secondary">
                            {store.addresses[0]?.street_address}, {store.addresses[0]?.city}
                        </Typography>
                    </Box>

                    {/* Contactos */}
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <CallIcon sx={{ fontSize: "1.1rem", color: "primary.main" }} />
                            <Typography variant="body2" color="text.secondary">
                                {store.phone_number}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <EmailIcon sx={{ fontSize: "1.1rem", color: "primary.main" }} />
                            <Typography variant="body2" color="text.secondary">
                                {store.email}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box>

                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
                        {/* Botão Mais Informações */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "16px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                transition: "color 0.3s ease-in-out",
                                color: theme.palette.primary.main,
                                "&:hover": {
                                    color: theme.palette.primary.dark,
                                },
                            }}
                        >
                            <Typography variant="button">MAIS INFORMAÇÕES</Typography>
                            <IconButton size="small">
                                <ArrowForwardIosIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
});

export default StoreCardPesquisa;
