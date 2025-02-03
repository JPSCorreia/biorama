import { observer } from "mobx-react";
import { cartStore } from "../../Stores";
import { Typography, List, Box } from "@mui/material";
import { CartProductCard } from "..";

const CartList = observer(() => {
    return (
        <Box sx={{ width: "100%" }}>
            <Box
                sx={{
                    p: 0,
                    width: "100%",
                    display: "flex",
                    borderRadius: 2,
                    backgroundColor: "background.paper",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 3,
                }}
            >
                {cartStore.cart.map((product, index) => (
                    <CartProductCard
                        product={product}
                        key={index}
                        index={index}
                    />
                ))}
            </Box>
        </Box>
    );
});

export default CartList;
