import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
} from "@mui/material";
import { useState } from "react";
import { router } from '@inertiajs/react';
import { alpha } from '@mui/material/styles';
import { authStore } from '../Stores';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleLogin = (e) => {
        e.preventDefault();
    
        router.post('/login', formData, {
            onSuccess: (page) => {
                console.log('Login response:', page);
                
                if (page.props.auth && page.props.auth.user) {
                    authStore.setAuth(true);
                    authStore.setUser(page.props.auth.user);
                    console.log("Login successful with user:", page.props.auth.user);
                } else {
                    console.warn("Login successful but no user data received");
                }
            },
            onError: (errors) => {
                console.error("Login errors:", errors);
            },
        });
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    marginTop: "10%",
                }}
            >
                <Paper
                    elevation={1}
                    sx={{
                        p: 4,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: (theme) => alpha(theme.palette.background.default, 0.85),
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>
                    <form onSubmit={handleLogin}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                variant="outlined"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="outlined"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ mt: 2 }}
                            >
                                Login
                            </Button>
                        </Box>
                    </form>
                    
                    <Box 
                        sx={{ 
                            mt: 3, 
                            pt: 2, 
                            borderTop: 1, 
                            borderColor: 'divider',
                            textAlign: 'center' 
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Ainda não tem uma conta?
                        </Typography>
                        <Button
                            onClick={() => router.visit('/registo')}
                            variant="text"
                            sx={{ mt: 1 }}
                        >
                            Registar-se
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login; 