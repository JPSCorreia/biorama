import { observer } from "mobx-react";
import { ProfileInformation } from "../../Components/index.js";
import { Box } from "@mui/material";
import { ProfileLayout } from "../../Pages/index.js";
import App from "../../App.jsx";

const Home = observer(() => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                marginTop: "88px !important",
            }}
        >
            {/* Profile Information card*/}
            <ProfileInformation />
        </Box>
    );
});

export default Home;
