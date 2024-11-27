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

const ForgotPassword = () => {

    const [formData, setFormData] = useState({
        email: ""
    });

    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const handleForgotPassword = (e) => {
        e.preventDefault();

        router.post("/recuperar-palavra-passe", formData, {
            onSuccess: (page) => {
                // TODO: talvez redirecionar para uma página de sucesso
            },
            onError: (errors) => {
                console.error("Registration errors:", errors);

                // Verify if the error is due to an email not existing
                if (
                    errors.email ===
                    "email nao existe" // TODO: alterar para o erro correto
                ) {
                    setError(
                        "Erro ao enviar email. Verifique o email inserido."
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
                        Recuperar Palavra-Passe
                    </Typography>
                    <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                    <Typography
                            variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "16px"}}
                    >
                        Esqueceu-se da palavra-passe?
                    </Typography>
                    <Typography
                            variant="body2"
                        color="text.secondary"
                        sx={{  mb:2, fontSize: "16px"}}
                    >
                       Insira o seu email para recuperar a sua conta.
                        </Typography>
                    </Box>
                    <form onSubmit={handleForgotPassword}>
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
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ pt: 1, maxWidth: "360px" }}
                            >
                                Mandar Email
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

export default ForgotPassword;
