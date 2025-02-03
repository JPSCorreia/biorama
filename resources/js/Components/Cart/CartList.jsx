import { observer } from "mobx-react";
import { cartStore } from "../../Stores";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { Typography, List, Box, Tooltip, IconButton } from "@mui/material";
import { CartProductCard } from "..";

const CartList = observer(() => {
    return (
        <Box sx={{ display: "flex", width: "60%", border: "1px solid red" }}>
            <Box
                sx={{
                    p: 0,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    backgroundColor: "background.paper",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 3,
                }}
            >
                {Object.entries(cartStore.cart).map(([storeId, products]) => (
                    <Box
                        key={storeId}
                        sx={{
                            border: "1px solid #ccc",
                            borderRadius: 4,
                            p: 2,
                            gap: 3,
                            width: "100%",
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {cartStore.cart[storeId][0].store.name}
                        </Typography>

                        <Box
                            key={storeId}
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 3,
                                flexWrap: "wrap",
                            }}
                        >
                            {products.map((product) => (
                                <CartProductCard
                                    key={product.id}
                                    product={product}
                                    storeId={storeId}
                                />
                            ))}
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mt: 2, justifyContent: "space-between" }}>
                            <Typography variant="h6" >
                                Total: {cartStore.storeTotals[storeId]}€
                            </Typography>
                            {/* Button to clear the cart */}
                            <Tooltip title="Eliminar produtos desta loja">
                                <IconButton
                                    variant="outlined"
                                    sx={{ mr: 2 }}
                                    color="delete"
                                    onClick={() =>
                                        cartStore.clearStore(storeId)
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
});

export default CartList;
