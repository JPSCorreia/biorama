import {
    Box,
    Button,
    Typography,
    IconButton,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useTheme,
    useMediaQuery
} from "@mui/material";
import {
    Delete as DeleteIcon,
    ShoppingCartSharp,
} from "@mui/icons-material";
import { observer } from "mobx-react";
import { useState } from "react";
import { cartStore } from "../../Stores";
import { CartPaymentIcons} from "../../Components";


const CartSidebar = observer(() => {

    const theme = useTheme();
    const smallerThanSmall = useMediaQuery(theme.breakpoints.down("sm"));

    function ClearCartButton() {
        const [open, setOpen] = useState(false);

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
        };

        const handleConfirm = () => {
            cartStore.clearCart();
            setOpen(false);
        };

        return (
            <>
                <Tooltip title="Limpar carrinho">
                    <IconButton
                        variant="outlined"
                        sx={{ mr: 2 }}
                        color="delete"
                        onClick={handleClickOpen}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Limpar carrinho
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Tem a certeza de que deseja remover todos os
                            produtos do seu carrinho de compras?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleConfirm} color="error" autoFocus>
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: 4,
                minWidth: smallerThanSmall ? "100%" : "500px",
                height: "100%",
                ml: 1,
                p: 2,
                pb: 1,
                pt: 1,
                mt: 7,
            }}
        >
            <Box
                sx={{
                    mt: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <Typography variant="h6">
                    Total: €{cartStore.totalPrice}
                </Typography>
                <Box>
                    {/* Button to clear the cart */}
                    <ClearCartButton />
                    {/* Button to go to the checkout page */}
                    <Button
                        variant="outlined"
                        color="terciary"
                        startIcon={<ShoppingCartSharp />}
                    >
                        Comprar
                    </Button>
                </Box>
            </Box>
            <CartPaymentIcons />
        </Box>
    );
});

export default CartSidebar;
