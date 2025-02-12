import { observer } from "mobx-react";
import { Box, Typography, Divider } from "@mui/material";
import { Email, Phone, LocationOn } from "@mui/icons-material";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { Icon } from "leaflet";
import { AlertBox } from "../Components";
import logoImage from "../../../public/images/logo.webp";

const Contacts = observer(() => {
    // Create a custom icon in green
    const greenIcon = new Icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                height: "100%",
                width: "100%",
                marginTop: "15px !important",
                marginBottom: "5%",
                padding: "0 10%",
            }}
        >
            {/* Alerts */}
            <AlertBox />

            {/* Logo */}
            <Box sx={{ display: "flex", mb: 5 }}>
                <img src={logoImage} alt="Biorama Logo" width="250" />
            </Box>

            {/* Team description */}
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Sobre Nós
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                A nossa equipa é composta por três programadores:{" "}
                <strong>João Correia</strong>,<strong> Lucas Silvestre</strong>{" "}
                e <strong>Vladimiro Bonaparte</strong>. Somos estudantes da ATEC
                no curso de{" "}
                <i>TPSI (Técnico de Programação e Sistemas de Informação)</i> e
                esta aplicação foi construída no âmbito do nosso{" "}
                <strong>Projeto Final</strong>.
            </Typography>

            {/* Team mission */}
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                A Nossa Missão
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                A <strong>Biorama</strong> tem como objetivo facilitar a
                promoção e venda de produtos
                <strong> sustentáveis</strong> e de origem{" "}
                <strong>local</strong>, apoiando pequenos agricultores e
                negócios regionais em Portugal.
            </Typography>

            <Divider sx={{ width: "100%", mb: 3 }} />

            {/* Contact information */}
            <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ mb: 2 }}
            >
                Contacta-nos
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                    Sede: ATEC - Palmela, Portugal
                </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Email color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                    Email: biorama.contact@gmail.com
                </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Phone color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                    Telefone: +351 912 345 678
                </Typography>
            </Box>

            <Divider sx={{ width: "100%", mb: 3 }} />

            {/* Map with our location */}
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                A Nossa Localização
            </Typography>

            <Box
                sx={{
                    width: "100%",
                    maxWidth: "1250px",
                    height: "400px",
                    overflow: "hidden",
                    mt: 1,
                }}
            >
                <MapContainer
                    center={[38.5698, -8.9036]}
                    zoom={15}
                    style={{ width: "100%", height: "100%" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[38.5698, -8.9036]} icon={greenIcon}>
                        <Tooltip direction="right" offset={[15, -22]} permanent>
                            Biorama - Sede (ATEC, Palmela)
                        </Tooltip>
                    </Marker>
                </MapContainer>
            </Box>

            <Typography variant="body1" sx={{ mt: 2, alignSelf: "center" }}>
                Quinta da Marqueza - Palmela, Parque Industrial da Volkswagen
                Autoeuropa, 2950-557 Q.ta do Anjo
            </Typography>
        </Box>
    );
});

export default Contacts;
