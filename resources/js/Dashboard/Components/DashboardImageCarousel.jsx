import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { fixImagePath } from "../../utils/utils.js";

const DashboardImageCarousel = ({ galleries }) => {

    return (
            <Carousel autoPlay={true} indicators={true}>
                {galleries?.map((gallery, index) => (
                    <Box
                        key={index}
                        sx={{
                            height: "250px",
                            backgroundImage: `url(${fixImagePath(gallery.image_link)})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    ></Box>
                ))}
            </Carousel>
    );
};

export default DashboardImageCarousel;
