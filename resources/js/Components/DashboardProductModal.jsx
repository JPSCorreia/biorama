import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Modal, Button, Snackbar, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { observer } from "mobx-react";
import { productStore } from "@/Stores/index.js";
import DashboardEditProduct from "@/Components/DashBoardEditProduct.jsx";
import DashboardShowProduct from "@/Components/DashboardShowProduct.jsx";

const DashboardProductModal = observer(({ open, onClose, product, storeid, initialEditMode }) => {
    const [isEditing, setIsEditing] = useState(initialEditMode ||false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    // Atualiza o produto no store sempre que o modal abrir com um novo produto
    useEffect(() => {
        if (open && product) {
            productStore.fetchProductData(product.id);
            setIsEditing(initialEditMode);
        }
    }, [open, product]);
    console.log("Produto actual", productStore.currentProduct);

    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleUpdateProduct = async (updatedProduct) => {
        try {
            setLoading(true);
            await productStore.updateProduct(storeid, product.id, updatedProduct);

            setSnackbar({ open: true, message: "Produto atualizado com sucesso!", severity: "success" });
            setIsEditing(false);
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
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h5">
                        {isEditing ? "Editar Produto" : "Detalhes do Produto"}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {isEditing ? (
                    <DashboardEditProduct
                        product={productStore.currentProduct}
                        storeId={storeid}
                        onCancel={() => setIsEditing(false)}
                        onSubmit={handleUpdateProduct}
                    />
                ) : (
                    <>
                        <DashboardShowProduct product={productStore.currentProduct} />
                        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                            <Button variant="contained" onClick={handleToggleEdit}>
                                Editar
                            </Button>
                        </Box>
                    </>
                )}

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
