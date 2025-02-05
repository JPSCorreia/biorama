import { AddProductCreate } from './';
import { observer } from "mobx-react";
import { vendorRegistrationStore } from "../Stores";
import { VendorRegistrationProductCard } from "./";
import { Box, MenuItem, Pagination, Select, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";

const Step3CreateProduct = observer(() => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const [openModal, setOpenModal] = useState(false);

    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const products = vendorRegistrationStore?.products || [];
    const hasProducts = products.length > 0;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = itemsPerPage === "all" ? products.length : startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    const totalPages = itemsPerPage === "all" ? 1 : Math.ceil(products.length / itemsPerPage);

    const shouldScroll = isSmallScreen || itemsPerPage > 5 || itemsPerPage === "all";

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: isSmallScreen ? "100%" : isMediumScreen ? "80%" : "65%",
                height: "100%",
                alignItems: isSmallScreen ? "center" : "flex-start",
            }}
        >
            {!hasProducts && (
                <Box
                    sx={{
                        width: isSmallScreen ? "45%" : "25%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: isSmallScreen ? "320px" : "370px",
                        m: "auto",
                    }}
                >
                    <AddProductCreate />
                </Box>
            )}

            {hasProducts && (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: isSmallScreen ? "repeat(1, 1fr)" : isMediumScreen ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                        gap: 2,
                        width: "100%",
                        maxHeight: shouldScroll ? "75vh" : "auto",
                        overflowY: shouldScroll ? "auto" : "visible",
                        scrollbarWidth: "thin",
                        "&::-webkit-scrollbar": {
                            width: "4px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                            borderRadius: "4px",
                        },
                        padding: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            m: isSmallScreen ? "auto" : "0",
                            minHeight: isSmallScreen ? "200px" : "",
                        }}
                    >
                        <AddProductCreate />
                    </Box>
                    {paginatedProducts.map((product) => (
                        <Box
                            key={product.id}
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "430px",
                            }}
                        >
                            <VendorRegistrationProductCard
                                product={product}
                                sx={{
                                    width: "100%",
                                    transition: "transform 0.3s ease-in-out",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                    },
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
});

export default Step3CreateProduct;
