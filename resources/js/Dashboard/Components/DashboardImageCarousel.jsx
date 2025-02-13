import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { fixImagePath } from "../../utils/utils.js";

const DashboardImageCarousel = ({ galleries }) => {

    return (
        <Box sx={{ position: "relative", height: 200, overflow: "hidden" }}>
            <Carousel autoPlay={true} indicators={true}>
                {galleries?.map((gallery, index) => (
                    <Box
                        key={index}
                        sx={{
                            height: "300px",
                            backgroundImage: `url(${fixImagePath(gallery.image_link)})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    ></Box>
                ))}
            </Carousel>
        </Box>
    );
};

export default DashboardImageCarousel;
