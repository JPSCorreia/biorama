import React from "react";
import {
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    useMediaQuery,
    useTheme
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { authStore } from "@/Stores";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSidebar } from "../../Context/SidebarContext.jsx";
import { observer } from "mobx-react";
import { router } from "@inertiajs/react";

const SideBar = observer(() => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const { activeItem, setActiveItem } = useSidebar();

    const menuItems = [
        { text: "Dados Pessoais", icon: <AccountCircleIcon />, color: theme.palette.primary.main },
        { text: "Encomendas", icon: <ShoppingCartIcon />, color: theme.palette.message.info },
        { text: "Moradas", icon: <HomeIcon />, color: theme.palette.message.success },
        { text: "Notificações", icon: <NotificationsIcon />, color:  theme.palette.message.warning },
        { text: "Sair", icon: <LogoutIcon />, color:  theme.palette.message.error },
    ];

    const handleNavigation = (text) => {
        switch (text) {
            case "Sair":
                router.post(
                    "/sair",
                    {},
                    {
                        onSuccess: () => {
                            authStore.updateAuth({ user: null });
                        },
                    },
                );
                break;
            case "Dados Pessoais":
                console.log("Navegar para Dados Pessoais");
                break;
            default:
                console.log(`Navegar para ${text}`);
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
        <Box sx={{ display: "flex", flexDirection: "column",  width: "100%", alignItems: "baseline", justifyContent: "flex-start", ml: 2, mb: 1 }}>
        <Typography
            sx={{ fontWeight: "bold", alignItems: "baseline"}}
        >
            {authStore.user?.first_name} {authStore.user?.last_name}
        </Typography>
        <Typography
            sx={{ fontWeight: "bold", fontSize: 12, ml: 1, alignItems: "baseline", color: "text.secondary" }}
        >
            ({authStore.user?.email})
        </Typography>
        </Box>
        <Paper
            elevation={4}
            sx={{
                width: isSmallScreen ? "90%" : "280px", // Largura responsiva
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: 2, // Padding menor em telas pequenas
                borderRadius: "8px",
            }}
        >
            <List sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", maxHeight: "320px" }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ display: "flex", width: "100%", mb: 2 }}>
                        <ListItemButton
                            onClick={() => {
                                setActiveItem(item.text); // Define o item ativo no contexto
                                handleNavigation(item.text);
                            }}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5, // Ícones mais próximos do texto
                                bgcolor: activeItem === item.text ? "primary.light" : "inherit",
                                color: activeItem === item.text ? "profile.sidebar.textActive" :  "profile.sidebar.text", // Cor do texto baseada na seleção
                                borderRadius: "5px",

                                "&:hover": {
                                    bgcolor: activeItem === item.text ? "secondary.dark" : "primary.light", // Hover verde mais escuro para item selecionado

                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: activeItem === item.text ? "profile.sidebar.iconActive" : item.color, // Cor do ícone baseada na seleção
                                    minWidth: 0,
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                            <ArrowForwardIosIcon
                                sx={{
                                    color: activeItem === item.text ? "profile.sidebar.arrowActive" : "profile.sidebar.arrow", // Ícone de seta baseado na seleção
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

        </Paper>
        </Box>
    );
});

export default SideBar;
