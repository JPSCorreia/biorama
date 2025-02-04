import {observer} from "mobx-react";
import {Box, IconButton, Modal, Typography} from "@mui/material";
import DashboardShowProduct from "@/Components/DashboardShowProduct.jsx";
import CloseIcon from "@mui/icons-material/Close";

const DashboardProductModal = observer(({open, onClose, product}) => {

    return(
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: "60%",
                    padding: "20px",
                    borderRadius: "10px",
                    backgroundColor: "background.paper",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    margin: "100px auto",
                    outline: "none", // Remove o contorno padrão do modal
                }}
            >
                {/* Cabeçalho do Modal */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Conteúdo principal do modal */}
                <DashboardShowProduct product={product} />
            </Box>
        </Modal>

    )
})

export default DashboardProductModal;
