import { Paper, Typography, Box } from "@mui/material";

const ProfileNotifications = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
            }}
        >
            <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 2, width: "100%" }}
            >
                Notificações
            </Typography>
            <Paper
                elevation={4}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    justifyContent: "start",
                    p: 3,
                    borderRadius: "8px",
                }}
            ></Paper>
        </Box>
    );
};

export default ProfileNotifications;
