import PropTypes from "prop-types";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useTheme } from "@mui/material/styles";
import { authStore } from "@/Stores/index.js";
import { ThemeSwitcher } from "../Components";
import {router, usePage} from "@inertiajs/react";
import { Box, Typography, Button } from "@mui/material";
import { useState, useMemo } from "react";
import {
    Person as PersonIcon,
    Spa as SpaIcon,
    Store as StoreIcon,
    ShoppingBasket as ShoppingBasketIcon,
    Assessment as AssessmentIcon,
    Logout as LogoutIcon,
} from "@mui/icons-material";
import background from "../../images/background.jpg";
import {shopStore} from "@/Stores/index.js";

const updateNavigationWithStores = (navigation, stores) => {
    if (!stores) {
        return navigation;
    }

    return navigation.map(item => {
        if (item.segment === "dashboard" && item.children) {
            // Atualiza os children mantendo o existente ("Todas Lojas") e adiciona as novas lojas
            return {
                ...item,
                children: [
                    ...item.children, // Mantém o "Todas Lojas"
                    ...stores.map(store => ({
                        segment: `store/${store.id}`,
                        title: store.name,
                        icon: <StoreIcon />,
                    })),
                ],
            };
        }
        return item;
    });
};

// Navigation items
const navigation = [
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
        segment: "dashboard",
        title: "Lojas",
        icon: <StoreIcon />,
        children:[{
            segment: "stores",
            title: "Todas Lojas",
            icon: <StoreIcon />,
        }],
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
        title: "Dashboard",
        icon: <AssessmentIcon />,
    },
];

const Dashboard = ({ children }) => {

    const theme = useTheme();
    shopStore.setStoresData(usePage().props.stores);
    const stores = shopStore.stores;
    const updatedNavigation = updateNavigationWithStores(navigation, stores);

    // User information
    const [session, setSession] = useState({
        user: {
            name: authStore.user.first_name,
            email: authStore.user.email,
            image: authStore.user.photo,
        },
    });

    // Exit Dashboard Button
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
                    onClick={() => router.get("/")}
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


    // Authentication settings for AppProvider
    const authentication = useMemo(() => {
        return {
            signIn: () => {
                setSession({
                    user: {
                        name: "Bharat Kashyap",
                        email: "bharatkashyap@outlook.com",
                    },
                });
            },
            signOut: () => {},
        };
    }, []);

    return (
        <AppProvider
            navigation={updatedNavigation}
            session={session}
            authentication={authentication}
            router={{
                navigate: (path) => router.get(path),
                pathname: window.location.pathname,
                searchParams: new URLSearchParams(window.location.search),
            }}
            theme={theme}
            branding={{
                title: "BIORAMA",
                logo:
                    <SpaIcon
                        sx={{
                            mt: 0.65,
                            mr: 0.25,
                            fontSize: 28,
                            color: theme.palette.primary.main,
                        }}
                    />
                ,
            }}
        >
            <DashboardLayout
                slots={{
                    sidebarFooter: ExitButton,
                    toolbarActions: ThemeSwitcher,
                }}
            >
                <Box sx={{ flexGrow: 1, margin: 0, paddingTop: "10%", "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${background})`, // Caminho da imagem
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: 0.7, // Apenas a imagem fica transparente
                        zIndex: -1, // Mantém o fundo atrás do conteúdo
                    },
                }}>
                    {children}
                </Box>
            </DashboardLayout>
        </AppProvider>
    );
};

// Typechecking props for the Dashboard
Dashboard.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Dashboard;
