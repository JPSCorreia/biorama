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
import { Switch } from "@mui/material";
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
import { useState, useEffect  } from "react";
import { observer } from "mobx-react";
import { router,  } from "@inertiajs/react";
import SearchBar from "./SearchBar";

const Navbar = observer(() => {
    const isAuthenticated = authStore.isAuthenticated;

    //Controlo do togle de dashboard
    const userRoles = authStore.user?.roles || [];
    const hasRole = (roleName) => {
        return userRoles.some((role) => role.name === roleName); // Verifica se existe uma role com o nome fornecido
    };
    const[vendorMode, setVendorMode] = useState(false); //controla o estado  do toggle

    const handleToggleChange = (event) => {
        console.log("Switch clicado:", event.target.checked)
        setVendorMode(event.target.checked);
    };//Actualiza o estado ao alterar o Toggle
    useEffect(() => {
        setVendorMode(false); // Redefine para `false` quando o utilizador muda
    }, [authStore.user]);



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

    /*const Search = styled("div")(({ theme }) => ({
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 5,
        width: true ? "750px" : "425px",
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
    }));*/

    /*const StyledInputBase = styled(InputBase)(({ theme }) => ({
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
    }));*/

    /*const [query, setQuery] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Evita refresh da página
        router.get("/pesquisa", { query });
    };*/



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

    const vendorPages =[
        {id: 1, name: "My inFo",
            onClick: () => {
                router.get("#");
            }, },
        {id: 2, name: "Minhas lojas",
            onClick: () => {
                router.get("#");
            }, },
        {id: 3, name: "Meus Produtos",
            onClick: () => {
                router.get("#");
            }, },
    ];

    const settings = [
        { id: 1, name: "Perfil",
            onClick: () => {
                router.get(
                    "/perfil");
            },  },
        { id: 2, name: "Definições", link: "/definições"},
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

                    {vendorMode ? ( //Verifica se o user mode esta activo, se sim mostra o menu VendorMode se não mostra navbar normal.
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
                                BIO.DASHBOARD
                            </Typography>
                        </Box>
                    ) : (
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
                    )}
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
                            {vendorMode ? (
                                vendorPages.map((vendorPages) =>(
                                    <MenuItem
                                        Key={vendorPages.name}
                                        onClick={() => {
                                            handleCloseNavMenu();
                                            navigate(vendorPages.link);
                                        }}
                                    sx={{ height: "40px", pr: 2 }}
                                    >
                                        <Typography textAlign="center">
                                            {vendorPages.name}
                                        </Typography>
                                    </MenuItem>
                                ))
                            ) : (
                                pages.map((page) => (
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
                                    ))
                            )}

                        </Menu>
                    </Box>
                    {vendorMode ? (
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                                justifyContent: "center",
                            }}
                        >
                            {vendorPages.map((vendorPages) =>(
                                <Tooltip
                                    key={vendorPages.name}
                                    title={!isLg ? vendorPages.name : ""}
                                >
                                    <Button
                                        key={vendorPages.name}
                                        onClick={() => {
                                            handleCloseNavMenu();
                                            navigate(vendorPages.link);
                                        }}
                                        variant="outlined"
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
                                        {isLg ? vendorPages.name : vendorPages.icon}
                                    </Button>
                                </Tooltip>
                            ))}
                        </Box>
                    ) : (
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
                    )}

                    <Box sx={{ marginLeft: "auto", width: "300px" }}>
                        {vendorMode ? (
                            null
                        ) : (
                            <SearchBar />
                        )}
                    </Box>
                    <Tooltip title={cart.name}>
                        {vendorMode ? (
                            null
                        ) : (
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
                        )}
                    </Tooltip>
                    {isAuthenticated ? (
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
                                <MenuItem>
                                    {hasRole("vendor") && ( // Verifica se o user Tem a Role Vender, e se sim, mostra o toggle para entrar em vendorMode
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Typography>Modo Dashboard</Typography>
                                            <Switch
                                                color="secondary"
                                                checked={vendorMode}
                                                onChange={handleToggleChange}
                                            />
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
