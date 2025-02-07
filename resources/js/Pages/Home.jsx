import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Container, Box, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import { nearbyShopStore } from "../Stores/nearbyShopStore.js";
import NearbyStores from "../Components/HomePage/NearbyStores.jsx";
import MapModal from "../Components/HomePage/MapModal.jsx";
import MapIcon from "@mui/icons-material/Map";
import { alpha } from "@mui/material/styles";
import { authStore} from "../Stores/index.js";
import {usePage, router} from "@inertiajs/react";
import AlertBox from "../Components/AlertBox.jsx";
import bannerImageGuest from "../../../public/images/Banners/BannerGuest.png";
import bannerImageRegistoVendor from "../../../public/images/Banners/BannerRegistoVendor.png";
import bannerImageVendor from "../../../public/images/Banners/BannerVendor.png";

const Home = observer(() => {

    const {auth} = usePage().props;
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
    }, []);

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
            <AlertBox />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    cursor: "pointer",
                    borderRadius: "18px",
                    overflow: "hidden",
                    transition: "transform 0.3s ease-out, box-shadow 0.3s ease-out",
                    "&:hover": (theme) => ({
                        transform: "scale(1.02)",
                        boxShadow: `0px 8px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }),
                    mb:10
                }}
                onClick={() => {
                    const targetRoute = auth?.isVendor
                        ? "/vendedores/dashboard"
                        : authStore.isAuthenticated
                            ? "/vendedores/registo"
                            : "/auth/login";

                    router.get(targetRoute);
                }}
            >
                <img
                    src={`${
                        auth?.isVendor
                            ? bannerImageVendor
                            : authStore.isAuthenticated
                                ? bannerImageRegistoVendor
                                : bannerImageGuest
                    }`}
                    alt="Banner"
                    style={{
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: "auto",
                        borderRadius: "18px",
                        transition: "transform 0.3s ease-out",
                    }}
                />
            </Box>

            {/* Título */}
            <Box sx={{ width: "100%", mb: 1}}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: "primary.title" }}>
                    As lojas mais próximas de si
                </Typography>
            </Box>

            {/* Nearby Stores */}
            <Box sx={{ display: "flex", flexDirection: smallerThanMedium ? "column-reverse" : "row", mb: 10 }}>
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
            <MapModal open={openMapModal} onClose={handleCloseMap} />
        </Container>
    );
});

export default Home;
