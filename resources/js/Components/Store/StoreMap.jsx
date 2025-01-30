import { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import {
    Paper,
    Box,
    CircularProgress,
    Typography,
    useTheme,
    useMediaQuery,
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
        map.setView(position, 16); // Zoom
    }
    return null;
};

const StoreMap = ({ store, address }) => {
    const theme = useTheme();

    const smallerThanMediumScreen = useMediaQuery(theme.breakpoints.down("md"));


    // Verificar se a loja tem coordenadas
    const storePosition =
        store.latitude && store.longitude
            ? [store.latitude, store.longitude]
            : null;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "300px",
                flexGrow: 1,
                ml: smallerThanMediumScreen? 0 : 4,
                borderRadius: "10px",
                mt: smallerThanMediumScreen ? 4 : 0,
            }}
        >
            {!storePosition ? (
                <Box
                    sx={{
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
                        height: "100%",
                        minHeight: "300px",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "8px",
                        padding: "2px",
                        border: `1px solid ${theme.palette.primary.main}`,
                    }}
                >
                    <MapContainer
                        center={storePosition} // Centraliza no marcador da loja
                        zoom={13}
                        style={{ height: smallerThanMediumScreen? "300px" : "100%", width: "100%" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {/* Marcador da loja */}
                        <Marker
                            position={storePosition}
                            icon={createCustomIcon(theme.palette.primary.main)}
                        >
                            <Tooltip
                                direction="right"
                                offset={[20, -10]}
                                opacity={1}
                                permanent={true}
                            >
                                <div>
                                    <strong>{store.name}</strong>
                                    <br />
                                    {address.street_address || "Loja"}
                                </div>
                            </Tooltip>
                        </Marker>
                        <SetViewOnPosition position={storePosition} />
                    </MapContainer>
                </Box>
            )}
            <Typography
                variant="body1"
                sx={{ mt: 2, mb: 0.25 }}
            >
                {address.street_address}, {address.postal_code} - {address.city}
            </Typography>
        </Box>
    );
};

export default StoreMap;
