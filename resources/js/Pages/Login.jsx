import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
} from "@mui/material";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { alpha } from "@mui/material/styles";
import { authStore } from "../Stores";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

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
                console.error("Login errors:", errors);
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
                                    maxWidth: "170px",
                                    padding: "0.25rem !important",
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
                        >
                            Faça o seu registo e aceda a a todas as
                            funcionalidades da Biorama.
                        </Typography>

                        <Button
                            onClick={() => router.visit("/registo")}
                            variant="outlined"
                            sx={{ mt: 1, pt: 1, maxWidth: "130px" }}
                        >
                            Criar Conta
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
