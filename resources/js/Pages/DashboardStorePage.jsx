import {observer} from "mobx-react";
import {usePage} from "@inertiajs/react";
import {Paper, useMediaQuery, useTheme} from "@mui/material";
import {DashboardStoresCard} from "@/Components/index.js";

const DashboardStorePage  = observer(()=>{
    const {auth, user} = usePage().props;
    console.log("Auth", user);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    return(
        <Paper elevation={4}
               sx={{
                       p: 2,
                       width: isSmallScreen ? "100%" : "80%",
                       m: "auto",
                       display: "flex",
                       flexDirection: "column",
                       height: "100%",
                       borderRadius: "10px",
               }}>
        <DashboardStoresCard/>
        </Paper>
    )
})

export default DashboardStorePage;
