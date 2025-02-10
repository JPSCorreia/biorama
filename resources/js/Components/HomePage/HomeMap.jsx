import { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import {Box, Typography, useTheme} from "@mui/material";
import ReactDOMServer from "react-dom/server";
import StoreSharpIcon from "@mui/icons-material/StoreSharp";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { router } from "@inertiajs/react"; // Importa o router do Inertia
import { nearbyShopStore } from "../../Stores/nearbyShopStore";
import { toJS } from "mobx";

// Ícone para a localização do utilizador
const userLocationIcon = L.divIcon({
    html: ReactDOMServer.renderToString(
        <div
            style={{
                fontSize: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <MyLocationIcon
                fontSize="inherit"
                style={{ fill: "blue", width: "1em", height: "1em" }}
            />
        </div>
    ),
    className: "user-location-icon",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});

// Função para obter coordenadas de um store (retorna [lat, lng] ou null)
const getCoordinates = (store) => {
    if (store.addresses && store.addresses.length > 0) {
        const latitude = parseFloat(store.addresses[0].latitude);
        const longitude = parseFloat(store.addresses[0].longitude);
        if (!isNaN(latitude) && !isNaN(longitude)) {
            return [latitude, longitude];
        }
    }
    return null;
};

// Componente para ajustar dinamicamente o mapa aos marcadores
const FitMapToMarkers = ({ stores }) => {
    const map = useMap();
    useEffect(() => {
        if (stores.length > 0) {
            const validCoords = stores.map(getCoordinates).filter((coords) => coords !== null);
            if (validCoords.length > 0) {
                const bounds = L.latLngBounds(validCoords);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [stores, map]);
    return null;
};

// Ícone personalizado para marcadores individuais (sem boxShadow)
const createCustomIcon = (color) => {
    return L.divIcon({
        html: ReactDOMServer.renderToString(
            <div
                style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    border: `1px solid ${color}`,
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#ffffff",
                    textAlign: "center",
                }}
            >
                <StoreSharpIcon
                    fontSize="inherit"
                    style={{ fill: color, fontSize: "28px" }}
                />
            </div>
        ),
        className: "custom-marker-icon",
        iconSize: [36, 36],
        iconAnchor: [25, 25],
    });
};

// Ícone personalizado para clusters (sem boxShadow)
const createClusterCustomIcon = (cluster) => {
    const color = "#388e3c";
    const count = cluster.getChildCount();
    return L.divIcon({
        html: ReactDOMServer.renderToString(
            <div
                style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    border: `1px solid ${color}`,
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#ffffffa9",
                    textAlign: "center",
                }}
            >
                <StoreSharpIcon
                    fontSize="inherit"
                    style={{ fill: color, fontSize: "28px" }}
                />
                <span style={{ color: color, marginTop: "-4px" }}>{count}</span>
            </div>
        ),
        className: "custom-cluster-icon",
        iconSize: [25, 25],
        iconAnchor: [25, 25],
    });
};

const HomeMap = observer(() => {
    const [position, setPosition] = useState(null);
    const [mapCenter, setMapCenter] = useState([38.7071, -9.1355]); // Centro padrão para Lisboa
    const mapRef = useRef(null);
    const theme = useTheme();

    const nearbyStores = toJS(nearbyShopStore.nearbyStores) || [];

    if (!Array.isArray(nearbyStores)) {
        return <Typography>Nenhuma loja encontrada.</Typography>;
    }

    if (nearbyShopStore.loading) {
        return <Typography>A carregar lojas...</Typography>;
    }

    if (!nearbyStores.length) {
        return <Typography>Nenhuma loja encontrada.</Typography>;
    }

    // Define o centro do mapa com base nas lojas próximas
    useEffect(() => {
        if (nearbyShopStore.nearbyStores.length > 0) {
            const validStores = nearbyShopStore.nearbyStores.filter(
                (store) => getCoordinates(store) !== null
            );
            if (validStores.length > 0) {
                const avgLat =
                    validStores.reduce((sum, store) => sum + getCoordinates(store)[0], 0) /
                    validStores.length;
                const avgLng =
                    validStores.reduce((sum, store) => sum + getCoordinates(store)[1], 0) /
                    validStores.length;
                setMapCenter([avgLat, avgLng]);
            }
        }
    }, [nearbyShopStore.nearbyStores]);

    return (
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
                ref={mapRef}
                center={mapCenter}
                zoom={14}
                style={{ height: "100%", width: "100%", minHeight: "300px", minWidth: "300px" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Ajusta o mapa para incluir todos os marcadores */}
                <FitMapToMarkers stores={nearbyShopStore.allStores} />

                {/* Marcador da localização do utilizador */}
                {position && <Marker position={position} icon={userLocationIcon} />}

                {/* Agrupamento de marcadores */}
                <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
                    {/* Marcadores de todas as lojas */}
                    {nearbyShopStore.allStores.map((store) => {
                        const coords = getCoordinates(store);
                        return coords ? (
                            <Marker
                                key={store.id}
                                position={coords}
                                icon={createCustomIcon(theme.palette.primary.light)}
                                eventHandlers={{
                                    click: () => {
                                        // Navega para a página da loja usando router.visit
                                        router.visit(`/loja/${store.id}`);
                                    },
                                }}
                            >
                                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                                    <div>
                                        <strong>{store.name}</strong>
                                    </div>
                                </Tooltip>
                            </Marker>
                        ) : null;
                    })}

                    {/* Marcadores das lojas próximas destacadas */}
                    {nearbyShopStore.nearbyStores.map((store) => {
                        const coords = getCoordinates(store);
                        return coords ? (
                            <Marker
                                key={`nearby-${store.id}`}
                                position={coords}
                                icon={createCustomIcon(theme.palette.primary.main)}
                                eventHandlers={{
                                    click: () => {
                                        router.visit(`/loja/${store.id}`);
                                    },
                                }}
                            >
                                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                                    <div>
                                        <strong>{store.name}</strong>
                                    </div>
                                </Tooltip>
                            </Marker>
                        ) : null;
                    })}
                </MarkerClusterGroup>
            </MapContainer>
        </Box>
    );
});

export default HomeMap;
