import { observer } from "mobx-react";
import { cartStore } from "../Stores/cartStore";
import { CartList } from "../Components";
import { Container, Box, Button, Typography } from "@mui/material";

const Cart = observer(() => {
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                marginTop: "88px !important",
                marginBottom: "5%",
            }}
        >
            <Typography variant="h3" gutterBottom>
                Carrinho de Compras
            </Typography>
            {cartStore.total ? (
                <Box
                    sx={{
                        mt: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                    }}
                >
                    <CartList />
                    <Button
                        sx={{ mt: 3 }}
                        variant="contained"
                        onClick={cartStore.clearCart}
                    >
                        Limpar Carrinho
                    </Button>
                </Box>
            ) : (
                <Box
                    sx={{
                        mt: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        O teu carrinho de compras está vazio
                    </Typography>{" "}
                </Box>
            )}
        </Container>
    );
});

export default Cart;
