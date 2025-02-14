import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import {
    Paper,
    Box,
    Typography,
    IconButton,
    ImageList,
    ImageListItem,
    TextField,
    useMediaQuery,
    Tooltip,
    Modal,
    Button,
    CircularProgress,
    useTheme,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
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
const StoreCreateForm = observer(({ passFormik, images }) => {
    const theme = useTheme();
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [loading, setLoading] = useState(false);
    // Adicionando media queries para small e medium screens
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const [shouldUpdateMap, setShouldUpdateMap] = useState(false);
    const [isDisabled, setisDisabled] = useState(true);

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

    const initialValues = {
        name: "",
        phone_number: "",
        email: "",
        description: "",
        street_address: "",
        city: "",
        comment: "",
        coordinates: "",
        postal_code: "",
    };

    const validationSchema = yup.object().shape({
        name: yup.string().required("Nome é obrigatório"),
        phone_number: yup
            .string()
            .matches(/^\d{9,15}$/, "Número de telefone inválido")
            .required("Telefone é obrigatório"),
        email: yup
            .string()
            .email("Email inválido")
            .required("Email é obrigatório"),
        description: yup.string().nullable(),
        street_address: yup.string().required("Morada é obrigatória"),
        city: yup.string().required("Localidade é obrigatória"),
        comment: yup.string().nullable(),
        postal_code: yup
            .string()
            .matches(/^\d{4}-\d{3}$/, "Código Postal inválido")
            .required("Código Postal é obrigatório"),
        coordinates: yup.string().required("Necessário definir coordenadas"),
    });

    const formik = useFormik({
        initialValues,
        validationSchema: validationSchema,
        // validateOnMount: false,
        onSubmit: handleFormSubmit,
    });

    // const handlePostalCodeChange2 = async (e) => {
    //     let value = e.target.value.replace(/\D/g, "");
    //     if (value.length > 4) {
    //         value = `${value.slice(0, 4)}-${value.slice(4, 7)}`;
    //     }
    //     formik.setFieldValue("postal_code", value);

    //     if (/^\d{4}-\d{3}$/.test(value)) {
    //         const [cp4, cp3] = value.split("-");
    //         try {
    //             setLoading(true);
    //             setIsReadOnly(true);
    //             const url = `${import.meta.env.VITE_CTT_API_URL}/${import.meta.env.VITE_CTT_API_KEY}/${cp4}-${cp3}`;
    //             const response = await axios.get(url);
    //             if (response.status === 200 && response.data.length > 0) {
    //                 const data = response.data[0];
    //                 const coordinates = `${data.latitude},${data.longitude}`;
    //                 formik.setFieldValue("street_address", data.morada || "");
    //                 formik.setFieldValue("city", data.distrito || "");
    //                 formik.setFieldValue("coordinates", coordinates);

    //                 formik.setFieldTouched("street_address", true);
    //                 formik.setFieldTouched("city", true);
    //                 formik.setFieldTouched("coordinates", true);

    //                 setShouldUpdateMap(true); // Atualizar mapa apenas aqui
    //             } else {
    //                 formik.setFieldError("postal_code", "Código Postal não encontrado");
    //             }
    //         } catch {
    //             formik.setFieldError("postal_code", "Erro ao validar o Código Postal");
    //         } finally {
    //             setLoading(false);
    //             setIsReadOnly(false);
    //         }
    //     } else {
    //         formik.setFieldValue("coordinates", "");
    //         setShouldUpdateMap(false);
    //     }
    // };

    const handlePostalCodeChange = async (event) => {
        let value = event.target.value.replace(/\D/g, "");
        if (value.length > 4) {
            value = `${value.slice(0, 4)}-${value.slice(4, 7)}`;
        }
        formik.setFieldValue("postal_code", value);

        if (value.length === 8 && /^\d{4}-\d{3}$/.test(value)) {
            const [cp4, cp3] = value.split("-");
            try {
                const url = `${import.meta.env.VITE_CTT_API_URL}/${import.meta.env.VITE_CTT_API_KEY}/${cp4}-${cp3}`;
                const response = await axios.get(url);
                if (response.status === 200 && response.data.length > 0) {
                    const data = response.data[0];
                    const coordinates = `${data.latitude},${data.longitude}`;
                    formik.setFieldValue("street_address", data.morada || "");
                    formik.setFieldValue("city", data.distrito || "");
                    formik.setFieldValue("coordinates", coordinates);
                    setisDisabled(false);
                    setShouldUpdateMap(true);
                } else {
                    formik.setFieldError(
                        "postal_code",
                        "Código Postal não encontrado na API",
                    );
                    formik.setFieldValue("street_address", "");
                    formik.setFieldValue("city", "");
                    formik.setFieldValue("coordinates", "");
                    setisDisabled(true);
                }
            } catch {
                formik.setFieldError(
                    "postal_code",
                    "Erro ao validar o Código Postal",
                );
                formik.setFieldValue("street_address", "");
                formik.setFieldValue("city", "");
                formik.setFieldValue("coordinates", "");
                setisDisabled(true);
            }
        } else {
            formik.setFieldValue("street_address", "");
            formik.setFieldValue("city", "");
            formik.setFieldValue("coordinates", "");
            setisDisabled(true);
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
                        formik.setFieldValue(
                            "coordinates",
                            `${latlng.lat},${latlng.lng}`,
                        );
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
            sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
        >
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                justifySelf: "center",
                alignItems: "center",
                alignSelf: "center",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                borderRadius: "8px",
                width: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "background.paper",
                    borderRadius: "8px",
                    width: "900px",
                    // boxShadow: 24,
                    // p: 4,
                    pb: 3,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        // m: "auto",
                    }}
                >
                    {images.length === 0 ? (
                        <Box
                            sx={{
                                height: 200,
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                borderTopLeftRadius: "8px",
                                borderTopRightRadius: "8px",
                            }}
                        >
                            <Tooltip title="Adicionar Imagem">
                                <IconButton
                                    color="primary"
                                    aria-label="upload picture"
                                    component="label"
                                >
                                    <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        multiple
                                        onChange={handleImageUpload}
                                    />
                                    <PhotoCamera sx={{ fontSize: "3rem" }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    ) : (
                        <ImageList
                            sx={{
                                width: "100%",
                                height: 200,
                                overflow: "hidden",
                                borderRadius: 2,
                                position: "relative",
                            }}
                            cols={2} // Exibir uma imagem por vez
                        >
                            {images.map((image, index) => (
                                <ImageListItem key={index}>
                                    <img
                                        src={image}
                                        alt={`Imagem ${index + 1}`}
                                        loading="lazy"
                                        style={{ borderRadius: "10px" }}
                                    />
                                </ImageListItem>
                            ))}
                            {/* Botão para adicionar mais imagens */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 16,
                                    right: 16,
                                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                                    borderRadius: "50%",
                                }}
                            >
                                <IconButton
                                    color="primary"
                                    aria-label="upload more pictures"
                                    component="label"
                                >
                                    <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        multiple
                                        onChange={handleImageUpload}
                                    />
                                    <PhotoCamera />
                                </IconButton>
                            </Box>
                        </ImageList>
                    )}

                    {/* Form Section */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            position: "relative",
                            mt: 0,
                            p: 3,
                            pb: 1,
                            pt: 1.5,
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h5"
                            >
                                Criar Loja
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={formik.handleSubmit}
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    mt: 1.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        mb: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: "60%",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                mb: 2,
                                                gap: 2,
                                                width: "100%",
                                            }}
                                        >
                                            <TextField
                                                label="Nome"
                                                name="name"
                                                onChange={formik.handleChange}
                                                value={formik.values.name}
                                                error={Boolean(
                                                    formik.errors.name,
                                                )}
                                                helperText={
                                                    formik.touched.name &&
                                                    formik.errors.name
                                                }
                                                fullWidth
                                            />
                                            <TextField
                                                label="Telefone"
                                                name="phone_number"
                                                onChange={formik.handleChange}
                                                value={
                                                    formik.values.phone_number
                                                }
                                                error={Boolean(
                                                    formik.errors.phone_number,
                                                )}
                                                helperText={
                                                    formik.touched
                                                        .phone_number &&
                                                    formik.errors.phone_number
                                                }
                                                fullWidth
                                            />
                                        </Box>
                                            <TextField
                                                label="Email"
                                                name="email"
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 2,
                                                    mb: 2,
                                                }}
                                                onChange={formik.handleChange}
                                                value={formik.values.email}
                                                error={Boolean(
                                                    formik.errors.email,
                                                )}
                                                helperText={
                                                    formik.touched.email &&
                                                    formik.errors.email
                                                }
                                                fullWidth
                                            />
                                            <TextField
                                                label="Descrição"
                                                name="description"
                                                sx={{ mb: 2 }}
                                                onChange={formik.handleChange}
                                                value={
                                                    formik.values.description
                                                }
                                                error={Boolean(
                                                    formik.errors.description,
                                                )}
                                                helperText={
                                                    formik.touched
                                                        .description &&
                                                    formik.errors.description
                                                }
                                                fullWidth
                                                multiline
                                                rows={2}
                                            />
                                            <TextField
                                                label="Morada"
                                                name="street_address"
                                                sx={{
                                                    mb: 2,
                                                }}
                                                onChange={formik.handleChange}
                                                value={
                                                    formik.values.street_address
                                                }
                                                error={Boolean(
                                                    formik.errors
                                                        .street_address,
                                                )}
                                                helperText={
                                                    formik.touched
                                                        .street_address &&
                                                    formik.errors.street_address
                                                }
                                                fullWidth
                                            />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                gap: 2,
                                            }}
                                        >
                                            <TextField
                                                label="Localidade"
                                                name="city"
                                                onChange={formik.handleChange}
                                                value={formik.values.city}
                                                error={Boolean(
                                                    formik.errors.city,
                                                )}
                                                helperText={
                                                    formik.touched.city &&
                                                    formik.errors.city
                                                }
                                                fullWidth
                                            />
                                            <TextField
                                                label="Código Postal"
                                                name="postal_code"
                                                onChange={
                                                    handlePostalCodeChange
                                                }
                                                value={
                                                    formik.values.postal_code
                                                }
                                                error={Boolean(
                                                    formik.errors.postal_code,
                                                )}
                                                helperText={
                                                    formik.touched
                                                        .postal_code &&
                                                    formik.errors.postal_code
                                                }
                                                fullWidth
                                            />
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: "40%",
                                            ml: 2,

                                        }}
                                    >
                                        <Box
                                            sx={{
                                                height: "367px",
                                                width: "100%",
                                            }}
                                        >
                                            <MapContainer
                                                center={
                                                    formik.values.coordinates
                                                        ? formik.values.coordinates
                                                              .split(",")
                                                              .map(Number)
                                                        : [38.7071, -9.1355]
                                                }
                                                zoom={13}
                                                style={{
                                                    height: "100%",
                                                    width: "100%",
                                                }}
                                            >
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <DraggableMarker />
                                                {shouldUpdateMap && (
                                                    <CenterMapOnPostalCode
                                                        position={
                                                            formik.values
                                                                .coordinates
                                                                ? formik.values.coordinates
                                                                      .split(
                                                                          ",",
                                                                      )
                                                                      .map(
                                                                          Number,
                                                                      )
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
                        </Box>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <CircularProgress
                                size={24}
                                sx={{ color: "white" }}
                            />
                        ) : (
                            "Guardar"
                        )}
                    </Button>
                </Box>

                {errorMessage && (
                    <Typography
                        color="error"
                        sx={{ mt: 2, textAlign: "center" }}
                    >
                        {errorMessage}
                    </Typography>
                )}
            </Box>
        </Box>
        </Box>
    );
});

export default StoreCreateForm;
