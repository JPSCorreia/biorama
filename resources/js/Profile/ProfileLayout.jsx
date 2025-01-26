import React from "react";
import { Box } from "@mui/material";
import SideBar from "../Components/SideBar.jsx"; // Certifique-se de que o caminho está correto

export default function ProfileLayout({ children }){


    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            {/* Sidebar fixa */}
            <Box sx={{ width: "240px", bgcolor: "#f5f5f5" }}>
                <SideBar />
            </Box>

            {/* Conteúdo dinâmico */}
            <Box sx={{ flex: 1, padding: "20px" }}>
                {children}
            </Box>
        </Box>
    );
};
