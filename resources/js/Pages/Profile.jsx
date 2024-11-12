import { observer } from "mobx-react";
import { ProfileInformation } from "../Components";
import { Box, Typography } from "@mui/material";

const Profile = observer(() => {
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
            <ProfileInformation />
        </Box>
    );
});

export default Profile;
