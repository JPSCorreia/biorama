import { observer } from "mobx-react";
import { usePage } from "@inertiajs/react";
import { StoreBanner, StoreProductsContainer, StoreVendorCard, StoreMap, StoreDescription } from "../Components";
import { Container, Typography, Box, useTheme, useMediaQuery  } from "@mui/material";
import { AlertBox } from "../Components";

const Store = observer(() => {

    const { store, vendor, products, user, gallery, addresses, other } = usePage().props;

    console.log("other", other.vendor_rating);
    console.log("store rating", store.rating);

    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
            <StoreBanner title={store.name} gallery={gallery} />

            {/* Store Information */}
            <StoreDescription store={store} />
            <StoreProductsContainer products={products} />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    mt: 4,
                    mb: 4,
                    flexWrap: "wrap",
                }}
            >
                <StoreVendorCard store={store} vendor={vendor} user={user} other={other} />
                <StoreMap store={store} addresses={addresses} />
            </Box>
        </Container>
    );
});

export default Store;
