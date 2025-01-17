import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import {useTheme} from "@mui/material/styles";
import {authStore} from "@/Stores/index.js";
import {Button} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import {router} from "@inertiajs/react";



const NAVIGATION = [
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
];




function DemoPageContent({ pathname }) {
    return (
        <Box
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <Typography>Dashboard content for {pathname}</Typography>
        </Box>
    );
}



const ExitDashboard = () => {
    router.get("/");
};
DemoPageContent.propTypes = {
    pathname: PropTypes.string.isRequired,
};

function Dashboard() {
    const user = authStore.user;
    const theme = useTheme();

    const [session, setSession] = React.useState({
        user: {
            name: user.first_name,
            email: user.email,
            image: user.photo,
        },
    });



    //funcão para sair do modo vendedor
    function ExitButton({ mini }) {

        return (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center', mb: 5}}>

                <Button
                    onClick={ExitDashboard}
                    component="label"
                    variant="outlined"
                    sx={{
                        width: "50%",
                        borderRadius:"5px",
                    }}
                >
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                        <LogoutIcon sx={{ marginRight: 1 }} /> {/* Ícone ao lado */}
                        {mini ? 'Sair' : 'Sair'}
                    </Typography>
                </Button>
            </Box>

        );
    }


    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                setSession({
                    user: {
                        name: 'Bharat Kashyap',
                        email: 'bharatkashyap@outlook.com',
                        image: 'https://avatars.githubusercontent.com/u/19550456',
                    },
                });
            },
            signOut: () => {

            },
        };
    }, []);

    const router = useDemoRouter('/Vendor/info');


    return (
        // preview-start
        <AppProvider
            session={session}
            authentication={authentication}
            navigation={NAVIGATION}
            router={router}
            theme={theme}
            branding={{
                    title: "DASHBOARD",
                    logo: <img src="https://github.com/JPSCorreia/biorama/blob/main/resources/images/icon_auth0.png?raw=true" alt="Biorama" />,
            }}
        >
            <DashboardLayout
                slots={{
                      sidebarFooter: ExitButton
                }}

            >
                <DemoPageContent pathname={router.pathname} />
            </DashboardLayout>
        </AppProvider>
        // preview-end
    );
}

Dashboard.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window: PropTypes.func,
};


export default Dashboard;
