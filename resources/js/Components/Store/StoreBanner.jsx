import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";

const StoreBanner = ({ imageLink, title }) => {
    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    return (
        <Box
            sx={{
                width: "100%",
                height: { xs: 150, sm: 200, md: 250 },
                backgroundImage: `url(${imageLink})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 2,
                boxShadow: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                textAlign: "center",
                fontSize: { xs: 24, sm: 32, md: 40 },
                fontWeight: "bold",
                position: "relative",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: 2,
                }}
            />
            <Typography
                variant={isSmallScreen ? "h6" : isMediumScreen ? "h4" : "h2"}
                sx={{
                    zIndex: 1,
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    textShadow:
                        "0 0 3px limegreen, 0 0 3px limegreen, 0 0 3px limegreen",
                }}
            >
                {title}
            </Typography>
        </Box>
    );
};

StoreBanner.propTypes = {
    imageLink: PropTypes.string.isRequired,
};

export default StoreBanner;
