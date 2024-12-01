import { Box, Container, Typography, Button, Alert, Fade } from "@mui/material";
import { HomeMap } from "../Components";
import { usePage, router } from "@inertiajs/react";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { alertStore } from "../Stores/alertStore";

const Home = observer(() => {
    const { auth, flash = {} } = usePage().props;
    const isAuthenticated = !!auth?.user;

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
                // marginBottom: "5%",
                marginTop: "40px !important",
            }}
        >
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

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >
                <Box sx={{ bgcolor: "primary.main" }}>
                    <Typography variant="h4" gutterBottom textAlign="center">
                        Conteudo extra
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Descubra as lojas mais perto de si!
                    </Typography>
                    <HomeMap />
                </Box>
                <Box sx={{ bgcolor: "primary.main" }}>
                    <Typography variant="h4" gutterBottom textAlign="center">
                        Conteudo extra
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ bgcolor: "primary.main", mt: 4 }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Conteudo extra
                </Typography>
            </Box>
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
