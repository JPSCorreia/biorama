import { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    IconButton,
    TextField,
    Button,
} from "@mui/material";
import {fixImagePath} from "../utils/utils.js";


const DashboardShowProduct = ({ product}) => {
    const [selectedImage, setSelectedImage] = useState(product.gallery ? product.gallery[0] : "");


    return (
        <Box>
            {/* Cabeçalho do Modal */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5">Detalhes do Produto</Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
                {/* **Coluna das Miniaturas (Esquerda)** */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {product.gallery.map((image, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "6px",
                                overflow: "hidden",
                                border: selectedImage === fixImagePath(image.image_link) ? "2px solid blue" : "1px solid grey",
                                cursor: "pointer",
                            }}
                            onClick={() => setSelectedImage(fixImagePath(image.image_link))}
                        >
                            <img
                                src={fixImagePath(image.image_link)}
                                alt={`Thumb-${index}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </Box>
                    ))}
                </Box>

                {/* **Imagem Principal (Centro)** */}
                <Box
                    sx={{
                        width: "50%",
                        height: 300,
                        border: "2px dashed grey",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                    }}
                >
                    <img
                        src={selectedImage}
                        alt="Selected"
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                </Box>

                {/* **Campos do Produto (Direita)** */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography>
                        <strong>Nome:</strong> {product.name}
                    </Typography>
                    <Typography>
                        <strong>Descrição:</strong> {product.description}
                    </Typography>
                    <Typography>
                        <strong>Stock:</strong> {product.stock}
                    </Typography>
                    <Typography>
                        <strong>Desconto:</strong> {product.discount}%
                    </Typography>
                    <Typography>
                        <strong>Preço:</strong> {product.price} €
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardShowProduct;
