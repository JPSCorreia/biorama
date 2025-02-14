import { Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CreateProductModal from "./CreateProductModal";
import {useEffect, useState} from "react";
import {IconButton} from "@mui/material";

const AddProductCard = () => {

    const [modalCreateProductOpen, setModalCreateProductOpen] = useState(false);
    const handleModalOpen = () => console.log("Modal Aberto") || setModalCreateProductOpen(true);
    const handleModalClose = () => console.log("Modal fechado") || setModalCreateProductOpen(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    useEffect(() => {
        console.log("Estado modalCreateProductOpen:", modalCreateProductOpen);
    }, [modalCreateProductOpen]);

    return (
        <Box
            onClick={handleModalOpen}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 250,
                height: 380,
                justifyContent: "center",
                backgroundColor: "#388e3c26",
                border: "2px dashed",
                borderColor: theme.palette.primary.main,
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "scale(1.02)", // Redução do efeito para evitar ultrapassar a div pai
                },
            }}
        >

            <AddCircleIcon
                sx={{
                    fontSize: isSmallScreen ? 30 : 40,
                    color: theme.palette.primary.main,
                }}
            />

            <Typography
                sx={{
                    mt: 1,
                    fontWeight: "bold",
                    color: theme.palette.primary.main,
                    fontSize: isSmallScreen ? "14px" : "16px",
                    textAlign: "center",
                }}
            >
                Criar Novo Produto
            </Typography>
            <CreateProductModal
                open={modalCreateProductOpen}
                handleClose={handleModalClose}
            />
        </Box>
    );
};

export default AddProductCard;
