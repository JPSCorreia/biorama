import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import {orderStore} from "@/Stores/index.js";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, TextField, Button } from "@mui/material";

const DashboardAllOrders = observer(() => {
    const [sortField, setSortField] = useState("user");

    // Buscar encomendas ao carregar o componente
    useEffect(() => {
        orderStore.fetchOrders();
    }, []);

    // Ordenar encomendas dinamicamente
    const sortedOrders = [...orderStore.orders].sort((a, b) => {
        if (sortField === "user") return (a.user?.name || "").localeCompare(b.user?.name || "");
        if (sortField === "status") return a.status?.name.localeCompare(b.status?.name);
        if (sortField === "total") return parseFloat(b.total || 0) - parseFloat(a.total || 0);
        return 0;
    });


    return (
        <div>
            {/* Campo de pesquisa */}
            <TextField
                label="Pesquisar por ID ou nome do utilizador"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 2 }}
                onChange={(e) => orderStore.searchOrders(e.target.value)}
            />

            {/* Botões de ordenação */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <Button variant="outlined" onClick={() => setSortField("user")}>Ordenar por Nome</Button>
                <Button variant="outlined" onClick={() => setSortField("status")}>Ordenar por Status</Button>
                <Button variant="outlined" onClick={() => setSortField("total")}>Ordenar por Valor</Button>
            </div>

            {/* Verificação de encomendas */}
            {orderStore.orders.length === 0 ? (
                <p>Nenhuma encomenda encontrada.</p>
            ) : (
                <>
                    {/* Tabela de encomendas */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Utilizador</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.user?.name || "N/A"}</TableCell>
                                        <TableCell>{order.status?.name || "N/A"}</TableCell>
                                        <TableCell>{parseFloat(order.total || 0).toFixed(2)} €</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Paginação */}
                    {orderStore.totalPages > 1 && (
                        <Pagination
                            count={orderStore.totalPages}
                            page={orderStore.currentPage}
                            onChange={(e, value) => orderStore.changePage(value)}
                            sx={{ marginTop: 2 }}
                        />
                    )}
                </>
            )}
        </div>
    );
});

export default DashboardAllOrders;
