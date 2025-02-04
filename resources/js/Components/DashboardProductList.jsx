import React, {useEffect, useState} from "react";
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
    IconButton
} from "@mui/material";
import axios from "axios";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DashboardProductModal from "@/Components/DashboardProductModal.jsx";

const DashboardProductList = ({storeId}) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);

    // Função para buscar os produtos
    const fetchProducts = async (pageNumber = 1) => {
        try {
            const response = await axios.get(`/stores/${storeId}/products?page=${pageNumber}`);
            setProducts(response.data.data);  // Atualiza os produtos
            setTotalProducts(response.data.total);  // Total de produtos
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };

    // Buscar produtos na montagem inicial e quando a página muda
    useEffect(() => {
        fetchProducts(page + 1);  // Corrige para considerar a base 1 do Laravel
    }, [page]);

    // Atualiza a página
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Abre o modal e define o produto selecionado
    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    // Fecha o modal
    const handleCloseModal = () => {
        setShowProductModal(false);
        setSelectedProduct(null);
    };


    return (
        <>
            <TableContainer component={Paper} sx={{mt: 3, boxShadow: 3, borderRadius: 2}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Nome</strong></TableCell>
                            <TableCell><strong>Descrição</strong></TableCell>
                            <TableCell><strong>Preço</strong></TableCell>
                            <TableCell><strong>Acção</strong> </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleViewProduct(product)}>
                                        <VisibilityIcon/>
                                    </IconButton>
                                    <IconButton>
                                        <BorderColorIcon/>
                                    </IconButton>
                                    <IconButton>
                                        < DeleteIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[10]}
                                count={totalProducts}
                                rowsPerPage={10}
                                page={page}
                                onPageChange={handleChangePage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            {/* Modal para visualizar o produto */}
            {selectedProduct && (
                <DashboardProductModal
                    open={showProductModal}
                    onClose={handleCloseModal}
                    product={selectedProduct}
                />
            )}
        </>
    );
};

export default DashboardProductList;
