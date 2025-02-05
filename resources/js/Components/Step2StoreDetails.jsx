import {Paper, Box, Typography, IconButton, useTheme, useMediaQuery} from "@mui/material";
import FormStoreRegistration from "./FormStoreRegistration";
import { ArrowBackIos, ArrowForwardIos, Delete, PhotoCamera } from "@mui/icons-material";
import { forwardRef, useEffect, useState } from "react";
import { AlertBox } from "@/Components/index.js";

const Step2StoreDetails = forwardRef(({ formErrors, images, setImages, handleImageUpload, showAlert }, ref) => {
    useEffect(() => {
        console.log("Step2StoreDetails -> Recebeu refs:", { ref });
    }, [ref]);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleDeleteImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        if (currentIndex >= images.length - 1) {
            setCurrentIndex(0);
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                m: "auto",
            }}
        >
            {showAlert && <AlertBox />}

            {/* Div para o botão de upload e miniaturas */}
            {images.length >= 1 && (

                <Box sx={{ width: isSmallScreen || isMediumScreen ? "100%" : "80%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent:"center", m: "auto" }}>
                    {images.length < 3 && (
                        <IconButton
                            onClick={() => document.getElementById("imageUpload")?.click()}
                            sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", mb: 1 }}
                        >
                            <PhotoCamera />
                        </IconButton>
                    )}
                    <Box sx={{ display: "flex", gap: 1 }}>
                        {images.map((image, index) => (
                            <Box key={index} sx={{ position: "relative" }}>
                                <img
                                    src={image}
                                    alt={`Miniatura ${index + 1}`}
                                    style={{ width: 50, height: 50, borderRadius: "5px", cursor: "pointer" }}
                                    onClick={() => setCurrentIndex(index)}
                                />
                                <IconButton
                                    onClick={() => handleDeleteImage(index)}
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        backgroundColor: "rgba(255, 0, 0, 0.7)",
                                        color: "white",
                                    }}
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Carrossel de imagens */}
            <Box sx={{ width: isSmallScreen || isMediumScreen ? "100%" : "85%", height: 350, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
                    <input hidden id="imageUpload" accept="image/*" type="file" multiple onChange={handleImageUpload} />
                    {images.length === 0 ? (
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                cursor: "pointer",
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                borderRadius: 2,
                                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.2)" },
                            }}
                            onClick={() => document.getElementById("imageUpload")?.click()}
                        >
                            <PhotoCamera sx={{ fontSize: "3rem" }} />
                            <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", ml: 2 }}>
                                Adicionar Imagem de Fundo
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
                            <img
                                src={images[currentIndex]}
                                alt={`Imagem ${currentIndex + 1}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                }}
                            />
                            {images.length > 1 && (
                                <>
                                    <IconButton
                                        onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: 10,
                                            transform: "translateY(-50%)",
                                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                                        }}
                                    >
                                        <ArrowBackIos />
                                    </IconButton>

                                    <IconButton
                                        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            right: 10,
                                            transform: "translateY(-50%)",
                                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                                        }}
                                    >
                                        <ArrowForwardIos />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>

            <Paper
                sx={{
                    display: "flex",
                    flexDirection: isSmallScreen || isMediumScreen ? "row" : "column",
                    p: 5,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    boxShadow: 3,
                    width: isSmallScreen || isMediumScreen ? "96%" : "80%",
                    position: "relative",
                    mt: -5,
                    mb: 7,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        m: "auto",
                    }}

                >
                    <Typography sx={{ fontSize: "2rem", fontWeight: "bold", textAlign: "left" }}>
                        Dados da sua Loja
                    </Typography>
                    <FormStoreRegistration ref={ref} formErrors={formErrors?.store} />
                </Box>
            </Paper>
        </Box>
    );
});

export default Step2StoreDetails;
