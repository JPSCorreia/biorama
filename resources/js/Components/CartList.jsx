import { observer } from 'mobx-react';
import { cartStore } from '../Stores/cartStore';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import CartProduct from './CartProduct';

const CartList = observer(() => {
  return (
    <Grid item xs={12} md={6} sx={ { width: "100%"}}>
      <Typography sx={{ mt: 1, mb: 1 }} variant="subtitle2" component="div">
        Total: {cartStore.total}
      </Typography>
      <List
        sx={{
          p: 0,
          width: '100%',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
        dense={false}
      >
        {cartStore.cart.map((cartProduct, index) => (
          <CartProduct cartProduct={cartProduct} key={index} index={index} />
        ))}
      </List>
    </Grid>
  );
});

export default CartList;
