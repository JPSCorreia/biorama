import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Paper, Rating } from "@mui/material";
import axios from "axios";

const DashboardStoreReviewList = ({ storeId }) => {
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    // Função para buscar as reviews
    const fetchReviews = async (pageNumber = 1) => {
        try {
            const response = await axios.get(`/stores/${storeId}/reviews?page=${pageNumber}`);
            setReviews(response.data.data);  // Atualiza as reviews
            setTotalReviews(response.data.total);  // Total de reviews
        } catch (error) {
            console.error("Erro ao buscar reviews:", error);
        }
    };
console.log("user no review", reviews)

    useEffect(() => {
        fetchReviews(page + 1);  // Corrige para considerar a base 1 do Laravel
    }, [page]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>ID</strong></TableCell>
                        <TableCell><strong>Autor</strong></TableCell>
                        <TableCell><strong>Comentário</strong></TableCell>
                        <TableCell><strong>Avaliação</strong></TableCell>
                        <TableCell><strong>Data</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reviews.map((review) => (
                        <TableRow key={review.id}>
                            <TableCell>{review.id}</TableCell>
                            <TableCell>{review.user?.first_name || "Anónimo"}</TableCell>
                            <TableCell>{review.comment}</TableCell>
                            <TableCell>
                                <Rating value={review.rating} readOnly />
                            </TableCell>
                            <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10]}
                            count={totalReviews}
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

export default DashboardStoreReviewList;
