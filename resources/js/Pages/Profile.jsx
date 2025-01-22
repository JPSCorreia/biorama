import { observer } from "mobx-react";
import { ProfileInformation } from "../Components";
import {Box} from "@mui/material";

const Profile = observer(() => {
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
            <ProfileInformation />
        </Box>
    );
});

export default Profile;
