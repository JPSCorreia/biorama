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
import { hoverStore } from "../Stores";
import { observer } from "mobx-react-lite";

// Criar um ícone customizado para o marcador das lojas
const createCustomIcon = (color) => {
    return L.divIcon({
        html: ReactDOMServer.renderToString(
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
        ),
        className: "custom-marker-icon",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
};

// Recentra o mapa na posição fornecida
const SetViewOnPosition = ({ position }) => {
    const map = useMap();
    if (position) {
        map.setView(position, 14); // Zoom level
    }
    return null;
};

const HomeMap = observer(({ radius }) => {
    const [position, setPosition] = useState(null); // Coordenadas do utilizador
    const [loading, setLoading] = useState(true);
    const [nearbyStores, setNearbyStores] = useState([]);
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

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    const { latitude, longitude } = coords;
                    setPosition([latitude, longitude]); // Define a posição do utilizador
                    fetchNearbyStores(latitude, longitude);
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

    return (
        <>
            {loading ? (
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
                        height: "250px",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "6px",
                        padding: "2px",
                        border: `1px solid ${theme.palette.primary.main}`,
                    }}
                >
                    <MapContainer
                        center={position || [38.7071, -9.1355]} // Default para Lisboa
                        zoom={14}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {position && (
                            <>
                                {nearbyStores.slice(0, 6).map((store) => {
                                    const isHovered =
                                        hoverStore.hoveredStoreId === store.id;

                                    return (
                                        <Marker
                                            key={store.id}
                                            position={[
                                                store.latitude,
                                                store.longitude,
                                            ]}
                                            icon={createCustomIcon(
                                                isHovered
                                                    ? theme.palette.secondary
                                                          .main // Cor diferente no hover
                                                    : theme.palette.primary
                                                          .main,
                                            )}
                                            eventHandlers={{
                                                click: () => {
                                                    navigate(
                                                        `/loja/${store.id}`,
                                                    );
                                                },
                                                mouseover: () => {
                                                    hoverStore.setHoveredStore(
                                                        store.id,
                                                    );
                                                },
                                                mouseout: () => {
                                                    hoverStore.setHoveredStore(
                                                        null,
                                                    );
                                                },
                                            }}
                                        >
                                            {isHovered && (
                                                <Tooltip
                                                    direction="top"
                                                    offset={[0, -10]}
                                                    opacity={1}
                                                    permanent
                                                >
                                                    <div>
                                                        <strong>
                                                            {store.name}
                                                        </strong>
                                                    </div>
                                                </Tooltip>
                                            )}
                                        </Marker>
                                    );
                                })}
                                <SetViewOnPosition position={position} />
                            </>
                        )}
                    </MapContainer>
                </Box>
            )}
        </>
    );
});

HomeMap.propTypes = {
    radius: PropTypes.number.isRequired,
};

export default HomeMap;
