import { useState, useEffect } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Tooltip,
    useMap,
} from 'react-leaflet';
import { Box, CircularProgress, useTheme } from '@mui/material';
import StoreSharpIcon from '@mui/icons-material/StoreSharp';
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';

// Função para criar um ícone customizado com StoreSharpIcon e a cor do tema
const createCustomIcon = (color) => {
    const iconHtml = ReactDOMServer.renderToString(
        <div
            style={{
                fontSize: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: `1px solid ${color}`,
                borderRadius: '50%',
                padding: '4px',
                boxShadow: `0 0 8px ${color}, 0 0 16px ${color}, 0 0 24px ${color}`,
            }}
        >
            <StoreSharpIcon
                fontSize="inherit"
                style={{ fill: color, width: '1em', height: '1em' }}
            />
        </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: 'custom-marker-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
};

// Função para recentrar o mapa na posição
const SetViewOnPosition = ({ position }) => {
    const map = useMap();
    if (position) {
        map.setView(position, 12); // Ajusta o zoom para o nível desejado
    }
    return null;
};

const MapComponent = () => {
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
                    console.error('Não foi possível obter a localização.');
                    setLoadMap(true);
                }
            );
        } else {
            console.error('Geolocalização não é suportada neste navegador.');
            setLoadMap(true);
        }

        return () => clearTimeout(timeoutId);
    }, []);

    // Gera três posições fictícias próximas
// Gera cinco posições fictícias próximas
const generateNearbyStores = (center) => {
    const offset = 0.04; // Pequeno desvio para criar lojas próximas
    return [
        {
            position: [center[0] + offset, center[1] + offset],
            name: 'Loja Fictícia 1',
            description: 'Especializada em produtos locais e orgânicos.',
        },
        {
            position: [center[0] - offset, center[1] - offset],
            name: 'Loja Fictícia 2',
            description: 'Grande variedade de produtos artesanais.',
        },
        {
            position: [center[0] + offset, center[1] - offset],
            name: 'Loja Fictícia 3',
            description: 'Conhecida pelos seus alimentos frescos e sustentáveis.',
        },
        {
            position: [center[0] - offset * 1.5, center[1] + offset * 0.5],
            name: 'Loja Fictícia 4',
            description: 'Oferece uma variedade de frutas e vegetais frescos.',
        },
        {
            position: [center[0] + offset * 1.5, center[1] - offset * 0.5],
            name: 'Loja Fictícia 5',
            description: 'Loja local com produtos artesanais de alta qualidade.',
        },
    ];
};


    const nearbyStores = position ? generateNearbyStores(position) : [];

    return (
        <Box
            style={{
                height: '85%',
                width: '85%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {!loadMap ? (
                <CircularProgress
                    size={60}
                    style={{ color: theme.palette.primary.main }}
                />
            ) : (
                <MapContainer
                    center={position || [38.7071, -9.1355]} // Default para Lisboa enquanto espera a localização
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                    />
                    {position && (
                        <>
                            {/* Marcador para a posição do utilizador */}
                            {/* <Marker
                                position={position}
                            /> */}
                            {/* Marcadores para as lojas fictícias */}
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

export default MapComponent;

// propTypes
SetViewOnPosition.propTypes = {
    position: PropTypes.arrayOf(PropTypes.number),
};
