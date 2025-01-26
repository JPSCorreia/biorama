import { useState } from "react";
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
    display: "flex",
    // flexGrow: 1, // Ocupa todo o espaço restante
    width: "100%",
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

const SearchBar = () => {
    const [query, setQuery] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Evita refresh da página
        router.get("/pesquisa", { query });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                justifyContent: "center",
                maxWidth: "300px !important",
                marginTop: "4px",
                marginLeft: { xs: 0, md: 2 },
            }}
        >
            <Search>
                <StyledInputBase
                    placeholder="Pesquisar..."
                    value={query}
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
        </Box>
    );
};

export default SearchBar;
