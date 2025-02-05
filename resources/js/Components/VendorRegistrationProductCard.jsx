import { Card, CardContent, CardMedia, Typography, Box, Tooltip, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import AddShoppingCartSharpIcon from "@mui/icons-material/AddShoppingCartSharp";
import ReactMarkdown from "react-markdown";
import Carousel from "react-material-ui-carousel";

const VendorRegistrationProductCard = ({ product }) => {
    const theme = useTheme();
    const smallerThanMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
    return (
        <Card
            sx={{
                minWidth: 220,
                width: smallerThanMediumScreen ? "50%" : "20%",
                maxWidth: "220px",
                mr: 2,
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: 3,
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}
        >
            {/* Nome do Produto */}
            <CardContent
                sx={{
                    textAlign: "center",
                    pt: 1,
                    pb: 0.75,
                    backgroundColor: theme.palette.primary.main,
                }}
            >
                <Typography fontWeight="bold" noWrap sx={{ color: "white" }}>
                    {product.name || "Produto sem nome"}
                </Typography>
            </CardContent>

            {/* Carrossel de Imagens */}
            <Box
                sx={{
                    width: "100%",
                    height: "180px",
                    overflow: "hidden",
                    "&:hover .MuiButtonBase-root": {
                        opacity: 1,
                    }
                }}
            >
                <Carousel
                    autoPlay={false}
                    indicators={false}
                    navButtonsAlwaysVisible={true}
                    sx={{
                        width: "100%",
                        height: "100%",
                        "& .MuiButtonBase-root": {
                            backgroundColor: "rgba(0, 0, 0, 0.2) !important",
                            color: "#fff",
                            boxShadow: "none !important",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            opacity: 0,
                            transition: "opacity 0.3s ease-in-out, background-color 0.3s ease-in-out",
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.3) !important",
                            },
                        },
                        "& .MuiSvgIcon-root": {
                            fontSize: "2rem",
                        }
                    }}
                >
                    {product.gallery.map((image, index) => (
                        <img
                            key={index}
                            src={image.image_link}
                            alt={`product-${index}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ))}
                </Carousel>
            </Box>

            {/* Descrição e Preço */}
            <CardContent
                sx={{
                    pb: "0 !important",
                    pt: ".5rem !important",
                }}
            >
                <Box sx={{ mb: 1, display: "flex", flexDirection: "column" }}>
                    <Box
                        sx={{
                            minHeight: "140px",
                            fontSize: 14,
                            fontWeight: "normal",
                        }}
                    >
                        <ReactMarkdown>{product.description}</ReactMarkdown>
                    </Box>
                    <Typography sx={{ fontSize: 12 }}>Preço por unidade:</Typography>
                    {product.discount > 0 ? (
                        <Box display="flex" alignItems="baseline" gap={1}>
                            <Typography
                                sx={{
                                    textDecoration: "line-through",
                                    fontSize: 14,
                                    color: "red",
                                    lineHeight: 1,
                                }}
                            >
                                {Number(product.price).toFixed(2)}€
                            </Typography>
                            <Typography
                                color="primary"
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: 20,
                                    lineHeight: 1,
                                }}
                            >
                                {(Number(product.price) * (1 - product.discount / 100)).toFixed(2)}€
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: 14,
                                    lineHeight: 1,
                                    mb: "2px",
                                }}
                            >
                                (-{Number(product.discount).toFixed(0)}%)
                            </Typography>
                        </Box>
                    ) : (
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                fontSize: 17,
                            }}
                        >
                            {Number(product.price).toFixed(2)}€
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default VendorRegistrationProductCard;
