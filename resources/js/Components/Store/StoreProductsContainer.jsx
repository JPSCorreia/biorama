import { Typography, Box } from "@mui/material";
import { ProductCard } from "../";

const StoreProductsContainer = ({ products, vendor }) => {
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
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "row"}}>
                    {products.reverse().slice(0, 6).map((product) => (
                        <ProductCard key={product.id} product={product} vendor={vendor} />
                    ))}
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", mt: 2}}>
                        {products.reverse().slice(6, 12).map((product) => (
                        <ProductCard key={product.id} product={product} vendor={vendor} />
                    ))}
                    </Box>
                </Box>
            </Typography>
        </Box>
    );
};

export default StoreProductsContainer;
