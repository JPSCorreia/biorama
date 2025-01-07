import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import { Box, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { router } from "@inertiajs/react";

// Estilos personalizados
const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 5,
    width: "100%",
    maxWidth: "750px", // Define um limite de largura para monitores maiores
    [theme.breakpoints.down("lg")]: {
        width: "100%", // Full width em dispositivos pequenos
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "white", // Texto branco no campo de pesquisa
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingRight: `calc(1em + ${theme.spacing(4)})`, // Espaço para o ícone
        paddingLeft: theme.spacing(2), // Espaçamento inicial
        transition: theme.transitions.create("width"),
        [theme.breakpoints.up("sm")]: {
            width: "12ch",
            "&:focus": {
                width: "20ch",
            },
        },
    },
}));

const SearchBar = () => {
    const [query, setQuery] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Evita refresh da página
        router.get("/pesquisa", { query });
    };

    return (
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: "flex", justifyContent: "center" }}>
            <Search>
                <StyledInputBase
                    placeholder="Pesquisar..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    inputProps={{ "aria-label": "search" }}
                />
                {/* Ícone de lupa à direita */}
                <IconButton type="submit" sx={{ position: "absolute", right: 0, color: "white" }}>
                    <SearchIcon />
                </IconButton>
            </Search>
        </Box>
    );
};

export default SearchBar;
