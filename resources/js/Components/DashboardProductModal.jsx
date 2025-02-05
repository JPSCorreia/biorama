import { useState } from "react";
import { Box, Typography, IconButton, Modal, Button, Snackbar, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { observer } from "mobx-react";
import DashboardEditProduct from "@/Components/DashBoardEditProduct.jsx";
import DashboardShowProduct from "@/Components/DashboardShowProduct.jsx";
import {productStore } from "@/Stores/index.js";


const DashboardProductModal = observer(({ open, onClose, product }) => {
    productStore.setProductData(product)
    const thisProduct = productStore.currentProduct

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleUpdateProduct = async (updatedProduct) => {
        try {
            setLoading(true);

            // Chama a função existente no store para fazer o update
            await productStore.updateProduct(product.id, updatedProduct);

            // Mensagem de sucesso e saída do modo de edição
            setSnackbar({ open: true, message: "Produto atualizado com sucesso!", severity: "success" });
            setIsEditing(false); // Fecha o modo de edição
        } catch (error) {
            console.error("Erro ao atualizar o produto:", error);
            setSnackbar({ open: true, message: "Erro ao atualizar o produto!", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: "60%",
                    padding: "20px",
                    borderRadius: "10px",
                    backgroundColor: "background.paper",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    margin: "100px auto",
                    outline: "none",
                }}
            >
                {/* Cabeçalho do Modal */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h5">
                        {isEditing ? "Editar Produto" : "Detalhes do Produto"}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Conteúdo principal do modal */}
                {isEditing ? (
                    <DashboardEditProduct
                        product={thisProduct}
                        onCancel={() => setIsEditing(false)}
                        onSubmit={handleUpdateProduct}
                    />
                ) : (
                    <>
                        <DashboardShowProduct product={thisProduct} />
                        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                            <Button variant="contained" onClick={handleToggleEdit}>
                                Editar
                            </Button>
                        </Box>
                    </>
                )}

                {/* Snackbar para feedback visual */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Modal>
    );
});

export default DashboardProductModal;
