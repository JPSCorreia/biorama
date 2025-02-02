import { observer } from "mobx-react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Typography,
    Tooltip,
    IconButton,
    Avatar,
    Rating,
    useTheme,
    useMediaQuery,
} from "@mui/material";

import { AddShoppingCartSharp as AddShoppingCartSharpIcon } from "@mui/icons-material";
import { cartStore } from "../Stores";

const StoreVendorCard = observer(({ product, image_test }) => {
    console.log(product);

    const theme = useTheme();
    const smallerThanMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Card
            sx={{
                minWidth: 220,
                width: smallerThanMediumScreen ? "40%" : "20%",
                maxWidth: "220px",
                mr: 2,
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: 3,
                minHeight: 250,
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}
        >
            {/* Conteúdo do Card */}
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

            <CardMedia
                sx={{
                    height: 180,
                    width: "100%",
                    objectFit: "cover",
                    backgroundColor: theme.palette.primary.main,
                }}
                image={image_test}
            />

            {/* Informações */}
            <CardContent
                sx={{
                    pb: "0.25rem !important",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                }}
            >
                <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>Preço por unidade:</Typography>
                    {product.discount > 0 ? (
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                                sx={{
                                    textDecoration: "line-through",
                                    color: "red",
                                }}
                            >
                                {Number(product.price).toFixed(2)}€
                            </Typography>
                            <Typography
                                sx={{
                                    fontWeight: "bold",
                                }}
                            >
                                {(
                                    Number(product.price) *
                                    (1 - product.discount / 100)
                                ).toFixed(2)}
                                €
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: 12,
                                }}
                            >
                                (-{Number(product.discount).toFixed(0)}%)
                            </Typography>
                        </Box>
                    ) : (
                        <Typography
                            sx={{
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "pre-wrap",
                                fontWeight: "bold",
                            }}
                        >
                            {Number(product.price).toFixed(2)}€
                        </Typography>
                    )}
                </Box>
                <Tooltip title="Adicionar ao carrinho">
                    <IconButton
                        color="textSecondary"
                        sx={{ width: 40, height: 40 }}
                        onClick={() => cartStore.addItem(product.name, 1)}
                    >
                        <AddShoppingCartSharpIcon />
                    </IconButton>
                </Tooltip>
            </CardContent>
        </Card>
    );
});

export default StoreVendorCard;
