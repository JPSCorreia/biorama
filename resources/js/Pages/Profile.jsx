import { observer } from "mobx-react";
import { ProfileInformation } from "../Components";
import {Alert, Box} from "@mui/material";
import { usePage } from "@inertiajs/react";
import {authStore} from "@/Stores/index.js";

const Profile = observer(() => {
    const { auth, flash = {} } = usePage().props;
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
            <ProfileInformation/>
        </Box>
    );
});

export default Profile;
