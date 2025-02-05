import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const DashboardProductSearchBar = ({ onSearch, onClear }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        onClear();  // Chama a função para buscar todos os produtos
    };

    return (
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
                />
                <Button variant="contained" color="primary" onClick={handleSearch}>
                    Pesquisar
                </Button>
                <Button variant="outlined" color="inherit" onClick={handleClearSearch}>
                    Cancelar Pesquisa
                </Button>
            </Box>
        </Box>
    );
};

export default DashboardProductSearchBar;
