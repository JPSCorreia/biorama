import { observer } from "mobx-react";
import { Box, Typography } from "@mui/material";

const Stores = observer(() => {
    return (
        <Box
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
                Lojas
            </Typography>
        </Box>
    );
});

export default Stores;
