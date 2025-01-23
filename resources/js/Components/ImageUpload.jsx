import { useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@mui/material";

const ImageUpload = ({ onImageProcessed }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [cropData, setCropData] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => setSelectedImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleCrop = () => {
        // Process cropData to get the resized image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        // Define the size here
        canvas.width = 800; // exemplo
        canvas.height = 600; // exemplo
        ctx.drawImage(selectedImage, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            onImageProcessed(blob);
        });
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {selectedImage && (
                <div>
                    <Cropper
                        image={selectedImage}
                        crop={{ x: 0, y: 0 }}
                        zoom={1}
                        aspect={4 / 3}
                        onCropChange={(crop) => setCropData(crop)}
                    />
                    <Button onClick={handleCrop}>Redimensionar e Enviar</Button>
                </div>
            )}
        </div>
    );
};
export default ImageUpload;
