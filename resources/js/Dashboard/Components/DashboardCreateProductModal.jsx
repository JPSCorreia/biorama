import { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    IconButton,
    TextField,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageCropModal from "../../Components/ImageCropModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { productStore } from "../../Stores";

const DashboardCreateProductModal = ({ open, handleClose, storeId, handleViewProduct }) => {
    const [previewImages, setPreviewImages] = useState([]);
    const [serverImages, setServerImages] = useState([]);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    useEffect(() => {
        if (imageToCrop) {
            setCropModalOpen(true);
        }
    }, [imageToCrop]);

    // **Limpa os dados ao abrir o modal**
    useEffect(() => {
        if (open) {
            formik.resetForm();  // Reseta os campos do formulário
            setPreviewImages([]);  // Limpa as imagens de preview
            setServerImages([]);  // Limpa as imagens para envio
            setPreviewIndex(0);  // Reinicia o índice do carrossel
        }
    }, [open]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && previewImages.length < 3) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageToCrop(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedBase64, croppedFile) => {
        if (previewImages.length < 3) {
            setPreviewImages([...previewImages, croppedBase64]);
            setServerImages([...serverImages, croppedFile]);
            setPreviewIndex(previewImages.length);
        }
        setCropModalOpen(false);
        setImageToCrop(null);
    };

    const handleDeleteImage = (index) => {
        setPreviewImages(previewImages.filter((_, i) => i !== index));
        setServerImages(serverImages.filter((_, i) => i !== index));
        setPreviewIndex(0);
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            stock: "",
            price: "",
            discount: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().max(100).required("Nome obrigatório"),
            description: Yup.string().max(3500).required("Descrição obrigatória"),
            stock: Yup.number().min(0.01).required("Stock obrigatório"),
            price: Yup.number().positive().required("Preço obrigatório"),
            discount: Yup.number().min(0).max(100).required("Desconto obrigatório"),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("stock", values.stock);
            formData.append("price", values.price);
            formData.append("discount", values.discount);
            serverImages.forEach((img) => formData.append("imagesProduct[]", img));

            try {
                const response = await productStore.CreateProduct(formData, storeId);
                if (response.data.product) {
                    handleClose(); // Fecha o modal de criação
                    handleViewProduct(response.data.product); // Abre o modal de exibição
                }
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
                sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
                <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                        display: "flex",
                        flexDirection: "column",

                        width: isSmallScreen ? "100vh" : "50%",
                        height: isSmallScreen ? "100vh" : "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        backgroundColor: "background.paper",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    {/* Cabeçalho do modal */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="h5">Criar Produto</Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Formulário de criação de produto */}
                    <Box component="form" sx={{display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between"}}onSubmit={formik.handleSubmit}>
                        <Box>
                        <TextField
                            fullWidth
                            label="Nome do Produto"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Descrição"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            multiline
                            rows={4}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                            sx={{ mb: 2 }}
                        />
                                                <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                                label="Stock"
                                name="stock"
                                type="number"
                                value={formik.values.stock}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.stock && Boolean(formik.errors.stock)}
                                helperText={formik.touched.stock && formik.errors.stock}
                            />
                            <TextField
                                label="Preço (€)"
                                name="price"
                                type="number"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.price && Boolean(formik.errors.price)}
                                helperText={formik.touched.price && formik.errors.price}
                            />
                            <TextField
                                label="Desconto (%)"
                                name="discount"
                                type="number"
                                value={formik.values.discount}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.discount && Boolean(formik.errors.discount)}
                                helperText={formik.touched.discount && formik.errors.discount}
                            />
                        </Box>
                                                {/* Imagens de produto */}
                                                <Box sx={{ mt: 4 }}>
                            <Typography variant="h6">Imagens do Produto</Typography>
                            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                                {previewImages.map((image, index) => (
                                    <Box key={index} sx={{ position: "relative", width: 100, height: 100 }}>
                                        <img
                                            src={image}
                                            alt={`Imagem ${index}`}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                        <IconButton
                                            size="small"
                                            sx={{ position: "absolute", top: 0, right: 0 }}
                                            onClick={() => handleDeleteImage(index)}
                                        >
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </Box>
                                ))}
                                <IconButton component="label">
                                    <PhotoCameraIcon />
                                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                </IconButton>
                            </Box>
                        </Box>
                        </Box>




                        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                            <Button type="submit" variant="contained" color="primary">
                                Criar Produto
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            {/* Modal de corte de imagem */}
            {cropModalOpen && (
                <ImageCropModal
                    open={cropModalOpen}
                    image={imageToCrop}
                    onClose={() => setCropModalOpen(false)}
                    onCropComplete={handleCropComplete}
                />
            )}
        </>
    );
};

export default DashboardCreateProductModal;
