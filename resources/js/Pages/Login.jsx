import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Alert,
    Paper,
    Fade,
} from "@mui/material";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { alpha } from "@mui/material/styles";
import { authStore } from "../Stores";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();

        router.post("/entrar", formData, {
            onSuccess: (page) => {
                console.log("Login response:", page);

                if (page.props.auth && page.props.auth.user) {
                    authStore.setAuth(true);
                    authStore.setUser(page.props.auth.user);
                    console.log(
                        "Login successful with user:",
                        page.props.auth.user
                    );
                } else {
                    console.log("Login successful but no user data received");
                }
            },
            onError: (errors) => {
                console.error("Registration errors:", errors);

                // Verify if the error is due to an email already registered
                if (
                    errors.email ===
                    "The provided credentials do not match our records."
                ) {
                    setError(
                        "Erro ao iniciar sessão. Verifique o email e a palavra-passe."
                    );
                    setShowError(true);
                } else {
                    setError("Ocorreu um erro inesperado. Tente novamente.");
                    setShowError(true);
                }
            },
        });
    };

    // Clear the error message automatically after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setShowError(false); // Start the fade-out
            }, 4500); // After 4.5 seconds, start the fade

            const clearTimer = setTimeout(() => {
                setError(""); // Clear the error message
            }, 5000); // After 5 seconds, clear the error message completely

            return () => {
                clearTimeout(timer);
                clearTimeout(clearTimer);
            };
        }
    }, [error]);

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "40px !important",
            }}
        >
            <Fade in={showError} timeout={{ enter: 50, exit: 500 }}>
                {error ? (
                    <Alert
                        severity="error"
                        variant="filled"
                        sx={{
                            mb: 2,
                            height: "48px",
                            width: "100%",
                            maxWidth: "470px",
                        }}
                    >
                        {error}
                    </Alert>
                ) : (
                    <Box sx={{ mb: 2, height: "48px" }}></Box>
                )}
            </Fade>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    maxWidth: "470px",
                }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        p: 2,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: (theme) =>
                            alpha(theme.palette.background.default, 0.85),
                    }}
                >
                    <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
                        sx={{ mb: 2 }}
                    >
                        Iniciar Sessão
                    </Typography>
                    <form onSubmit={handleLogin}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <TextField
                                fullWidth
                                sx={{ maxWidth: "360px" }}
                                label="Email"
                                type="email"
                                variant="outlined"
                                required
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                fullWidth
                                sx={{ maxWidth: "360px" }}
                                label="Password"
                                type="password"
                                variant="outlined"
                                required
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ pt: 1, maxWidth: "360px" }}
                            >
                                Login
                            </Button>
                            <Button
                                variant="text"
                                size="small"
                                sx={{
                                    mt: 0.5,
                                    fontSize: "16px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    textTransform: "none",
                                    color: "text.secondary",
                                    maxWidth: "200px",
                                    padding: "0.1rem 0.5rem !important",
                                    "&:hover": {
                                        textDecoration: "underline",
                                        color: "primary.main",
                                    },
                                }}
                            >
                                Recuperar Password
                            </Button>
                        </Box>
                    </form>

                    <Box
                        sx={{
                            mt: 2,
                            pt: 1,
                            borderTop: 1,
                            borderColor: "divider",
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5, fontSize: "16px" }}
                        >
                            Ainda não tem conta?
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5, fontSize: "14px" }}
                        ></Typography>
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => router.visit("/registo")}
                            sx={{
                                mt: 0.5,
                                fontSize: "16px",
                                textAlign: "center",
                                cursor: "pointer",
                                textDecoration: "underline",
                                textTransform: "none",
                                color: "text.secondary",
                                maxWidth: "200px",
                                padding: "0.1rem 0.5rem !important",
                                "&:hover": {
                                    textDecoration: "underline",
                                    color: "primary.main",
                                },
                            }}
                        >
                            Faça aqui o seu registo
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
