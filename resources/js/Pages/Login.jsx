import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Alert,
    Paper,
    Fade,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { observer } from "mobx-react";
import { homeAddressStore } from "../Stores";
import { AlertBox } from "../Components";

const Login = observer(() => {
    // State to manage login form data
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: true, // Default 'remember me' option
    });

    // State to manage error messages
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    // Function to handle login submission
    const handleLogin = (e) => {
        e.preventDefault();

        router.post("/entrar", formData, {
            onSuccess: () => {
                homeAddressStore.addresses = homeAddressStore.fetchAddresses();
                // console.log("Login successful"); // For debugging
            },
            onError: (errors) => {
                console.error("Login errors:", errors);

                // Handle login errors based on API response
                if (
                    errors.email ===
                    "The provided credentials do not match our records."
                ) {
                    setError(
                        "Erro ao iniciar sessão. Verifique o email e a palavra-passe.",
                    );
                } else {
                    setError("Ocorreu um erro inesperado. Tente novamente.");
                }
                setShowError(true); // Display error alert
            },
        });
    };

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
            <AlertBox />
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
                    {/* Login form title */}
                    <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
                        sx={{ mb: 2 }}
                    >
                        Iniciar Sessão
                    </Typography>

                    {/* Login form */}
                    <form onSubmit={handleLogin}>
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

                            {/* Password input field */}
                            <TextField
                                fullWidth
                                sx={{ maxWidth: "360px" }}
                                label="Password"
                                type="password"
                                variant="outlined"
                                required
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                            />

                            {/* Remember me checkbox */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.remember}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                remember: e.target.checked,
                                            })
                                        }
                                        name="remember"
                                    />
                                }
                                label="Manter-me ligado"
                            />

                            {/* Submit button */}
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ pt: 1, maxWidth: "360px" }}
                            >
                                Login
                            </Button>

                            {/* Link to password recovery page */}
                            <Button
                                variant="text"
                                size="small"
                                onClick={() =>
                                    router.visit("/recuperar-palavra-passe")
                                }
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
});

export default Login;
