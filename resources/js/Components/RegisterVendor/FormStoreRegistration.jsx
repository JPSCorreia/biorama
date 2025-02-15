import { useEffect, useImperativeHandle, useState, forwardRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { vendorRegistrationStore } from "@/Stores/vendorRegistrationStore.js";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import "leaflet/dist/leaflet.css";

// Componente para centralizar e ajustar o zoom no marcador
const CenterMapOnPostalCode = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 17, { duration: 1.5 });
        }
    }, [position, map]);
    return null;
};

const FormStoreRegistration = forwardRef(({ formErrors }, ref) => {
    const theme = useTheme();
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [loading, setLoading] = useState(false);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const [shouldUpdateMap, setShouldUpdateMap] = useState(false);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Nome é obrigatório"),
        phone_number: Yup.string()
            .matches(/^\d{9,15}$/, "Número de telefone inválido")
            .required("Telefone é obrigatório"),
        email: Yup.string().email("Email inválido").required("Email é obrigatório"),
        description: Yup.string().nullable("Descrição é obrigatória"),
        street_address: Yup.string().required("Morada é obrigatória"),
        city: Yup.string().required("Localidade é obrigatória"),
        postal_code: Yup.string()
            .matches(/^\d{4}-\d{3}$/, "Código Postal inválido")
            .required("Código Postal é obrigatório"),
        coordinates: Yup.string().required("Necessário coordenadas"),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            phone_number: "",
            email: "",
            description: "",
            street_address: "",
            city: "",
            coordinates: "",
            postal_code: "",
            image_link: [],
        },
        validationSchema,
        onSubmit: async (values) => {
            formik.setTouched(
                Object.keys(values).reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                }, {})
            );
            const isValid = await formik.validateForm();
            if (Object.keys(isValid).length === 0) {
                vendorRegistrationStore.setStoreFormik(formik);
            }
        },
    });

    useEffect(() => {
        if (formErrors) {
            formik.setErrors(formErrors);
            formik.setTouched(
                Object.keys(formErrors).reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                }, {})
            );
            formik.validateForm();
        }
    }, [formErrors]);

    const handlePostalCodeChange = async (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 4) {
            value = `${value.slice(0, 4)}-${value.slice(4, 7)}`;
        }
        formik.setFieldValue("postal_code", value);

        if (/^\d{4}-\d{3}$/.test(value)) {
            try {
                setLoading(true);
                setIsReadOnly(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_CTT_API_URL}/${import.meta.env.VITE_CTT_API_KEY}/${value}`
                );
                if (response.status === 200 && response.data.length > 0) {
                    const data = response.data[0];
                    formik.setFieldValue("street_address", data.morada || "");
                    formik.setFieldValue("city", data.distrito || "");
                    formik.setFieldValue("coordinates", `${data.latitude},${data.longitude}`);
                    setShouldUpdateMap(true);
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

    useImperativeHandle(ref, () => ({
        validateForm: formik.validateForm,
        setTouched: formik.setTouched,
        setFieldValue: formik.setFieldValue,
        values: formik.values,
        handleSubmit: formik.handleSubmit,
    }));

    return (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row", gap: 5 }}>
                <Box sx={{ width: isSmallScreen ? "100%" : "50%" }}>
                    <Box sx={{ display: "flex", gap: 2, mb:2 }}>
                        <TextField
                            label="Nome"
                            name="name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Telefone"
                            name="phone_number"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phone_number}
                            error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                            helperText={formik.touched.phone_number && formik.errors.phone_number}
                            fullWidth
                            required
                        />
                    </Box>
                    <TextField
                        label="Email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        fullWidth
                        required
                        sx={{mb:2}}
                    />
                    <TextField
                        label="Descrição"
                        name="description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                        fullWidth
                        required
                        multiline
                        rows={4}
                        sx={{mb:2}}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <TextField
                            label="Código Postal"
                            name="postal_code"
                            onChange={handlePostalCodeChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.postal_code}
                            error={formik.touched.postal_code && Boolean(formik.errors.postal_code)}
                            helperText={formik.touched.postal_code && formik.errors.postal_code}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Localidade"
                            name="city"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.city}
                            error={formik.touched.city && Boolean(formik.errors.city)}
                            helperText={formik.touched.city && formik.errors.city}
                            fullWidth
                            required
                        />
                    </Box>
                    <TextField
                        label="Morada"
                        name="street_address"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.street_address}
                        error={formik.touched.street_address && Boolean(formik.errors.street_address)}
                        helperText={formik.touched.street_address && formik.errors.street_address}
                        fullWidth
                        required
                    />
                </Box>
                <Box
                    sx={{
                        width: isSmallScreen || isMediumScreen ? "100%" : "45%",
                    }}
                >
                    <Box
                        sx={{
                            maxHeight: "500px",
                            height: "415px", // Adiciona uma altura fixa aqui
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
        </Box>
    );
});

export default FormStoreRegistration;
