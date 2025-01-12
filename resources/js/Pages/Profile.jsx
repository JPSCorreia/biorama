import { observer } from "mobx-react";
import { ProfileInformation } from "../Components";
import {Alert, Box} from "@mui/material";
import { usePage } from "@inertiajs/react";
import {authStore} from "@/Stores/index.js";

const Profile = observer(() => {
    const { auth, flash = {} } = usePage().props;
    const user = authStore.user;
    console.log("User Profile Information:", user);
    console.log("Auth:", auth);
    console.log("Flash:", flash);
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                marginTop: "88px !important",
                // marginBottom: "5%",
            }}
        >
            {flash.message && (
                <Box sx={{ mb: 2 }}>
                    <Alert severity={flash.type || "success"}>{flash.message}</Alert>
                </Box>
            )}
            <ProfileInformation user={user}/>
        </Box>
    );
});

export default Profile;
