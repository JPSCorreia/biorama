import React, { useState, useCallback } from "react";
import { Modal, Box, Button, Slider, Typography } from "@mui/material";
import Cropper from "react-easy-crop";

const ImageCropModal = ({ open, image, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const aspectRatio = 4 / 3; // Mantém 800x600

    // Captura a área recortada
    const onCropAreaChange = useCallback((_, areaPixels) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    // Processa e corta a imagem
    const handleCrop = async () => {
        if (!croppedAreaPixels || !image) return;

        try {
            const { base64, file } = await getCroppedImage(image, croppedAreaPixels, "cropped-image.png");

            // Retorna o Base64 para preview e o File para envio
            if (onCropComplete) {
                onCropComplete(base64, file);
            }

            onClose(); // Fecha o modal
        } catch (error) {
            console.error("Erro ao processar a imagem:", error);
        }
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

    // Processar e cortar a imagem para 800x600
    const getCroppedImage = (imageSrc, cropPixels, filename) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = imageSrc;
            image.crossOrigin = "anonymous";

            image.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // Define a resolução exata do corte
                canvas.width = 800;
                canvas.height = 600;

                ctx.drawImage(
                    image,
                    cropPixels.x,
                    cropPixels.y,
                    cropPixels.width,
                    cropPixels.height,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                // Converter a imagem cortada para Base64
                const croppedImageBase64 = canvas.toDataURL("image/png", 1.0);

                // Converter Base64 para File
                const croppedImageFile = base64ToFile(croppedImageBase64, filename);

                resolve({ base64: croppedImageBase64, file: croppedImageFile });
            };

            image.onerror = (error) => reject(error);
        });
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
                {/* Verificar se há uma imagem antes de renderizar o Cropper */}
                {image ? (
                    <Box sx={{ position: "relative", width: "100%", height: "70%" }}>
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio} // Mantém 4:3
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropAreaChange}
                        />
                    </Box>
                ) : (
                    <Typography color="error">Nenhuma imagem carregada.</Typography>
                )}

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
