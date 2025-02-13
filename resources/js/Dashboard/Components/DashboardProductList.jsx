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
    useTheme,
    useMediaQuery,
    InputBase,
    Tooltip,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { observer } from "mobx-react";
import { productStore } from "@/Stores/index.js";
import { DashboardCreateProductModal, DashboardProductModal } from "@/Dashboard/Components/";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ReactMarkdown from "react-markdown";

const DashboardProductList = observer(({ storeId }) => {

    const theme = useTheme();
    const smallerThanSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [initialEditMode, setInitialEditMode] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        product: null,
    });
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        productStore.fetchProductsPaginated(storeId, page + 1, searchTerm);
    }, [page, searchTerm]);

    // Atualiza a página
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

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

    const Search = styled("div")(({ theme }) => ({
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        display: "flex",
        // flexGrow: 1, // Ocupa todo o espaço restante
        width: smallerThanSmall ? "90%" : "250px",
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: "inherit", // Herda a cor do tema atual
        width: "100%",
        "& .MuiInputBase-input": {
            padding: theme.spacing(1, 1, 1, 0),
            paddingRight: `calc(1em + ${theme.spacing(4)})`, // Espaço para o ícone
            paddingLeft: theme.spacing(2), // Espaçamento inicial
            transition: theme.transitions.create("width"),
        },
    }));

    return (
        <Box sx={{ mb: 4 }}>
            {/* Barra verde com título e campo de pesquisa */}
            <Paper
                elevation={4}
                sx={{
                    display: "flex",
                    justifyContent: smallerThanSmall? "center" : "space-between",
                    alignItems: "center",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                }}
            >
                {!smallerThanSmall && <Typography variant="h5" sx={{ fontWeight: "bold" }}>Os meus produtos</Typography>}
                <Search>
                <StyledInputBase
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setQuery(e.target.value)}
                    inputProps={{ "aria-label": "search" }}
                />
                {/* Ícone de lupa à direita */}
                <IconButton
                    type="submit"
                    sx={{
                        position: "absolute",
                        right: 0,
                        color: "white",
                    }}
                >
                    <SearchIcon />
                </IconButton>
            </Search>
            </Paper>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleOpenCreateModal} variant="contained">
                    Adicionar Produto
                </Button>
            </Box>

            {/* Tabela de produtos */}
            <TableContainer
                component={Paper}
                sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>Nome</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Descrição</strong>
                            </TableCell>
                            <TableCell align="center">
                                <strong>Preço</strong>
                            </TableCell>
                            <TableCell align="center">
                                <strong>Ações</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productStore.products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell><ReactMarkdown>{product.description}</ReactMarkdown></TableCell>
                                <TableCell align="center">{product.price} €</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Visualizar">
                                    <IconButton
                                        onClick={() =>
                                            handleViewProduct(product)
                                        }
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                    <IconButton
                                        onClick={() =>
                                            handleEditProduct(product)
                                        }
                                    >
                                        <BorderColorIcon />
                                    </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Apagar">
                                    <IconButton
                                        onClick={() =>
                                            confirmDeleteProduct(product)
                                        }
                                    >
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                    </Tooltip>
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

            {/* Modal de criação */}
            <DashboardCreateProductModal
                open={showCreateModal}
                handleClose={handleCloseCreateModal}
                storeId={storeId}
                handleViewProduct={handleViewProduct} // Passamos a função
            />

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
                <DialogTitle>
                    Tem a certeza que deseja apagar este produto?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDeleteProduct} color="error">
                        Apagar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
});

export default DashboardProductList;
