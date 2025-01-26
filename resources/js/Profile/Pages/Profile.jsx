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


Profile.layout = (page) =>  <App><ProfileLayout>{page}</ProfileLayout></App>;
export default Profile;
// Aninhar os dois layouts
