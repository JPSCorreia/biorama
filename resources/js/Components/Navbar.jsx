import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
    Badge,
    useMediaQuery,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Spa as SpaIcon,
    HomeSharp as HomeSharpIcon,
    StoreSharp as StoreSharpIcon,
    ContactSupportSharp as ContactSupportSharpIcon,
    ShopSharp as ShopSharpIcon,
    ShoppingCartSharp as ShoppingCartSharpIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { ThemeSwitcher } from "./";
import { appStore, cartStore, authStore } from "../Stores";
import { useState } from "react";
import { observer } from "mobx-react";
import { router } from "@inertiajs/react";
import { SearchBar } from "./";

const Navbar = observer(() => {
    // Get user roles
    const userRoles = authStore.user?.roles || [];

    // Check if the user has a specific role
    const hasRole = (roleName) => {
        return userRoles.some((role) => role.name === roleName);
    };

    // State management for navigation and user menus
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    // Handle opening and closing of menus
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Access theme properties using Material UI's theme hook
    const theme = useTheme();

    // Navigation pages with links and icons
    const pages = [
        {
            name: "Home",
            link: "/",
            icon: (
                <HomeSharpIcon
                    sx={{
                        mb: 0.25,
                    }}
                />
            ),
        },
        {
            name: "Produtos",
            link: "/produtos",
            icon: (
                <ShopSharpIcon
                    sx={{
                        mb: 0.25,
                    }}
                />
            ),
        },
        {
            name: "Lojas",
            link: "/lojas",
            icon: (
                <StoreSharpIcon
                    sx={{
                        mb: 0.25,
                    }}
                />
            ),
        },
        {
            name: "Contactos",
            link: "/contactos",
            icon: (
                <ContactSupportSharpIcon
                    sx={{
                        mb: 0.25,
                    }}
                />
            ),
        },
    ];

    // User account settings options
    const settings = [
        {
            id: 1,
            name: "Perfil",
            onClick: () => {
                router.get("/perfil");
            },
        },
        { id: 2, name: "Definições", link: "/definições" },
        {
            id: 3,
            name: "Terminar Sessão",
            onClick: () => {
                router.post(
                    "/sair",
                    {},
                    {
                        onSuccess: () => {
                            handleCloseUserMenu();
                            authStore.updateAuth({ user: null });
                            console.log("Logout successful");
                        },
                    },
                );
            },
        },
    ];

    // Theme change button configuration
    const themeChange = {
        id: 4,
        name: "Tema",
        onClick: appStore.changeThemeType,
    };

    // Login button configuration
    const login = {
        id: 5,
        name: "Entrar",
        link: "/entrar",
    };

    // Shopping cart button configuration
    const cart = {
        name: "Carrinho de Compras",
        link: "/carrinho",
        icon: (
            <ShoppingCartSharpIcon
                sx={{
                    mb: 0.25,
                }}
            />
        ),
    };

    // Check if the screen size is large or small
    const isLg = useMediaQuery(theme.breakpoints.up("lg"));
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    // Function to handle navigation with Inertia.js preserving state and scroll position
    const navigate = (path) => {
        router.visit(path, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppBar
            position="static"
            sx={{
                borderBottom: `1px solid ${theme.palette.primary.main}`,
                borderRadius: "0 0 5px 5px",
            }}
        >
            <Container
                maxWidth="xl"
                sx={{
                    pr: "0.5rem !important",
                    pl: isSm ? "0.3rem !important" : "1.25rem !important",
                }}
            >
                <Toolbar disableGutters>
                    {/* Logo and title */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            handleCloseNavMenu();
                            navigate("/");
                        }}
                    >
                        {isSm ? (
                            ""
                        ) : (
                            <SpaIcon
                                sx={{
                                    mb: 0,
                                    mr: 1,
                                    color:
                                        theme.palette.mode === "dark"
                                            ? theme.palette.primary.main
                                            : "white",
                                }}
                            />
                        )}
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            sx={{
                                mr: 1,
                                display: { xs: "none", md: "none", lg: "flex" },
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            BIORAMA
                        </Typography>
                    </Box>
                    {/* Mobile menu */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                            sx={{
                                ml: 0,
                                mr: 0.5,
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page.name}
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        navigate(page.link);
                                    }}
                                    sx={{ height: "40px", pr: 2 }}
                                >
                                    <Typography textAlign="center">
                                        {page.name}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    {/* Desktop navigation menu */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        {pages.map((page) => (
                            <Tooltip
                                key={page.name}
                                title={!isLg ? page.name : ""}
                            >
                                <Button
                                    key={page.name}
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        navigate(page.link);
                                    }}
                                    variant="outline"
                                    sx={{
                                        color: "white",
                                        display: "block",
                                        marginTop: 1.7,
                                        marginBottom: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "40px",
                                    }}
                                >
                                    {isLg ? page.name : page.icon}
                                </Button>
                            </Tooltip>
                        ))}
                    </Box>
                    {/* Search bar */}
                    <SearchBar />
                    {/* Shopping cart button */}
                    <Tooltip title={cart.name}>
                        <Button
                            key={cart.name}
                            onClick={() => {
                                handleCloseNavMenu();
                                navigate(cart.link);
                            }}
                            variant="outline"
                            sx={{
                                color: "white",
                                display: "block",
                                marginTop: 1.7,
                                marginBottom: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                height: "40px",
                                minWidth: "55px",
                                paddingRight: "10px",
                                paddingLeft: "10px",
                                marginLeft: "20px",
                            }}
                        >
                            <Badge
                                sx={{
                                    paddingRight: "5px",
                                    marginLeft: "5px",
                                }}
                                badgeContent={cartStore.total}
                                color="success"
                                overlap="circular"
                            >
                                <ShoppingCartSharpIcon />
                            </Badge>
                        </Button>
                    </Tooltip>
                    {/* User profile menu */}
                    {authStore.isAuthenticated ? (
                        <Box
                            sx={{
                                display: "flex",
                                flexGrow: 0,
                                minWidth: "80px",
                                paddingRight: "10px",
                                justifyContent: "end",
                                alignItems: "center",
                            }}
                        >
                            <Tooltip title="Definições">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar
                                        alt="User Avatar"
                                        // src={testProfileImage}
                                        sx={{
                                            width: 45,
                                            height: 45,
                                            bgcolor: "background.secondary",
                                            color: "primary.main",
                                            fontSize: "1.5rem",
                                        }}
                                    >
                                        {authStore.user?.first_name[0]}
                                        {authStore.user?.last_name[0]}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem
                                    key={1}
                                    onClick={() => {
                                        handleCloseUserMenu();
                                        themeChange.onClick();
                                    }}
                                    sx={{
                                        height: "40px",
                                        zIndex: 9999,
                                    }}
                                >
                                    <Box textAlign="center">
                                        {themeChange.name === "Tema" ? (
                                            <Box
                                                sx={{
                                                    display: {
                                                        md: "flex",
                                                        xs: "flex",
                                                    },
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <Box sx={{ mr: 2 }}>Tema </Box>{" "}
                                                <ThemeSwitcher />
                                            </Box>
                                        ) : (
                                            themeChange.name
                                        )}
                                    </Box>
                                </MenuItem>
                                {settings.map((setting) => (
                                    <MenuItem
                                        key={setting.id}
                                        onClick={() => {
                                            handleCloseUserMenu();
                                            if (setting.onClick) {
                                                setting.onClick();
                                            } else {
                                                navigate(setting.link);
                                            }
                                        }}
                                        sx={{ height: "40px" }}
                                    >
                                        <Box textAlign="center">
                                            {setting.name}
                                        </Box>
                                    </MenuItem>
                                ))}
                                <MenuItem>
                                    {/* Render if the user has the "vendor" role */}
                                    {hasRole("vendor") && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() =>
                                                    router.get("/dashboard")
                                                }
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                Ir para Dashboard
                                            </Button>
                                        </Box>
                                    )}
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Button
                            key={login.name}
                            onClick={() => {
                                handleCloseNavMenu();
                                navigate(login.link);
                            }}
                            variant="outline"
                            sx={{
                                color: "white",
                                display: "block",
                                marginTop: 1.7,
                                marginBottom: 1,
                                minWidth: "75px",
                                marginLeft: "5px !important",
                                paddingLeft: "0 !important",
                                paddingRight: "0 !important",
                            }}
                        >
                            {login.name}
                        </Button>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
});
export default Navbar;
