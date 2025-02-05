import { observer } from "mobx-react";
import { cartStore, homeAddressStore } from "../../Stores";
import { Delete as DeleteIcon } from "@mui/icons-material";
import {
    Typography,
    Box,
    Tooltip,
    IconButton,
    Divider,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { CartProductCard } from "..";
import React from "react";

const CartList = observer(() => {
    const shippingCosts = 5;


    const theme = useTheme();
    const smallerThanLarge = useMediaQuery(theme.breakpoints.down("lg"));

    return (
        <Box sx={{ display: "flex", width: "100%", justifyContent: "start" }}>
            <Box
                sx={{
                    p: 0,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    backgroundColor: "background.paper",
                    justifySelf: "start",
                    justifyContent: "start",
                    flexWrap: "wrap",
                    gap: 3,
                }}
            >
                {Object.entries(cartStore.cart).map(
                    ([storeId, products], index, arr) => (
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
                                {console.log("latitude da loja: ", cartStore.cart[storeId][0].store.latitude)}
                                {console.log("longitude da loja: ",cartStore.cart[storeId][0].store.longitude)}
                                {console.log("id da loja: ", storeId)}
                                {console.log("primary address longitude: ", homeAddressStore?.primaryAddress?.longitude)}
                                {console.log("primary address latitude: ", homeAddressStore?.primaryAddress?.latitude)}


                                <Box
                                    display="flex"
                                    alignItems="baseline"
                                    sx={{ flexDirection: "row" }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: 14,
                                        }}
                                    >
                                        Loja:
                                    </Typography>
                                    <Typography
                                        color="terciary"
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: 20,
                                            ml: 1,
                                        }}
                                    >
                                        {cartStore.cart[storeId][0].store.name}
                                    </Typography>
                                </Box>

                                <Box
                                    key={storeId}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 3,
                                        flexWrap: "wrap",
                                        justifyContent: smallerThanLarge
                                            ? "center"
                                            : "start",
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
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    {/* Subtotal Price */}
                                    <Box
                                        display="flex"
                                        alignItems="baseline"
                                        sx={{
                                            flexDirection: "row",
                                            minWidth: "150px",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: 14,
                                            }}
                                        >
                                            Subtotal:
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: 20,
                                                ml: 1,
                                            }}
                                        >
                                            €
                                            {Number(
                                                cartStore.storeTotals[storeId],
                                            )}
                                        </Typography>
                                    </Box>
                                    {/* Shipping Costs */}
                                    <Box
                                        display="flex"
                                        alignItems="baseline"
                                        sx={{ flexDirection: "row" }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: 14,
                                            }}
                                        >
                                            Custos de envio estimados:
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: 20,
                                                ml: 1,
                                            }}
                                        >
                                            €{shippingCosts}
                                        </Typography>
                                    </Box>

                                    {/* Total Price */}
                                    <Box
                                        display="flex"
                                        alignItems="baseline"
                                        sx={{ flexDirection: "row" }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: 14,
                                            }}
                                        >
                                            Total:
                                        </Typography>
                                        <Typography
                                            color="terciary"
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: 20,
                                                ml: 1,
                                            }}
                                        >
                                            €
                                            {(
                                                Number(
                                                    cartStore.storeTotals[
                                                        storeId
                                                    ],
                                                ) + Number(shippingCosts)
                                            ).toFixed(2)}
                                        </Typography>
                                    </Box>

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
                            {index !== arr.length - 1 && (
                                <Divider variant="middle" />
                            )}
                        </React.Fragment>
                    ),
                )}
            </Box>
        </Box>
    );
});

export default CartList;
