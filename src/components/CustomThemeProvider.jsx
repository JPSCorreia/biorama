import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { observer } from 'mobx-react';
import App from '../App.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

const CustomThemeProvider = observer(({ appStore }) => {
    const theme = createTheme({
        palette: {
            mode: appStore.themeType, // dark or light toggle
            primary: {
                main: green[600],
            },
            background: {
                default: appStore.themeType === 'dark' ? '#242424' : '#FDFDF9',
                paper: appStore.themeType === 'dark' ? '#242424' : '#FDFDF9',
            },
            footer: {
                background: appStore.themeType === 'dark' ? '#242424' : green[600],
                text: 'white',
            },

        }
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <App appStore={appStore} />
            </Router>
        </ThemeProvider>
    );
});

export default CustomThemeProvider;
