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
import { authStore, homeAddressStore } from "../../Stores/index.js";
import { observer } from "mobx-react";
import ProfileEditModal from "../../Components/ProfileEditModal.jsx";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { formatDateToPortuguese } from "../../utils/utils";


const ProfileInformation = observer(() => {
    const theme = useTheme();
    const addresses = homeAddressStore.addresses; // Obter moradas do Store

    // Estados separados para cada modal
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    // Funções para abrir/fechar modais
    const handleProfileModalOpen = () => setProfileModalOpen(true);
    const handleProfileModalClose = () => setProfileModalOpen(false);

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
            }}
        >
            <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 2, width: "100%" }}
            >
                Dados Pessoais
            </Typography>
            <Paper
                elevation={4}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    justifyContent: "start",
                    p: 2,
                    borderRadius: "8px",
                }}
            >
                <Avatar
                    alt="Profile Image"
                    src={authStore.user?.image_profile}
                    sx={{
                        width: isSmallScreen ? 90 : 120,
                        height: isSmallScreen ? 90 : 120,
                        color: "background.secondary",
                        bgcolor: "primary.main",
                        borderRadius: "8px",
                        border: `1px solid ${theme.palette.primary.main}`,
                    }}
                >
                    {authStore.user?.first_name[0]}
                    {authStore.user?.last_name[0]}
                </Avatar>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: "bold",
                            mt: 2,
                        }}
                    >
                        {authStore.user?.first_name} {authStore.user?.last_name}
                    </Typography>
                    <ProfileEditModal
                        open={profileModalOpen}
                        handleClose={handleProfileModalClose}
                    />
                    <Box>
                        <List sx={{ display: "flex", flexDirection: "row", }}>
                            <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
                            <ListItem
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "baseline",
                                    p: 0,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    Email:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    sx={{ ml: 1 }}
                                >
                                    {authStore.user?.email}
                                </Typography>
                            </ListItem>
                            <ListItem
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "baseline",
                                    p: 0,
                                    mt: 0.8,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    Telefone:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    sx={{ ml: 1 }}
                                >
                                    {authStore.user?.phone || "Desconhecido"}
                                </Typography>
                            </ListItem>
                            <ListItem
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "baseline",
                                    p: 0,
                                    mt: 0.8,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    NIF:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    sx={{ ml: 1 }}
                                >
                                    {authStore.user?.nif || "Desconhecido"}
                                </Typography>
                            </ListItem>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
                            <ListItem
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "baseline",
                                    p: 0,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    Género:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    sx={{ ml: 1 }}
                                >
                                    {authStore.user?.gender?.name || "Desconhecido"}
                                </Typography>
                            </ListItem>
                            <ListItem
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "baseline",
                                    mt: 0.8,
                                    p: 0,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    Data de Nascimento:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    sx={{ ml: 1 }}
                                >
                                    {authStore.user?.date_of_birth || "Desconhecido"}
                                </Typography>
                            </ListItem>
                            <ListItem
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "baseline",
                                    mt: 0.8,
                                    p: 0,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                   Membro desde:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    sx={{ ml: 1 }}
                                >
                                    {formatDateToPortuguese(authStore.user?.created_at)|| "Desconhecido"}
                                </Typography>
                            </ListItem>
                            </Box>
                        </List>
                        <Button
                            variant="contained"
                            sx={{
                                width: "140px",
                                alignContent: "center",
                                justifySelf: "end",
                                display: isSmallScreen ? "none" : "block",
                            }}
                            onClick={handleProfileModalOpen}
                        >
                            Editar Perfil
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
});

export default ProfileInformation;
