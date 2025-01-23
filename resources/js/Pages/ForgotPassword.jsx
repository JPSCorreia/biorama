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
    // State to manage form data (email input)
    const [formData, setFormData] = useState({
        email: "",
    });

    // State to manage error messages
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    // State to track success message
    const [success, setSuccess] = useState(false);

    // Handle password recovery form submission
    const handleForgotPassword = (e) => {
        e.preventDefault();
        router.post("/recuperar-palavra-passe", formData, {
            onSuccess: () => {
                setSuccess(true);
                setFormData({ email: "" });
                setError("");
                setShowError(false);
            },
            onError: (errors) => {
                if (errors.email) {
                    setError(errors.email);
                } else {
                    setError(
                        "Ocorreu um erro ao enviar o email de recuperação.",
                    );
                }
                setShowError(true);
                setSuccess(false);
            },
        });
    };

    // Clear the error message automatically after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setShowError(false);
            }, 4500); // After 4.5 seconds, start the fade

            const clearTimer = setTimeout(() => {
                setError("");
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
            {/* Display error or success message */}
            {error ? (
                <Fade in={showError} timeout={{ enter: 50, exit: 500 }}>
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
                </Fade>
            ) : success ? (
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{
                        mb: 2,
                        height: "48px",
                        width: "100%",
                        maxWidth: "470px",
                    }}
                >
                    Email de recuperação enviado com sucesso!
                </Alert>
            ) : (
                <Box sx={{ mb: 2, height: "48px" }}></Box>
            )}

            {/* Password recovery form container */}
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
                            sx={{ fontSize: "16px" }}
                        >
                            Esqueceu-se da palavra-passe?
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, fontSize: "16px" }}
                        >
                            Insira o seu email para recuperar a sua conta.
                        </Typography>
                    </Box>

                    {/* Password recovery form */}
                    <form onSubmit={handleForgotPassword}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            {/* Email input field */}
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

                            {/* Submit button */}
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

                    {/* Section for user registration */}
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

                        {/* Link to registration page */}
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
