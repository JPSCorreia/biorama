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
                    p: 3,
                    borderRadius: "8px",
                }}
            >
                    <Box sx={{ display: "flex", justifyContent: "start" }}>
                        <Avatar
                            alt="Profile Image"
                            variant={isSmallScreen ? "" : "rounded"}
                            src={authStore.user?.image_profile}
                            sx={{
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
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: "bold",
                                    mt: 2,
                                }}
                            >
                                {authStore.user?.first_name}{" "}
                                {authStore.user?.last_name}
                            </Typography>
                        </Box>
                        <ProfileEditModal
                            open={profileModalOpen}
                            handleClose={handleProfileModalClose}
                        />
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                }}
                            >
                                <Box>
                                    <ProfileEditModal
                                        open={profileModalOpen}
                                        handleClose={handleProfileModalClose}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <List
                                >
                                    <ListItem
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "baseline",
                                            p: 0,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "baseline",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: "bold",
                                                    fontSize: "1.3rem",
                                                }}
                                            >
                                                Email:
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                gutterBottom
                                                sx={{ ml: 1 }}                                    >
                                                {authStore.user?.email}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: isSmallScreen
                                                    ? "flex-start"
                                                    : "flex-end",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: "bold",
                                                    fontSize: "1.5rem",
                                                }}
                                            >
                                                Nº de Telemóvel
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                gutterBottom
                                                sx={{ mt: 1, ml: 1 }}
                                            >
                                                {authStore.user?.phone ||
                                                    "Não Fornecido"}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                    <Divider
                                        variant="middle"
                                        sx={{
                                            display: isSmallScreen
                                                ? "block"
                                                : "none",
                                            width: "100%",
                                            mt: 1.5,
                                            mb: 1.5,
                                            background:
                                                "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.3), transparent)",
                                            border: "none",
                                            height: 1.5,
                                        }}
                                    />
                                    <ListItem
                                        sx={{
                                            display: "flex",
                                            flexDirection: isSmallScreen
                                                ? "column"
                                                : "row",
                                            justifyContent: isSmallScreen
                                                ? ""
                                                : "space-between",
                                            alignItems: isSmallScreen
                                                ? "baseline"
                                                : "",
                                            p: 0,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: "bold",
                                                    fontSize: "1.3rem",
                                                }}
                                            >
                                                NIF
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                gutterBottom
                                                sx={{ ml: 1 }}
                                            >
                                                {authStore.user?.nif ||
                                                    "Não Fornecido"}
                                            </Typography>
                                        </Box>
                                        <Divider
                                            variant="middle"
                                            sx={{
                                                display: isSmallScreen
                                                    ? "block"
                                                    : "none",
                                                width: "100%",
                                                mt: 1.5,
                                                mb: 1.5,
                                                background:
                                                    "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.3), transparent)",
                                                border: "none",
                                                height: 1.5,
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: isSmallScreen
                                                    ? "flex-start"
                                                    : "flex-end",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: "bold",
                                                    fontSize: "1.5rem",
                                                }}
                                            >
                                                Género
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                gutterBottom
                                                sx={{ mt: 1, ml: 1 }}
                                            >
                                                {authStore.user?.gender?.name ||
                                                    "Não Fornecido"}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                    <Divider
                                        variant="middle"
                                        sx={{
                                            display: isSmallScreen
                                                ? "block"
                                                : "none",
                                            width: "100%",
                                            mt: 1.5,
                                            mb: 1.5,
                                            background:
                                                "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.3), transparent)",
                                            border: "none",
                                            height: 1.5,
                                        }}
                                    />
                                    <ListItem
                                        sx={{
                                            display: "flex",
                                            flexDirection: isSmallScreen
                                                ? "column"
                                                : "row",
                                            justifyContent: isSmallScreen
                                                ? ""
                                                : "space-between",
                                            alignItems: isSmallScreen
                                                ? "baseline"
                                                : "",
                                            p: 0,
                                            mt: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: "bold",
                                                    fontSize: "1.3rem",
                                                }}
                                            >
                                                Data de Nascimento
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                gutterBottom
                                                sx={{ ml: 1 }}
                                            >
                                                {authStore.user?.date_of_birth ||
                                                    "Não Fornecida"}
                                            </Typography>
                                        </Box>
                                        <Divider
                                            variant="middle"
                                            sx={{
                                                display: isSmallScreen
                                                    ? "block"
                                                    : "none",
                                                width: "100%",
                                                mt: 1.5,
                                                mb: 1.5,
                                                background:
                                                    "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.3), transparent)",
                                                border: "none",
                                                height: 1.5,
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: isSmallScreen
                                                    ? "flex-start"
                                                    : "flex-end",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: "bold",
                                                    fontSize: "1.5rem",
                                                }}
                                            >
                                                Tempo de Registo
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                gutterBottom
                                                sx={{ mt: 1, ml: 1 }}
                                            >
                                                {calculateRegisterTime(
                                                    authStore.user?.created_at,
                                                )}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                </List>
                                <Button
                                    variant="contained"
                                    sx={{
                                        width: "140px",
                                        alignContent: "center",
                                        justifySelf: "end",
                                        display: isSmallScreen
                                            ? "none"
                                            : "block",
                                    }}
                                    onClick={handleProfileModalOpen}
                                >
                                    Editar Perfil
                                </Button>
                            </Box>
                        </Box>
                    </Box>
            </Paper>
        </Box>
    );
});

export default ProfileInformation;
