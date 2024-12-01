import { observer } from "mobx-react";
import { Container, Typography } from "@mui/material";
import { ProductList } from "../Components";

const Products = observer(() => {
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                marginTop: "88px !important",
                // marginBottom: "5%",
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
