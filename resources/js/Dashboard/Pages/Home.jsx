import { Box } from "@mui/material";
import { VendorInformation } from "@/Pages/index.js";

/**
 * Component: Home Vendor info father Component
 * Description: Component to show vendor info
 */
const Home = () => {
    return (
        <Box sx={{paddingTop:"10%"}}>
            <VendorInformation />
        </Box>
    );
};

export default Home;
