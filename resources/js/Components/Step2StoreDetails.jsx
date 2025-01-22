import {Paper, Box, Typography, IconButton } from "@mui/material";
import FormStoreRegistration from './FormStoreRegistration';
import { PhotoCamera } from "@mui/icons-material";
import {useState} from 'react';
import {observer} from "mobx-react";

const Step2StoreDetails = observer(({setStoreFormik}) => {

    const [backgroundImage, setBackgroundImage] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setBackgroundImage(reader.result);
            reader.readAsDataURL(file);
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
                m:"auto",
            }}
        >
            {/* Background Image Section */}
            <Box
                sx={{
                    height: 300,
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
                    backgroundColor: backgroundImage ? "none" : "rgba(0, 0, 0, 0.1)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    width: "82%",
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center", // Centraliza o ícone ou o conteúdo
                }}
            >
                {!backgroundImage && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                        >
                            <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                            <PhotoCamera sx={{ fontSize: "3rem" }} />
                        </IconButton>
                        <Typography
                            sx={{
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            Adicionar Imagem de Fundo
                        </Typography>
                    </Box>

                )}
            </Box>

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
                    <FormStoreRegistration passFormik = {setStoreFormik}/>
                </Box>
            </Paper>

        </Box>
    );
});

export default Step2StoreDetails;
