import { Paper, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";


const HomeStoreCard = ({ store }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    return (
        <Paper
            sx={{
                flex: isSmallScreen
                ? "1 1 100%" // Full width for small screens
                : isMediumScreen
                ? "1 1 calc(50% - 16px)" // Two cards per row for medium screens
                : "1 1 calc(33.33% - 16px)", // Three cards per row for larger screens
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                margin: "2px",
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: "8px",
                padding: 2,
                boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
                justifyContent: "space-between",
            }}
            elevation={4}
            key={store.id}
        >
                <Typography variant="h6">{store.name}</Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: 1 }}
                >
                    {store.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Distância: {(store.distance / 1000).toFixed(2)} km
                </Typography>
        </Paper>
    );
};

export default HomeStoreCard;

HomeStoreCard.propTypes = {
    store: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        distance: PropTypes.number.isRequired,
    }).isRequired,
};
