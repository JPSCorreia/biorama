import {AddProductCreate} from './';
import {observer} from "mobx-react";
import {vendorRegistrationStore} from "../Stores";
import {VendorRegistrationProductCard} from "./";
import {Box, MenuItem, Pagination, Select, useMediaQuery, useTheme} from "@mui/material";
import {useState} from "react";

const Step3CreateProduct = observer(() => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    // State for pagination and items per page selection
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Retrieve products from store
    const products = vendorRegistrationStore?.products || [];
    const hasProducts = products.length > 0;

    // Pagination logic
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = itemsPerPage === "all" ? products.length : startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    const totalPages = itemsPerPage === "all" ? 1 : Math.ceil(products.length / itemsPerPage);

    // Define if scrolling is needed
    const shouldScroll = itemsPerPage > 5 || itemsPerPage === "all";

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "65%",
                margin: "auto",
            }}
        >
            {/* Top section: Pagination and Items per Page Selector (inside the black div with pink content) */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    padding: "10px",
                    marginBottom: 2,
                }}
            >
                {/* Pagination (always visible, but disabled when 'all' is selected) */}
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    disabled={itemsPerPage === "all"}
                />

                {/* Dropdown to select items per page */}
                <Select
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(e.target.value);
                        setPage(1); // Reset pagination when changing number of items
                    }}
                    variant="outlined"
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value="all">All</MenuItem>
                </Select>
            </Box>

            {/* Grid of Products (inside the second black div) */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)", // Always 3 columns
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
                {/* Add Product Card (green, fixed size) */}
                <Box
                    sx={{
                        width: "60%",
                        height: "360px", // Ensures all cards are the same height
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <AddProductCreate />
                </Box>

                {/* Product Cards (red, fixed size, paginated) */}
                {hasProducts &&
                    paginatedProducts.map((product) => (
                        <Box
                            key={product.id}
                            sx={{
                                width: "100%",
                                height: "200px", // Fixed height to ensure uniformity
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <VendorRegistrationProductCard
                                product={product}
                                sx={{
                                    width: "100%",
                                    height: "100%", // Ensures all product cards are the same size
                                    transition: "transform 0.3s ease-in-out",
                                    "&:hover": {
                                        transform: "scale(1.05)", // Smooth transition without overflowing
                                    },
                                }}
                            />
                        </Box>
                    ))}
            </Box>
        </Box>
    );
});

export default Step3CreateProduct;
