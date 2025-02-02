import { Typography, Box } from "@mui/material";
import { ProductCard } from "../";

const StoreProductsContainer = ({ products, image_test }) => {
    return (
        <Box
            sx={{
                borderRadius: "10px",
                mt: 2,
                mb: 1,
            }}
        >
            <Typography
                variant="h5"
                sx={{ marginBottom: 2, fontWeight: "bold" }}
            >
                Os nossos produtos
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
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
        </Box>
    );
};

export default StoreProductsContainer;
