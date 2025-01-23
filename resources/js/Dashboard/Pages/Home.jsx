import {Box, Typography} from "@mui/material";
import {VendorInformation} from "@/Pages/index.js";
import {usePage} from "@inertiajs/react";

const Home = () => {
    const user = usePage().props.user;
    console.log('Home', user);
    return (
        <Box>
            <VendorInformation/>
        </Box>
    );
};

export default Home;
