import { observer } from "mobx-react";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Tooltip,
    IconButton,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    Delete as DeleteIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
} from "@mui/icons-material";
import { cartStore } from "../../Stores";
import ReactMarkdown from "react-markdown";
import Carousel from "react-material-ui-carousel";
import {useState} from "react";

const CartProductCard = observer(({ product }) => {
    const theme = useTheme();

    const smallerThanMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
    const storeId = product.store.id;
    const cartItems = cartStore.cart[storeId] || [];
    const cartItem = cartItems.find((item) => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    const [previewIndex, setPreviewIndex] = useState(0);


    const totalPrice = cartItem
        ? (
              cartItem.price *
              cartItem.quantity *
              (1 - cartItem.discount / 100)
          ).toFixed(2)
        : "0.00";

    return (
        <Card
            sx={{
                width: 250,
                height: 460,
                boxShadow: 3,
                borderRadius: "10px",
                overflow: "hidden",
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                backgroundColor: theme.palette.background.paper,
                cursor: "pointer",
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
            key={product.id}
        >
            {/* Desconto no canto superior direito */}
            {product.discount > 0 && (
                <Box
                    sx={{
                        position: "absolute",
                        top: "-13px",
                        right: "-68px",
                        width: "75px",
                        height: "92px",
                        backgroundColor: theme.palette.primary.main,
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "end",
                        justifyContent: "center",

                        transform: "rotate(45deg)", // Inclina a etiqueta para criar o efeito de triângulo
                        transformOrigin: "top right",
                        zIndex: 100,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "14px",
                        }}>

                        -{Number(product.discount).toFixed(0)}%</Typography>

                </Box>
            )}

            <Box sx={{ height: "40%", overflow: "hidden", position: "relative" }}>
                <Carousel
                    autoPlay={false}
                    indicators={false}
                    navButtonsAlwaysVisible={true}
                    index={previewIndex}
                    onChange={(index) => setPreviewIndex(index)}
                    sx={{
                        width: "100%",
                        height: "100%",
                        "& .MuiButtonBase-root": {
                            backgroundColor: "rgba(0, 0, 0, 0.3) !important",
                            color: "#fff",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            opacity: 0.8,
                            transition: "opacity 0.3s ease-in-out",
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.5) !important",
                            },
                        },
                        "& .MuiSvgIcon-root": {
                            fontSize: "1.8rem",
                        },
                    }}
                >
                    {product.gallery.length > 0 ? (
                        product.gallery.map((img, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: "100%",
                                    height: "180px",
                                    backgroundImage: `url(${img.image_link})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}
                            />
                        ))
                    ) : (
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                backgroundImage: "url('/images/default-store.jpg')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                    )}
                </Carousel>
            </Box>

            <CardContent
                sx={{
                    pb: "0 !important",
                    pt: ".5rem !important",
                    height: "60%",
                }}
            >
                <Box sx={{ mb: 1, display: "flex", flexDirection: "column" }}>
                    <Box>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: "bold",
                                fontSize: 20,
                                lineHeight: 1,
                                display: "flex",
                                alignItems: "center",
                                color: theme.palette.primary.main,
                            }}
                        >
                            {product.name}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            minHeight: "125px",
                            fontSize: 14,
                            fontWeight: "normal",
                        }}
                    >
                        <ReactMarkdown>{product.description}</ReactMarkdown>
                    </Box>
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            minHeight:"36px",
                            mb:2
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column", // Agora os preços estão em coluna
                                alignItems: "flex-start",
                            }}
                        >
                            {product.discount > 0 ? (
                                <>
                                    <Typography
                                        color="primary"
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: 18,
                                            lineHeight: 1,
                                            display: "flex",
                                            alignItems: "baseline",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        {(
                                            Number(product.price) *
                                            (1 - product.discount / 100)
                                        ).toFixed(2)}
                                        €
                                    </Typography>
                                    <Typography
                                        sx={{
                                            textDecoration: "line-through",
                                            fontSize: 13,
                                            color: "red",
                                            lineHeight: 1,
                                            display: "flex",
                                            alignItems: "baseline",
                                            mt: 0.5, // Pequeno espaçamento entre os preços
                                        }}
                                    >
                                        {Number(product.price).toFixed(2)}€
                                    </Typography>
                                </>
                            ) : (
                                <Typography
                                    sx={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                        fontWeight: "bold",
                                        fontSize: 17,
                                    }}
                                >
                                    {Number(product.price).toFixed(2)}€
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    {/* Contador de Quantidade */}
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        gap={1}
                        mb={0.5}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            border="1px solid #ccc"
                            borderRadius="4px"
                            gap={1}
                            p={0.5}
                        >
                            <Tooltip title="Remover quantidade">
                                <span>
                                    <IconButton
                                        sx={{ color: "red" }}
                                        disabled={quantity <= 1}
                                        onClick={() =>
                                            cartStore.deleteItem(
                                                storeId,
                                                product.id,
                                            )
                                        }
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Typography
                                sx={{ minWidth: "20px", textAlign: "center" }}
                            >
                                {quantity}
                            </Typography>
                            <Tooltip title="Adicionar quantidade">
                                <IconButton
                                    sx={{ color: "green" }}
                                    onClick={() =>
                                        cartStore.addItem({
                                            ...product,
                                            quantity: 1,
                                        })
                                    }
                                >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Tooltip title="Remover todos">
                            <IconButton
                                color="textSecondary"
                                sx={{ width: 40, height: 40 }}
                                onClick={() =>
                                    cartStore.removeAllOfItem(
                                        storeId,
                                        product.id,
                                    )
                                }
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
});

export default CartProductCard;
