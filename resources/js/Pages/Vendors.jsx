import { observer } from "mobx-react";
import { Container, Typography } from "@mui/material";

const Vendors = observer(() => {
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
                Vendedores
            </Typography>
        </Container>
    );
});

export default Vendors;
