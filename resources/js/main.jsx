import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { StyledEngineProvider } from "@mui/material/styles";
import { Provider } from "mobx-react";
import { appStore, authStore } from "./Stores";
import CustomThemeProvider from "./CustomThemeProvider";
import App from "./App";
import { router } from "@inertiajs/react";

// Supress console.log in production
if (process.env.APP_ENV === "production") {
    console.log = () => {};
}


// Atualiza o authStore quando houver navegação
router.on("navigate", (event) => {
    const auth = event.detail.page.props.auth;
    // Para debugging:
    // console.log("Navigation event:", event.detail.page.url, auth);
    authStore.updateAuth(auth);
});

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App: InertiaApp, props }) {
        // Inicializa o authStore com os dados iniciais
        authStore.updateAuth(props.initialPage.props.auth);

        createRoot(el).render(
            <Provider appStore={appStore} authStore={authStore}>
                <StyledEngineProvider injectFirst>
                    <CustomThemeProvider appStore={appStore}>
                        <App appStore={appStore}>
                            <InertiaApp {...props} />
                        </App>
                    </CustomThemeProvider>
                </StyledEngineProvider>
            </Provider>
        );
    },
});
