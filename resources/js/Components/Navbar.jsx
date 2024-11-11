import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import SpaIcon from "@mui/icons-material/Spa";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import ThemeSwitcher from "./ThemeSwitcher";
import { useMediaQuery } from "@mui/material";
import { appStore } from "../Stores/appStore";
import { cartStore } from "../Stores/cartStore";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import StoreSharpIcon from "@mui/icons-material/StoreSharp";
import ContactSupportSharpIcon from "@mui/icons-material/ContactSupportSharp";
import ShopSharpIcon from "@mui/icons-material/ShopSharp";
import ShoppingCartSharpIcon from "@mui/icons-material/ShoppingCartSharp";
import { Badge } from "@mui/material";
import { observer } from "mobx-react";
import { authStore } from "../Stores/authStore";
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
        // [theme.breakpoints.up('sm')]: {
        //   marginLeft: theme.spacing(1),
        //   width: 'auto',
        // },
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
        { id: 2, name: "Conta", link: "/conta" },
        {
            id: 3,
            name: "Terminar Sessão",
            onClick: () => authStore.logout(),
        },
    ];

    const tema = { id: 4, name: "Tema", onClick: appStore.changeThemeType };
    const login = {
        id: 5,
        name: "Login",
        // link: '/',
        onClick: () => authStore.login(),
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
            replace: true,
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
            <Container maxWidth="xl" sx={{ pr: "0.6rem !important" }}>
                <Toolbar disableGutters>
                    <SpaIcon
                        sx={{
                            mb: 0.2,
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
                            // marginLeft: 2,
                            display: { xs: "none", md: "flex" },
                            justifyContent: "center",
                        }}
                    >
                        {pages.map((page) => (
                            <Tooltip key={page.name} title={!isLg ? page.name : ""}>
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

                    <Search sx={{ marginRight: 2, marginLeft: 0.75 }}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ "aria-label": "search" }}
                        />
                    </Search>
                    {/* <Box
                        sx={{
                            display: { md: 'flex', xs: 'none' },
                            ml: 2,
                            mr: 0,
                        }}
                    >
                        <ThemeSwitcher />
                    </Box> */}
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
                        <Box sx={{ flexGrow: 0, ml: 3, mr: 1.25 }}>
                            <Tooltip title="Definições">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar
                                        alt="Remy Sharp"
                                        src={testProfileImage}
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
                                            // display: { xs: 'flex', md: 'none' },
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
                                                    <Box sx={{ mr: 2 }}>
                                                        Tema{" "}
                                                    </Box>{" "}
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
                                    login.onClick ? login.onClick() : navigate(login.link);
                                }}
                                variant="outline"
                                sx={{
                                    color: "white",
                                    display: "block",
                                    marginTop: 1.7,
                                    marginBottom: 1,
                                    height: "40px",
                                    // mx: 0.5,
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
