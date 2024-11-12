import { observer } from 'mobx-react';
import { cartStore } from '../Stores';
import { Grid, Typography, List } from '@mui/material'
import { CartProduct } from './';

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
