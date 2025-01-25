import React from "react";
import { Box } from "@mui/material";
import SideBar from "../Components/SideBar"; // Certifique-se de que o caminho está correto
import { useSidebar } from "@/Context/SidebarContext"; // Para acessar o estado

const ProfileLayout = ({ children }) => {
    const { activeItem, setActiveItem } = useSidebar(); // Obtém o estado do contexto

    console.log("Item ativo:", activeItem);

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            {/* Sidebar fixa */}
            <Box sx={{ width: "240px", bgcolor: "#f5f5f5" }}>
                <SideBar />
            </Box>

            {/* Conteúdo dinâmico */}
            <Box sx={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                {children}
            </Box>
        </Box>
    );
};

export default ProfileLayout;
