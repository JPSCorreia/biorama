import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import Carousel from "react-material-ui-carousel";

const StoreBanner = ({ title, gallery }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    function Item(props) {

        let image_link = props.item.image_link;


        if (!image_link.includes("mock_images")) {
          image_link = image_link.replace("/loja", "");
        }

        // Garante que a URL é absoluta
        if (!image_link.startsWith("http")) {
          image_link = `${window.location.origin}/${image_link}`;
        }



        return (
            <Box
                sx={{
                    width: "100%",
                    height: { xs: 150, sm: 200, md: 300 },
                    backgroundImage: `url(${image_link})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Dark background overlay */}
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                position: "relative", // Set position to relative so it can be positioned above the images
                width: "100%",
                // alignSelf: "center",
                height: { xs: 150, sm: 200, md: 300 },
            }}
        >
            {/* Títle above the images */}
            <Box
                sx={{
                    position: "absolute",
                    top: 10,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    zIndex: 2,
                }}
            >
                <Typography
                    variant={
                        isSmallScreen ? "h5" : isMediumScreen ? "h3" : "h2"
                    }
                    sx={{
                        color: "white",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        textAlign: "center",
                        textShadow: `0 0 3px ${theme.palette.primary.main}, 0 0 3px ${theme.palette.primary.main}, 0 0 3px ${theme.palette.primary.main}`,
                        width: "80%",
                    }}
                >
                    {title}
                </Typography>
            </Box>

            <Carousel
                animation="slide"
                navButtonsProps={{
                    // Change the colors and radius of the actual buttons
                    style: {
                        backgroundColor: theme.palette.primary.main,
                        padding: 3,
                    },
                }}
                indicatorIconButtonProps={{
                    style: {
                        color: theme.palette.carousel.buttons.inactive,
                    },
                }}
                activeIndicatorIconButtonProps={{
                    style: {
                        color: theme.palette.carousel.buttons.active,
                    },
                }}
            >
                {gallery.map((item, i) => (
                    <>
                        {console.log(item)}
                        <Item key={i} item={item} />
                    </>
                ))}
            </Carousel>
        </Box>
    );
};

StoreBanner.propTypes = {
    title: PropTypes.string.isRequired,
    gallery: PropTypes.arrayOf(
        PropTypes.shape({
            image_link: PropTypes.string.isRequired,
        }),
    ).isRequired,
};

export default StoreBanner;
