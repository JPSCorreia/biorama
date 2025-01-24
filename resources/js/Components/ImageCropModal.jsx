import React, { useState, useCallback } from "react";
import { Modal, Box, Button, Slider, Typography } from "@mui/material";
import Cropper from "react-easy-crop";

const ImageCropModal = ({ open, image, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const aspectRatio = 4 / 3; // Mantém o ratio 4:3

    const onCropAreaChange = useCallback((_, areaPixels) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const handleCrop = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = image;

        img.onload = () => {
            // Configurar a resolução de saída (800x600)
            canvas.width = 800;
            canvas.height = 600;

            // Desenhar a área recortada na resolução correta
            ctx.drawImage(
                img,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                canvas.width,
                canvas.height
            );

            // Converter para Base64 no formato PNG
            const croppedImageBase64 = canvas.toDataURL("image/png", 1.0); // Qualidade máxima (100%)

            // Converter Base64 para Objeto File
            const croppedImageFile = base64ToFile(croppedImageBase64, "cropped-image.png");

            // Enviar o ficheiro para o componente pai
            onCropComplete(croppedImageFile);
        };
    };

    // Função para converter Base64 em File
    const base64ToFile = (base64String, filename) => {
        const arr = base64String.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    width: "90%",
                    maxWidth: 800,
                    height: 600,
                    backgroundColor: "white",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 2,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Ajuste a sua imagem para 800x600 (Ratio 4:3)
                </Typography>
                <Box sx={{ position: "relative", width: "100%", height: "70%" }}>
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio} // Força o ratio 4:3
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropAreaChange}
                    />
                </Box>
                <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e, value) => setZoom(value)}
                    sx={{ mt: 2, width: "90%" }}
                />
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button variant="contained" onClick={handleCrop}>
                        Confirmar
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        Cancelar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ImageCropModal;
