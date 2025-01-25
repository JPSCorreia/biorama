import { observer } from "mobx-react";
import { ProfileInformation } from "../Components";
import { Box } from "@mui/material";
import {ProfileLayout} from "./";
import App from "../App.jsx";
import {SidebarProvider} from "@/Context/SidebarContext.jsx";

const Profile = observer(() => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                marginTop: "88px !important",
            }}
        >
            {/* Profile Information card*/}
            <ProfileInformation />
        </Box>
    );
});

// Aninhar os dois layouts
Profile.layout = (page) => (
    <App>
        <SidebarProvider> {/* Contexto aplicado */}
            <ProfileLayout>{page}</ProfileLayout>
        </SidebarProvider>
    </App>
);
export default Profile;
