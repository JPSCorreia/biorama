import {
    Paper,
    Box,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { Delete, PhotoCamera } from "@mui/icons-material";
import { observer } from "mobx-react";
import { DashboardStoreCreateForm } from "@/Dashboard/Components/";
import { useState } from "react";

const DashboardStoreStep2 = observer(
    ({ setStoreFormik, handleImageUpload, images, setImages }) => {
        const theme = useTheme();
        const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
        const isMediumScreen = useMediaQuery(
            theme.breakpoints.between("sm", "md"),
        );
        const [currentIndex, setCurrentIndex] = useState(0);

        const handleRemoveImage = (index) => {
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
                {/* Lista de miniaturas e botão de upload quando há imagens carregadas */}
                {images.length > 0 && (
                    <Box
                        sx={{
                            width:
                                isSmallScreen || isMediumScreen
                                    ? "100%"
                                    : "80%",
                            display: "flex",
                            gap: 1,
                            mb: 2,
                            overflowX: "auto",
                            justifyContent: "center",
                        }}
                    >
                        {/* Botão de adicionar imagem */}
                        <Box
                            sx={{
                                width: 70,
                                height: 70,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                            onClick={() =>
                                document.getElementById("imageUpload")?.click()
                            }
                        >
                            <PhotoCamera />
                            <input
                                hidden
                                id="imageUpload"
                                accept="image/*"
                                type="file"
                                multiple
                                onChange={handleImageUpload}
                            />
                        </Box>

                        {/* Miniaturas das imagens carregadas */}
                        {images.map((image, index) => (
                            <Box key={index} sx={{ position: "relative" }}>
                                <img
                                    src={image}
                                    alt={`Miniatura ${index + 1}`}
                                    style={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setCurrentIndex(index)}
                                />
                                <IconButton
                                    onClick={() => handleRemoveImage(index)}
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        backgroundColor: "rgba(255, 0, 0, 0.7)",
                                        color: "white",
                                        p: 0.5,
                                    }}
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Imagem de destaque ou botão de upload inicial */}
                <Box
                    sx={{
                        width: isSmallScreen || isMediumScreen ? "100%" : "80%",
                        height: 300,
                        position: "relative",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    {images.length > 0 ? (
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
                    ) : (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}
                            onClick={() =>
                                document.getElementById("imageUpload")?.click()
                            }
                        >
                            <PhotoCamera sx={{ fontSize: "3rem" }} />
                            <Typography
                                sx={{
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                    mt: 2,
                                }}
                            >
                                Adicionar Imagem de Fundo
                            </Typography>
                        </Box>
                    )}
                    <input
                        hidden
                        id="imageUpload"
                        accept="image/*"
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                    />
                </Box>

                {/* Formulário */}
                <Paper
                    sx={{
                        display: "flex",
                        flexDirection:
                            isSmallScreen || isMediumScreen ? "row" : "column",
                        p: 5,
                        backgroundColor: "rgba(0, 255, 255, 0.1)",
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
                        <Typography
                            sx={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                textAlign: "left",
                            }}
                        >
                            Dados da sua Loja
                        </Typography>
                        <DashboardStoreCreateForm
                            passFormik={setStoreFormik}
                            images={images}
                        />
                    </Box>
                </Paper>
            </Box>
        );
    },
);

export default DashboardStoreStep2;
