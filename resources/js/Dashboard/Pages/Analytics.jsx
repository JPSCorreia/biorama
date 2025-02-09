import {Paper, Typography} from "@mui/material";
import DashboardGraphsPage from "@/Pages/DashbaordGraphsPage.jsx";

const Analytics = () => {
    return (
        <Paper elevation={4}
                       sx={{
                           p: 2,
                           width: "80%",
                           m: "auto",
                           display: "flex",
                           flexDirection: "column",
                           gap: 2,
                           borderRadius: "10px",
                           overflow: "hidden",
                           backgroundColor: "rgba(255, 255, 255, 0.9)",
                           position: "relative", // Adiciona posição relativa ao Paper
                       }}>
            <Typography variant="h4">Análises</Typography>
            <DashboardGraphsPage/>
        </Paper>
    );
};

export default Analytics;
