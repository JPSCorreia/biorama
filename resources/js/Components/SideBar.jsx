import React from "react";
import {
    Box,
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
import { useSidebar } from "@/context/SidebarContext"; // Importa o Contexto

const SideBar = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const menuItems = [
        { text: "Dados Pessoais", icon: <AccountCircleIcon />, color: "primary.main" },
        { text: "Encomendas", icon: <ShoppingCartIcon />, color: "secondary.main" },
        { text: "Moradas", icon: <HomeIcon />, color: "success.main" },
        { text: "Notificações", icon: <NotificationsIcon />, color: "warning.main" },
        { text: "Sair", icon: <LogoutIcon />, color: "warning.main" },
    ];

    const handleNavigation = (text) => {
        switch (text) {
            case "Sair":
                authStore.logout();
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
                width: isSmallScreen ? "100vw" : "240px", // Largura responsiva
                height: isSmallScreen ? "auto" : "100vh", // Altura total em telas grandes
                bgcolor: "#f5f5f5",
                boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: isSmallScreen ? 1 : 2, // Padding menor em telas pequenas
                borderRadius: isSmallScreen ? 0 : "10px",
                overflowY: "auto", // Permite rolagem se necessário
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, ml: 2 }}>
                Olá, {authStore.user.first_name}
            </Typography>

            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ width: "100%", mb: 2 }}>
                        <ListItemButton
                            onClick={() => {
                                setActiveItem(item.text); // Define o item ativo no contexto
                                handleNavigation(item.text);
                            }}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                bgcolor: activeItem === item.text ? "primary.light" : "inherit",
                                borderRadius: "5px",
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                            <ArrowForwardIosIcon />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SideBar;
