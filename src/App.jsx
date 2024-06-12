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

const App = observer(() => {


  return (
    <Container sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        <Navbar />
        {/* <UsersContainer /> */}
          <Routes>
            <Route path="/" element={<UsersContainer />} />
            <Route path="/produtos" element={<ProductsContainer />} />
            <Route path="/lojas" element={<StoresContainer />} />
            <Route path="/vendedores" element={<VendorsContainer />} />
            <Route path="/contactos" element={<ContactsContainer />} />
            <Route path="/perfil" element={<ProfileContainer />} />
            <Route path="/conta" element={<AccountContainer />} />
          </Routes>
    </Container>
  );
});

export default App;

