import { Paper, Grid, Typography, Card, CardContent, CardMedia } from "@mui/material";

const StoreProductsContainer = ({ products }) => {

    console.log(products)
    return (
        <Paper
            elevation={4}
            sx={{
                padding: 2,
                borderRadius: "10px",
            }}
        >
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
                Produtos da Loja
            </Typography>


        </Paper>
    );
};

export default StoreProductsContainer;
