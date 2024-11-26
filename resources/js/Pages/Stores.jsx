import { observer } from "mobx-react";
import { Container, Typography } from "@mui/material";

const Stores = observer(() => {
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                marginTop: "5%",
                marginBottom: "5%",
            }}
        >
            <Typography variant="h3" gutterBottom>
                Lojas
            </Typography>
        </Container>
    );
});

export default Stores;
