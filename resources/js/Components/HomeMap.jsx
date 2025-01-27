import { useState, useEffect } from "react";
import axios from "axios";
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
import { router } from "@inertiajs/react";

// Criar um ícone customizado para o marcador das lojas
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

// Recentra o mapa na posição fornecida
const SetViewOnPosition = ({ position }) => {
    const map = useMap();
    if (position) {
        map.setView(position, 15); // Zoom level
    }
    return null;
};

const HomeMap = ({ radius }) => {
    const [position, setPosition] = useState(null); // Coordenadas do utilizador
    const [loading, setLoading] = useState(true);
    const [nearbyStores, setNearbyStores] = useState([]); // Lojas próximas
    const theme = useTheme();

    useEffect(() => {
        const fetchNearbyStores = async (latitude, longitude) => {
            try {
                const response = await axios.get("/stores/nearby", {
                    params: { latitude, longitude, radius },
                });
                setNearbyStores(response.data);
            } catch (err) {
                console.error(
                    "Erro ao buscar lojas próximas:",
                    err.response?.data?.message || err.message,
                );
            } finally {
                setLoading(false);
            }
        };

        // Obter a localização do utilizador
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    const { latitude, longitude } = coords;
                    setPosition([latitude, longitude]); // Define a posição do utilizador
                    fetchNearbyStores(latitude, longitude); // Buscar lojas próximas
                },
                () => {
                    console.error("Não foi possível obter a localização.");
                    setLoading(false);
                },
            );
        } else {
            console.error("Geolocalização não é suportada neste navegador.");
            setLoading(false);
        }
    }, [radius]);

    const navigate = (path) => {
        router.visit(path, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    console.log("Nearby Stores:", nearbyStores);

    return (
        <>
            {loading ? (
                <Box
                    sx={{
                        height: "400px",
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
                        height: "400px",
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
                        center={position || [38.7071, -9.1355]} // Default para Lisboa
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {position && (
                            <>
                                {/* Marcadores para as lojas próximas */}
                                {nearbyStores.slice(0, 5).map((store) => (
                                    <Marker
                                        key={store.id}
                                        position={[store.latitude, store.longitude]}
                                        icon={createCustomIcon(
                                            theme.palette.primary.main,
                                        )}
                                        eventHandlers={{
                                            click: () => {
                                                navigate(`/loja/${store.id}`);
                                            },
                                        }}
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
                </Box>
            )}
        </>
    );
};

HomeMap.propTypes = {
    radius: PropTypes.number.isRequired, // Raio de busca (em km)
};

export default HomeMap;
