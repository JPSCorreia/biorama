import {
    Paper,
    Box,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery,
    Tooltip,
} from "@mui/material";
import { FormStoreRegistration } from "@/Components";
import {
    ArrowBackIos,
    ArrowForwardIos,
    Delete,
    PhotoCamera,
} from "@mui/icons-material";
import { forwardRef, useEffect, useState } from "react";
import { AlertBox } from "@/Components/index.js";

const Step2StoreDetails = forwardRef(
    ({ formErrors, images, setImages, handleImageUpload, showAlert }, ref) => {

        const theme = useTheme();
        const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
        const isMediumScreen = useMediaQuery(
            theme.breakpoints.between("sm", "md"),
        );

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
                }}
            >
                {showAlert && <AlertBox />}

                {images.length <= 0 && (
                    <Box sx={{ minHeight: "57px" }}></Box>
                )}

                {/* Div para o botão de upload e miniaturas */}
                {images.length >= 1 && (
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 2,
                            mb: 1,
                        }}
                    >
                        {images.length < 3 && (
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
                                    }}
                                >
                                    <PhotoCamera />
                                </IconButton>
                            </Tooltip>
                        )}

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                            }}
                        >
                            {images.map((image, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <img
                                        src={image}
                                        alt={`Miniatura ${index + 1}`}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => setCurrentIndex(index)}
                                    />
                                    <Tooltip title="Apagar">
                                        <IconButton
                                            onClick={() =>
                                                handleDeleteImage(index)
                                            }
                                            sx={{
                                                position: "absolute",
                                                right: 7,
                                                top: 7,
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
                    </Box>
                )}

                {/* Carrossel de imagens */}
                <Box
                    sx={{
                        width: "100%",
                        height: 250,
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                        }}
                    >
                        <input
                            hidden
                            id="imageUpload"
                            accept="image/*"
                            type="file"
                            multiple
                            onChange={handleImageUpload}
                        />
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
                                    "&:hover": {
                                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                                    },
                                }}
                                onClick={() =>
                                    document
                                        .getElementById("imageUpload")
                                        ?.click()
                                }
                            >
                                <PhotoCamera sx={{ fontSize: "3rem" }} />
                                <Typography
                                    sx={{
                                        fontSize: "1.2rem",
                                        fontWeight: "bold",
                                        ml: 2,
                                    }}
                                >
                                    Adicionar Imagem de Fundo
                                </Typography>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    position: "relative",
                                }}
                            >
                                <img
                                    src={images[currentIndex]}
                                    alt={`Imagem ${currentIndex + 1}`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        maxHeight: 250,
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                    }}
                                />
                                {images.length > 1 && (
                                    <>
                                        <IconButton
                                            onClick={() =>
                                                setCurrentIndex(
                                                    (prev) =>
                                                        (prev -
                                                            1 +
                                                            images.length) %
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
                                                        theme.palette.primary
                                                            .main,
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
                                                        (prev + 1) %
                                                        images.length,
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
                                                        theme.palette.primary
                                                            .main,
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
                        )}
                    </Box>
                </Box>

                <Paper
                    elevation={4}
                    sx={{
                        display: "flex",
                        flexDirection:
                            isSmallScreen || isMediumScreen ? "row" : "column",
                        p: 3,
                        width: "90%",
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
                        <FormStoreRegistration
                            ref={ref}
                            formErrors={formErrors?.store}
                        />
                    </Box>
                </Paper>
            </Box>
        );
    },
);

export default Step2StoreDetails;
