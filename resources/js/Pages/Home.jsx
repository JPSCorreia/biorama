import { Box, Container, Typography, Button, Alert, Fade } from "@mui/material";
import { HomeMap } from "../Components";
import { usePage, router } from "@inertiajs/react";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { alertStore } from "../Stores/alertStore";
import { NearbyStores } from "../Components/NearbyStores";

const Home = observer(() => {
    const { auth, flash = {} } = usePage().props;
    const isAuthenticated = !!auth?.user;

    const vendorRegister = () => {
      router.push("/vendors/register");
    };

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

    useEffect(() => {
        // Set alert based on flash message
        if (flash?.message && flash.message !== alertStore.lastMessage) {
            alertStore.clearTimers();

            setTimeout(() => {
                alertStore.setAlert(flash.message, flash.type || "success");

                // Set timer to hide alert after 3 seconds
                const hideTimer = setTimeout(() => {
                    alertStore.hideAlert();
                }, 3000);
                alertStore.addTimer(hideTimer);

                // Set timer to clear alert after 3.5 seconds
                const clearTimer = setTimeout(() => {
                    alertStore.clearAlert();
                }, 3500);
                alertStore.addTimer(clearTimer);
            }, 150);
        }

        return () => {
            // Clear timers on unmount
            alertStore.clearTimers();
        };
    }, [flash?.message]);

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                marginTop: "40px !important",
            }}
        >
            {/* Alerta */}
            {alertStore.message ? (
                <Fade
                    in={alertStore.show}
                    timeout={{
                        enter: 150,
                        exit: 500,
                    }}
                    unmountOnExit
                >
                    <Alert
                        severity={alertStore.severity}
                        variant="filled"
                        sx={{
                            mb: 2,
                            height: "48px",
                            width: "100%",
                            maxWidth: "470px",
                            alignSelf: "center",
                        }}
                    >
                        {alertStore.message}
                    </Alert>
                </Fade>
            ) : (
                <Box sx={{ mb: 2, height: "48px" }} />
            )}

            {/* Caixa "Click" no topo */}
            <Box
                sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    p: 2,
                    textAlign: "center",
                    mb: 4,
                }}
            >
                <Typography variant="h4">
                    Queres divulgar o teu negócio?
                    <Button
                        variant="contained"
                        onClick={vendorRegister}
                    >
                        Cria agora o teu espaço!
                    </Button>
                </Typography>
            </Box>

            {/* Mapa */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Descubra as lojas mais perto de si!
                </Typography>
                <HomeMap />
            </Box>

            {/* Lojas próximas */}
            <Box sx={{ bgcolor: "primary.main", mt: 4, p: 2 }}>
                <Typography variant="h4" gutterBottom textAlign="center" color="white">
                    Lojas Próximas
                </Typography>
                <NearbyStores radius={10000} />
            </Box>

            {/* Botão de Teste */}
            <Button
                sx={{ mt: 4 }}
                variant="contained"
                onClick={() => {
                    console.log("Auth state:", isAuthenticated);
                }}
            >
                Testar User Auth
            </Button>
        </Container>
    );
});

export default Home;
