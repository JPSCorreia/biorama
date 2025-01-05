import { observer } from "mobx-react";
import { Box, Typography } from "@mui/material";

const Contacts = observer(() => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                marginTop: "88px !important",
                marginBottom: "5%",
            }}
        >
            <Typography variant="h3" gutterBottom>
                Contactos
            </Typography>
        </Box>
    );
});

export default Contacts;
