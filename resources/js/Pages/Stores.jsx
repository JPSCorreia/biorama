import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import {
    TextField,
    Button,
    Box,
    useTheme,
    Typography,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    useMediaQuery,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { router, usePage } from "@inertiajs/react";
import ReactDOMServer from "react-dom/server";
import { StoreSharp as StoreSharpIcon } from "@mui/icons-material";
import { hoverStore } from "../Stores";
import { AlertBox } from "../Components/";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import { StoreCardPesquisa } from "../Components/";

// Componente para ajustar o zoom dinamicamente
const FitMapToMarkers = ({ stores }) => {
    const map = useMap();

    useEffect(() => {
        if (stores.length > 0) {
            const bounds = L.latLngBounds(
                stores.map((store) => [
                    store.addresses[0].latitude,
                    store.addresses[0].longitude,
                ]),
            );
            map.fitBounds(bounds, { padding: [50, 50] }); // Ajusta com padding para evitar cortes
        }
    }, [stores, map]);

    return null;
};

// Ícone personalizado para o marcador
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

// Função para personalizar os clusters com contagem e cor dinâmica
const createClusterCustomIcon = (cluster) => {
    const count = cluster.getChildCount(); // Número de lojas agrupadas
    let color = "green"; // Cor padrão

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
                    boxShadow: `0 0 2px ${color}, 0 0 4px ${color}`,
                    textAlign: "center",
                }}
            >
                <StoreSharpIcon
                    fontSize="inherit"
                    style={{ fill: color, fontSize: "28px" }}
                />
                <span style={{ color: color, marginTop: "-4px" }}>{count}</span>
            </div>,
        ),
        className: "custom-cluster-icon",
        iconSize: [50, 50],
        iconAnchor: [25, 25],
    });
};

const Stores = observer(() => {
    const theme = useTheme();
    const [search, setSearch] = useState("");
    const [radius, setRadius] = useState(15);
    const [location, setLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState([39.5, -8.0]);
    const [zoom, setZoom] = useState(6);
    const stores = usePage().props.stores.data;
    const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));
    const smallerThanLarge = useMediaQuery(theme.breakpoints.down("lg"));
    const isLarger = useMediaQuery(theme.breakpoints.only("lg"));

    // Função para obter a localização do utilizador
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Erro ao obter localização:", error);
                },
            );
            handleSearch();
        } else {
            alert("Geolocalização não suportada no seu navegador.");
        }
    };

    const handleSearch = () => {
        router.get(
            "/lojas",
            {
                search,
                radius,
                latitude: location ? location.lat : null,
                longitude: location ? location.lng : null,
            },
            { preserveState: true },
        );
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mt: 2,
            }}
        >
            <AlertBox />
            {/* Pesquisa */}
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                }}
            >
                {/* Input de pesquisa */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: smallerThanMedium ? "column" : "row",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            maxWidth: "200px",
                            mb: smallerThanMedium ? 2 : 0,
                        }}
                    >
                        <TextField
                            label="Morada ou Distrito"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            spellCheck={false}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch(radius);
                                }
                            }}
                            sx={{
                                width: 300,
                                mr: 4,
                                "& .MuiInputBase-root": {
                                    height: "40px", // Ajusta a altura do input
                                },
                                "& .MuiInputLabel-root": {
                                    top: "-5px", // Ajusta a posição da label
                                    fontSize: "15px", // Ajusta o tamanho da label
                                },
                            }}
                        />

                    </Box>
                    {/* CheckBox e seletor de raio */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <FormControl sx={{ width: 130 }}>
                            <InputLabel id="demo-simple-select-label">
                                Raio(km)
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Raio(km)"
                                value={radius}
                                variant="outlined"
                                onChange={(e) => setRadius(e.target.value)}
                                sx={{
                                    height: 40,
                                    "& .MuiOutlinedInput-root": {
                                        height: "40px",
                                        display: "flex",
                                        alignItems: "center",
                                    },
                                }}
                            >
                                {[5, 10, 15, 30, 50, 100].map((km) => (
                                    <MenuItem key={km} value={km}>
                                        {km} km
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* Botões de pesquisa e localização */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        // width: "40%",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "secondary.button",
                            borderRadius:
                                smallerThanMedium || smallerThanLarge
                                    ? "50px"
                                    : "",
                        }}
                        onClick={() => handleSearch(radius)}
                    >
                        <SearchIcon />
                        <Typography
                            sx={{
                                display: smallerThanLarge ? "none" : "block",
                                ml: 1,
                            }}
                        >
                            Pesquisar
                        </Typography>
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: "primary.title",
                            borderRadius:
                                smallerThanMedium || smallerThanLarge
                                    ? "50px"
                                    : "",
                        }}
                        variant="contained"
                        onClick={getUserLocation}
                    >
                        <LocationOnIcon />
                        <Typography
                            sx={{
                                display: smallerThanLarge ? "none" : "block",
                                ml: 1,
                            }}
                        >
                            Usar a minha Localização
                        </Typography>
                    </Button>
                </Box>
            </Box>

            {/* Mapa */}
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
                    center={mapCenter}
                    zoom={zoom}
                    style={{ width: "100%", height: "500px" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {/* Ajusta o zoom automaticamente para incluir todos os markers */}
                    <FitMapToMarkers stores={stores} />
                    {location &&
                        (() => {
                            return (
                                <MarkerClusterGroup
                                    chunkedLoading
                                    maxClusterRadius={60} // Define a distância para agrupar markers
                                    iconCreateFunction={createClusterCustomIcon} // Personaliza a aparência dos clusters
                                    showCoverageOnHover={false} // Oculta os círculos ao passar o rato
                                >
                                    {stores.map((store) => {
                                        const isHovered =
                                            hoverStore.hoveredStoreId ===
                                            store.id;
                                        return (
                                            <Marker
                                                key={store.id}
                                                position={[
                                                    store.addresses[0].latitude,
                                                    store.addresses[0]
                                                        .longitude,
                                                ]}
                                                icon={createCustomIcon(
                                                    isHovered
                                                        ? theme.palette
                                                              .secondary.main
                                                        : theme.palette.primary
                                                              .main,
                                                )}
                                            >
                                                <Popup>{store.name}</Popup>
                                            </Marker>
                                        );
                                    })}
                                </MarkerClusterGroup>
                            );
                        })()}
                    <MarkerClusterGroup
                        chunkedLoading
                        maxClusterRadius={60} // Define a distância para agrupar markers
                        iconCreateFunction={createClusterCustomIcon} // Personaliza a aparência dos clusters
                        showCoverageOnHover={false} // Oculta os círculos ao passar o rato
                    >
                        {stores.map((store) => {
                            const isHovered =
                                hoverStore.hoveredStoreId === store.id;
                            return (
                                <Marker
                                    key={store.id}
                                    position={[
                                        store.addresses[0].latitude,
                                        store.addresses[0].longitude,
                                    ]}
                                    icon={createCustomIcon(
                                        isHovered
                                            ? theme.palette.secondary.main
                                            : theme.palette.primary.main,
                                    )}
                                >
                                    <Popup>{store.name}</Popup>
                                </Marker>
                            );
                        })}
                    </MarkerClusterGroup>
                </MapContainer>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                    width: "98%",
                    mt: 2,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontWeight: "bold",
                            fontSize: "2rem",
                            color: "primary.title",
                        }}
                    >
                        Resultado da Pesquisa
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10,
                        width: "100%",
                        mt: 2,
                        mb: 4,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {stores.length > 0 ? (
                        stores.map((store) => (
                            <StoreCardPesquisa key={store.id} store={store} />
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Nenhuma loja encontrada.
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
});

export default Stores;
