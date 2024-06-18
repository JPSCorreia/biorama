import { observer } from 'mobx-react';
import { Container } from '@mui/material';
// import UsersContainer from './components/UsersContainer';
import HomeContainer from './components/HomeContainer';
import ProductsContainer from './components/ProductsContainer';
import Navbar from './components/Navbar';
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";
import { Routes, Route } from 'react-router-dom';
import StoresContainer from './components/StoresContainer';
import VendorsContainer from './components/VendorsContainer';
import ContactsContainer from './components/ContactsContainer';
import ProfileContainer from './components/ProfileContainer';
import AccountContainer from './components/AccountContainer';
import CartContainer from './components/CartContainer';
import Footer from './components/Footer';
import { Box } from '@mui/system';
import { appStore } from './stores/appStore';

const App = observer(() => {
    return (
        <Container
            className="App"
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundImage: `url(../../public/assets/images/background.jpg)`,
                backgroundSize: 'cover', // Cover the entire area
                backgroundPosition: 'center', // Center the image
                backgroundRepeat: 'no-repeat', // No repeating of the image
                height: '100vh',
                width: '100%',
                maxWidth: '100% !important',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: appStore.themeType === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)' , // Semi-transparent black
                    zIndex: 1,
                }}
            />
            <Container
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: '0 !important',
                    zIndex: 1,
                }}
            >
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomeContainer />} />
                    <Route path="/produtos" element={<ProductsContainer />} />
                    <Route path="/lojas" element={<StoresContainer />} />
                    <Route path="/vendedores" element={<VendorsContainer />} />
                    <Route path="/contactos" element={<ContactsContainer />} />
                    <Route path="/carrinho" element={<CartContainer />} />
                    <Route path="/perfil" element={<ProfileContainer />} />
                    <Route path="/conta" element={<AccountContainer />} />
                </Routes>
            </Container>
            <Container sx={{ zIndex: 1, width: '100%', p: '0 !important', m: '0 !important' }}>
            <Footer />

            </Container>
        </Container>
    );
});

export default App;
