import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { StyledEngineProvider } from "@mui/material/styles";
import { Provider } from "mobx-react";
import { appStore, authStore } from "./Stores";
import CustomThemeProvider from "./CustomThemeProvider";
import { router } from "@inertiajs/react";
import App from "./App";

// Supress console.log in production
if (process.env.APP_ENV === "production") {
    console.log = () => {};
}

// Atualiza o authStore quando houver navegação
router.on("navigate", (event) => {
    const auth = event.detail.page.props.auth;
    authStore.updateAuth(auth);
});

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });

        // Caso especial para DashBoard (fora do layout padrão)
        if (name === "DashBoard") {
            return import("./Standalone/DashBoard.jsx").then(
                (module) => {
                    const Component = module.default || module;
                    Component.layout = null; // Sem layout para esta página
                    return Component;
                }
            );
        }

        // Resolve as páginas normais
        const page = pages[`./Pages/${name}.jsx`];
        if (!page) {
            throw new Error(`Página ${name} não encontrada.`);
        }

        // Envolve as páginas normais com o layout principal (App.jsx)
        const Component = page.default || page;
        Component.layout = (page) => <App>{page}</App>;
        return Component;
    },
    setup({ el, App: InertiaApp, props }) {
        authStore.updateAuth(props.initialPage.props.auth);

        createRoot(el).render(
            <Provider appStore={appStore} authStore={authStore}>
                <StyledEngineProvider injectFirst>
                    <CustomThemeProvider appStore={appStore}>
                        <InertiaApp {...props} />
                    </CustomThemeProvider>
                </StyledEngineProvider>
            </Provider>
        );
    },
});
