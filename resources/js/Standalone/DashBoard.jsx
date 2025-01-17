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
import {router,} from "@inertiajs/react";
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { ThemeSwitcher } from '../Components';
import { appStore } from '../Stores';
import {Profile} from "@/Pages/index.js";






function DemoPageContent({ pathname, navigate }) {
    return (

        {pathname.startsWith('/orders') ? (
                <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                    <Button
                        onClick={() => {
                            navigate('/orders/1');
                        }}
                    >
                        Order 1
                    </Button>
                    <Button
                        onClick={() => {
                            navigate('/orders/2');
                        }}
                    >
                        Order 2
                    </Button>
                    <Button
                        onClick={() => {
                            navigate('/orders/3');
                        }}
                    >
                        Order 3
                    </Button>
                </Stack>
            ) : null}
);
        <Profile/>
    );
}


DemoPageContent.propTypes = {
    navigate: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
};

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
    console.log('theme', theme);

    return (
        // preview-start
        <AppProvider
            NAVIGATION={[
                {
                    kind: 'header',
                    title:
                        'DASHBOARD'
                }
                ,
                {
                    segment: 'myinfo',
                    title:
                        'Minha Informação',
                    icon:
                        <PersonIcon/>,
                }
                ,
                {
                    kind: 'divider'
                }
                ,
                {
                    segment: 'MyStore',
                    title:
                        'Lojas',
                    icon:
                        <StoreIcon/>,
                }
                ,
                {
                    kind: 'divider'
                }
                ,
                {
                    segment: 'orders',
                    title:
                        'Encomendas',
                    icon:
                        <ShoppingBasketIcon/>,
                    pattern:
                        '/orders'
                }
                ,
                {
                    kind: 'divider'
                }
                ,
                {
                    segment: 'Analytics',
                    title:
                        'Analises',
                    icon:
                        <AssessmentIcon/>,
                }
                ,
            ]}
            session={session}
            authentication={authentication}
            router={router}
            theme={theme}
            branding={{
                    title: "BIORAMA",
                    logo: <img src="https://github.com/JPSCorreia/biorama/blob/main/resources/images/icon_auth0.png?raw=true" alt="Biorama" />,
            }}
        >

            <DashboardLayout
                slots={{
                    sidebarFooter: ExitButton,
                    toolbarActions: ThemeSwitcher,
                }}
            >
                <DemoPageContent pathname={router.pathname} navigate={router.navigate} />
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
