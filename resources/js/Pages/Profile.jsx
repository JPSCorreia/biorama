import { observer } from "mobx-react";
import { ProfileInformation } from "../Components";
import { Box, Typography } from "@mui/material";
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { authStore } from "../Stores";

const Profile = observer(() => {
    const { auth } = usePage().props;
    
    useEffect(() => {
        if (auth && auth.user) {
            authStore.setAuth(true);
            authStore.setUser(auth.user);
        }
    }, [auth]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                marginTop: "5%",
                marginBottom: "5%",
            }}
        >
            <Typography variant="h3" gutterBottom>Perfil</Typography>
            <ProfileInformation user={auth.user} />
        </Box>
    );
});

export default Profile;
