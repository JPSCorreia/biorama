import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useTheme } from "@mui/material/styles";
import "leaflet/dist/leaflet.css";
import {IconButton, useMediaQuery} from "@mui/material";
import { observer } from "mobx-react";
import * as yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import {fixImagePath} from "../utils/utils.js";

// Componente para centralizar e ajustar o zoom no marcador
const CenterMapOnPostalCode = ({ position }) => {
    const map = useMap();
    if (position) {
        map.flyTo(position, 17, { duration: 1.5 });
    }
    return null;
};
const DashboardStoreEditForm = observer(({ store, onCancel, onSubmit }) => {
    const theme = useTheme();
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [loading, setLoading] = useState(false);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [shouldUpdateMap, setShouldUpdateMap] = useState(false);
    const [existingImages, setExistingImages] = useState(
        store?.galleries.map(img => ({ id: img.id, imageLink: img.image_link })) || []
    );
    const [newImages, setNewImages] = useState([]);
    const [deleteImages, setDeleteImages] = useState([]); // Novos IDs de imagens a excluir

    // Upload e remoção de imagens
    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const base64Promises = files.map(file => new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
        }));

        Promise.all(base64Promises).then(base64Images => {
            setNewImages([...newImages, ...base64Images]);
        });
    };

    const handleRemoveImage = (imageId, index, isNewImage) => {
        if (isNewImage) {
            setNewImages(newImages.filter((_, i) => i !== index));
        } else {
            console.log("Imagem a apagar (ID):", imageId);
            if (imageId) {
                setDeleteImages(prev => [...prev, imageId]); // Marca o ID da imagem para exclusão
            }
            setExistingImages(existingImages.filter((_, i) => i !== index)); // Remove a imagem da lista visual
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
            name: store?.name || "",
            phone_number: store?.phone_number || "",
            email: store?.email || "",
            description: store?.description || "",
            street_address: store?.addresses?.[0]?.street_address || "",
            city: store?.addresses?.[0]?.city || "",
            postal_code: store?.addresses?.[0]?.postal_code || "",
            coordinates: `${store.addresses[0]?.latitude || 38.7071},${store.addresses[0]?.longitude || -9.1355}`,
        },
        validationSchema: validationSchema,
        validateOnMount: true,
        onSubmit: (values) => {
            const formData = {
                ...values,
                existingImages,
                newImages,
                deleteImages,
            };
            onSubmit(formData, existingImages, newImages, deleteImages);
        },
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
            : [store.latitude || 38.7071, store.longitude || -9.1355];
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


    return (
        <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
                mt: 3, pt:3,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
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
                                : [store.latitude || 38.7071, store.longitude || -9.1355]}
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
            <Box>
                <Typography variant="h6" sx={{ mt: 4 }}>Imagens Existentes</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {existingImages.map((imageObj, index) => (
                        <Box key={imageObj.id} sx={{ position: "relative", width: 100, height: 100 }}>
                            <img src={fixImagePath(imageObj.imageLink)}  alt={`Imagem ${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <IconButton
                                size="small"
                                sx={{ position: "absolute", top: 0, right: 0 }}
                                onClick={() => handleRemoveImage(imageObj.id, index, false)}
                            >
                                <DeleteIcon color="error" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>

                {/* Exibição de novas imagens */}
                <Typography variant="h6" sx={{ mt: 4 }}>Novas Imagens</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {newImages.map((image, index) => (
                        <Box key={index} sx={{ position: "relative", width: 100, height: 100 }}>
                            <img src={image} alt={`Nova Imagem ${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <IconButton
                                size="small"
                                sx={{ position: "absolute", top: 0, right: 0 }}
                                onClick={() => handleRemoveImage(index, true)}
                            >
                                <DeleteIcon color="error" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
                <Box sx={{gap:1, display:"flex", flexDirection:"row"}}>
                    {/* Botão de upload */}
                    <Box>
                        <Button variant="contained" component="label" sx={{ mt: 2,  }}>
                            Adicionar Imagens
                            <input type="file" hidden multiple onChange={handleImageUpload} />
                        </Button>
                    </Box>
                    <Box>
                        <Button type="submit" variant="contained" sx={{ mt: 2, }}>Guardar</Button>
                    </Box>
                    <Box>
                        <Button onClick={onCancel} variant="contained" sx={{ mt: 2, }}>Cancelar</Button>
                    </Box>


                </Box>

            </Box>
        </Box>


    );
});

export default DashboardStoreEditForm;
