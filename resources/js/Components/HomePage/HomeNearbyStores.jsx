import { observer } from "mobx-react";
import { Box, CircularProgress, Typography, useTheme, useMediaQuery } from "@mui/material";
import { HomeStoreCard } from "../index.js";
import { nearbyShopStore } from "../../Stores/nearbyShopStore.js";
import { toJS } from "mobx";
import PropTypes from 'prop-types';


export const HomeNearbyStores = observer(() => {
    const theme = useTheme();
    const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));
    const smallerThanLarge = useMediaQuery(theme.breakpoints.down("lg"));

    const nearbyStores = toJS(nearbyShopStore.nearbyStores) || [];
    if (!nearbyStores || !Array.isArray(nearbyStores)) {
        return <Typography>Nenhuma loja encontrada.</Typography>;
    }
    if (nearbyShopStore.loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: smallerThanMedium ? "100%" : "60%",
                    minWidth: "300px",
                    minHeight: "500px",
                }}
            >
                <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
            </Box>
        );
    }

    if (nearbyShopStore.error) {
        return (
            <Typography variant="body1" component="div">
                {nearbyShopStore.error}
            </Typography>
        );
    }

    if (!nearbyStores.length) {
        return (
            <Box sx={{ textAlign: "center", padding: 2 }}>
                <Typography variant="body1">
                    Nenhuma loja encontrada próxima de si.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gap: 4,
                    gridTemplateColumns: smallerThanMedium
                        ? "1fr" // 1 coluna em telas pequenas
                        : smallerThanLarge
                            ? "1fr 1fr" // 2 colunas em tablets
                            : "1fr 1fr 1fr", // 3 colunas em telas grandes
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >
                {nearbyStores.slice(0, 6).map((store) => (
                    <HomeStoreCard key={store.id} store={store} />
                ))}
            </Box>
        </Box>
    );
});

export default HomeNearbyStores;
