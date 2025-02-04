import { Card, CardContent, Typography, Divider, Box } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import ReactMarkdown from "react-markdown";
import { truncateDescription } from "../utils/utils";

const VendorRegistrationProductCard = ({ product }) => {
    return (
        <Card
            sx={{
                width: "100%", // Ocupa toda a célula da grid
                height: "100%", // Mantém o tamanho uniforme com os outros cards
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                    transform: "scale(1.02)", // Efeito suave sem ultrapassar limites
                },
            }}
        >
            {/* Carrossel de Imagens - Com altura fixa */}
            <Box
                sx={{
                    width: "100%",
                    height: "155px", // Fixar altura do carrossel
                    overflow: "hidden",
                    "&:hover .MuiButtonBase-root": {
                        opacity: 1, // Mostrar os botões ao passar o rato sobre a imagem
                    }
                }}
            >
                <Carousel
                    autoPlay={false}
                    indicators={false} // Esconder indicadores para um design mais limpo
                    navButtonsAlwaysVisible={true}
                    sx={{
                        width: "100%",
                        height: "100%",
                        "& .MuiButtonBase-root": {
                            backgroundColor: "rgba(0, 0, 0, 0.2) !important", // Fundo cinza claro discreto
                            color: "#fff", // Setas brancas
                            boxShadow: "none !important", // Sem sombras
                            borderRadius: "50%", // Fundo arredondado
                            width: "30px", // Ajusta tamanho da área do botão
                            height: "30px",
                            opacity: 0, // Esconde por padrão
                            transition: "opacity 0.3s ease-in-out, background-color 0.3s ease-in-out",
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.3) !important", // Ligeiramente mais escuro ao passar o rato
                            },
                        },
                        "& .MuiSvgIcon-root": {
                            fontSize: "2rem", // Ajusta o tamanho das setas
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
                                objectFit: "cover", // Ajusta a imagem ao espaço sem distorcer
                            }}
                        />
                    ))}
                </Carousel>
            </Box>

            {/* Informações do Produto */}
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                {/* Nome do Produto */}
                <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", marginBottom: "4px", textAlign: "left" }}
                >
                    {product.name}
                </Typography>

                {/* Descrição */}
                <Box
                    sx={{
                        fontSize: 14,
                        maxHeight: "60px", // Define a altura máxima
                        lineHeight: "20px", // Mantém espaçamento consistente
                        overflow: "hidden", // Esconde conteúdo extra
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3, // Limita a 3 linhas antes de cortar
                        textOverflow: "ellipsis", // Adiciona "..." ao final
                        whiteSpace: "normal", // Permite quebra de linha conforme necessário
                        wordBreak: "break-word", // Garante que palavras longas sejam quebradas
                    }}
                >
                    {product.description}
                </Box>

                {/* Stock e Preço */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ fontWeight: "500" }}>
                        Stock: {product.stock}
                    </Typography>

                    <Typography
                        variant="h6"
                        color="primary"
                        sx={{ fontWeight: "bold" }}
                    >
                        {product.price.toLocaleString("pt-PT", {
                            style: "currency",
                            currency: "EUR",
                        })}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default VendorRegistrationProductCard;
