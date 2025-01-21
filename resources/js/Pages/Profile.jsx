import { observer } from "mobx-react";
import { ProfileInformation } from "../Components";
import {Alert, Box} from "@mui/material";
import { usePage } from "@inertiajs/react";

const Profile = observer(() => {
    const {genders, user = {} } = usePage().props;
    console.log("Teste User Rota", user);
    console.log("Teste genders", genders);
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
