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
    IconButton, ListItemButton, ListItemIcon, ListItemText,
} from "@mui/material";
import { authStore, homeAddressStore } from "../Stores";
import { observer } from "mobx-react";
import AddressModal from "./AddressModal.jsx";
import AddressCard from "./AddressCard.jsx";
import ProfileEditModal from "./ProfileEditModal.jsx";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SideBar from "./SideBar.jsx";
import { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";

const ProfileInformation = observer(() => {



    const theme = useTheme();
    const addresses = homeAddressStore.addresses; // Obter moradas do Store

    // Estados separados para cada modal
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [addressModalOpen, setAddressModalOpen] = useState(false);

    // Funções para abrir/fechar modais
    const handleProfileModalOpen = () => setProfileModalOpen(true);
    const handleProfileModalClose = () => setProfileModalOpen(false);

    const handleAddressModalOpen = () => setAddressModalOpen(true);
    const handleAddressModalClose = () => setAddressModalOpen(false);


    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                overflow: "hidden", // Evita overflow lateral
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: "75%",
                    m: "auto",
                    display: isSmallScreen ? 'none' : "flex",
                    flexDirection: "column",
                    borderRadius: "10px",
                }}

            >
                {/* Avatar e Nome ECRÃ LARGE */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        m:" 2% auto 2% auto",
                        justifyContent: "center",

                    }}
                >
                    <Box>
                        <Avatar
                            alt="Profile Image"
                            variant = {isSmallScreen ? "" : "rounded"}
                            src={authStore.user?.image_profile}
                            sx={{
                                justifyContent: "flex-top",
                                width: isSmallScreen ? 90 : 150,
                                height: isSmallScreen ? 90 : 150,
                                color: "background.secondary",
                                bgcolor: "primary.main",
                                borderRadius: isSmallScreen ? "50%" : "10px",
                                fontSize: isSmallScreen ? "1.5rem" : "3rem",
                                display: isSmallScreen ? "none" : "block",
                            }}
                        >
                            {authStore.user?.first_name[0]}
                            {authStore.user?.last_name[0]}
                        </Avatar>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            ml: 2,
                            mt: 5,
                            width: "85%",


                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                mb: 2,
                            }}
                        >
                            <Typography sx={{
                                fontWeight: "bold",
                                fontSize: "2.3rem"
                            }}
                            >
                                {authStore.user.first_name} {authStore.user.last_name}
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{ width: "140px",
                                    alignContent: "center",
                                    display: isSmallScreen ? "none" : "block",
                                }}
                                onClick={handleProfileModalOpen}
                            >
                                Editar Perfil
                            </Button>
                        </Box>
                        <ProfileEditModal open={profileModalOpen} handleClose={handleProfileModalClose}/>
                        <Box
                            sx={{
                                width: "100%",
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
                                    width: "50%",
                                    borderBottom: "1px solid #e0e0e0",

                                }}
                            >
                                <Typography sx={{ fontWeight: "bold", fontSize: "2rem" }}>Dados Pessoais</Typography>
                                <Box>
                                    {authStore.isAuthenticated && (
                                        <IconButton
                                            aria-label="edit"
                                            onClick={handleProfileModalOpen}
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
                                    <ProfileEditModal open={profileModalOpen} handleClose={handleProfileModalClose} />
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    mt: 9.5,
                                }}
                            >
                                <Typography sx={{ fontWeight: "bold", fontSize: "2rem" }}>Dados Pessoais</Typography>
                                <List
                                    sx={{
                                        pl:2,
                                        width: "60%",
                                    }}
                                >
                                    <ListItem
                                        sx={{
                                            display: "flex",
                                            flexDirection: isSmallScreen ? "column" : "row",
                                            justifyContent: isSmallScreen ? "" : "space-between",
                                            alignItems: isSmallScreen ? "baseline" : "",
                                            p: 0,
                                        }}
                                    >
                                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                                            <Typography sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>Email</Typography>
                                            <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                                                {authStore.user.email}
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
                                                {authStore.user.phone || "Não Fornecido"}
                                            </Typography>
                                        </Box>
                                    </ListItem>
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
                                            <Typography sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>NIF</Typography>
                                            <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                                                {authStore.user.nif || "Não Fornecido"}
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
                                            <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>Género</Typography>
                                            <Typography variant="body1" gutterBottom sx={{ mt: 1, ml: 1 }}>
                                                {authStore.user.gender?.name|| "Não Fornecido"}
                                            </Typography>
                                        </Box>
                                    </ListItem>
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
                                            <Typography sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>Data de Nascimento</Typography>
                                            <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                                                {authStore.user.date_of_birth || "Não Fornecida"}
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
                                                {calculateRegisterTime(authStore.user.created_at)}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                </List>

                                {/* Gestão de Moradas */}
                                <Box sx={{ mt: 4 }}>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "2rem", mb: 2 }}>Gestão de Moradas</Typography>
                                    {addresses.length > 0 ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: isSmallScreen ? "column" : "row",
                                                alignItems: isSmallScreen ? "baseline" : "center",
                                                flexWrap: "wrap",
                                                m: isSmallScreen ? "auto" : 0,
                                                '& > :first-of-type': {
                                                    mr: '10%',
                                                },
                                            }}
                                        >
                                            {addresses.map((address) => {
                                                return (
                                                    <AddressCard
                                                        key={address.id}
                                                        address={address}
                                                        theme={theme}

                                                    />
                                                );
                                            })}

                                            {addresses.length < 3 && (
                                                <Box
                                                    onClick={handleAddressModalOpen}
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        ml: isSmallScreen ? "auto" : 0,
                                                        mr: isSmallScreen ? "auto" : 0,
                                                        backgroundColor: "#388e3c26",
                                                        border: "2px dashed",
                                                        borderColor: theme.palette.primary.main,
                                                        borderRadius: "10px",
                                                        width: isSmallScreen ? "100%" : "25%",
                                                        minHeight: isSmallScreen ? "200px" : "350px",
                                                        cursor: "pointer",
                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            transform: "scale(1.05)",
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
                                            onClick={handleAddressModalOpen} // Abre o modal para adicionar uma nova morada
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: "#f5f5f5", // Cor de fundo do card
                                                border: "2px dashed #9e9e9e", // Borda estilizada
                                                borderRadius: "10px", // Cantos arredondados
                                                width: isSmallScreen? "100%" : "30%", // Largura do card
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
                                    <AddressModal open={addressModalOpen} handleClose={handleAddressModalClose} />
                                </Box>

                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>

        </Box>
    );
});

export default ProfileInformation;
