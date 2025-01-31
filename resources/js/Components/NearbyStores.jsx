import { useState, useEffect } from "react";
import axios from "axios";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { HomeStoreCard } from "./";

export const NearbyStores = ({ radius }) => {
    // const [position, setPosition] = useState(null); // Localização do utilizador
    const [nearbyStores, setNearbyStores] = useState([]); // Lojas próximas
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Mensagem de erro
    const theme = useTheme();

    useEffect(() => {
        const fetchNearbyStores = async (latitude, longitude) => {
            try {
                const response = await axios.get("/stores/nearby", {
                    params: { latitude, longitude, radius: radius },
                });
                setNearbyStores(response.data);
                setLoading(false);
            } catch (err) {
                console.error(
                    "Erro ao buscar lojas próximas:",
                    err.response?.data?.message || err.message,
                );
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    const { latitude, longitude } = coords;
                    // setPosition({ latitude, longitude });
                    fetchNearbyStores(latitude, longitude);
                },
                () => {
                    setError("Não foi possível obter a localização.");
                    setLoading(false);
                },
            );
        } else {
            setError("Geolocalização não é suportada neste navegador.");
            setLoading(false);
        }
    }, [radius]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "60%",
                    minWidth: "300px",
                    minHeight: "500px",
                }}
            >
                <CircularProgress
                    size={60}
                    sx={{ color: theme.palette.primary.main }}
                />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    textAlign: "center",
                    color: theme.palette.error.main,
                    padding: 2,
                }}
            >
                <Typography variant="body1">{error}</Typography>
            </Box>
        );
    }

    if (!nearbyStores.length) {
        return (
            <Box sx={{ textAlign: "center", padding: 2 }}>
                <Typography variant="body1">
                    Nenhuma loja encontrada próxima de si.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "60%",
                alignItems: "center",
                mr: 2,
                mt: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px",
                    justifyContent: "space-between",
                }}
            >
                {nearbyStores.slice(0, 6).map((store) => (
                    <HomeStoreCard key={store.id} store={store} />
                ))}
            </Box>
        </Box>
    );
};

export default NearbyStores;
