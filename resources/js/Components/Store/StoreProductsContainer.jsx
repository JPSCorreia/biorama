import { Paper, Typography, Box } from "@mui/material";

const StoreProductsContainer = ({ products }) => {

    return (
        <Paper
            elevation={4}
            sx={{
                padding: 3,
                borderRadius: "10px",
                mt: 2,
                mb: 1,
            }}
        >
            <Typography
                variant="h5"
                sx={{ marginBottom: 2, fontWeight: "bold" }}
            >
                Produtos da Loja
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        ml: 2,
                        mt: 4,
                    }}
                >
                    {products.slice(0, 12).map((product) => (
                        <Box
                            key={product.id}
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                mb: 1,
                                fontSize: "1.2rem",
                            }}
                        >
                            {product.name}
                        </Box>
                    ))}
                </Box>
            </Typography>
        </Paper>
    );
};

export default StoreProductsContainer;
