import { Paper, Box, Typography, IconButton, ImageList, ImageListItem } from "@mui/material";
import FormStoreRegistration from "./FormStoreRegistration";
import { PhotoCamera } from "@mui/icons-material";
import { observer } from "mobx-react";

const Step2StoreDetails = observer(({ setStoreFormik, handleImageUpload, images }) => {
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
            {/* ImageList Section */}
            <Box
                sx={{
                    width: "82%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {images.length === 0 ? (
                    <Box
                        sx={{
                            height: 300,
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 2,
                        }}
                    >
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                        >
                            <input hidden accept="image/*" type="file" multiple onChange={handleImageUpload} />
                            <PhotoCamera sx={{ fontSize: "3rem" }} />
                        </IconButton>
                        <Typography
                            sx={{
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                textAlign: "center",
                                ml: 2,
                            }}
                        >
                            Adicionar Imagem de Fundo
                        </Typography>
                    </Box>
                ) : (
                    <ImageList
                        sx={{
                            width: "100%",
                            height: 300,
                            overflow: "hidden",
                            borderRadius: 2,
                            position: "relative",
                        }}
                        cols={1} // Exibir uma imagem por vez
                    >
                        {images.map((image, index) => (
                            <ImageListItem key={index}>
                                <img
                                    src={image}
                                    alt={`Imagem ${index + 1}`}
                                    loading="lazy"
                                    style={{ borderRadius: "10px" }}
                                />
                            </ImageListItem>
                        ))}
                        {/* Botão para adicionar mais imagens */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 16,
                                right: 16,
                                backgroundColor: "rgba(255, 255, 255, 0.7)",
                                borderRadius: "50%",
                            }}
                        >
                            <IconButton
                                color="primary"
                                aria-label="upload more pictures"
                                component="label"
                            >
                                <input hidden accept="image/*" type="file" multiple onChange={handleImageUpload} />
                                <PhotoCamera />
                            </IconButton>
                        </Box>
                    </ImageList>
                )}
            </Box>

            {/* Form Section */}
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 5,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    boxShadow: 3,
                    width: "80%",
                    position: "relative",
                    mt: -5,
                    mb: 7,
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
                    <FormStoreRegistration passFormik={setStoreFormik} images={images} />
                </Box>
            </Paper>
        </Box>
    );
});

export default Step2StoreDetails;
