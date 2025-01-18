import * as React from "react";
import PropTypes from "prop-types";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { useTheme } from "@mui/material/styles";
import { authStore } from "@/Stores/index.js";
import { ThemeSwitcher } from "../Components";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";
import { router } from "@inertiajs/react";
import { Box, Typography, Button } from "@mui/material";
import { usePage } from "@inertiajs/react";

const NAVIGATION = [
    {
        kind: "header",
        title: "DASHBOARD",
    },
    {
        segment: "dashboard",
        title: "Minha Informação",
        icon: <PersonIcon />,
    },
    {
        kind: "divider",
    },
    {
        segment: "dashboard/lojas",
        title: "Lojas",
        icon: <StoreIcon />,
    },
    {
        kind: "divider",
    },
    {
        segment: "dashboard/encomendas",
        title: "Encomendas",
        icon: <ShoppingBasketIcon />,
    },
    {
        kind: "divider",
    },
    {
        segment: "dashboard/analises",
        title: "Análises",
        icon: <AssessmentIcon />,
    },
];

const ExitDashboard = () => {
    router.get("/");
};

const Dashboard = ({ children }) => {
    console.log("Children in Dashboard:", children);

    const user = authStore.user;

    const theme = useTheme();

    const [session, setSession] = React.useState({
        user: {
            name: user.first_name,
            email: user.email,
            image: user.photo,
        },
    });

    function ExitButton({ mini }) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 5,
                }}
            >
                <Button
                    onClick={ExitDashboard}
                    component="label"
                    variant="outlined"
                    sx={{
                        width: "50%",
                        borderRadius: "5px",
                    }}
                >
                    <Typography sx={{ display: "flex", alignItems: "center" }}>
                        <LogoutIcon sx={{ marginRight: 1 }} />
                        {mini ? "Sair" : "Sair"}
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
                        name: "Bharat Kashyap",
                        email: "bharatkashyap@outlook.com",
                        image: "https://avatars.githubusercontent.com/u/19550456",
                    },
                });
            },
            signOut: () => {},
        };
    }, []);

    const routerDemo = useDemoRouter("/");

    return (
        <AppProvider
            navigation={NAVIGATION}
            session={session}
            authentication={authentication}
            router={{
                navigate: (path) => router.get(path), // Usa o router do Inertia para navegação
            }}
            // router={routerDemo}
            theme={theme}
            branding={{
                title: "BIORAMA",
                logo: (
                    <img
                        src="https://github.com/JPSCorreia/biorama/blob/main/resources/images/icon_auth0.png?raw=true"
                        alt="Biorama"
                    />
                ),
            }}
        >
            <DashboardLayout
                slots={{
                    sidebarFooter: ExitButton,
                    toolbarActions: ThemeSwitcher,
                }}
            >
                <Box sx={{ p: 3, flexGrow: 1 }}>{children}</Box>
            </DashboardLayout>
        </AppProvider>
    );
};

Dashboard.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Dashboard;
