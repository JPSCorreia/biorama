import {
    Box,
    Container,
    Typography,
    Button,
    Alert,
    Fade,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { HomeMap, NearbyStores, AlertBox } from "../Components";
import { usePage, router } from "@inertiajs/react";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { alertStore } from "../Stores";

const Home = observer(() => {
    // Get authentication and flash from page props
    const { auth, flash = {} } = usePage().props;

    // Get theme
    const theme = useTheme();

    // Get media queries
    const smallerThanLg = useMediaQuery(theme.breakpoints.down("lg"));
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
                    flexDirection: smallerThanLg ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.main",
                    color: "white",
                    p: 2,
                    textAlign: "center",
                    mb: 4,
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
            </Box>

            {/* Map */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Descubra as lojas mais perto de si!
                </Typography>
                <HomeMap />
            </Box>

            {/* Nearby Stores */}
            <Box sx={{ bgcolor: "primary.main", mt: 3, p: 2, mb: 4 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    textAlign="center"
                    color="white"
                >
                    Lojas Próximas
                </Typography>
                <NearbyStores radius={10000} />
            </Box>
        </Container>
    );
});

export default Home;
