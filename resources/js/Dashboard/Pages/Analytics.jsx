import {Box, Paper, Typography, useTheme} from "@mui/material";
import DashboardGraphsPage from "@/Pages/DashbaordGraphsPage.jsx";
import React from "react";

const Analytics = () => {
    const theme = useTheme();
    return (
        <Box paddingTop={"2%"}>
            <Box sx={{
                width: "96%",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                padding: "12px 24px",
                borderRadius: "8px",
                textAlign: "left",
                fontWeight: "bold",
                fontSize: "1.5rem",
                boxShadow: 3,
                zIndex: 2,
                m: "auto",
            }}
            >
                <Typography variant="h4" fontWeight="bold" >
                    Dashboard
                </Typography>
            </Box>
            <Box paddingTop={"2%"}></Box>
            <Box elevation={4}
                 sx={{
                     p: 2,
                     width: "95%",
                     m: "auto",
                     display: "flex",
                     flexDirection: "column",
                     gap: 2,
                     borderRadius: "10px",
                     overflow: "hidden",
                     backgroundColor: "rgba(255, 255, 255, 0.9)",
                     position: "relative", // Adiciona posição relativa ao Paper
                 }}>
                <DashboardGraphsPage/>
            </Box>
        </Box>

    );
};

export default Analytics;
