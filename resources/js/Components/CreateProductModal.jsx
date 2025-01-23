import React, { useState } from "react";
import {
    Box,
    Button,
    Modal,
    TextField,
    Typography,
    useTheme,
    useMediaQuery,
    IconButton,
    Switch,
    FormControlLabel
} from "@mui/material";
import {ImageUpload} from "./";
import UploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateProductModal = ({ open, handleClose }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [images, setImages] = useState([]);
    const [previewIndex, setPreviewIndex] = useState(0);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...newImages]);
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            sold_at_unit: false,
            price: "",
            discount: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .max(100, "O nome deve ter no máximo 100 caracteres")
                .required("O nome é obrigatório"),
            description: Yup.string()
                .max(500, "A descrição deve ter no máximo 500 caracteres")
                .required("A descrição é obrigatória"),
            sold_at_unit: Yup.boolean(),
            price: Yup.number()
                .typeError("O preço deve ser um número")
                .positive("O preço deve ser positivo")
                .required("O preço é obrigatório"),
            discount: Yup.number()
                .typeError("O desconto deve ser um número")
                .min(0, "O desconto deve ser maior ou igual a 0")
                .max(100, "O desconto deve ser menor ou igual a 100"),
        }),
        onSubmit: (values, { resetForm }) => {
            console.log("Dados do Produto:", values, images);
            resetForm();
            setImages([]);
            handleClose();
        },
    });

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="create-product-modal-title"
            aria-describedby="create-product-modal-description"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: isSmallScreen ? "90%" : "30%",
                    padding: isSmallScreen ? "10px" : "20px",
                    borderRadius: "10px",
                    backgroundColor: "background.paper",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography id="create-product-modal-title" variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
                        Criar Produto
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Área de imagens */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        alignItems: "flex-start",
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: "50%",
                            height: 300,
                            border: "2px dashed",
                            borderColor: "grey.400",
                            borderRadius: "8px",
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            cursor: "pointer",
                        }}
                        onMouseEnter={() => {}}
                        onClick={() => document.getElementById("image-upload-input").click()}
                    >
                        {images.length > 0 ? (
                            <img
                                src={images[previewIndex]}
                                alt="Preview"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <UploadIcon sx={{ fontSize: 40, color: "grey.500" }} />
                                <Typography variant="caption" color="grey.500">
                                    Adicionar Imagens
                                </Typography>
                            </Box>
                        )}
                        <input
                            id="image-upload-input"
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            width: "100%",
                        }}
                    >
                        {/* Nome do Produto */}
                        <TextField
                            fullWidth
                            label="Nome"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            required
                        />
                        {/* Descrição */}
                        <TextField
                            fullWidth
                            label="Descrição"
                            name="description"
                            multiline
                            rows={3}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                            required
                        />
                        {/* Preço e Desconto */}
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Preço (€)"
                                name="price"
                                type="number"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                error={formik.touched.price && Boolean(formik.errors.price)}
                                helperText={formik.touched.price && formik.errors.price}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Desconto (%)"
                                name="discount"
                                type="number"
                                value={formik.values.discount}
                                onChange={formik.handleChange}
                                error={formik.touched.discount && Boolean(formik.errors.discount)}
                                helperText={formik.touched.discount && formik.errors.discount}
                            />
                        </Box>
                        {/* Vendido à Unidade */}
                        <FormControlLabel
                            control={
                                <Switch
                                    name="sold_at_unit"
                                    checked={formik.values.sold_at_unit}
                                    onChange={formik.handleChange}
                                />
                            }
                            label="Vendido à Unidade?"
                        />
                    </Box>
                </Box>

                {/* Carrossel de imagens */}
                {images.length > 1 && (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            overflowX: "auto",
                            mt: 1,
                        }}
                    >
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Imagem ${index + 1}`}
                                style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    border: index === previewIndex ? "2px solid blue" : "none",
                                }}
                                onClick={() => setPreviewIndex(index)}
                            />
                        ))}
                    </Box>
                )}

                {/* Botão de Submissão */}
                <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={formik.handleSubmit}
                    >
                        Criar Produto
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateProductModal;
