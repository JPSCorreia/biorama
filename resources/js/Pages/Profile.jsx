import { observer } from "mobx-react";
import { ProfileInformation } from "../Components";
import {Alert, Box, Typography} from "@mui/material";
import { usePage } from "@inertiajs/react";

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
            <Typography variant="h3" gutterBottom>
                Perfil
            </Typography>
            {flash.message && (
                <Box sx={{ mb: 2 }}>
                    <Alert severity={flash.type || "success"}>{flash.message}</Alert>
                </Box>
            )}
            <ProfileInformation user={auth.user} />
            {/*console.log(auth.user)*/}
        </Box>
    );
});

export default Profile;
