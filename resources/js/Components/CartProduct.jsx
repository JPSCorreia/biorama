import { observer } from 'mobx-react';
import DeleteIcon from '@mui/icons-material/Delete';
import { stringAvatar } from '../utils/utils';
import { cartStore } from '../Stores/cartStore';
import Tooltip from '@mui/material/Tooltip';
import {
    Divider,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    IconButton,
} from '@mui/material';

const CartProduct = observer(({ cartProduct, index }) => {

    const deleteUser = () => {
        cartStore.deleteItem(index);
    };

    return (
        <>
            <ListItem
                sx={{ width: "100%" }}
                secondaryAction={
                    <Tooltip title="Remover">
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={deleteUser}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                }
            >
                <ListItemAvatar>
                    <Avatar {...stringAvatar(cartProduct.name)} />
                </ListItemAvatar>
                <ListItemText primary={cartProduct.name} secondary={'Quantidade: ' + cartProduct.quantity} />
            </ListItem>
            {index < cartStore.cart.length - 1 && <Divider component="li" />}
        </>
    );
});

export default CartProduct;
