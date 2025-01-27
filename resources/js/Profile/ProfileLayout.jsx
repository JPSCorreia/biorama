import { Box } from "@mui/material";
import { SideBar } from "./Components/";
import {SidebarProvider} from "../Context/SidebarContext.jsx"
import DynamicContent from "./DynamicContent.jsx";

export default function ProfileLayout() {
    return (
        <SidebarProvider>
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "88px" }}>
                {/* Sidebar fixa */}
                <Box
                    sx={{
                        width: "25%",
                        display: "flex",
                        justifyContent: "right",
                        alignItems: "flex-start",
                        mr: 10,
                    }}
                >
                    <SideBar />
                </Box>

                {/* Conteúdo dinâmico */}
                <Box sx={{ width: "75%" }}>
                    <DynamicContent />
                </Box>
            </Box>
        </SidebarProvider>
    );
}
