import { useState } from "react";
import Cropper from "react-easy-crop";
import { Button, Box, Typography } from "@mui/material";

const ImageUpload = ({ onImageProcessed }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => setSelectedImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCrop = async () => {
        if (!croppedAreaPixels || !selectedImage) return;

        // Cria um canvas para processar a área cortada
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Carrega a imagem original
        const image = new Image();
        image.src = selectedImage;
        await new Promise((resolve) => {
            image.onload = resolve;
        });

        // Define o tamanho do canvas baseado na área cortada
        const { width, height } = croppedAreaPixels;
        canvas.width = width;
        canvas.height = height;

        // Desenha a área cortada no canvas
        ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            width,
            height
        );

        // Converte o canvas para Blob e chama a função de callback
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    const processedImageURL = URL.createObjectURL(blob);
                    onImageProcessed(processedImageURL);
                }
            },
            "image/jpeg",
            1 // Qualidade máxima
        );
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Enviar e Redimensionar Imagem
            </Typography>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {selectedImage && (
                <Box sx={{ mt: 2, position: "relative", height: 400, width: "100%" }}>
                    <Cropper
                        image={selectedImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={4 / 3}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={handleCropComplete}
                    />
                </Box>
            )}
            {selectedImage && (
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={handleCrop}
                >
                    Redimensionar e Enviar
                </Button>
            )}
        </Box>
    );
};

export default ImageUpload;
