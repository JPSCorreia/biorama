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
import { authStore} from "../Stores";
import { observer } from "mobx-react";
import { router } from "@inertiajs/react";
import EditIcon from '@mui/icons-material/Edit';
import user from "@/Fetch-Example/User.jsx";

const VendorInformation = observer(({ vendor }) => {
    if (!vendor) {
        return (
            <Box sx={{ padding: 2 }}>
                <Typography variant="h6" color="error" align="center">
                    Informações de vendedor não disponíveis.
                </Typography>
            </Box>
        );
    }
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
                            <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>IBAN</Typography>
                            <Typography variant="body1" gutterBottom sx={{ mt: 1, ml: 1 }}>
                                PT50 0000 000 325 1254 1
                            </Typography>
                        </Box>
                    </ListItem>
                </List>

                {/* Gestão de Moradas */}
                <Box sx={{ mt: 4 }}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "1.8rem", mb: 2 }}>Morada</Typography>
                </Box>
            </Box>
        </Paper>
    );
});

export default VendorInformation;

