import { observer } from "mobx-react";
import { usePage } from "@inertiajs/react";
import { StoreBanner, StoreProductsContainer, StoreVendorCard, StoreMap, StoreDescription } from "../Components";
import { Container, Box, useTheme, useMediaQuery  } from "@mui/material";
import { AlertBox } from "../Components";

const Store = observer(() => {

    const { store, vendor, products, user } = usePage().props;

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
            <StoreBanner imageLink={store.image_link} title={store.name} />

            {/* Store Information */}
            <StoreDescription store={store} />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 2,
                    flexWrap: "wrap",
                    // height: "300px"
                }}
            >
                <StoreVendorCard store={store} vendor={vendor} user={user} />
                <StoreMap store={store} />
            </Box>

            {/* Products */}
            <Box
                sx={{
                    marginTop: 2,
                }}
            >
                {/* <StoreProductsContainer products={products} /> */}
            </Box>
        </Container>
    );
});

export default Store;
