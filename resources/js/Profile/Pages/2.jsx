import { observer } from "mobx-react";
import { ProfileInformation } from "../../Components/index.js";
import { Box } from "@mui/material";
import {ProfileLayout} from "../../Pages/index.js";
import App from "../../App.jsx";
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
Profile.layout = (page) => <ProfileLayout>{page}</ProfileLayout>;

export default Profile;
