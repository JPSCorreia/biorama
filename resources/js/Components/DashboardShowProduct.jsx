import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { fixImagePath } from "../utils/utils.js";

const DashboardShowProduct = ({ product }) => {
    // Verifica se há imagens na galeria e define a primeira corretamente
    const [selectedImage, setSelectedImage] = useState(
        product?.gallery && product?.gallery.length > 0
            ? product?.gallery[0].image_link
            : "/images/default-image.jpg" // Imagem padrão caso não haja imagens
    );

    return (
        <Box>

            <Box sx={{ display: "flex", gap: 2 }}>
                {/* **Coluna das Miniaturas (Esquerda)** */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {product?.gallery && product?.gallery.map((image, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "6px",
                                overflow: "hidden",
                                border: selectedImage === image.image_link ? "2px solid blue" : "1px solid grey",
                                cursor: "pointer",
                            }}
                            onClick={() => setSelectedImage(image.image_link)}
                        >
                            <img
                                src={image.image_link}
                                alt={`Thumb-${index}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </Box>
                    ))}
                </Box>

                {/* **Imagem Principal (Centro)** */}
                <Box
                    sx={{
                        width: "40%",
                        height: 320,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                        borderRadius:"16px",
                    }}
                >
                    <img
                        src={selectedImage}
                        alt="Selected"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
