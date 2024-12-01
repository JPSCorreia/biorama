import { observer } from "mobx-react";
import { Container, Typography } from "@mui/material";

const Settings = observer(() => {
    return (
        <Container
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
                Definições
            </Typography>
        </Container>
    );
});

export default Settings;
