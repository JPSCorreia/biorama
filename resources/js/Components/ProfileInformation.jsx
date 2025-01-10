import {
    Avatar,
    Button,
    Paper,
    Typography,
    Box,
    Divider,
    ListItem,
    List,
    useTheme,
    useMediaQuery,
    IconButton,
} from "@mui/material";
import { authStore, homeAddressStore } from "../Stores";
import { observer } from "mobx-react";
import { router } from "@inertiajs/react";
import AddressModal from "./AddressModal.jsx";
import AddressCard from "./AddressCard.jsx";
import EditIcon from '@mui/icons-material/Edit';
import React from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const ProfileInformation = observer(({ user }) => {
    const theme = useTheme();
    const addresses = homeAddressStore.addresses; // Obter moradas do Store
    const [open, setOpen] = React.useState(false); // Estado para abrir o modal

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const handleOpen = () => setOpen(true); // Abrir modal para adicionar morada
    const handleClose = () => setOpen(false); // Fechar modal

    const calculateRegisterTime = (createdDate) => {
        const actualDate = new Date();
        const registerDate = new Date(createdDate);
        const msDifference = actualDate - registerDate;
        const totalDays = Math.floor(msDifference / (1000 * 60 * 60 * 24));
        const years = Math.floor(totalDays / 365);
        const days = totalDays % 365;

        if (years === 1 && days === 1) {
            return `${years} ano e ${days} dia`;
        } else if (years > 1 && days === 1) {
            return `${years} anos e ${days} dia`;
        } else if (years > 1 && days > 1) {
            return `${years} anos e ${days} dias`;
        } else if (days === 1) {
            return `${days} dia`;
        } else {
            return `${days} dias`;
        }
    };

    return (
        <Paper
            elevation={4}
            sx={{
                p: 2,
                width: isSmallScreen ? "100%" : "80%",
                m: "auto",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                borderRadius: "10px",
            }}
        >
            {/* Avatar e Nome ECRÃ LARGE */}
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", mb: 4 }}>
                <Avatar
                    alt="Profile Image"
                    variant = {isSmallScreen ? "" : "rounded"}
                    sx={{
                        width: isSmallScreen ? 90 : 110,
                        height: isSmallScreen ? 90 : 110,
                        color: "background.secondary",
                        bgcolor: "primary.main",
                        borderRadius: isSmallScreen ? "50%" : "10px",
                        fontSize: isSmallScreen ? "1.5rem" : "3rem",
                    }}
                >
                    {authStore.user?.first_name[0]}
                    {authStore.user?.last_name[0]}
                </Avatar>
                <Box sx={{
                    display:  "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between" }}
                >
                    <Box sx={{
                        ml: 2,
                        display: "flex",
                        alignItems: "center"
                    }}
                    >
                        <Typography sx={{
                            fontWeight: "bold",
                            fontSize: "2.3rem"
                        }}
                        >
                            {user.first_name} {user.last_name}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            alignSelf: "flex-end",
                            height: "50px",
                            display: isSmallScreen ? "none" : "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {authStore.isAuthenticated && (
                            <Button
                                variant="contained"
                                sx={{ width: "140px",
                                    alignContent: "center",
                                    mr: 6,
                                    display: isSmallScreen ? "none" : "block",
                                }}
                                onClick={() => router.get("/perfil/edit")}
                            >
                                Editar Perfil
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Dados Pessoais BOTAO SO NO ECRÃ PEQUENO*/}
            <Box
                sx={{
                    width: isSmallScreen ? "100%" : "79%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    m: "auto",
                }}
            >
                <Box
                    sx={{
                        display: isSmallScreen ? "flex" : "none",
                        flexDirection: "row",
                        mb: 3,
                        ml: 2,

                    }}
                >
                    <Typography sx={{ fontWeight: "bold", fontSize: "1.8rem" }}>Dados Pessoais</Typography>
                    <Box>
                        {authStore.isAuthenticated && (
                            <IconButton
                                aria-label="edit"
                                onClick={() => router.get("/perfil/edit")}
                                sx={{
                                    display: isSmallScreen ? "block" : "none",
                                    color: theme.palette.primary.main,
                                    ml: 1,
                                }}
                            >
                                <EditIcon
                                    sx={{
                                        fontSize: "1.6rem",
                                        color: theme.palette.primary.main,
                                    }}
                                />
                            </IconButton>
                        )}
                    </Box>
                </Box>
                <Typography sx={{
                    display: isSmallScreen ? 'none' : 'block',
                    fontWeight: "bold", fontSize: "1.8rem"
                    }}
                >
                    Dados Pessoais
                </Typography>
                <List
                    sx={{
                        width: "100%",
                    }}
                >
                    <ListItem
                        sx={{
                            display: "flex",
                            flexDirection: isSmallScreen ? "column" : "row",
                            justifyContent: isSmallScreen ? "" : "space-between",
                            alignItems: isSmallScreen ? "baseline" : "",
                            p: 0
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>Email</Typography>
                            <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                                {user.email}
                            </Typography>
                        </Box>
                        <Divider
                            variant="middle"
                            sx={{
                                display : isSmallScreen ? "block" : "none",
                                width: "100%",
                                mt: 1.5,
                                mb: 1.5,
                                background: "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.3), transparent)",
                                border: "none",
                                height: 1.5,
                            }}
                        />
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: isSmallScreen ? "flex-start" : "flex-end" }}>
                            <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>Nº de Telemóvel</Typography>
                            <Typography variant="body1" gutterBottom sx={{ mt: 1, ml: 1 }}>
                                {user.phone || "Não Fornecido"}
                            </Typography>
                        </Box>
                    </ListItem>
                    <Divider
                        variant="middle"
                        sx={{
                            width: "100%",
                            mt: 1.5,
                            background: "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.3), transparent)",
                            border: "none",
                            height: 1.5,
                        }}
                    />
                    <ListItem
                        sx={{
                            display: "flex",
                            flexDirection: isSmallScreen ? "column" : "row",
                            justifyContent: isSmallScreen ? "" : "space-between",
                            alignItems: isSmallScreen ? "baseline" : "",
                            p: 0,
                            mt: 2
                    }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>Data de Nascimento:</Typography>
                            <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                                {user.date_of_birth || "Não Fornecida"}
                            </Typography>
                        </Box>
                        <Divider
                            variant="middle"
                            sx={{
                                display : isSmallScreen ? "block" : "none",
                                width: "100%",
                                mt: 1.5,
                                mb: 1.5,
                                background: "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.3), transparent)",
                                border: "none",
                                height: 1.5,
                            }}
                        />
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: isSmallScreen ? "flex-start" : "flex-end" }}>
                            <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>Tempo de Registo</Typography>
                            <Typography variant="body1" gutterBottom sx={{ mt: 1, ml: 1 }}>
                                {calculateRegisterTime(user.created_at)}
                            </Typography>
                        </Box>
                    </ListItem>
                </List>

                {/* Gestão de Moradas */}
                <Box sx={{ mt: 4 }}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "1.8rem", mb: 2 }}>Gestão de Moradas</Typography>
                    {addresses.length > 0 ? (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: isSmallScreen ? "column" : "row",
                                alignItems: isSmallScreen ? "baseline" : "center",
                                flexWrap: "wrap",
                                m: isSmallScreen ? "auto" : 0, // Margem negativa para compensar a margem do último filho
                                "& > :first-of-type": {
                                    marginRight: isSmallScreen ? "" : 5.25,
                                    marginBottom: isSmallScreen ? 2 : "",// Margem à direita para o primeiro filho
                                },
                                "& > :last-child": {
                                    marginLeft: isSmallScreen ? "" : 5.25, // Margem à esquerda para o último filho
                                    marginTop: isSmallScreen ? 2 : "",
                                },
                            }}
                        >
                            {addresses.map((address, index) => {
                                return (
                                    <AddressCard
                                        key={address.id || index}
                                        address={address}
                                        theme={theme}

                                    />
                                );
                            })}

                            {addresses.length < 3 && (
                                <Box
                                    onClick={handleOpen}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        ml: isSmallScreen ? "auto" : 0,
                                        mr: isSmallScreen ? "auto" : 0,
                                        backgroundColor: "#388e3c26", // Cor de fundo do card
                                        border: "2px dashed",
                                        borderColor: theme.palette.primary.main, // Borda estilizada
                                        borderRadius: "10px", // Cantos arredondados
                                        width: isSmallScreen ? "80%" : "30%", // Largura igual aos outros cards
                                        height: isSmallScreen ? "200px" : "315px", // Altura fixa para coincidir com os outros cards
                                        cursor: "pointer", // Indica que é clicável
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra para parecer um card
                                        transition: "all 0.3s ease", // Animação suave no hover
                                        "&:hover": {
                                            transform: "scale(1.05)", // Leve aumento no hover
                                        },
                                    }}
                                >
                                    <AddCircleIcon
                                        sx={{
                                            fontSize: 40,
                                            color: theme.palette.primary.main,
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            mt: 1,
                                            fontWeight: "bold",
                                            color: theme.palette.primary.main,
                                        }}
                                    >
                                        Adicionar Morada
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Box
                            onClick={handleOpen} // Abre o modal para adicionar uma nova morada
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f5f5f5", // Cor de fundo do card
                                border: "2px dashed #9e9e9e", // Borda estilizada
                                borderRadius: "10px", // Cantos arredondados
                                width: "30%", // Largura do card
                                height: "150px", // Altura do card
                                cursor: "pointer", // Indica que é clicável
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra para dar efeito de card
                                transition: "all 0.3s ease", // Animação suave no hover
                                "&:hover": {
                                    backgroundColor: "#e0e0e0", // Cor de fundo no hover
                                    transform: "scale(1.05)", // Leve aumento no hover
                                },
                            }}
                        >
                            <AddCircleIcon sx={{ fontSize: 40, color: "#757575" }} /> {/* Ícone central */}
                            <Typography sx={{ mt: 1, fontWeight: "bold", color: "#757575" }}>
                                Adicionar Morada
                            </Typography>
                        </Box>
                    )}

                    {/* Modal apenas para adicionar moradas */}
                    <AddressModal open={open} handleClose={handleClose} />
                </Box>
            </Box>
        </Paper>
    );
});

export default ProfileInformation;
