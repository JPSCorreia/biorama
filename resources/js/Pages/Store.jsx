import { observer } from "mobx-react";
import { usePage } from "@inertiajs/react";
import { StoreBanner, StoreProductsContainer, StoreVendorCard, StoreMap, StoreDescription } from "../Components";
import { Container, Box, useTheme, useMediaQuery  } from "@mui/material";
import { AlertBox } from "../Components";

const Store = observer(() => {

    const { store, vendor, products, user, gallery, address, other } = usePage().props;

    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const smallerThanMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

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
                    flexDirection: smallerThanMediumScreen? "column" : "row",
                    justifyContent: "center",
                    mt: 4,
                    mb: 4,
                    flexWrap: "wrap",
                }}
            >
                <StoreVendorCard store={store} vendor={vendor} user={user} other={other} />
                <StoreMap store={store} address={address} />
            </Box>
        </Container>
    );
});

export default Store;
