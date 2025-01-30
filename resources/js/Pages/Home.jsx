import {
    Box,
    Container,
    Typography,
    Button,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { HomeMap, NearbyStores, AlertBox } from "../Components";
import { usePage, router } from "@inertiajs/react";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { alertStore } from "../Stores";
import BannerImage from "../../images/banner2.png";

const Home = observer(() => {
    // Get authentication and flash from page props
    const { auth, flash = {} } = usePage().props;

    // Get theme
    const theme = useTheme();

    // Get media queries
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
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
            {/* <Box
                sx={{
                    display: "flex",
                    flexDirection: smallerThanLg ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.main",
                    color: "white",
                    p: 2,
                    textAlign: "center",
                    mb: 2,
                    borderRadius: "5px",
                }}
            >
                <Typography variant="h4" sx={{ mr: 3 }}>
                    {auth.isVendor
                        ? `Bemvindo, ${auth.user.first_name} ${auth.user.last_name}!`
                        : "Queres divulgar o teu negócio?"}
                </Typography>
                {auth.isVendor ? null : (
                    <Button
                        variant="contained"
                        onClick={() => router.get("/vendedores/registo")}
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            "&:hover": {
                                backgroundColor: theme.palette.secondary.dark,
                            },
                        }}
                    >
                        Cria agora o teu espaço!
                    </Button>
                )}
            </Box> */}
            <Box sx={{ display: "flex", justifyContent: "center", maxWidth: "100%", cursor: "pointer"}} onClick={() => router.get("/vendedores/registo")}><img src={BannerImage} alt="Banner"style={{ width: "100%", padding: "1px", border: "1px solid green", borderRadius: "3px" }}/></Box>
            {/* Map */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 2,
                    mt: 2,
                    justifyContent: "center",
                }}
            >
                <Typography variant={isSmallScreen ? "text" : isMediumScreen ? "h5" : "h4"} gutterBottom sx={{ alignSelf: "start" }}>
                    Descobre as lojas mais perto de ti!
                </Typography>
                <HomeMap radius={10000} />
            </Box>

            {/* Nearby Stores */}
            <NearbyStores radius={10000} />
        </Container>
    );
});

export default Home;
