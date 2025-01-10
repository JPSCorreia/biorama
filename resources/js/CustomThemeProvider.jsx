import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import { observer } from "mobx-react";

const CustomThemeProvider = observer(({ appStore, children }) => {
    const theme = createTheme({
        palette: {
            mode: appStore.themeType,
            primary: {
                main: green[700],
            },
            secondary: {
                main: green[400],
                dark: green[700],
            },
            background: {
                default: appStore.themeType === "dark" ? "#242424" : "#3838381f",
                paper: appStore.themeType === "dark" ? "#242424" : "#FFFFFF",
                secondary: appStore.themeType === "dark" ? "#121212" : "#F5F5F0",
            },
            navbar: {
                background:
                    appStore.themeType === "dark" ? "#242424" : green[700],
                text: "white",
            },
            footer: {
                background:
                    appStore.themeType === "dark" ? "#373737" : green[700],
                text: "white",
            },
            card: {
                background:
                    appStore.themeType === "dark" ? "#121212" : "#FDFDF9",
                text: "white",
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
