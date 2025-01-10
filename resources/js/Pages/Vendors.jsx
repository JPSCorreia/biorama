import { observer } from "mobx-react";
import { Container, Typography } from "@mui/material";

import { usePage } from "@inertiajs/react";

const Vendors = observer(() => {
    const { auth = {} } = usePage().props;
    console.log("Auth:", auth);
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
                Vendedores
            </Typography>

        </Container>
    );
});

export default Vendors;
