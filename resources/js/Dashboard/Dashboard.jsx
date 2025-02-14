import PropTypes from "prop-types";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useTheme } from "@mui/material/styles";
import { authStore } from "@/Stores/index.js";
import { ThemeSwitcher } from "../Components";
import { router, usePage } from "@inertiajs/react";
import { Box, Tooltip } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import {
    Person as PersonIcon,
    Spa as SpaIcon,
    Store as StoreIcon,
    ShoppingBasket as ShoppingBasketIcon,
    Assessment as AssessmentIcon,
    ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import background from "../../images/background.jpg";
import { shopStore } from "@/Stores";
import axios from "axios";
import { observer } from "mobx-react";
import { autorun } from "mobx";

const Dashboard = observer(({ children }) => {
    // Get theme
    const theme = useTheme();
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const fetchStores = async () => {
            await shopStore.fetchStores();
            setStores([...shopStore.stores]); // Atualiza o estado local
        };

        fetchStores();

        // Adicionar um listener para mudanças no estado do MobX
        const disposer = autorun(() => {
            setStores([...shopStore.stores]);
        });

        return () => disposer(); // Limpar listener quando o componente desmontar
    }, []);

    // Navigation items
    const navigation = [
        {
            kind: "header",
            title: "DASHBOARD",
        },
        {
            segment: "dashboard/estatisticas",
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
            segment: "dashboard/lojas",
            title: "Lojas",
            icon: <StoreIcon />,
            children: [
                {
                    segment: "",
                    title: "Todas as Lojas",
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


    const updatedNavigation = useMemo(() => {
        if (!stores || stores.length === 0) {
            return navigation;
        }

        return navigation.map((item) => {
            if (item.segment === "dashboard/lojas" && item.children) {
                return {
                    ...item,
                    children: [
                        ...item.children,
                        ...stores.map((store) => ({
                            segment: `${store.id}`,
                            title: store.name,
                            icon: <StoreIcon />,
                        })),
                    ],
                };
            }
            return item;
        });
    }, [stores]); // Recalcular sempre que `stores` mudar

    let image_link = authStore.user?.image_profile || "";

    if (!authStore.user?.image_profile?.includes("mock_images")) {
        image_link = image_link.replace("/dashboard", "");
    }

    // Garante que a URL é absoluta
    if (!authStore.user?.image_profile?.startsWith("http")) {
        image_link = `${window.location.origin}/${image_link}`;
    }

    // User information
    const session = {
        user: {
            name: authStore.user.first_name + " " + authStore.user.last_name,
            email: authStore.user.email,
            image: image_link,
        },
    };

    // Updates the navigation only after fetching the stores
    function ExitButton({ mini }) {
        return (
            <>
                <Tooltip
                    title={mini ? "Voltar á Aplicação" : ""}
                    placement="right"
                >
                    <li
                        className="MuiListItem-root MuiListItem-gutters MuiListItem-padding css-xs41a9-MuiListItem-root"
                        style={{ marginBottom: "0.75rem" }}
                    >
                        <div
                            className={
                                theme.palette.mode === "dark"
                                    ? "MuiButtonBase-root MuiListItemButton-root MuiListItemButton-gutters MuiListItemButton-root MuiListItemButton-gutters css-1yzzic3-MuiButtonBase-root-MuiListItemButton-root"
                                    : "MuiButtonBase-root MuiListItemButton-root MuiListItemButton-gutters MuiListItemButton-root MuiListItemButton-gutters css-1hg1ikb-MuiButtonBase-root-MuiListItemButton-root"
                            }
                            tabIndex="0"
                            onClick={() => router.get("/")}
                        >
                            <div
                                className={
                                    theme.palette.mode === "dark"
                                        ? "MuiListItemIcon-root css-1vq8r3o-MuiListItemIcon-root"
                                        : "MuiListItemIcon-root css-snvjoq-MuiListItemIcon-root"
                                }
                            >
                                <ExitToAppIcon
                                    sx={{
                                        color: `${theme.palette.dashboard.sidebarIcon} !important`,
                                    }}
                                />
                            </div>
                            <div className="MuiListItemText-root css-r8i4uo-MuiListItemText-root">
                                <span className="MuiTypography-root MuiTypography-body1 MuiListItemText-primary css-rizt0-MuiTypography-root">
                                    Voltar á Aplicação
                                </span>
                            </div>
                            <span className="MuiTouchRipple-root css-r3djoj-MuiTouchRipple-root"></span>
                        </div>
                    </li>
                </Tooltip>
            </>
        );
    }

    // Authentication settings for AppProvider
    const authentication = useMemo(() => {
        return {
            signIn: () => router.get("/entrar"),

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
                            backgroundImage: `url(${background})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            opacity: theme.palette.mode === "dark" ? 0.5 : 0.8,
                            zIndex: -1,
                        },
                    }}
                >
                    {children}
                </Box>
            </DashboardLayout>
        </AppProvider>
    );
});

// Typechecking props for the Dashboard
Dashboard.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Dashboard;
