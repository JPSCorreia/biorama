import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    Box,
    TextField,
    Typography,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DashboardProductModal from "@/Components/DashboardProductModal.jsx";
import { observer } from "mobx-react";
import { productStore } from "@/Stores/index.js";

const DashboardProductList = observer(({ storeId }) => {
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [initialEditMode, setInitialEditMode] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });


    useEffect(() => {
        productStore.fetchProductsPaginated(storeId, page + 1, searchTerm);
    }, [page, searchTerm]);

    // Atualiza a página
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Função para pesquisa



    // Abre o modal e define o produto selecionado para visualização
    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setInitialEditMode(false); // Modo de visualização
        setShowProductModal(true);
    };

    // Abre o modal no modo de edição
    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setInitialEditMode(true); // Abre no modo de edição
        setShowProductModal(true);
    };

    // Fecha o modal
    const handleCloseModal = () => {
        setShowProductModal(false);
        setSelectedProduct(null);
    };

    // Confirmação de exclusão
    const confirmDeleteProduct = (product) => {
        setDeleteDialog({ open: true, product });
    };

    // Fecha o diálogo de confirmação
    const handleCloseDeleteDialog = () => {
        setDeleteDialog({ open: false, product: null });
    };

    // Função para apagar produto via productStore
    const handleDeleteProduct = async () => {
        try {
            await productStore.deleteProduct(deleteDialog.product);
            setDeleteDialog({ open: false, product: null }); // Fecha o diálogo após sucesso
            productStore.fetchProductsPaginated(storeId, page + 1); // Atualiza os produtos após apagar
        } catch (error) {
            console.error("Erro ao apagar o produto:", error);
        }
    };

    return (
        <>
            {/* Barra verde com título e campo de pesquisa */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    p: 2,
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: 2,
                }}
            >
                <Typography variant="h5">Os meus produtos</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Pesquisar produto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ backgroundColor: "white", borderRadius: 1 }}
                    />
                </Box>
            </Box>

            {/* Tabela de produtos */}
            <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Nome</strong></TableCell>
                            <TableCell><strong>Descrição</strong></TableCell>
                            <TableCell><strong>Preço</strong></TableCell>
                            <TableCell><strong>Ações</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productStore.products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>{product.price} €</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleViewProduct(product)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleEditProduct(product)}>
                                        <BorderColorIcon />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDeleteProduct(product)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[10]}
                                count={productStore.totalProducts}
                                rowsPerPage={10}
                                page={page}
                                onPageChange={handleChangePage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>

            {/* Modal para visualização/edição de produto */}
            {selectedProduct && (
                <DashboardProductModal
                    open={showProductModal}
                    onClose={handleCloseModal}
                    product={selectedProduct}
                    storeid={storeId}
                    initialEditMode={initialEditMode}
                />
            )}

            {/* Diálogo de confirmação de exclusão */}
            <Dialog open={deleteDialog.open} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Tem a certeza que deseja apagar este produto?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDeleteProduct} color="secondary">
                        Apagar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});

export default DashboardProductList;
