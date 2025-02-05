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
import { useSidebar } from "../../Context/SidebarContext.jsx";

const SideBar = () => {
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
                authStore.updateAuth({ user: null });
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
                width: isSmallScreen ? "100vw" : "260px", // Largura responsiva
                height: isSmallScreen ? "auto" : "auto", // Altura total em telas grandes
                bgcolor: "#f5f5f5",
                boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: isSmallScreen ? 1 : 2, // Padding menor em telas pequenas
                borderRadius: isSmallScreen ? 0 : "10px",
                overflowY: "none", // Permite rolagem se necessário
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, ml: 2 }}>
                Olá, {authStore.user.first_name}
            </Typography>

            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ width: "100%", m:"10% 0%" }}>
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
                                color: activeItem === item.text ? "white" :  "#000", // Cor do texto baseada na seleção
                                borderRadius: "5px",

                                "&:hover": {
                                    bgcolor: activeItem === item.text ? "success.dark" : "primary.light", // Hover verde mais escuro para item selecionado
                                    color: "white", // Mantém o texto branco no hover
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: activeItem === item.text ? "white" : item.color, // Cor do ícone baseada na seleção
                                    minWidth: 0, // Remove largura padrão para ajustar espaçamento
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                            <ArrowForwardIosIcon
                                sx={{
                                    color: activeItem === item.text ? "white" : "#000", // Ícone de seta baseado na seleção
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

        </Box>
    );
};

export default SideBar;
