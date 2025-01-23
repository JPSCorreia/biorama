import {Card, CardContent, Typography, IconButton, Box, useTheme, useMediaQuery} from '@mui/material';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {CreateProductModal} from "./";
import {useState} from "react";


const AddProductCard = () => {
    const [createProductModalOpen, setHandleCreateProductModalOpen] = useState(false);
    const handleCreateProductModalOpen = () => setHandleCreateProductModalOpen(true);
    const handleCreateProductModalClose = () => setHandleCreateProductModalOpen(false);


    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            onClick={handleCreateProductModalOpen}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                ml: isSmallScreen ? "auto" : 0,
                mr: isSmallScreen ? "auto" : 0,
                backgroundColor: "#388e3c26",
                border: "2px dashed",
                borderColor: theme.palette.primary.main,
                borderRadius: "10px",
                width: isSmallScreen ? "100%" : "18%",
                height: isSmallScreen ? "200px" : "372px",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "scale(1.05)",
                },
            }}
        >
            <AddCircleIcon
                sx={{
                    fontSize: 40,
                    color: theme.palette.primary.main,
                }}
            />
            <Typography
                sx={{
                    mt: 1,
                    fontWeight: "bold",
                    color: theme.palette.primary.main,
                }}
            >
                Criar Novo Produto
            </Typography>
            <CreateProductModal open={createProductModalOpen} handleClose={handleCreateProductModalClose} />
        </Box>
    );
};

export default AddProductCard;
