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

import { AddShoppingCartSharp as AddShoppingCartSharpIcon } from "@mui/icons-material";
import { cartStore } from "../../Stores";
import ReactMarkdown from "react-markdown";

const ProductCard = observer(({ product, vendor, store }) => {
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
                minHeight: 360,
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
                    height: 120,
                    width: "100%",
                    objectFit: "cover",
                    backgroundColor: theme.palette.primary.main,
                }}
                image={product.image_link}
            />

            {/* Informações */}
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
                    <Typography sx={{ fontSize: 12 }}>
                        Preço por unidade:
                    </Typography>
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                minWidth: "155px",
                            }}
                        >
                            {product.discount > 0 ? (
                                <Box
                                    display="flex"
                                    alignItems="baseline"
                                    gap={1}
                                >
                                    <Typography
                                        sx={{
                                            textDecoration: "line-through",
                                            fontSize: 14,
                                            color: "red",
                                            lineHeight: 1,
                                            display: "flex",
                                            alignItems: "baseline",
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
                                        variant="body2"
                                        sx={{
                                            fontSize: 14,
                                            lineHeight: 1,
                                            mb: "2px",
                                            display: "flex",
                                            alignItems: "baseline",
                                            alignSelf: "center",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        (-{Number(product.discount).toFixed(0)}
                                        %)
                                    </Typography>
                                </Box>
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
                        <Tooltip title="Adicionar ao carrinho">
                            <IconButton
                                color="primary"
                                sx={{ width: 40, height: 40 }}
                                onClick={() =>
                                    cartStore.addItem({
                                        ...product,
                                        vendor: vendor,
                                        store: store,
                                    })
                                }
                            >
                                <AddShoppingCartSharpIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
});

export default ProductCard;
