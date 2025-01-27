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
import { authStore } from "../Stores";
import { AlertBox } from "../Components";

const Register = () => {
    // State to manage registration form data
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        nif: "",
        password: "",
        password_confirmation: "",
    });

    // Function to handle form submission
    const handleRegister = (e) => {
        e.preventDefault();

        // Verify if the passwords match
        if (formData.password !== formData.password_confirmation) {
            return;
        }

        // Send registration data to the server
        router.post("/registar", formData, {
            onSuccess: (page) => {
                // Check if authentication was successful and update authentication store
                if (page.props.auth && page.props.auth.user) {
                    authStore.updateAuth(page.props.auth);
                    // console.log("Registration and login successful!"); // debug
                }
            },
            onError: (errors) => {
                // console.error("Registration errors:", errors); // debug
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
                    {/* Registration form title */}
                    <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
                        sx={{ mb: 2 }}
                    >
                        Crie a sua conta
                    </Typography>

                    {/* Registration form */}
                    <form onSubmit={handleRegister}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >

                            {/* First name input */}
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

                            {/* Last name input */}
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

                            {/* Email input */}
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

                            {/* NIF input */}
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

                            {/* Password inputs */}
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

                            {/* Submit button */}
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

                    {/* Section for existing users */}
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

                        {/* Link to login page */}
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
