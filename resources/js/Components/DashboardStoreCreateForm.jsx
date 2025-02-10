import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { vendorRegistrationStore } from "../Stores/vendorRegistrationStore.js";
import { useTheme } from "@mui/material/styles";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMediaQuery } from "@mui/material";
import { observer } from "mobx-react";
import * as yup from "yup";

// Componente para centralizar e ajustar o zoom no marcador
const CenterMapOnPostalCode = ({ position }) => {
    const map = useMap();
    if (position) {
        map.flyTo(position, 17, { duration: 1.5 });
    }
    return null;
};
const DashboardStoreCreateForm = observer(({ passFormik, images }) => {
    const theme = useTheme();
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [loading, setLoading] = useState(false);
    // Adicionando media queries para small e medium screens
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const [shouldUpdateMap, setShouldUpdateMap] = useState(false);

    const handleFormSubmit = async (values) => {
        try {
            // Atualize a store com os valores do formulário, incluindo as imagens
            vendorRegistrationStore.updateStore({
                ...values,
                images, // Assegure que as imagens estão incluídas
            });
            console.log("Dados submetidos:", values);
        } catch (error) {
            console.error("Erro ao submeter o formulário:", error);
        }
    };

    const validationSchema = yup.object().shape({
        name: yup.string().required("Nome é obrigatório"),
        phone_number: yup.string().matches(/^\d{9,15}$/, "Número de telefone inválido").required("Telefone é obrigatório"),
        email: yup.string().email("Email inválido").required("Email é obrigatório"),
        description: yup.string().nullable(),
        street_address: yup.string().required("Morada é obrigatória"),
        city: yup.string().required("Localidade é obrigatória"),
        comment: yup.string().nullable(),
        postal_code: yup.string().matches(/^\d{4}-\d{3}$/, "Código Postal inválido").required("Código Postal é obrigatório"),
        coordinates: yup.string().required("Necessário definir coordenadas"),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            phone_number: "",
            email: "",
            description: "",
            street_address: "",
            city: "",
            comment: "",
            coordinates: "",
            postal_code: "",
        },
        validationSchema: validationSchema,
        validateOnMount: true,
        onSubmit: handleFormSubmit,
    });



    const handlePostalCodeChange = async (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 4) {
            value = `${value.slice(0, 4)}-${value.slice(4, 7)}`;
        }
        formik.setFieldValue("postal_code", value);

        if (/^\d{4}-\d{3}$/.test(value)) {
            const [cp4, cp3] = value.split("-");
            try {
                setLoading(true);
                setIsReadOnly(true);
                const url = `${import.meta.env.VITE_CTT_API_URL}/${import.meta.env.VITE_CTT_API_KEY}/${cp4}-${cp3}`;
                const response = await axios.get(url);
                if (response.status === 200 && response.data.length > 0) {
                    const data = response.data[0];
                    const coordinates = `${data.latitude},${data.longitude}`;
                    formik.setFieldValue("street_address", data.morada || "");
                    formik.setFieldValue("city", data.distrito || "");
                    formik.setFieldValue("coordinates", coordinates);
                    setShouldUpdateMap(true); // Atualizar mapa apenas aqui
                } else {
                    formik.setFieldError("postal_code", "Código Postal não encontrado");
                }
            } catch {
                formik.setFieldError("postal_code", "Erro ao validar o Código Postal");
            } finally {
                setLoading(false);
                setIsReadOnly(false);
            }
        } else {
            formik.setFieldValue("coordinates", "");
            setShouldUpdateMap(false);
        }
    };

    const DraggableMarker = () => {
        const position = formik.values.coordinates
            ? formik.values.coordinates.split(",").map(Number)
            : [38.7071, -9.1355];
        const [markerPosition, setMarkerPosition] = useState(position);

        return (
            <Marker
                position={markerPosition}
                draggable
                eventHandlers={{
                    dragend: (event) => {
                        const latlng = event.target.getLatLng();
                        setMarkerPosition([latlng.lat, latlng.lng]);
                        formik.setFieldValue("coordinates", `${latlng.lat},${latlng.lng}`);
                        setShouldUpdateMap(false);
                    },
                }}
            />
        );
    };

    // Passar o formik ao componente pai ao inicializar
    if (passFormik) {
        passFormik(formik);
    }

    return (
        <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
                mt: 3,
                display: "flex",
                flexDirection: isSmallScreen || isMediumScreen ? "column" : "row",
                gap: 3,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: isSmallScreen || isMediumScreen ? "column" : "row",
                    justifyContent: "space-between",
                    width: "100%",
                    gap: 5,
                }}
            >
                <Box
                    sx={{
                        width: "55%",
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: isSmallScreen ? 'column' : 'row',
                            gap: 5,
                            mb: 2,
                        }}
                    >
                        <TextField
                            label="Nome"
                            name="name"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            error={Boolean(formik.errors.name)}
                            helperText={
                                <Box sx={{ minHeight: "20px" }}>
                                    {formik.touched.name && formik.errors.name}
                                </Box>
                            }
                            fullWidth
                        />
                        <TextField
                            label="Telefone"
                            name="phone_number"
                            onChange={formik.handleChange}
                            value={formik.values.phone_number}
                            error={Boolean(formik.errors.phone_number)}
                            helperText={
                                <Box sx={{ minHeight: "20px" }}>
                                    {formik.touched.phone_number && formik.errors.phone_number}
                                </Box>
                            }
                            fullWidth
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: isSmallScreen ? 'column' : 'row',
                            gap: 5,
                            mb: 2,
                        }}
                    >
                        <TextField
                            label="Email"
                            name="email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            error={Boolean(formik.errors.email)}
                            helperText={
                                <Box sx={{ minHeight: "20px" }}>
                                    {formik.touched.email && formik.errors.email}
                                </Box>
                            }
                            fullWidth
                        />
                    </Box>
                    <Box>
                        <TextField
                            label="Descrição"
                            name="description"
                            onChange={formik.handleChange}
                            value={formik.values.description}
                            error={Boolean(formik.errors.description)}
                            helperText={
                                <Box sx={{ minHeight: "20px" }}>
                                    {formik.touched.description && formik.errors.description}
                                </Box>
                            }
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: isSmallScreen ? 'column' : 'row',
                            gap: 5,
                            mb: 2,
                        }}
                    >
                        <TextField
                            label="Morada"
                            name="street_address"
                            onChange={formik.handleChange}
                            value={formik.values.street_address}
                            error={Boolean(formik.errors.street_address)}
                            helperText={
                                <Box sx={{ minHeight: "20px" }}>
                                    {formik.touched.street_address && formik.errors.street_address}
                                </Box>
                            }
                            fullWidth
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: isSmallScreen ? 'column' : 'row',
                            gap: 5,
                            mb: 2,
                        }}
                    >
                        <TextField
                            label="Localidade"
                            name="city"
                            onChange={formik.handleChange}
                            value={formik.values.city}
                            error={Boolean(formik.errors.city)}
                            helperText={
                                <Box sx={{ minHeight: "20px" }}>
                                    {formik.touched.city && formik.errors.city}
                                </Box>
                            }
                            fullWidth
                        />
                        <TextField
                            label="Código Postal"
                            name="postal_code"
                            onChange={handlePostalCodeChange}
                            value={formik.values.postal_code}
                            error={Boolean(formik.errors.postal_code)}
                            helperText={
                                <Box sx={{ minHeight: "20px" }}>
                                    {formik.touched.postal_code && formik.errors.postal_code}
                                </Box>
                            }
                            fullWidth
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: "45%",
                    }}
                >
                    <Box
                        sx={{
                            height: "400px",
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            marginBottom: "16px",
                        }}
                    >
                        <MapContainer
                            center={formik.values.coordinates
                                ? formik.values.coordinates.split(",").map(Number)
                                : [38.7071, -9.1355]}
                            zoom={13}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <DraggableMarker />
                            {shouldUpdateMap && (
                                <CenterMapOnPostalCode
                                    position={
                                        formik.values.coordinates
                                            ? formik.values.coordinates.split(",").map(Number)
                                            : null
                                    }
                                />
                            )}
                        </MapContainer>
                    </Box>
                </Box>
            </Box>
            <TextField
                label="Coordenadas"
                name="coordinates"
                value={formik.values.coordinates}
                error={Boolean(formik.errors.coordinates)}
                helperText={formik.errors.coordinates}
                InputProps={{ readOnly: true }}
                fullWidth
                sx={{ display: "none" }}
            />
        </Box>
    );
});

export default DashboardStoreCreateForm;
