import { Paper, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { router } from "@inertiajs/react";
import { observer } from "mobx-react";
import { hoverStore } from "../Stores";
import { truncateDescription } from "../utils/utils";

const HomeStoreCard = observer(({ store }) => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));
    const isHovered = hoverStore.hoveredStoreId === store.id;



    return (
        <Paper
            sx={{
                flex: smallerThanMedium
                    ? "1 1 100%" // Full width for small screens
                    : "1 1 calc(50% - 16px)", // Three cards per row for larger screens
                display: "flex",
                flexDirection: "column",
                borderRadius: "8px",
                border: `1px solid ${theme.palette.primary.main}`,
                cursor: "pointer",
                transition: "transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out",
                transform: isHovered ? "scale(1.02)" : "scale(1)",
                boxShadow: isHovered
                    ? `0px 4px 15px ${theme.palette.primary.main}`
                    : "none",
                overflow: "hidden", // Evita que a imagem saia do Paper
            }}
            elevation={4}
            key={store.id}
            onClick={() => router.visit(`/loja/${store.id}`)}
            onMouseEnter={() => hoverStore.setHoveredStore(store.id)}
            onMouseLeave={() => hoverStore.setHoveredStore(null)}
        >
            {/* Imagem de fundo com overlay escuro */}
            <Box
                sx={{
                    position: "relative",
                    height: "100px",
                    backgroundImage: `url(${store.image_link})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0, 0, 0, 0.5)", // Escurece a imagem
                    },
                }}
            >
                {/* Nome da loja sobre a imagem */}
                <Typography
                    variant={smallerThanMedium? "h5" : "h4"}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        zIndex: 1,
                        textAlign: "center",
                        width: "100%",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        textShadow:
                            `0 0 3px ${theme.palette.primary.main}, 0 0 3px ${theme.palette.primary.main}, 0 0 3px ${theme.palette.primary.main}`,
                        px: 1, // Padding lateral para evitar corte
                    }}
                >
                    {store.name}
                </Typography>
            </Box>

            {/* Conteúdo do card */}
            <Box sx={{ padding: 2, pt: 0 }}>
                <Box
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: 1, fontSize: 14 }}
                >
                    <ReactMarkdown>{truncateDescription(store.description, 150, 175)}</ReactMarkdown>
                </Box>
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                    Distância: {(store.distance / 1000).toFixed(2)} km
                </Typography>
            </Box>
        </Paper>
    );
});

export default HomeStoreCard;

HomeStoreCard.propTypes = {
    store: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        name: PropTypes.string.isRequired,
        image_link: PropTypes.string.isRequired, // Garante que a imagem está definida
        description: PropTypes.string.isRequired,
        distance: PropTypes.number.isRequired,
    }).isRequired,
};
