import { Box } from "@mui/material";
import { SideBar } from "./Components/";
import { AlertBox } from "../Components";
import { SidebarProvider } from "../Context/SidebarContext.jsx";
import DynamicContent from "./DynamicContent.jsx";
import { useTheme, useMediaQuery } from "@mui/material";

export default function ProfileLayout() {
    const theme = useTheme();
    const smallerThanLg = useMediaQuery(theme.breakpoints.down("lg"));

    return (
        <SidebarProvider>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    marginTop: "15px !important",
                    marginBottom: "5%",
                }}
            >
                <AlertBox />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: smallerThanLg ? "column" : "row",
                        mb: 4,
                        width: "100%",
                    }}
                >
                    {/* Sidebar fixa */}
                    <SideBar />

                    {/* Conteúdo dinâmico */}
                    <DynamicContent />
                </Box>
            </Box>
        </SidebarProvider>
    );
}
