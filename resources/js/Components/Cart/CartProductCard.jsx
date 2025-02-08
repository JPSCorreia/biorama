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

const CartProductCard = observer(({ product }) => {
    const theme = useTheme();

    const smallerThanMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
    const storeId = product.store.id;
    const cartItems = cartStore.cart[storeId] || [];
    const cartItem = cartItems.find((item) => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

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
                minWidth: 220,
                width: smallerThanMediumScreen ? "40%" : "20%",
                maxWidth: "220px",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: 3,
                minHeight: 360,
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

            {/* Imagem */}
            <CardMedia
                sx={{
                    height: 120,
                    width: "100%",
                    objectFit: "cover",
                    backgroundColor: theme.palette.primary.main,
                }}
                image={product.gallery[0]?.image_link}
            />

            {/* Descrição e Preço Total */}
            <CardContent sx={{ pb: "0 !important", pt: ".5rem !important" }}>
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
                    {/* Preço Total */}
                    <Box
                        display="flex"
                        alignItems="baseline"
                        sx={{ flexDirection: "row", mb: 1 }}
                    >
                        <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
                            Total:
                        </Typography>
                        <Typography
                            color="terciary"
                            sx={{ fontWeight: "bold", fontSize: 18, ml: 1 }}
                        >
                            €{totalPrice}
                        </Typography>
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
