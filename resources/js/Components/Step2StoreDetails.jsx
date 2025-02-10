import { Paper, Box, Typography, IconButton, ImageList, ImageListItem } from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import { observer } from "mobx-react";
import DashboardStoreCreateForm from "@/Components/DashboardStoreCreateForm.jsx";

const DashboardStoreStep2 = observer(({ setStoreFormik, handleImageUpload, images, setImages }) => {
    // Função para remover uma imagem específica
    const handleRemoveImage = (indexToRemove) => {
        setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
    };

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
            }}
        >
            {/* Seção de imagens */}
            <Box
                sx={{
                    width: "82%",
                    // height: "150px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        height: 150,
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 2,
                        position: "relative",
                    }}
                >
                    {/* Imagem principal */}
                    {images.length > 0 && (
                        <img
                            src={images[0]}
                            alt="Imagem principal"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "10px",
                            }}
                        />
                    )}

                    {/* Botão de upload inicial */}
                    {images.length === 0 && (
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                        >
                            <input hidden accept="image/*" type="file" multiple onChange={handleImageUpload} />
                            <PhotoCamera sx={{ fontSize: "3rem" }} />
                        </IconButton>
                    )}

                    {/* Lista de imagens sobreposta */}
                    {images.length > 1 && (
                        <ImageList
                            sx={{
                                position: "absolute",
                                bottom: 16,
                                left: 16,
                                width: "80%",
                                height: "100px",
                                display: "flex",
                                flexDirection: "row",
                                overflowX: "auto",
                                gap: 1,
                            }}
                            cols={images.length - 1}
                        >
                            {images.slice(1).map((image, index) => (
                                <ImageListItem key={index} sx={{ width: "100px", height: "100px", position: "relative" }}>
                                    <img
                                        src={image}
                                        alt={`Imagem ${index + 2}`}
                                        loading="lazy"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <IconButton
                                        onClick={() => handleRemoveImage(index + 1)}
                                        sx={{
                                            position: "absolute",
                                            top: 4,
                                            right: 4,
                                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                                        }}
                                    >
                                        <Delete color="error" />
                                    </IconButton>
                                </ImageListItem>
                            ))}
                        </ImageList>
                    )}
                </Box>
            </Box>

            {/* Seção do formulário */}
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                    pb: 0,
                    // backgroundColor: "rgba(255, 255, 255, 0.9)",
                    boxShadow: 3,
                    width: "80%",
                    position: "relative",
                    mt: -5,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: "2rem",
                            fontWeight: "bold",
                            textAlign: "left",
                        }}
                    >
                        Dados da sua Loja
                    </Typography>
                    <DashboardStoreCreateForm passFormik={setStoreFormik} images={images} />
                </Box>
            </Paper>
        </Box>
    );
});

export default DashboardStoreStep2;
