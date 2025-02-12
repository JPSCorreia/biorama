import PropTypes from "prop-types";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useTheme } from "@mui/material/styles";
import { authStore } from "@/Stores/index.js";
import { ThemeSwitcher } from "../Components";
import { router, usePage } from "@inertiajs/react";
import { Box, Typography, Button } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import {
    Person as PersonIcon,
    Spa as SpaIcon,
    Store as StoreIcon,
    ShoppingBasket as ShoppingBasketIcon,
    Assessment as AssessmentIcon,
    Logout as LogoutIcon,
    ExitToApp as ExitToAppIcon

} from "@mui/icons-material";
import background from "../../images/background.jpg";
import { shopStore } from "@/Stores/index.js";
import axios from "axios";

const updateNavigationWithStores = (navigation) => {
    const [stores, setStores] = useState([]);

    // Function to fetch the stores of the authenticated vendor
    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await axios.get("/dashboard/stores/list");
                setStores(response.data.stores);
            } catch (error) {
                console.error("Erro ao carregar as lojas do vendedor:", error);
            }
        };

        fetchStores();
    }, []);

    // Atualiza a navegação somente após obter as lojas
    if (!stores || stores.length === 0) {
        return navigation;
    }

    return navigation.map((item) => {
        if (item.segment === "dashboard" && item.children) {
            return {
                ...item,
                children: [
                    ...item.children,
                    ...stores.map((store) => ({
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
        segment: "dashboard/analises",
        title: "Painel de Estatísticas",
        icon: <AssessmentIcon />,
    },
    {
        kind: "divider",
    },
    {
        segment: "dashboard",
        title: "Informação Pessoal",
        icon: <PersonIcon />,
    },
    {
        kind: "divider",
    },
    {
        segment: "dashboard",
        title: "Lojas",
        icon: <StoreIcon />,
        children: [
            {
                segment: "stores",
                title: "Todas Lojas",
                icon: <StoreIcon />,
            },
        ],
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

    // Updates the navigation only after fetching the stores
    function ExitButton({ mini }) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    "&:hover": {
                        color: theme.palette.primary.main,
                    }
                }}
            >
                <Button
                    onClick={() => router.get("/")}
                    component="label"
                    variant="text"
                    sx={{
                        minWidth: mini ? "48px" : "95%",
                        maxWidth: mini ? "48px" : "95%",
                        minHeight: "48px",
                        justifyContent: "flex-start",
                        pl: mini? 1.5 : 1,
                        color: theme.palette.dashboard.sidebarIcon,
                    }}
                >
                    <Typography sx={{ display: "flex", alignItems: "center", textTransform: "none", color: theme.palette.text.main, fontSize: 17 }}>
                        <ExitToAppIcon sx={{ marginRight: 2, color: theme.palette.dashboard.sidebarIcon }} />
                        {mini ? "" : "Sair"}
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
            signOut: () => {
                router.post(
                    "/sair",
                    {},
                    {
                        onSuccess: () => {
                            authStore.updateAuth({ user: null });
                        },
                    },
                );
            },
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
                logo: (
                    <SpaIcon
                        sx={{
                            mt: 0.65,
                            mr: 0.25,
                            fontSize: 28,
                            color: theme.palette.primary.main,
                        }}
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
                <Box
                    sx={{
                        flexGrow: 1,
                        margin: 0,
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${background})`, // Caminho da imagem
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            opacity: theme.palette.mode === "dark" ? 0.5 : 0.8, // Apenas a imagem fica transparente
                            zIndex: -1, // Mantém o fundo atrás do conteúdo
                        },
                    }}
                >
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
