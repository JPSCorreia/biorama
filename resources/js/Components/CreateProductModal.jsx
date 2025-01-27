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

const CreateProductModal = observer(({ open, handleClose }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [images, setImages] = useState([]); // Lista de imagens [{ file, url }]
    const [previewIndex, setPreviewIndex] = useState(0); // Índice da imagem em pré-visualização
    const [cropModalOpen, setCropModalOpen] = useState(false); // Estado do modal de recorte
    const [imageToCrop, setImageToCrop] = useState(null); // Imagem bruta para recorte

    // Abrir modal de recorte com a imagem carregada
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
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
    const handleCropComplete = (croppedFile) => {
        const url = URL.createObjectURL(croppedFile); // Cria URL temporário para preview
        setImages((prev) => [...prev, { file: croppedFile, url }]); // Adiciona ao estado
        setPreviewIndex(images.length); // Atualiza o índice para a nova imagem
        setCropModalOpen(false); // Fecha o modal de recorte
    };

    // Apagar a imagem atual em pré-visualização
    const handleDeleteImage = () => {
        if (images.length > 0) {
            URL.revokeObjectURL(images[previewIndex].url); // Libera o URL temporário
            const updatedImages = images.filter((_, index) => index !== previewIndex);
            setImages(updatedImages);
            setPreviewIndex(0);
        }
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
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("price", values.price);
            formData.append("discount", values.discount);
            formData.append("sold_at_unit", values.sold_at_unit);

            images.forEach((image, index) => {
                formData.append(`images[${index}]`, image.file);
            });

            // Envia para a store (ou para o backend via API)
            vendorRegistrationStore.addProduct(formData);

            console.log("Dados do Produto:", values);
            resetForm();
            images.forEach((image) => URL.revokeObjectURL(image.url)); // Libera URLs temporários
            setImages([]);
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
                    {/* Cabeçalho do Modal */}
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
                        <IconButton
                            onClick={(event) => {
                                event.stopPropagation();
                                handleClose();
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Conteúdo do Modal */}
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mb: 2 }}>
                        {/* Área de Imagens */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box
                                sx={{
                                    width: 400,
                                    height: 300,
                                    border: "2px dashed",
                                    borderColor: "grey.400",
                                    borderRadius: "8px",
                                    position: "relative",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    overflow: "hidden",
                                    "&:hover": {
                                        cursor: "pointer",
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                {images.length > 0 ? (
                                    <img
                                        src={images[previewIndex].url}
                                        alt="Preview"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                        }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    >
                                        <Typography variant="body2" color="grey.500" mb={1}>
                                            Adicionar Imagem
                                        </Typography>
                                        <IconButton
                                            component="label"
                                            sx={{
                                                backgroundColor: "primary.main",
                                                color: "white",
                                                "&:hover": { backgroundColor: "primary.dark" },
                                            }}
                                        >
                                            <UploadIcon />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={handleImageUpload}
                                            />
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>

                            {/* Carrossel de Imagens */}
                            {images.length > 0 && (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, m: "auto" }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,
                                            alignItems: "center",
                                            mt: 2,
                                        }}
                                    >
                                        {/* Botão de Anterior */}
                                        <IconButton
                                            onClick={() =>
                                                setPreviewIndex((prev) => (prev - 1 + images.length) % images.length)
                                            }
                                            disabled={images.length <= 1}
                                        >
                                            <ArrowBackIosIcon />
                                        </IconButton>

                                        {/* Miniaturas */}
                                        <Box sx={{ display: "flex", gap: 1, overflowX: "auto" }}>
                                            {images.map((image, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        position: "relative",
                                                        width: 80,
                                                        height: 60,
                                                        borderRadius: "8px",
                                                        border:
                                                            previewIndex === index
                                                                ? "2px solid green"
                                                                : "2px solid transparent",
                                                        overflow: "hidden",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt={`Thumbnail ${index}`}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                        onClick={() => setPreviewIndex(index)}
                                                    />
                                                    <IconButton
                                                        sx={{
                                                            position: "absolute",
                                                            top: 8,
                                                            right: 8,
                                                            color: "red",
                                                        }}
                                                        onClick={() => {
                                                            URL.revokeObjectURL(image.url);
                                                            setImages((prev) =>
                                                                prev.filter((_, i) => i !== index)
                                                            );
                                                            setPreviewIndex(0);
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Box>

                                        {/* Botão de Próximo */}
                                        <IconButton
                                            onClick={() =>
                                                setPreviewIndex((prev) => (prev + 1) % images.length)
                                            }
                                            disabled={images.length <= 1}
                                        >
                                            <ArrowForwardIosIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        {/* Formulário */}
                        <Box sx={{ width: "70%" }}>
                            <TextField
                                fullWidth
                                label="Nome"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                required
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
                                required
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
                                    required
                                    sx={{ width: "35%" }}
                                />
                                <TextField
                                    label="Preço (€)"
                                    name="price"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                    required
                                    sx={{ width: "35%" }}
                                />
                            </Box>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formik.values.sold_at_unit}
                                        onChange={formik.handleChange}
                                        name="sold_at_unit"
                                    />
                                }
                                label={
                                    formik.values.sold_at_unit
                                        ? "Preço por unidade"
                                        : "Preço por Kg"
                                }
                            />
                        </Box>
                    </Box>

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

            {/* Modal de Recorte */}
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
