import { observer } from "mobx-react";
import { Box, Typography, Container } from "@mui/material";
import { ProductList } from "../Components";

const Products = observer(() => {
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minWidth: "100%",
                marginTop: "88px !important",
            }}
        >
            <Typography variant="h3" gutterBottom>
                Produtos
            </Typography>
            <ProductList />
        </Container>
    );
});

export default Products;
