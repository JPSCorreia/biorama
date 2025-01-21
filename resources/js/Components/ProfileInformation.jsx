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
import AddressModal from "./AddressModal.jsx";
import AddressCard from "./AddressCard.jsx";
import ProfileEditModal from "./ProfileEditModal.jsx";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import React from "react";
import {usePage} from "@inertiajs/react";

const ProfileInformation = observer(() => {
    const {genders, user = {} } = usePage().props;
    console.log("Teste User Filho", authStore.user);
    console.log("Teste Genders Filho", genders);
    const theme = useTheme();
    const addresses = homeAddressStore.addresses; // Obter moradas do Store



    // Estados separados para cada modal
    const [profileModalOpen, setProfileModalOpen] = React.useState(false);
    const [addressModalOpen, setAddressModalOpen] = React.useState(false);

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
                    src={authStore.user?.image_profile}
                    sx={{
                        width: isSmallScreen ? 90 : 150,
                        height: isSmallScreen ? 90 : 150,
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
                            {authStore.user.first_name} {authStore.user.last_name}
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
                                onClick={handleProfileModalOpen}
                            >
                                Editar Perfil
                            </Button>
                        )}
                        <ProfileEditModal open={profileModalOpen} handleClose={handleProfileModalClose}/>
                    </Box>
                </Box>
            </Box>

            {/* Dados Pessoais BOTAO NO ECRÃ PEQUENO*/}
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
                        p:3
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
                                "& > :first-of-type": {
                                    marginRight: isSmallScreen ? "" : 5.25,
                                    marginBottom: isSmallScreen ? 2 : "",
                                },
                                "& > :last-child": {
                                    marginLeft: isSmallScreen ? "" : 5.25,
                                    marginTop: isSmallScreen ? 2 : "",
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
                                        width: isSmallScreen ? "100%" : "30%",
                                        height: isSmallScreen ? "200px" : "372px",
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
        </Paper>
    );
});

export default ProfileInformation;
