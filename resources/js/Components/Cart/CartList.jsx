import { observer } from "mobx-react";
import { cartStore } from "../../Stores";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { Typography, Box, Tooltip, IconButton, Divider } from "@mui/material";
import { CartProductCard } from "..";
import React from "react";

const CartList = observer(() => {
    return (
        <Box sx={{ display: "flex", width: "65%", justifyContent: "center" }}>
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
                {Object.entries(cartStore.cart).map(([storeId, products], index, arr) => (
                    <React.Fragment key={storeId}>
                    <Box
                        key={storeId}
                        sx={{
                            p: 2,
                            pt: 0,
                            pb: 0,
                            gap: 3,
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {console.log(cartStore.cart[storeId][0].store.longitude)}
                        <Typography variant="h6">
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
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
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
                    {index !== arr.length - 1 && <Divider variant="middle" />}
                    </React.Fragment>
                ))}
            </Box>
        </Box>
    );
});

export default CartList;
