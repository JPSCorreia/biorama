import React, { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    IconButton,
} from "@mui/material";
import { observer } from "mobx-react";
import { useFormik } from "formik";
import * as yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import { shopStore } from "../Stores/shopStore";

const DashboardStoreEditModal = observer(({ open, onClose, store }) => {
    const [images, setImages] = useState(store?.galleries.map((img) => img.image_link) || []);
    const [newImages, setNewImages] = useState([]);

    const validationSchema = yup.object().shape({
        name: yup.string().required("O nome é obrigatório"),
        email: yup.string().email("Email inválido").required("Email é obrigatório"),
        phone_number: yup.string().required("Número de telefone é obrigatório"),
        description: yup.string().nullable(),
        street_address: yup.string().required("Morada é obrigatória"),
        city: yup.string().required("Cidade é obrigatória"),
        postal_code: yup.string().required("Código postal é obrigatório"),
    });

    const formik = useFormik({
        initialValues: {
            name: store?.name || "",
            email: store?.email || "",
            phone_number: store?.phone_number || "",
            description: store?.description || "",
            street_address: store?.addresses?.[0]?.street_address || "",
            city: store?.addresses?.[0]?.city || "",
            postal_code: store?.addresses?.[0]?.postal_code || "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const result = await shopStore.updateStore(store.id, {
                ...values,
                images: [...images, ...newImages],
            });

            if (result.success) {
                onClose(); // Fecha o modal se bem-sucedido
            }
        },
    });

    // Adiciona novas imagens ao estado local
    const handleImageUpload = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        const base64Promises = uploadedFiles.map((file) => convertToBase64(file));

        Promise.all(base64Promises).then((base64Images) => {
            setNewImages([...newImages, ...base64Images]);
        });
    };

    // Função para converter imagem para Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Remove uma imagem do estado local (tanto antiga quanto nova)
    const handleRemoveImage = (index, isNewImage) => {
        if (isNewImage) {
            setNewImages(newImages.filter((_, imgIndex) => imgIndex !== index));
        } else {
            setImages(images.filter((_, imgIndex) => imgIndex !== index));
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: 600,
                    backgroundColor: "white",
                    borderRadius: "8px",
                    p: 3,
                    m: "auto",
                    mt: 5,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h6" mb={2}>
                    Editar Loja
                </Typography>
                <Divider />
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        label="Nome"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={Boolean(formik.errors.name)}
                        helperText={formik.errors.name}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={Boolean(formik.errors.email)}
                        helperText={formik.errors.email}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Telefone"
                        name="phone_number"
                        value={formik.values.phone_number}
                        onChange={formik.handleChange}
                        error={Boolean(formik.errors.phone_number)}
                        helperText={formik.errors.phone_number}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Descrição"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        multiline
                        rows={3}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Morada"
                        name="street_address"
                        value={formik.values.street_address}
                        onChange={formik.handleChange}
                        error={Boolean(formik.errors.street_address)}
                        helperText={formik.errors.street_address}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Cidade"
                        name="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        error={Boolean(formik.errors.city)}
                        helperText={formik.errors.city}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Código Postal"
                        name="postal_code"
                        value={formik.values.postal_code}
                        onChange={formik.handleChange}
                        error={Boolean(formik.errors.postal_code)}
                        helperText={formik.errors.postal_code}
                        sx={{ mt: 2 }}
                    />

                    {/* Exibição de imagens atuais */}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Imagens Existentes</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {images.map((image, index) => (
                                <Box
                                    key={index}
                                    sx={{ position: "relative", width: 100, height: 100 }}
                                >
                                    <img
                                        src={image}
                                        alt={`Imagem ${index}`}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                                    />
                                    <IconButton
                                        size="small"
                                        sx={{ position: "absolute", top: 0, right: 0 }}
                                        onClick={() => handleRemoveImage(index, false)}
                                    >
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Novas imagens adicionadas */}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Novas Imagens Adicionadas</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {newImages.map((image, index) => (
                                <Box
                                    key={index}
                                    sx={{ position: "relative", width: 100, height: 100 }}
                                >
                                    <img
                                        src={image}
                                        alt={`Nova Imagem ${index}`}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                                    />
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
                    </Box>

                    {/* Botão para carregar novas imagens */}
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" component="label">
                            Carregar Imagens
                            <input type="file" hidden multiple onChange={handleImageUpload} />
                        </Button>
                    </Box>

                    <Box sx={{ textAlign: "right", mt: 3 }}>
                        <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            Guardar
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
});

export default DashboardStoreEditModal;
