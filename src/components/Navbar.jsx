import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SpaIcon from '@mui/icons-material/Spa';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import ThemeSwitcher from './ThemeSwitcher';
import { useMediaQuery } from '@mui/material';
import { appStore } from '../stores/appStore';
import { useTheme } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import HomeSharpIcon from '@mui/icons-material/HomeSharp';
import StoreSharpIcon from '@mui/icons-material/StoreSharp';
import ContactSupportSharpIcon from '@mui/icons-material/ContactSupportSharp';
import ShopSharpIcon from '@mui/icons-material/ShopSharp';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import { Badge } from '@mui/material';

function Navbar() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    //TODO: mudar mais tarde, provisorio enquanto não temos o estado do login e cart items
    const [loggedIn, setLoggedIn] = useState(false);
    const [cartItems, setCartItems] = useState(3);

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

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 5,
        width: loggedIn ? '425px' : '425px',
        [theme.breakpoints.down('lg')]: {
            width: '100%',
        },
        // [theme.breakpoints.up('sm')]: {
        //   marginLeft: theme.spacing(1),
        //   width: 'auto',
        // },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        width: '100%',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
    }));

    const pages = [
        {
            name: 'Home',
            link: '/',
            icon: (
                <HomeSharpIcon
                    sx={{
                        mb: 0.25,
                    }}
                />
            ),
        },
        {
            name: 'Produtos',
            link: '/produtos',
            icon: (
                <ShopSharpIcon
                    sx={{
                        mb: 0.25,
                    }}
                />
            ),
        },
        {
            name: 'Lojas',
            link: '/lojas',
            icon: (
                <StoreSharpIcon
                    sx={{
                        mb: 0.25,
                    }}
                />
            ),
        },
        {
            name: 'Contactos',
            link: '/contactos',
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
        { id: 1, name: 'Perfil', link: '/perfil' },
        { id: 2, name: 'Conta', link: '/conta' },
        {
            id: 3,
            name: 'Terminar Sessão',
            onClick: () => setLoggedIn(false),
        },
    ];

    const tema = { id: 4, name: 'Tema', onClick: appStore.changeThemeType };
    const login = {
        id: 5,
        name: 'Login',
        link: '/login',
        onClick: () => setLoggedIn(true),
    };

    const cart = {
        name: 'Carrinho de Compras',
        link: '/cart',
        icon: (
            <ShoppingCartSharpIcon
                sx={{
                    mb: 0.25,
                }}
            />
        ),
    };

    // larger than lg (900px?)
    const isLg = useMediaQuery(theme.breakpoints.up('lg'));

    return (
        <AppBar
            position="static"
            sx={{
                borderBottom: `1px solid ${theme.palette.primary.main}`,
            }}
        >
            <Container maxWidth="xl" sx={{ pr: '0.6rem !important' }}>
                <Toolbar disableGutters>
                    <SpaIcon
                        sx={{
                            mb: 0.2,
                            mr: 1,
                            color:
                                theme.palette.mode === 'dark'
                                    ? theme.palette.primary.main
                                    : 'white',
                        }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 1,
                            display: { xs: 'none', md: 'none', lg: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        BIORAMA
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
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
                                ml: 2,
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <NavLink
                                    key={page.name}
                                    to={page.link}
                                    style={{
                                        textDecoration: 'none',
                                        color: 'inherit',
                                    }}
                                >
                                    <MenuItem
                                        key={page.name}
                                        onClick={handleCloseNavMenu}
                                        sx={{ height: '40px', pr: 2 }}
                                    >
                                        <Typography textAlign="center">
                                            {page.name}
                                        </Typography>
                                    </MenuItem>
                                </NavLink>
                            ))}
                        </Menu>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            marginLeft: 2,
                            display: { xs: 'none', md: 'flex' },
                        }}
                    >
                        {pages.map((page) => (
                            <NavLink
                                key={page.name}
                                to={page.link}
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                            >
                                <Tooltip title={!isLg ? page.name : ''}>
                                    <Button
                                        key={page.name}
                                        onClick={handleCloseNavMenu}
                                        variant="outline"
                                        sx={{
                                            color: 'white',
                                            display: 'block',
                                            marginTop: 1.7,
                                            marginBottom: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '40px',
                                        }}
                                    >
                                        {isLg ? page.name : page.icon}
                                    </Button>
                                </Tooltip>
                            </NavLink>
                        ))}
                    </Box>

                    <Search sx={{ marginRight: 2.5, marginLeft: 2.5 }}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
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
                    <NavLink
                        key={cart.name}
                        to={cart.link}
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        <Tooltip title={cart.name}>
                            <Button
                                key={cart.name}
                                onClick={handleCloseNavMenu}
                                variant="outline"
                                sx={{
                                    color: 'white',
                                    display: 'block',
                                    marginTop: 1.7,
                                    marginBottom: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '40px',
                                    minWidth: '45px',
                                }}
                            >
                                <Badge  badgeContent={cartItems} color="success">
                                <ShoppingCartSharpIcon />
                                </Badge>
                                
                            </Button>
                        </Tooltip>
                    </NavLink>
                    {loggedIn ? (
                        <Box sx={{ flexGrow: 0, ml: 3, mr: 1.25 }}>
                            <Tooltip title="Definições">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar
                                        alt="Remy Sharp"
                                        src="/src/assets/images/2.jpg"
                                    />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <NavLink
                                    key={`menu-appbar-${tema.id}`}
                                    to={tema.link}
                                    style={{
                                        textDecoration: 'none',
                                        color: 'inherit',
                                    }}
                                >
                                    <MenuItem
                                        key={1}
                                        onClick={() => {
                                            handleCloseUserMenu();
                                            tema.onClick();
                                        }}
                                        sx={{
                                            height: '40px',
                                            // display: { xs: 'flex', md: 'none' },
                                            zIndex: 9999,
                                        }}
                                    >
                                        <Box textAlign="center">
                                            {tema.name === 'Tema' ? (
                                                <Box
                                                    sx={{
                                                        display: {
                                                            md: 'flex',
                                                            xs: 'flex',
                                                        },
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'space-between',
                                                    }}
                                                >
                                                    <Box sx={{ mr: 2 }}>
                                                        Tema{' '}
                                                    </Box>{' '}
                                                    <ThemeSwitcher />
                                                </Box>
                                            ) : (
                                                tema.name
                                            )}
                                        </Box>
                                    </MenuItem>
                                </NavLink>
                                {settings.map((setting) => (
                                    <NavLink
                                        key={`menu-appbar-${setting.id}`}
                                        to={setting.link}
                                        style={{
                                            textDecoration: 'none',
                                            color: 'inherit',
                                        }}
                                    >
                                        <MenuItem
                                            key={setting.id}
                                            onClick={() => {
                                                handleCloseUserMenu();
                                                setting.onClick
                                                    ? setting.onClick()
                                                    : '';
                                            }}
                                            sx={{ height: '40px' }}
                                        >
                                            <Box textAlign="center">
                                                {setting.name}
                                            </Box>
                                        </MenuItem>
                                    </NavLink>
                                ))}
                            </Menu>
                        </Box>
                    ) : (
                        <NavLink
                            key={login.name}
                            to={login.link}
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                            }}
                        >
                            <Button
                                key={login.name}
                                onClick={() => {
                                    handleCloseNavMenu();
                                    login.onClick ? login.onClick() : '';
                                }}
                                variant="outline"
                                sx={{
                                    color: 'white',
                                    display: 'block',
                                    marginTop: 1.7,
                                    marginBottom: 1,
                                    height: '40px',
                                    // mx: 0.5,
                                }}
                            >
                                {login.name}
                            </Button>
                        </NavLink>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Navbar;
