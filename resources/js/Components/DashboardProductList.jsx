import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Paper } from "@mui/material";
import axios from "axios";

const DashboardProductList = ({ storeId }) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);

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

    return (
        <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Nome</strong></TableCell>
                        <TableCell><strong>Descrição</strong></TableCell>
                        <TableCell><strong>Preço</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell>{product.price}</TableCell>
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
    );
};

export default DashboardProductList;
