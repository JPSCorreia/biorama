import { useState, useEffect } from "react";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { StoreSharp as StoreSharpIcon, MyLocation as MyLocationIcon } from "@mui/icons-material";
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
import { hoverStore } from "../../Stores/";
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

// Criar um ícone padrão para a localização do utilizador
const userLocationIcon = L.divIcon({
    html: ReactDOMServer.renderToString(
        <div style={{ fontSize: "24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <MyLocationIcon fontSize="inherit" style={{ fill: "blue", width: "1em", height: "1em" }} />
        </div>,
    ),
    className: "user-location-icon",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});

// Componente para recentrar o mapa na posição fornecida
const SetViewOnPosition = ({ position }) => {
    const map = useMap();
    if (position) {
        map.setView(position, 11); // Zoom level
    }
    return null;
};

const HomeMap = observer(({ radius }) => {
    const [position, setPosition] = useState(null); // Coordenadas do utilizador
    const [mapCenter, setMapCenter] = useState(null); // Centro do mapa baseado nas lojas
    const [loading, setLoading] = useState(true);
    const [nearbyStores, setNearbyStores] = useState([]);
    const theme = useTheme();

    useEffect(() => {
        const fetchNearbyStores = async (latitude, longitude) => {
            try {
                const response = await axios.get("/stores/nearby", {
                    params: { latitude, longitude, radius },
                });

                const limitedStores = response.data.slice(0, 6); // Apenas as 6 primeiras lojas mais próximas
                setNearbyStores(limitedStores);

                // Calcular a posição média das 6 primeiras lojas
                if (limitedStores.length > 0) {
                    const avgLat = limitedStores.reduce((sum, store) => sum + store.latitude, 0) / limitedStores.length;
                    const avgLng = limitedStores.reduce((sum, store) => sum + store.longitude, 0) / limitedStores.length;
                    setMapCenter([avgLat, avgLng]);
                } else {
                    setMapCenter([latitude, longitude]); // Se não houver lojas, fica na posição do utilizador
                }
            } catch (err) {
                console.error("Erro ao buscar lojas próximas:", err.response?.data?.message || err.message);
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
                        height: "100%",
                        width: "100%",
                        minHeight: "300px",
                        minWidth: "300px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                    }}
                >
                    <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
                </Box>
            ) : (
                <Box
                    sx={{
                        height: "100%",
                        width: "100%",
                        minHeight: "300px",
                        minWidth: "300px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "6px",
                        padding: "2px",
                        border: `1px solid ${theme.palette.primary.main}`,
                    }}
                >
                    <MapContainer
                        center={mapCenter || [38.7071, -9.1355]} // Default para Lisboa
                        zoom={14}
                        style={{ height: "100%", width: "100%", minHeight: "300px", minWidth: "300px" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {/* Marcador do utilizador */}
                        {position && <Marker position={position} icon={userLocationIcon} />}

                        {/* Marcadores das lojas */}
                        {nearbyStores.map((store) => {
                            const isHovered = hoverStore.hoveredStoreId === store.id;
                            return (
                                <Marker
                                    key={store.id}
                                    position={[store.latitude, store.longitude]}
                                    icon={createCustomIcon(
                                        isHovered ? theme.palette.secondary.main : theme.palette.primary.main
                                    )}
                                    eventHandlers={{
                                        click: () => navigate(`/loja/${store.id}`),
                                        mouseover: () => hoverStore.setHoveredStore(store.id),
                                        mouseout: () => hoverStore.setHoveredStore(null),
                                    }}
                                >
                                    {isHovered && (
                                        <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                                            <div><strong>{store.name}</strong></div>
                                        </Tooltip>
                                    )}
                                </Marker>
                            );
                        })}

                        {/* Recentra no ponto médio das 6 primeiras lojas */}
                        {mapCenter && <SetViewOnPosition position={mapCenter} />}
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
