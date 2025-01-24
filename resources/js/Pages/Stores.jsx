import { observer } from "mobx-react";
import { Container, Box, Typography } from "@mui/material";

const Stores = observer(() => {
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minWidth: "99%",
                marginTop: "88px !important",
            }}
        >
            <Typography variant="h3" gutterBottom>
                Lojas
            </Typography>
        </Container>
    );
});

export default Stores;
