import { Paper, Typography, Box } from "@mui/material";
import { ProductCard } from "../";

const StoreProductsContainer = ({ products, image_test }) => {
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
                        alignItems: "center",
                        ml: 2,
                        mt: 4,
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "row"}}>
                    {products.slice(0, 5).map((product) => (
                        <ProductCard key={product.id} product={product} image_test={image_test}/>
                    ))}
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", mt: 2}}>
                        {products.slice(5, 10).map((product) => (
                        <ProductCard key={product.id} product={product} image_test={image_test}/>
                    ))}
                    </Box>
                </Box>
            </Typography>
        </Paper>
    );
};

export default StoreProductsContainer;
