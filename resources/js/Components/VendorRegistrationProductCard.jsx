import { Card, CardContent, Typography, Divider } from "@mui/material";
import Carousel from "react-material-ui-carousel";

const VendorRegistrationProductCard = ({ product }) => {
    return (
        <Card
            sx={{
                maxWidth: 400,
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Nome do Produto */}
            <Typography
                variant="h6"
                component="div"
                sx={{
                    padding: "16px",
                    textAlign: "center",
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                }}
            >
                {product.name}
            </Typography>

            {/* Carrossel de Imagens */}
            <Carousel
                autoPlay={false}
                indicators={true}
                navButtonsAlwaysVisible={true}
                sx={{
                    "& img": { width: "100%", maxHeight: "200px", objectFit: "cover" },
                }}
            >
                {product.images.map((image, index) => (
                    <img src={image} alt={`product-${index}`} key={index} />
                ))}
            </Carousel>

            {/* Informações do Produto */}
            <CardContent sx={{ flexGrow: 1 }}>
                {/* Descrição */}
                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginBottom: "8px" }}
                >
                    {product.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Como é vendido */}
                <Typography variant="body2" sx={{ fontWeight: "500", marginBottom: "8px" }}>
                    Vendido por: {product.unitType === "kg" ? "Kilograma (kg)" : "Unidade"}
                </Typography>

                {/* Preço */}
                <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: "bold", textAlign: "right" }}
                >
                    {product.price.toLocaleString("pt-PT", {
                        style: "currency",
                        currency: "EUR",
                    })}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default VendorRegistrationProductCard;
