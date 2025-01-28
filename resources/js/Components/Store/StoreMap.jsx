import { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import {
    Paper,
    Box,
    CircularProgress,
    Typography,
    useTheme,
} from "@mui/material";
import { StoreSharp as StoreSharpIcon } from "@mui/icons-material";
import {
    MapContainer,
    TileLayer,
    Marker,
    Tooltip,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Criação de um ícone customizado para a loja
const createCustomIcon = (color) => {
    const iconHtml = ReactDOMServer.renderToString(
        <div
            style={{
                fontSize: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: `1px solid ${color}`,
                borderRadius: "50%",
                padding: "4px",
                boxShadow: `0 0 8px ${color}, 0 0 16px ${color}, 0 0 24px ${color}`,
            }}
        >
            <StoreSharpIcon
                fontSize="inherit"
                style={{ fill: color, width: "1em", height: "1em" }}
            />
        </div>,
    );

    return L.divIcon({
        html: iconHtml,
        className: "custom-marker-icon",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
};

// Função para recentrar o mapa
const SetViewOnPosition = ({ position }) => {
    const map = useMap();
    if (position) {
        map.setView(position, 15); // Zoom
    }
    return null;
};

const StoreMap = ({ store }) => {
    const theme = useTheme();

    // Verificar se a loja tem coordenadas
    const storePosition =
        store.latitude && store.longitude
            ? [store.latitude, store.longitude]
            : null;

    return (
        <Paper
            elevation={4}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "30%",
                ml: 1,
                padding: 3,
                pt: 2,
                borderRadius: "10px",
            }}
        >
            <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: 1 }}
            >
                Localização
            </Typography>
            {!storePosition ? (
                <Box
                    sx={{
                        height: "300px",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress
                        size={60}
                        sx={{ color: theme.palette.primary.main }}
                    />
                </Box>
            ) : (
                <Box
                    sx={{
                        height: "300px",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "2px",
                        padding: "1px",
                        border: `1px solid ${theme.palette.primary.main}`,
                    }}
                >
                    <MapContainer
                        center={storePosition} // Centraliza no marcador da loja
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {/* Marcador da loja */}
                        <Marker
                            position={storePosition}
                            icon={createCustomIcon(theme.palette.primary.main)}
                        >
                            <Tooltip
                                direction="top"
                                offset={[0, -10]}
                                opacity={1}
                            >
                                <div>
                                    <strong>{store.name}</strong>
                                    <br />
                                    {store.description || "Loja"}
                                </div>
                            </Tooltip>
                        </Marker>
                        <SetViewOnPosition position={storePosition} />
                    </MapContainer>
                </Box>
            )}
        </Paper>
    );
};

export default StoreMap;
