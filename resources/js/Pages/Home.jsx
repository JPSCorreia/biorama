import {
    Box,
    Container,
    Typography,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { HomeMap, NearbyStores, AlertBox } from "../Components";
import { router } from "@inertiajs/react";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { alertStore } from "../Stores";
import BannerImage from "../../images/banner2.png";

const Home = observer(() => {
    // Get theme
    const theme = useTheme();

    // Get media queries
    const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    useEffect(() => {
        // Reset alert store on navigation
        const handleNavigate = () => {
            alertStore.reset();
        };

        // Add navigation event listener
        if (typeof router?.on === "function") {
            router.on("navigate", handleNavigate);

            return () => {
                // Remove navigation event listener on cleanup
                if (typeof router?.off === "function") {
                    router.off("navigate", handleNavigate);
                }
            };
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
            {/* Alert */}
            <AlertBox />
            {/* Banner */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    maxWidth: "100%",
                    cursor: "pointer",
                }}
                onClick={() => router.get("/vendedores/registo")}
            >
                <img
                    src={BannerImage}
                    alt="Banner"
                    style={{
                        width: "100%",
                        padding: "1px",
                    }}
                />
            </Box>
            <Box sx={{ display: "flex", flexDirection: smallerThanMedium ? "column-reverse" : "row", mb: 8 }}>
                {/* Nearby Stores */}
                <NearbyStores radius={50000} />
                {/* Map */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: smallerThanMedium? "100%" : "40%",
                        minWidth: smallerThanMedium? "100%" : "40%",
                        minHeight: "100%",
                        mt: 2,
                    }}
                >
                    <HomeMap radius={50000} />
                </Box>
            </Box>
        </Container>
    );
});

export default Home;
