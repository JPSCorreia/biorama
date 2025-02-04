import { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    IconButton,
    TextField,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageCropModal from "./ImageCropModal";
import Carousel from "react-material-ui-carousel";
import { useFormik } from "formik";
import * as Yup from "yup";
import { vendorRegistrationStore } from "../Stores/";

const CreateProductModal = ({ open = false, handleClose }) => {
    const [previewImages, setPreviewImages] = useState([]); // Apenas para UI (Base64)
    const [serverImages, setServerImages] = useState([]); // Apenas para envio (File)
    const [previewIndex, setPreviewIndex] = useState(0); // Índice do carrossel
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);

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
            description: Yup.string().max(500, "Máximo 500 caracteres").required("Descrição obrigatória"),
            stock: Yup.number().min(1, "Mínimo 1").required("Stock obrigatório"),
            price: Yup.number().positive("Deve ser positivo").required("Preço obrigatório"),
            discount: Yup.number().min(0, "Mínimo 0%").max(100, "Máximo 100%"),
        }),
        onSubmit: async (values) => {
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
        },
    });

    return (
        <>
            {/* Modal Principal */}
            <Modal open={Boolean(open)} onClose={handleClose} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ display: "flex", flexDirection: "column", width: "50%", padding: "20px", borderRadius: "10px", backgroundColor: "background.paper", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>

                    {/* Cabeçalho do Modal */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Criar Produto</Typography>
                        <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        {/* **Preview da Imagem (Esquerda)** */}
                        <Box sx={{ width: "40%", height: 250, border: "2px dashed grey", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", position: "relative" }}>
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
                                                backgroundColor: "rgba(0, 0, 0, 0.2) !important", // Fundo cinza claro discreto
                                                color: "#fff", // Setas brancas
                                                boxShadow: "none !important", // Sem sombras
                                                borderRadius: "50%", // Fundo arredondado
                                                width: "30px", // Ajusta tamanho da área do botão
                                                height: "30px",
                                                opacity: 0, // Esconde por padrão
                                                transition: "opacity 0.3s ease-in-out, background-color 0.3s ease-in-out",
                                                "&:hover": {
                                                    backgroundColor: "rgba(0, 0, 0, 0.3) !important", // Ligeiramente mais escuro ao passar o rato
                                                },
                                            },
                                            "& .MuiSvgIcon-root": {
                                                fontSize: "2rem", // Ajusta o tamanho das setas
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
                                <IconButton component="label">
                                    <PhotoCameraIcon fontSize="large" />
                                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                </IconButton>
                            )}
                        </Box>

                        {/* **Campos do Produto (Direita)** */}
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField fullWidth label="Nome" {...formik.getFieldProps("name")} />
                            <TextField fullWidth label="Descrição" multiline rows={2} {...formik.getFieldProps("description")} />
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <TextField label="Stock" {...formik.getFieldProps("stock")} />
                                <TextField label="Desconto (%)" {...formik.getFieldProps("discount")} />
                            </Box>
                            <TextField label="Preço (€)" {...formik.getFieldProps("price")} />
                        </Box>
                    </Box>

                    {/* **Miniaturas abaixo do Preview** */}
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                        {previewImages.map((image, index) => (
                            <Box key={index} sx={{ position: "relative", width: 80, height: 50, borderRadius: "6px", overflow: "hidden" }}>
                                <img src={image} alt={`thumb-${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                <IconButton sx={{ position: "absolute", top: 0, right: 0, backgroundColor: "rgba(255, 0, 0, 0.6)", color: "white", padding: "2px" }} onClick={() => handleDeleteImage(index)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}

                        {/* Ícone da câmara ao lado das miniaturas para adicionar mais imagens */}
                        {previewImages.length < 3 && previewImages.length > 0 && (
                            <IconButton component="label" sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)", padding: 1 }}>
                                <PhotoCameraIcon />
                                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                            </IconButton>
                        )}
                    </Box>

                    <Button variant="contained" color="primary" sx={{ mt: 2 }} type="submit" onClick={formik.handleSubmit}>
                        Criar Produto
                    </Button>
                </Box>
            </Modal>

            {/* **Image Crop Modal** */}
            {cropModalOpen && <ImageCropModal open={cropModalOpen} image={imageToCrop} onClose={() => setCropModalOpen(false)} onCropComplete={handleCropComplete} />}
        </>
    );
};

export default CreateProductModal;
