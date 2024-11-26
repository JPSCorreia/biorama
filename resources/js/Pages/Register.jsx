import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Grid,
    Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { authStore } from "../Stores";

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleRegister = (e) => {
        e.preventDefault();

        router.post("/registar", formData, {
            onSuccess: (page) => {
                if (page.props.auth && page.props.auth.user) {
                    authStore.setAuth(true);
                    authStore.setUser(page.props.auth.user);
                    console.log("Registration and login successful!");
                }
            },
            onError: (errors) => {
                console.error("Registration errors:", errors);
            },
        });
    };

    return (
        <Container
            maxWidth="sm"
            sx={{ display: "flex", justifyContent: "center" }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    maxWidth: "470px",
                    marginTop: "20%",
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
                        Registo de novo utilizador
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
                            <TextField
                                fullWidth
                                sx={{ maxWidth: "360px" }}
                                label="Confirmar Password"
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
                                Registar
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
                            onClick={() => router.visit("/entrar")}
                            variant="outlined"
                            sx={{ mt: 1, pt: 1, maxWidth: "160px" }}
                        >
                            Aceder á conta
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register;
