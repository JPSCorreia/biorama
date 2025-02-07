import { Paper, Typography, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ProfileOrders = () => {
    const theme = useTheme();
    const smallerThanLg = useMediaQuery(theme.breakpoints.down("lg"));
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
                ml: smallerThanLg ? 0 : 4,
                maxWidth: smallerThanLg ? "100%" : "75%",
                flexGrow: 1,
            }}
        >
            <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 2, width: "100%" }}
            >
                Encomendas
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

export default ProfileOrders;
