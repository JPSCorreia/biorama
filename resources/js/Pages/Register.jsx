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
import { alpha } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { authStore } from "../Stores";

const Register = () => {

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        nif: "",
        password: "",
        password_confirmation: "",
    });

    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const handleRegister = (e) => {
        e.preventDefault();

        // Verify if the passwords match
        if (formData.password !== formData.password_confirmation) {
            setError("As palavras-passe não coincidem. Tente novamente.");
            setShowError(true);
            return;
        }

        // Clear the error before submitting the form
        setError("");
        setShowError(false);

        router.post("/registar", formData, {
            onSuccess: (page) => {
                if (page.props.auth && page.props.auth.user) {
                    authStore.updateAuth(page.props.auth);
                    console.log("Registration and login successful!");
                }
            },
            onError: (errors) => {
                console.error("Registration errors:", errors);

                // Verify if the error is due to an email already registered
                if (errors.email) {
                    setError("Já existe uma conta com este email.  Utilize outro email.");
                    setShowError(true);
                } else if (errors.password === "The password field must be at least 8 characters.") {
                    setError("A palavra-passe deve ter pelo menos 8 caracteres.");
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
                    elevation={8}
                    sx={{
                        p: 2,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "card.background",
                    }}
                >
                    <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
                        sx={{ mb: 2 }}
                    >
                        Crie a sua conta
                    </Typography>

                    <form onSubmit={handleRegister}>
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
                                label="Primeiro nome"
                                variant="outlined"
                                required
                                value={formData.first_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        first_name: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                fullWidth
                                sx={{ maxWidth: "360px" }}
                                label="Ultimo nome"
                                variant="outlined"
                                required
                                value={formData.last_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        last_name: e.target.value,
                                    })
                                }
                            />
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
                                label="Nif"
                                variant="outlined"
                                required
                                value={formData.nif}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nif: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                fullWidth
                                sx={{ maxWidth: "360px" }}
                                label="Palavra-passe"
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
                            <TextField
                                fullWidth
                                sx={{ maxWidth: "360px" }}
                                label="Confirmar palavra-passe"
                                type="password"
                                variant="outlined"
                                required
                                value={formData.password_confirmation}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password_confirmation: e.target.value,
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
                                Criar conta
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
                            Já tem uma conta?
                        </Typography>

                        <Button
                            variant="text"
                            size="small"
                            onClick={() => router.visit("/entrar")}
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
                            Iniciar sessão
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register;
