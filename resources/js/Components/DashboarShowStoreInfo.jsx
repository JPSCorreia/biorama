import {
    Avatar,
    Button,
    Paper,
    Typography,
    Box,
    Divider, useMediaQuery,
} from "@mui/material";
import {observer} from "mobx-react";
import Carousel from "react-material-ui-carousel";
import {MapContainer, TileLayer, Marker} from "react-leaflet";
import {fixImagePath} from "../utils/utils.js";
import {useTheme} from "@mui/material/styles";
import {StoreMap} from "@/Components/index.js";
import React from "react";

const DashboarShowStoreInfo = observer(({store, user}) => {

    const theme = useTheme();

    const backgroundImage = fixImagePath(store?.galleries?.[0]?.image_link)
        || "https://www.france-voyage.com/visuals/photos/frutas-vermelhas-7713_w1400.webp";

    const profileImage = fixImagePath(user?.image_profile)
        || "https://img.freepik.com/free-photo/sideways-black-person-looking-away_23-2148749548.jpg?t=st=1738098181~exp=1738101781~hmac=37201112c86819d842272cc0f3c10da8c78de0e39ee9a77845680f10018abde5&w=1800";
    // Get media queries
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Faz a query para mobile
    const latitude = store?.latitude || 38.7071;
    const longitude = store?.longitude || -9.1355;

    return (
        <Paper
            elevation={4}
            sx={{
                p: 2,
                width: "80%",
                m: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                position: "relative", // Adiciona posição relativa ao Paper
            }}
        >
            {/* Carrossel */}
            <Box sx={{position: "relative", height: 200, overflow: "hidden"}}>
                <Carousel autoPlay={true} indicators={true}>
                    {store?.galleries?.map((gallery, index) => (
                        <Box
                            key={index}
                            sx={{
                                height: "300px",
                                backgroundImage: `url(${fixImagePath(gallery.image_link)})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        ></Box>
                    ))}
                </Carousel>
            </Box>

            {/* Nome da loja */}
            <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                    top: "215px", // Ajustado para não ficar oculto
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    padding: "12px 24px",
                    borderRadius: "8px",
                    textAlign: "left",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    boxShadow: 3,
                    zIndex: 2,
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    <strong>{store?.name || "Nome da Loja"}</strong>
                </Typography>
            </Box>

            <Divider/>
            <Box sx={{flex: 1}}>

            </Box>
            {/* Informações da loja */}
            <Box sx={{display: "flex", gap: 2, mb: 3, pt:3}}>
                {/* Informações da loja */}
                <Box sx={{flex: "1 1 50%", marginBottom: "3%", p: 2}}>
                    {/* Linha 1 - Email & Telemóvel */}
                    <Box sx={{
                        display: "flex",
                        flexDirection: isSmallScreen ? "column" : "row",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3
                    }}>
                        <Box sx={{flex: "1 1 45%"}}>
                            <Typography fontWeight="bold" sx={{fontSize: "1.2rem"}}>Email:</Typography>
                            <Typography sx={{fontSize: "1rem"}}>{store?.email || "Sem email"}</Typography>
                        </Box>
                        <Box sx={{flex: "1 1 45%"}}>
                            <Typography fontWeight="bold" sx={{fontSize: "1.2rem"}}>Telemóvel:</Typography>
                            <Typography
                                sx={{fontSize: "1rem"}}>{store?.phone_number || "Sem número de telemóvel"}</Typography>
                        </Box>
                    </Box>

                    {/* Linha 2 - Localidade & Código Postal */}
                    <Box sx={{
                        display: "flex",
                        flexDirection: isSmallScreen ? "column" : "row",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3
                    }}>
                        <Box sx={{flex: "1 1 45%"}}>
                            <Typography fontWeight="bold" sx={{fontSize: "1.2rem"}}>Localidade:</Typography>
                            <Typography sx={{fontSize: "1rem"}}>
                                {store?.addresses?.[0]?.city || "Código postal não disponível"}
                            </Typography>
                        </Box>
                        <Box sx={{flex: "1 1 45%"}}>
                            <Typography fontWeight="bold" sx={{fontSize: "1.2rem"}}>Código Postal:</Typography>
                            <Typography sx={{fontSize: "1rem"}}>
                                {store?.addresses?.[0]?.postal_code || "Não disponível"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Linha 3 - Morada */}
                    <Box sx={{
                        display: "flex",
                        flexDirection: isSmallScreen ? "column" : "row",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3
                    }}>
                        <Box sx={{flex: "1 1 45%"}}>
                            <Typography fontWeight="bold" sx={{fontSize: "1.2rem"}}>Morada:</Typography>
                            <Typography sx={{fontSize: "1rem"}}>
                                {store?.addresses?.[0]?.street_address || "Código postal não disponível"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Linha 4 - Descrição */}
                    <Box sx={{
                        display: "flex",
                        flexDirection: isSmallScreen ? "column" : "row",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3
                    }}>
                        <Box sx={{flex: "1 1 45%"}}>
                            <Typography fontWeight="bold" sx={{fontSize: "1.2rem"}}>Descrição:</Typography>
                            <Typography sx={{fontSize: "1rem"}}>{store?.description || "Sem descrição"}</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Localização no Mapa */}
                <Box sx={{flex: "1 1 50%"}}>
                    <Typography variant="h5" sx={{mb: 2}}>
                        Localização no Mapa
                    </Typography>
                    <Box sx={{height: "400px", width: "100%", borderRadius: "8px", overflow: "hidden"}}>
                        <MapContainer center={[latitude, longitude]} zoom={13} style={{height: "100%", width: "100%"}}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            <Marker position={[latitude, longitude]}/>
                        </MapContainer>
                    </Box>
                </Box>
            </Box>


            <Divider/>

            {/* Mapa */}


            {/* Botão de Editar */}
            <Box sx={{mt: 3, textAlign: "right"}}>
                <Button variant="contained" color="primary">Editar</Button>
            </Box>
            {/* Cards de produtos e rating*/}
        </Paper>
    );
});

export default DashboarShowStoreInfo;
