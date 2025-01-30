import { useState } from "react";
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
    FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/CloudUpload";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useFormik } from "formik";
import * as Yup from "yup";
import ImageCropModal from "./ImageCropModal";
import { vendorRegistrationStore } from "../Stores";
import { observer } from "mobx-react";
import {usePage} from "@inertiajs/react";

const CreateProductModal = observer(({ open, handleClose }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [images, setImages] = useState([]); // [{ base64 }]
    const [previewIndex, setPreviewIndex] = useState(0); // Índice da imagem em pré-visualização
    const [cropModalOpen, setCropModalOpen] = useState(false); // Estado do modal de recorte
    const [imageToCrop, setImageToCrop] = useState(null); // Imagem para recorte

    // Abrir modal de recorte com a imagem carregada
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageToCrop(reader.result); // Define a imagem para recorte
                setCropModalOpen(true); // Abre o modal de recorte
            };
            reader.readAsDataURL(file);
        }
    };

    // Callback para salvar a imagem recortada
    const handleCropComplete = (base64Image) => {
        const newImage = { base64: base64Image };

        setImages((prev) => {
            const updatedImages = [...prev, newImage];

            formik.setFieldValue(
                "imagesProduct",
                updatedImages.map((img) => img.base64) // Apenas os Base64
            );

            return updatedImages;
        });

        setPreviewIndex(images.length); // Atualiza o índice da pré-visualização
        setCropModalOpen(false); // Fecha o modal de recorte
    };

    // Apagar a imagem selecionada
    const handleDeleteImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        formik.setFieldValue(
            "imagesProduct",
            updatedImages.map((img) => img.base64) // Apenas os Base64
        );
        setPreviewIndex(0);
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
        onSubmit: async (values) => {
            try {
                await vendorRegistrationStore.submitStep3(values);
            } catch (error) {
                console.error("Erro ao submeter o formulário:", error);
            }
        },
    });

    return (
        <>
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
                        width: isSmallScreen ? "90%" : "40%",
                        padding: isSmallScreen ? "10px" : "20px",
                        borderRadius: "10px",
                        backgroundColor: "background.paper",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Criar Produto
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Box
                            sx={{
                                width: "100%",
                                height: 300,
                                border: "2px dashed grey",
                                borderRadius: "8px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                overflow: "hidden",
                            }}
                        >
                            {images.length > 0 ? (
                                <img
                                    src={images[previewIndex].base64}
                                    alt="Preview"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            ) : (
                                <IconButton component="label" sx={{ backgroundColor: "primary.main", color: "white" }}>
                                    <UploadIcon />
                                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                </IconButton>
                            )}
                        </Box>

                        {images.length > 0 && (
                            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                                <IconButton onClick={() => setPreviewIndex((prev) => (prev - 1 + images.length) % images.length)}>
                                    <ArrowBackIosIcon />
                                </IconButton>
                                <IconButton onClick={() => setPreviewIndex((prev) => (prev + 1) % images.length)}>
                                    <ArrowForwardIosIcon />
                                </IconButton>
                            </Box>
                        )}
                        <form onSubmit={formik.handleSubmit}>
                            <TextField
                                fullWidth
                                label="Nome"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                sx={{ mb: 2 }}
                            />
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
                                sx={{ mb: 2 }}
                            />
                            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                                <TextField
                                    label="Desconto (%)"
                                    name="discount"
                                    value={formik.values.discount}
                                    onChange={formik.handleChange}
                                    error={formik.touched.discount && Boolean(formik.errors.discount)}
                                    helperText={formik.touched.discount && formik.errors.discount}
                                />
                                <TextField
                                    label="Preço (€)"
                                    name="price"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                />
                            </Box>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formik.values.sold_at_unit}
                                        onChange={(event) => {
                                            formik.setFieldValue("sold_at_unit", event.target.checked);
                                        }}
                                        name="sold_at_unit"
                                    />
                                }
                                label={formik.values.sold_at_unit ? "Preço por unidade" : "Preço por Kg"}
                            />
                            <Button variant="contained" color="primary" sx={{ mt: 2 }} type="submit">
                                Criar Produto
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Modal>

            <ImageCropModal
                open={cropModalOpen}
                image={imageToCrop}
                onClose={() => setCropModalOpen(false)}
                onCropComplete={handleCropComplete}
            />
        </>
    );
});

export default CreateProductModal;
