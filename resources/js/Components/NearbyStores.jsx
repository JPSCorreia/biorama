import { useState, useEffect } from "react";
import axios from "axios";
import { Box, CircularProgress, Typography, Grid, useTheme } from "@mui/material";

export const NearbyStores = ({ radius }) => {
    const [position, setPosition] = useState(null); // Localização do utilizador
    const [nearbyStores, setNearbyStores] = useState([]); // Lojas próximas
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Mensagem de erro
    const theme = useTheme();

    useEffect(() => {
        const fetchNearbyStores = async (latitude, longitude) => {
            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);
            try {
                const response = await axios.get("/stores/nearby", {
                    params: { latitude, longitude, radius: radius },
                });
                setNearbyStores(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao buscar lojas próximas:", err.response?.data?.message || err.message);
            }
        };


        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    const { latitude, longitude } = coords;
                    setPosition({ latitude, longitude });
                    fetchNearbyStores(latitude, longitude);
                },
                () => {
                    console.error("Não foi possível obter a localização.");
                    setError("Não foi possível obter a localização.");
                    setLoading(false);
                }
            );
        } else {
            console.error("Geolocalização não é suportada neste navegador.");
            setError("Geolocalização não é suportada neste navegador.");
            setLoading(false);
        }
    }, [radius]);

    if (loading) {
        return (
            console.log("Loading"),
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
            </Box>
        );
    }

    if (error) {
        return (
            console.log("Error"),
            <Box sx={{ textAlign: "center", color: theme.palette.error.main, padding: 2 }}>
                <Typography variant="body1">{error}</Typography>
            </Box>
        );
    }

    if (!nearbyStores.length) {
        return (
            console.log("No stores"),
            <Box sx={{ textAlign: "center", padding: 2 }}>
                <Typography variant="body1">Nenhuma loja encontrada próxima de si.</Typography>
            </Box>
        );
    }

    return (
        console.log("Stores"),
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Lojas perto de si
            </Typography>
            <Grid container spacing={2}>
                {nearbyStores.map((store) => (
                    console.log(store.id),
                    <Grid item xs={12} sm={6} md={4} key={store.id}>
                        <Box
                            sx={{
                                border: `1px solid ${theme.palette.primary.main}`,
                                borderRadius: "8px",
                                padding: 2,
                                boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
                            }}
                        >
                            <Typography variant="h6">{store.name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                                {store.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Distância: {(store.distance / 1000).toFixed(2)} km
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default NearbyStores;
