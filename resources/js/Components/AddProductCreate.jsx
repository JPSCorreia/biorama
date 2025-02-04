import { Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CreateProductModal from "./CreateProductModal";
import { useState } from "react";

const AddProductCard = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            onClick={handleModalOpen}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#388e3c26",
                border: "2px dashed",
                borderColor: theme.palette.primary.main,
                borderRadius: "10px",
                width: "100%",  // Ocupar 100% da largura do espaço disponível
                height: "100%", // Ocupar 100% da altura do espaço disponível
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
                open={modalOpen}
                handleClose={handleModalClose}
            />
        </Box>
    );
};

export default AddProductCard;
