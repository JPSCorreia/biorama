import React from "react";
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { authStore } from "@/Stores";

const SideBar = () => {
    const menuItems = [
        { text: "Dados Pessoais", icon: <AccountCircleIcon />, color: "primary.main" },
        { text: "Encomendas", icon: <ShoppingCartIcon />, color: "secondary.main" },
        { text: "Moradas", icon: <HomeIcon />, color: "success.main" },
        { text: "Notificações", icon: <NotificationsIcon />, color: "warning.main" },
        { text: "Sair", icon: <LogoutIcon />, color: "warning.main" },
    ];

    return (
        <Box
            sx={{
                width: "240px", // Largura fixa da SideBar
                bgcolor: "#f5f5f5", // Fundo cinza claro
                boxShadow: "2px 0 5px rgba(0,0,0,0.1)", // Sombra para destacar
                display: "flex",
                flexDirection: "column",
                p: 2,
                borderRadius: "10px", // Borda arredondada à direita
            }}
        >
            {/* Nome do utilizador */}
            <Typography variant="h6" sx={{ mb: 2 }}>
                Olá, {authStore.user.first_name}
            </Typography>
            {/* Menu de navegação */}
            <List>
                {menuItems.map((item, index) => (
                    <Box sx={{display:"flex", flexDirection:"column", justifyContent:"space-between", mb:2}}>
                        <ListItem key={index} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {React.cloneElement(item.icon, { sx: { color: item.color } })}
                                </ListItemIcon>
                                <ListItemText primary={item.text} sx={{fontSize:20}}/>
                            </ListItemButton>
                        </ListItem>
                    </Box>
                ))}
            </List>
        </Box>
    );
};

export default SideBar;
