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
    InputBase,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Spa as SpaIcon,
    Search as SearchIcon,
    HomeSharp as HomeSharpIcon,
    StoreSharp as StoreSharpIcon,
    ContactSupportSharp as ContactSupportSharpIcon,
    ShopSharp as ShopSharpIcon,
    ShoppingCartSharp as ShoppingCartSharpIcon,
} from "@mui/icons-material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { ThemeSwitcher } from "./";
import { appStore, cartStore, authStore } from "../Stores";
import { useState } from "react";
import { observer } from "mobx-react";
import { router } from "@inertiajs/react";
import testProfileImage from "../../images/2.jpg";

const Navbar = observer(() => {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

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
    const theme = useTheme();

    const Search = styled("div")(({ theme }) => ({
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 5,
        width: authStore.authenticated ? "425px" : "425px",
        [theme.breakpoints.down("lg")]: {
            width: "100%",
        },
    }));

    const SearchIconWrapper = styled("div")(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: "inherit",
        width: "100%",
        "& .MuiInputBase-input": {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create("width"),
            [theme.breakpoints.up("sm")]: {
                width: "12ch",
                "&:focus": {
                    width: "20ch",
                },
            },
        },
    }));

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

    const settings = [
        { id: 1, name: "Perfil", link: "/perfil" },
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
                            authStore.setAuth(false);
                            authStore.setUser(null);
                            handleCloseUserMenu();
                        },
                    }
                );
            },
        },
    ];

    const tema = { id: 4, name: "Tema", onClick: appStore.changeThemeType };
    const login = {
        id: 5,
        name: "Entrar",
        link: "/entrar",
    };

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

    // larger than lg (900px?)
    const isLg = useMediaQuery(theme.breakpoints.up("lg"));

    const navigate = (path) => {
        router.visit(path, {
            preserveState: true,
            preserveScroll: true,
            // replace: true,
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
                sx={{ pr: "0.5rem !important", pl: "1.25rem !important" }}
            >
                <Toolbar disableGutters>
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
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                            justifyContent: "center",
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

                    <Search sx={{ marginRight: 1.75, marginLeft: 0.75 }}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ "aria-label": "search" }}
                        />
                    </Search>
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
                                minWidth: "45px",
                                paddingRight: "10px",
                                paddingLeft: "10px",
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
                    {authStore.authenticated ? (
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
                                        alt="Profile avatar"
                                        src={testProfileImage}
                                        sx={{ width: 36, height: 36 }}
                                    />
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
                                        tema.onClick();
                                    }}
                                    sx={{
                                        height: "40px",
                                        zIndex: 9999,
                                    }}
                                >
                                    <Box textAlign="center">
                                        {tema.name === "Tema" ? (
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
                                            tema.name
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
                                // height: "40px",
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
