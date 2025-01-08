import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

import { alpha } from '@mui/material/styles';
import axios from "axios";
import AddressEditModal from "./AddressEditModal.jsx";

const AddressCard = ({ address, theme }) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSetPrimary = async (addressId) => {
        try {
            const response = await axios.patch(`/addresses/${addressId}/set-morada-fav`);
            if (response.status === 200) {
                console.log('Morada marcada como favorita com sucesso');
                // Atualiza o estado para refletir a mudança
            }
        } catch (error) {
            console.error('Erro ao marcar morada como favorita:', error);
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: "#ffffff", // Fundo branco
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
                borderRadius: "10px",
                width: "30%",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra leve
                border: "1px solid #e0e0e0", // Borda cinza clara
            }}
        >
            {/* Título da Morada */}
            <Typography
                sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    color: "#333", // Cor escura para contraste
                    mb: 1,
                }}
            >
                {address.address_name || "Nome da Morada"}
            </Typography>

            {/* Detalhes da Morada */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    mb: 1,
                }}
            >
                <Typography
                    sx={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                    }}
                >
                    Rua
                </Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ ml: 1 }}
                >
                    {address.street_address}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    mb: 1,
                }}
            >
                <Typography
                    sx={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                    }}
                >
                    Cidade
                </Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ ml: 1 }}
                >
                    {address.city}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    mb: 1,
                }}
            >
                <Typography
                    sx={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                    }}
                >
                    Código Postal
                </Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ ml: 1 }}
                >
                    {address.postal_code}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    mb: 1,
                }}
            >
                <Typography
                    sx={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                    }}
                >
                    Contacto
                </Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ ml: 1 }}
                >
                    {address.phone_number}
                </Typography>
            </Box>

            {/* Botões */}
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                {/* Botão Estrela */}
                {!address.is_primary ? (
                    <Button
                        variant="text"
                        sx={{
                            color: "#aaa", // Cor da estrela quando não é primária
                            "&:hover": {
                                color: "#666", // Cor ao passar o cursor
                            },
                            minWidth: 0, // Remove o espaço extra do botão
                            padding: 0, // Remove o padding interno
                        }}
                        onClick={() => handleSetPrimary(address.id)}
                    >
                        <StarBorderIcon sx={{ fontSize: "1.5rem" }} />
                    </Button>
                    ) : (
                        <Button
                            variant="text"
                            sx={{
                                color: theme.palette.primary.main, // Cor da estrela quando é primária
                                "&:hover": {
                                    color: alpha(theme.palette.primary.main, 0.7), // Cor ao passar o cursor
                                },
                                minWidth: 0, // Remove o espaço extra do botão
                                padding: 0, // Remove o padding interno
                            }}
                            onClick={() => handleSetPrimary(address.id)}
                        >
                            <StarIcon sx={{ fontSize: "1.5rem", color: "gold" }} />
                        </Button>
                    )
                }

                {/* Botão Editar */}
                <Button
                    variant="outlined"
                    sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        "&:hover": {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        },
                    }}
                    onClick={handleOpen}
                >
                    Editar
                </Button>
                <AddressEditModal open={open} handleClose={handleClose} address={address} />

                {/* Botão Apagar */}
                <Button
                    variant="outlined"
                    color="error"
                    sx={{
                        borderColor: "#f44336",
                        color: "#f44336",
                        "&:hover": {
                            backgroundColor: alpha("#f44336", 0.1),
                        },
                    }}
                >
                    Apagar
                </Button>
            </Box>
        </Box>
    );
};

export default AddressCard;
