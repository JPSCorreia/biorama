import { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    IconButton,
    TextField,
    Button, useMediaQuery, useTheme
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageCropModal from "./ImageCropModal";
import Carousel from "react-material-ui-carousel";
import { useFormik } from "formik";
import * as Yup from "yup";
import { vendorRegistrationStore } from "../Stores/";

const CreateProductModal = ({ open, handleClose }) => {
    const [previewImages, setPreviewImages] = useState([]); // Apenas para UI (Base64)
    const [serverImages, setServerImages] = useState([]); // Apenas para envio (File)
    const [previewIndex, setPreviewIndex] = useState(0); // Índice do carrossel
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    // **Abrir o modal de corte assim que `imageToCrop` for atualizado**
    useEffect(() => {
        if (imageToCrop) {
            setCropModalOpen(true);
        }
    }, [imageToCrop]);

    // **Abrir o modal de corte com a imagem carregada**
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && previewImages.length < 3) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageToCrop(reader.result); // Atualiza o estado antes de abrir o modal
            };
            reader.readAsDataURL(file);
        }
    };

    // **Guarda as imagens cortadas no preview (Base64) e para envio (File)**
    const handleCropComplete = (croppedBase64, croppedFile) => {
        if (previewImages.length < 3) {
            setPreviewImages([...previewImages, croppedBase64]); // Apenas para UI
            setServerImages([...serverImages, croppedFile]); // Apenas para envio
            setPreviewIndex(previewImages.length);
        }
        setCropModalOpen(false);
        setImageToCrop(null); // Reseta a imagem após o corte
    };

    // **Remover uma imagem do preview e do envio**
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
            name: Yup.string().max(100, "Máximo 100 caracteres").required("Nome obrigatório"),
            description: Yup.string().max(3500, "Máximo 3500 caracteres").required("Descrição obrigatória"),
            stock: Yup.number().min(0.01, "Mínimo 0.01€").required("Stock obrigatório"),
            price: Yup.number().positive("Deve ser positivo").required("Preço obrigatório"),
            discount: Yup.number().min(0, "Mínimo 0%").max(100, "Máximo 100%").required("Desconto obrigatório"),
        }),
        onSubmit: async (values) => {
            const isValid = await formik.validateForm();
            if (isValid) {
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("description", values.description);
                formData.append("stock", values.stock);
                formData.append("price", values.price);
                formData.append("discount", values.discount);

                // Corrigir envio de imagens no formato esperado pelo backend
                serverImages.forEach((img) => formData.append("imagesProduct[]", img));

                try {
                    await vendorRegistrationStore.submitStep3(formData);
                    formik.resetForm();
                    setPreviewImages([]);
                    setServerImages([]);
                    handleClose();
                } catch (error) {
                    console.error("Erro ao submeter o formulário:", error);
                }
            }

        },
    });

    return (
        <>
            {/* Modal Principal */}
            <Modal
                open={open}
                onClose={handleClose}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: isSmallScreen ? "80%" : "40%",
                    padding: "20px",
                    borderRadius: "10px",
                    backgroundColor: "background.paper",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
                }}
                >

                    {/* Cabeçalho do Modal */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Criar Produto</Typography>
                        <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2 ,
                            flexDirection: isSmallScreen || isMediumScreen ? "column" : "row"
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                width: isSmallScreen || isMediumScreen ? "78%" : "35%",
                                height: isSmallScreen ? "250px" : "100%",
                                m: isSmallScreen ? "auto" : "0",
                            }}
                        >
                            {/* **Preview da Imagem (Esquerda)** */}
                            <Box
                                sx={{
                                    width: "100%",
                                    aspectRatio: "4 / 3", // Mantém o rácio 4:3
                                    maxHeight: "600px", // Define um máximo de 600px abaixo de 800px de largura
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    overflow: "hidden",
                                    position: "relative",
                                    m: isSmallScreen ? "auto" : "0",
                                    backgroundColor: previewImages.length === 0 ? "rgba(200, 200, 200, 0.3)" : "transparent",
                                }}
                            >
                                {previewImages.length > 0 ? (
                                    <Box
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            position: "relative",
                                            "&:hover .MuiButtonBase-root": {
                                                opacity: 1, // Mostrar os botões ao passar o rato sobre a imagem
                                            }
                                        }}
                                    >
                                        <Carousel
                                            autoPlay={false}
                                            indicators={false}
                                            navButtonsAlwaysVisible={true}
                                            index={previewIndex}
                                            onChange={(index) => setPreviewIndex(index)}
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                "& .MuiButtonBase-root": {
                                                    backgroundColor: "rgba(0, 0, 0, 0.2) !important",
                                                    color: "#fff",
                                                    boxShadow: "none !important",
                                                    borderRadius: "50%",
                                                    width: "30px",
                                                    height: "30px",
                                                    opacity: 0,
                                                    transition: "opacity 0.3s ease-in-out, background-color 0.3s ease-in-out",
                                                    "&:hover": {
                                                        backgroundColor: "rgba(0, 0, 0, 0.3) !important",
                                                    },
                                                },
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: "2rem",
                                                }
                                            }}
                                        >
                                            {previewImages.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`Preview-${index}`}
                                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                                />
                                            ))}
                                        </Carousel>
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "100%",
                                            height: "100%",
                                            backgroundColor: "rgba(200, 200, 200, 0.4)", // Fundo cinza com opacidade
                                            borderRadius: "12px",
                                        }}
                                    >
                                        <IconButton component="label">
                                            <PhotoCameraIcon fontSize="large" sx={{ color: "#555" }} />
                                            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                        </IconButton>
                                        <Typography sx={{ color: "#000", fontSize: "1rem", mb: 2, textAlign:"center", fontWeight:"bold" }}>
                                            Adiciona as imagens do teu produto
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* **Miniaturas abaixo do Preview** */}
                            <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                {previewImages.map((image, index) => (
                                    <Box key={index} sx={{ position: "relative", width: 80, height: 50, borderRadius: "6px", overflow: "hidden" }}>
                                        <img src={image} alt={`thumb-${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        <IconButton
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                backgroundColor: "rgba(255, 0, 0, 0.6)",
                                                color: "white",
                                                padding: "2px"
                                            }}
                                            onClick={() => handleDeleteImage(index)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}

                                {/* Ícone da câmara para adicionar mais imagens */}
                                {previewImages.length < 3 && previewImages.length > 0 && (
                                    <IconButton component="label" sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)", padding: 1 }}>
                                        <PhotoCameraIcon />
                                        <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                    </IconButton>
                                )}
                            </Box>

                        </Box>
                        {/* **Campos do Produto (Direita)** */}
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField
                                fullWidth
                                name="name"
                                label="Nome"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Descrição"
                                name="description"
                                multiline
                                rows={6}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.description}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                                required
                            />
                            <Box sx={{ display: "flex", justifyContent:"space-between", gap: 2 }}>
                                <TextField
                                    label="Stock"
                                    name="stock"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.stock && Boolean(formik.errors.stock)}
                                    helperText={formik.touched.stock && formik.errors.stock}
                                    required
                                    sx={{
                                        width: isSmallScreen ? "40%" : "33%",
                                        '& input': { textAlign: "center" }
                                    }}
                                />
                                <TextField
                                    label="Desconto (%)"
                                    name="discount"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.discount && Boolean(formik.errors.discount)}
                                    helperText={formik.touched.discount && formik.errors.discount}
                                    required
                                    sx={{
                                        width: isSmallScreen ? "40%" : "33%",
                                        '& input': { textAlign: "center" }
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end", // Alinha o preço à direita
                                }}
                            >
                                <TextField
                                    label="Preço (€)"
                                    name="price"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                    required
                                    sx={{
                                        width: isSmallScreen ? "40%" : "33%",
                                        '& input': { textAlign: "center" }
                                }}
                                />
                            </Box>
                        </Box>

                    </Box>
                    <Box
                        sx={{
                            mt: 4,
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-end",
                        }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={formik.handleSubmit}
                            sx={{ width: isSmallScreen ? "100%" : "22%" }}
                        >
                            Criar Produto
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* **Image Crop Modal** */}
            {cropModalOpen && <ImageCropModal open={cropModalOpen} image={imageToCrop} onClose={() => setCropModalOpen(false)} onCropComplete={handleCropComplete} />}
        </>
    );
};

export default CreateProductModal;
