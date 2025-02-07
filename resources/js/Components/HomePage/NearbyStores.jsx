import { observer } from "mobx-react-lite";
import { Box, CircularProgress, Typography, useTheme, useMediaQuery } from "@mui/material";
import { HomeStoreCard } from "../index.js";
import { nearbyShopStore } from "../../Stores/nearbyShopStore.js";
import { toJS } from "mobx";

export const NearbyStores = observer(() => {
    const theme = useTheme();
    const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));

    const nearbyStores = toJS(nearbyShopStore.nearbyStores); // ✅ Garante que é um array normal

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
            <Box sx={{ textAlign: "center", color: theme.palette.error.main, padding: 2 }}>
                <Typography variant="body1">{nearbyShopStore.error}</Typography>
            </Box>
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
                justifyContent: "center",
                width: smallerThanMedium ? "100%" : "100%",
                alignItems: "center",
                mr: 2,
                mt: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px",
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

export default NearbyStores;
