import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { observer } from 'mobx-react';

const CustomThemeProvider = observer(({ appStore, children }) => {

    const theme = createTheme({
        palette: {
            mode: appStore.themeType,
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
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
});

export default CustomThemeProvider;
