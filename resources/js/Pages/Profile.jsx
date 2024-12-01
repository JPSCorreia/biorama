import { observer } from "mobx-react";
import { ProfileInformation } from "../Components";
import { Box, Typography } from "@mui/material";
import { usePage } from "@inertiajs/react";

const Profile = observer(() => {
    const { auth } = usePage().props;

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
            <ProfileInformation user={auth.user} />
        </Box>
    );
});

export default Profile;
