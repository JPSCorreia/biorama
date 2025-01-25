import { observer } from "mobx-react";
import { usePage } from "@inertiajs/react";
import { StoreBanner, StoreProductsContainer, StoreVendorCard, StoreDescription } from "../Components";
import { Container, Box } from "@mui/material";
import { AlertBox } from "../Components";

const Store = observer(() => {
    const { store, vendor, products } = usePage().props;
    console.log(products)

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: "100%",
                height: "100%",
                marginTop: "15px !important",
            }}
        >
            {/* Alerts */}
            <AlertBox />

            {/* Store Banner */}
            <StoreBanner imageLink={store.image_link} title={store.name} />

            {/* Store Information */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 2,
                }}
            >
                <StoreVendorCard store={store} vendor={vendor} />
                <StoreDescription store={store} />
            </Box>

            {/* Products */}
            <Box
                sx={{
                    marginTop: 2,
                }}
            >
                <StoreProductsContainer products={products} />
            </Box>
        </Container>
    );
});

export default Store;
