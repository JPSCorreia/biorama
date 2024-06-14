import { observer } from 'mobx-react';
import Button from '@mui/material/Button';
import { cartStore } from '../stores/cartStore';
import CartList from './CartList';
import { Container, Box } from '@mui/material';

const CartContainer = observer(() => {
    return <>
        <h1>Carrinho de Compras</h1>

        {cartStore.total? 
        <Container sx={{ mt: 1, display: "flex", flexDirection: "column",  alignItems: "flex-end" }}>
        <CartList />
        <Button
                sx={{ mt: 3 }}
                variant="contained"
                onClick={cartStore.clearCart}
            >
                Limpar Carrinho
            </Button>
        </Container>
        : <Box> Carrinho vazio </Box>}
    </>;
});

export default CartContainer;
