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
import { router, usePage } from "@inertiajs/react";

const ResetPassword = () => {
    const { token, email } = usePage().props;
    const [formData, setFormData] = useState({
        email: email || "",
        password: "",
        password_confirmation: "",
        token: token,
    });

    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const handleResetPassword = (e) => {
        e.preventDefault();

        router.post("/reset-password", formData, {
            onSuccess: () => {
                router.visit("/entrar");
            },
            onError: (errors) => {
                if (errors.email) {
                    setError(errors.email);
                } else if (errors.password) {
                    setError(errors.password);
                } else {
                    setError("Ocorreu um erro ao redefinir a palavra-passe.");
                }
                setShowError(true);
            },
        });
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setShowError(false);
            }, 4500);

            const clearTimer = setTimeout(() => {
                setError("");
            }, 5000);

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
                        Redefinir Palavra-passe
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
                            sx={{ mb: 2, fontSize: "16px" }}
                        >
                            Insira a sua nova palavra-passe
                        </Typography>
                    </Box>
                    <form onSubmit={handleResetPassword}>
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
                                label="Nova Palavra-passe"
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
                                label="Confirmar Palavra-passe"
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
                                Redefinir Palavra-passe
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
                            Voltar para o login
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default ResetPassword;