import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Container, Box, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import { nearbyShopStore } from "../Stores/nearbyShopStore.js";
import NearbyStores from "../Components/HomePage/NearbyStores.jsx";
import MapModal from "../Components/HomePage/MapModal.jsx";
import MapIcon from "@mui/icons-material/Map";

const Home = observer(() => {
    const theme = useTheme();
    const [openMapModal, setOpenMapModal] = useState(false);
    const handleOpenMap = () => setOpenMapModal(true);
    const handleCloseMap = () => setOpenMapModal(false);

    const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    const { latitude, longitude } = coords;
                    nearbyShopStore.fetchNearbyStores(latitude, longitude, 50000);
                },
                (error) => {
                    console.error("Não foi possível obter a localização:", error);
                }
            );
        } else {
            console.error("Geolocalização não suportada.");
        }
    }, []); // ✅ Apenas no primeiro render

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: "100%",
                height: "100%",
                marginTop: "15px !important",
            }}
        >
            {/* Título */}
            <Box sx={{ width: "100%", mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: "primary.title" }}>
                    As lojas mais próximas de si
                </Typography>
            </Box>

            {/* Nearby Stores */}
            <Box sx={{ display: "flex", flexDirection: smallerThanMedium ? "column-reverse" : "row", mb: 30 }}>
                <NearbyStores />
            </Box>

            {/* Botão para abrir o mapa */}
            <Button
                variant="contained"
                color="primary"
                sx={{
                    position: "fixed",
                    bottom: 60,
                    left: "50%",
                    transform: "translateX(-50%)",
                    borderRadius: "30px",
                    fontWeight: "bold",
                    padding: "12px 24px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                }}
                onClick={handleOpenMap}
            >
                Ver Mapa
                <MapIcon />
            </Button>

            {/* Modal do Mapa */}
            <MapModal open={openMapModal} onClose={handleCloseMap} radius={50000} />
        </Container>
    );
});

export default Home;
