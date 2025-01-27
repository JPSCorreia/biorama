import { observer } from "mobx-react";
import { ProfileInformation } from "../Components";
import { Box } from "@mui/material";

const Home = observer(() => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",

            }}
        >
            {/* Profile Information card*/}
            <ProfileInformation />
        </Box>
    );
});

export default Home;
