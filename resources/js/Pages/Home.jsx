import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import {
    Container,
    Box,
    Typography,
    Button,
    useTheme,
    useMediaQuery,
    Grid,
    IconButton
} from "@mui/material";
import { nearbyShopStore } from "../Stores/nearbyShopStore.js";
import HomeNearbyStores from "../Components/HomePage/HomeNearbyStores.jsx";
import HomeMapModal from "../Components/HomePage/HomeMapModal.jsx";
import MapIcon from "@mui/icons-material/Map";
import { alpha } from "@mui/material/styles";
import { authStore } from "../Stores/index.js";
import { usePage, router } from "@inertiajs/react";
import AlertBox from "../Components/AlertBox.jsx";
import bannerImageGuest from "../../../public/images/Banners/BannerGuest.png";
import bannerImageRegistoVendor from "../../../public/images/Banners/BannerRegistoVendor.png";
import bannerImageVendor from "../../../public/images/Banners/BannerVendor.png";
import HomeBestSellers from "@/Components/HomePage/HomeBestSellers.jsx";

const Home = observer(() => {
    const { auth } = usePage().props;
    const theme = useTheme();
    const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const [openMapModal, setOpenMapModal] = useState(false);
    const handleOpenMap = () => setOpenMapModal(true);
    const handleCloseMap = () => setOpenMapModal(false);

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
                    overflow: "hidden",
                    transition: "transform 0.3s ease-out, box-shadow 0.3s ease-out",
                    "&:hover": (theme) => ({
                        transform: "scale(1.02)",
                        boxShadow: `0px 8px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }),
                    mb: 10,
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
                        transition: "transform 0.3s ease-out",
                    }}
                />
            </Box>

            {/* Título */}
            <Box sx={{ width: "100%", mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: "primary.title", textAlign:"center" }}>
                    MAIS PERTO DE TI
                </Typography>
            </Box>

            {/* Nearby Stores */}
            <Box sx={{ display: "flex", flexDirection: smallerThanMedium ? "column-reverse" : "row", mb: 10 }}>
                <HomeNearbyStores />
            </Box>

            <Box sx={{ width: "100%", mb: 1 }}>
                <HomeBestSellers products={nearbyShopStore.bestProducts}/>
            </Box>

            {/* Botão para abrir o mapa */}
            <Button
                variant="contained"
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
                    zIndex: 1000,
                    backgroundColor: "secondary.button",
                }}
                onClick={handleOpenMap}
            >
                Ver Mapa
                <MapIcon />
            </Button>

            {/* Modal do Mapa */}
            <HomeMapModal open={openMapModal} onClose={handleCloseMap} />
        </Container>
    );
});

export default Home;
