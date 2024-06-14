import { observer } from 'mobx-react';
import { Container } from '@mui/material';
import UsersContainer from './components/UsersContainer';
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

const App = observer(() => {
    return (
        <Container
            className="App"
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <Container
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: '0 !important',
                }}
            >
                <Navbar />
                <Routes>
                    <Route path="/" element={<UsersContainer />} />
                    <Route path="/produtos" element={<ProductsContainer />} />
                    <Route path="/lojas" element={<StoresContainer />} />
                    <Route path="/vendedores" element={<VendorsContainer />} />
                    <Route path="/contactos" element={<ContactsContainer />} />
                    <Route path="/carrinho" element={<CartContainer />} />
                    <Route path="/perfil" element={<ProfileContainer />} />
                    <Route path="/conta" element={<AccountContainer />} />
                </Routes>
            </Container>
            <Footer />
        </Container>
    );
});

export default App;
