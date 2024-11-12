import { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { Box, CircularProgress, useTheme } from "@mui/material";
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
import PropTypes from "prop-types";

// Create custom leaflet store icon function.
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
        </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: "custom-marker-icon",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
};

// Recenter map function.
const SetViewOnPosition = ({ position }) => {
    const map = useMap();
    if (position) {
        map.setView(position, 12); // Zoom level
    }
    return null;
};

const HomeMap = () => {
    const [position, setPosition] = useState(null);
    const [loadMap, setLoadMap] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        const timeoutId = setTimeout(() => setLoadMap(true), 5000);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    const { latitude, longitude } = location.coords;
                    setPosition([latitude, longitude]);
                    setLoadMap(true);
                    clearTimeout(timeoutId);
                },
                () => {
                    console.error("Não foi possível obter a localização.");
                    setLoadMap(true);
                }
            );
        } else {
            console.error("Geolocalização não é suportada neste navegador.");
            setLoadMap(true);
        }

        return () => clearTimeout(timeoutId);
    }, []);

    // Generate 5 fictious stores (//TODO: remove later).
    const generateNearbyStores = (center) => {
        const offset = 0.04; // Pequeno desvio para criar lojas próximas
        return [
            {
                position: [center[0] + offset, center[1] + offset],
                name: "Loja Fictícia 1",
                description: "Especializada em produtos locais e orgânicos.",
            },
            {
                position: [center[0] - offset, center[1] - offset],
                name: "Loja Fictícia 2",
                description: "Grande variedade de produtos artesanais.",
            },
            {
                position: [center[0] + offset, center[1] - offset],
                name: "Loja Fictícia 3",
                description:
                    "Conhecida pelos seus alimentos frescos e sustentáveis.",
            },
            {
                position: [center[0] - offset * 1.5, center[1] + offset * 0.5],
                name: "Loja Fictícia 4",
                description:
                    "Oferece uma variedade de frutas e vegetais frescos.",
            },
            {
                position: [center[0] + offset * 1.5, center[1] - offset * 0.5],
                name: "Loja Fictícia 5",
                description:
                    "Loja local com produtos artesanais de alta qualidade.",
            },
        ];
    };

    const nearbyStores = position ? generateNearbyStores(position) : [];

    return (
        <Box
            sx={{
                height: "85%",
                width: "85%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {!loadMap ? (
                <CircularProgress
                    size={60}
                    sx={{ color: theme.palette.primary.main }}
                />
            ) : (
                <MapContainer
                    center={position || [38.7071, -9.1355]} // Default to Lisbon without location.
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {position && (
                        <>
                            {/* Geolocation Marker */}
                            {/* <Marker
                                position={position}
                            /> */}
                            {nearbyStores.map((store, index) => (
                                <Marker
                                    key={index}
                                    position={store.position}
                                    icon={createCustomIcon(
                                        theme.palette.primary.main
                                    )}
                                >
                                    <Tooltip
                                        direction="top"
                                        offset={[0, -10]}
                                        opacity={1}
                                    >
                                        <div>
                                            <strong>{store.name}</strong>
                                            <br />
                                            {store.description}
                                        </div>
                                    </Tooltip>
                                </Marker>
                            ))}
                            <SetViewOnPosition position={position} />
                        </>
                    )}
                </MapContainer>
            )}
        </Box>
    );
};

export default HomeMap;

SetViewOnPosition.propTypes = {
    position: PropTypes.arrayOf(PropTypes.number),
};
