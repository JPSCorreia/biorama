import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { Delete, PhotoCamera, ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
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
                }}
            >
                {/* Imagem de destaque ou botão de upload inicial */}
                <Box
                    sx={{
                        width: "100%",
                        height: 250,
                        position: "relative",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                    }}
                >
                    {images.length > 0 ? (
                        <Box sx={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                        }}>
                            <img
                                src={images[currentIndex]}
                                alt={`Imagem ${currentIndex + 1}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                            {images.length > 1 && (
                                <>
                                    <IconButton
                                        onClick={() =>
                                            setCurrentIndex(
                                                (prev) =>
                                                    (prev - 1 + images.length) %
                                                    images.length,
                                            )
                                        }
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: 10,
                                            height: "40px",
                                            width: "40px",
                                            transform: "translateY(-50%)",
                                            color: "#242424",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#121212",
                                            opacity: 0.8,
                                            "&:hover": {
                                                backgroundColor:
                                                    theme.palette.primary.main,
                                                opacity: 0.8,
                                            },
                                        }}
                                        size="medium"
                                    >
                                        <ArrowBackIos
                                            sx={{
                                                ml: 1,
                                                height: 24,
                                                width: 24,
                                                color: "#ffffff",
                                            }}
                                        />
                                    </IconButton>

                                    <IconButton
                                        onClick={() =>
                                            setCurrentIndex(
                                                (prev) =>
                                                    (prev + 1) % images.length,
                                            )
                                        }
                                        sx={{
                                            position: "absolute",
                                            display: "flex",
                                            top: "50%",
                                            right: 10,
                                            transform: "translateY(-50%)",
                                            color: "#242424",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#121212",
                                            opacity: 0.8,
                                            "&:hover": {
                                                backgroundColor:
                                                    theme.palette.primary.main,
                                                opacity: 0.8,
                                            },
                                        }}
                                    >
                                        <ArrowForwardIos
                                            sx={{
                                                height: 24,
                                                width: 24,
                                                color: "#ffffff",
                                            }}
                                        />
                                    </IconButton>
                                </>
                            )}
                        </Box>
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
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        position: "relative",
                        p: 3,
                        pt: 1,
                        pb: 0,
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                textAlign: "left",
                            }}
                        >
                            Criar loja
                        </Typography>
                        <DashboardStoreCreateForm
                            passFormik={setStoreFormik}
                            images={images}
                        />
                    </Box>
                    {/* Lista de miniaturas e botão de upload quando há imagens carregadas */}
                    {images.length > 0 && (
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                gap: 2,
                                overflowX: "auto",
                                justifyContent: "center",
                                height: 80,
                            }}
                        >
                            {/* Botão de adicionar imagem */}
                            <Tooltip title="Adicionar imagem">
                                <IconButton
                                    onClick={() =>
                                        document
                                            .getElementById("imageUpload")
                                            ?.click()
                                    }
                                    sx={{
                                        backgroundColor:
                                            "rgba(255, 255, 255, 0.4)",
                                            height: 40,
                                            alignSelf: "center"
                                    }}
                                >
                                    <PhotoCamera />
                                </IconButton>
                            </Tooltip>

                            {/* Miniaturas das imagens carregadas */}

                            {images.map((image, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position: "relative",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
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
                                    <Tooltip title="Apagar">
                                        <IconButton
                                            onClick={() =>
                                                handleRemoveImage(index)
                                            }
                                            sx={{
                                                position: "absolute",
                                                right: 17,
                                                top: 20,
                                                height: 36,
                                                width: 36,
                                                color: theme.palette.message
                                                    .error,
                                                "&:hover": {
                                                    backgroundColor:
                                                        "rgba(255, 255, 255, 0.6)",
                                                },
                                            }}
                                        >
                                            <Delete
                                                sx={{ fontSize: "1.5rem" }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            ))}
                        </Box>
                    )}
                    {images.length == 0 && <Box sx={{ height: 80 }}></Box>}
                </Box>
            </Box>
        );
    },
);

export default DashboardStoreStep2;
