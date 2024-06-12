import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css'
import { StyledEngineProvider } from '@mui/material/styles';
import { appStore } from './stores/appStore';
import CustomThemeProvider from './components/CustomThemeProvider';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
        <CustomThemeProvider appStore={appStore} />
    </StyledEngineProvider>
  </React.StrictMode>
);
