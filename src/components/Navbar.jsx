import * as React from 'react';
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
import { appStore } from '../stores/appStore';
import { useTheme } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';

const pages = [
    { name: 'Home', link: '/' },
    { name: 'Produtos', link: '/produtos' },
    { name: 'Lojas', link: '/lojas' },
    { name: 'Vendedores', link: '/vendedores' },
    { name: 'Contactos', link: '/contactos' },
];

const settings = [
    { id: 1, name: 'Perfil', link: '/perfil' },
    { id: 2, name: 'Conta', link: '/conta' },
    {
        id: 3,
        name: 'Terminar Sessão',
        onClick: () => console.log('Logging out...'),
    },
];
const tema = { id: 4, name: 'Tema', onClick: appStore.changeThemeType };
const login = { id: 5, name: 'Login', link: '/login' };

function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    //TODO: mudar mais tarde, provisorio enquanto não temos o estado do login
    const [loggedIn, setLoggedIn] = React.useState(false);

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
        width: loggedIn? '25%': '23%',
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

    console.log(theme);
    return (
        <AppBar
            position="static"
            sx={{
                p: 0,
                m: 0,
                borderBottom: `1px solid ${theme.palette.primary.main}`,
            }}
        >
            <Container maxWidth="xl">
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
                            mr: 2,
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
                                <Button
                                    key={page.name}
                                    onClick={handleCloseNavMenu}
                                    variant="outline"
                                    sx={{
                                        color: 'white',
                                        display: 'block',
                                        marginTop: 1.8,
                                        marginBottom: 1,
                                        // mx: 0.5,
                                    }}
                                >
                                    {page.name}
                                </Button>
                            </NavLink>
                        ))}
                    </Box>

                    <Search sx={{ marginRight: 2, marginLeft: 2 }}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Box
                        sx={{
                            display: { md: 'flex', xs: 'none' },
                            ml: 2,
                            mr: 0,
                        }}
                    >
                        <ThemeSwitcher />
                    </Box>

                    {loggedIn ? (
                        <Box sx={{ flexGrow: 0, ml: 1}}>
                            <Tooltip title="Open settings">
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
                                            display: { xs: 'flex', md: 'none' },
                                            zIndex: 9999,
                                        }}
                                    >
                                        <Box textAlign="center">
                                            {tema.name === 'Tema' ? (
                                                <Box
                                                    sx={{
                                                        display: {
                                                            md: 'none',
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
                            onClick={handleCloseNavMenu}
                            variant="outline"
                            sx={{
                                color: 'white',
                                display: 'block',
                                marginTop: 1.8,
                                marginBottom: 1,
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
