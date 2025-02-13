import { useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ReactMarkdown from "react-markdown";

const DashboardShowProduct = ({ product }) => {
    const theme = useTheme();
    const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md")); // Para ecrãs pequenos e médios

    // Verifica se há imagens na galeria e define a primeira corretamente
    const [selectedImage, setSelectedImage] = useState(
        product?.gallery[0].image_link,
    );

    return (
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    alignItems: smallerThanMedium ? "center" : "flex-start",
                    flexDirection: smallerThanMedium ? "column" : "row",
                    gap: 2,
                }}
            >
                {/* **Coluna das Miniaturas (Esquerda)** */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: smallerThanMedium ? "column" : "row",
                        // overflowX: smallerThanMedium ? "auto" : "visible",
                        gap: 1,
                    }}
                >
                    {product?.gallery &&
                        product?.gallery.map((image, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "6px",
                                    overflow: "hidden",
                                    border:
                                        selectedImage === image.image_link
                                            ? `2px solid ${theme.palette.primary.main}`
                                            : "1px solid grey",
                                    cursor: "pointer",
                                }}
                                onClick={() =>
                                    setSelectedImage(image.image_link)
                                }
                            >
                                <img
                                    src={image.image_link}
                                    alt={`Thumb-${index}`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </Box>
                        ))}
                </Box>

                {/* **Imagem Principal (Centro)** */}
                <Box
                    sx={{
                        width: smallerThanMedium ? "100%" : "50%",
                        height: 320,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                        borderRadius: "16px",
                    }}
                >
                    <img
                        src={selectedImage}
                        alt="Selected"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </Box>

                {/* **Campos do Produto (Direita)** */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignSelf: "flex-start",
                        justifyContent: "center",
                        minHeight: "320px",
                        ml: 2,
                        gap: 2,
                    }}
                >
                    <Typography>
                        <strong>Nome:</strong> {product.name}
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
                    <Box>
                    <ReactMarkdown>
                        {product.description}
                    </ReactMarkdown>
                    </Box>
                </Box>
            </Box>
    );
};

export default DashboardShowProduct;
