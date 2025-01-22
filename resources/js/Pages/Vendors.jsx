import { observer } from "mobx-react";
import { Container, Typography } from "@mui/material";
import { usePage } from "@inertiajs/react";

const Vendors = observer(() => {

    // Get authentication from Inertia page props
    const { auth = {} } = usePage().props;

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                marginTop: "88px !important",
            }}
        >
            <Typography variant="h3" gutterBottom>
                Vendedores
            </Typography>

        </Container>
    );
});

export default Vendors;
