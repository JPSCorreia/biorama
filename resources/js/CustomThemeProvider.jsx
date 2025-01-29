import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import { observer } from "mobx-react";

const CustomThemeProvider = observer(({ appStore, children }) => {
    // Create a custom theme based on the current theme type stored in the appStore
    const theme = createTheme({
        palette: {
            // Defines the color mode (dark or light) dynamically
            mode: appStore.themeType,

            // Primary color configuration
            primary: {
                main: green[700],
            },

            // Secondary color configuration
            secondary: {
                main: green[400], // Lighter green as secondary color
                dark: green[700], // Dark green for contrast
            },

            hover: {
                main: green[400],
                dark: green[500],
            },

            // Background colors for different elements based on theme mode
            background: {
                default:
                    appStore.themeType === "dark" ? "#242424" : "#ffffff", // Default page background
                paper: appStore.themeType === "dark" ? "#242424" : "#FFFFFF", // Paper elements background
                secondary:
                    appStore.themeType === "dark" ? "#121212" : "#F5F5F0", // Secondary background color
            },

            // Custom styles for the navbar
            navbar: {
                background:
                    appStore.themeType === "dark" ? "#242424" : green[700],
                text: "white",
            },

            // Custom styles for the footer
            footer: {
                background:
                    appStore.themeType === "dark" ? "#373737" : green[700],
                text: "white",
            },

            // Custom styles for the card
            card: {
                background:
                    appStore.themeType === "dark" ? "#121212" : "#FDFDF9",
                text: "white",
            },

            // Custom styles for messages
            message: {
                success: green[700],
                error: '#d32f2f',
                warning: '#ed6c02',
                info: '#0288d1',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Apply Material UI's default style baseline */}
            {children}
        </ThemeProvider>
    );
});

export default CustomThemeProvider;
