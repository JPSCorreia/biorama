import { AddProductCreate } from "..";
import { observer } from "mobx-react";
import { vendorRegistrationStore } from "../../Stores";
import {
    Box,
    IconButton,
    MenuItem,
    Select,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { VendorRegistrationProductCard } from "@/Components";

const Step3CreateProduct = observer(() => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const products = vendorRegistrationStore?.products || [];

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex =
        itemsPerPage === "Todos" ? products.length : startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    const totalPages =
        itemsPerPage === "Todos"
            ? 1
            : Math.ceil(products.length / itemsPerPage);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection:  "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                // "& > :first-of-type": {
                //     mb: 4,
                // },
                minHeight: "67.6vh",
            }}
        >
            {vendorRegistrationStore.products.length > 5 && (
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
                    {/* Botões de navegação */}
                    <Box>
                        <IconButton
                            sx={{ marginRight: 1 }}
                            onClick={() =>
                                setPage((prev) => Math.max(prev - 1, 1))
                            }
                        >
                            <ArrowBackIosIcon />
                        </IconButton>

                        <IconButton
                            onClick={() =>
                                setPage((prev) =>
                                    Math.min(prev + 1, totalPages),
                                )
                            }
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>

                    {/* Dropdown para selecionar itens por página */}
                    <Select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(e.target.value);
                            setPage(1); // Resetar para a primeira página ao mudar a quantidade
                        }}
                        variant="outlined"
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value="all">Todos</MenuItem>
                    </Select>
                </Box>
            )}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)", // Sempre 3 colunas
                    gap: 2,
                    display: "flex",
                    width: "100%",
                    justifyContent: "start",
                }}
            >
                {/* Card de adicionar produto (sempre antes dos produtos) */}
                <Box
                    sx={{
                        width: "100%",
                        height: "420px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <AddProductCreate />
                </Box>

                {/* Exibição dos produtos paginados */}
                {paginatedProducts.map((product) => (
                    <Box
                        key={product.id}
                        sx={{
                            width: "100%",
                            height: "420px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <VendorRegistrationProductCard
                            product={product}
                            sx={{
                                width: "100%",
                                height: "100%",
                                transition: "transform 0.3s ease-in-out",
                                "&:hover": {
                                    transform: "scale(1.05)",
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
