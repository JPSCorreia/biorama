import { observer } from "mobx-react";
import { Box, Typography } from "@mui/material";
import { ProductList } from "../Components";

const Products = observer(() => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                marginTop: "88px !important",
            }}
        >
            <Typography variant="h3" gutterBottom>
                Produtos
            </Typography>
            <ProductList />
        </Box>
    );
});

export default Products;
