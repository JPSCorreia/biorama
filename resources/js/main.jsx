import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { StyledEngineProvider } from "@mui/material/styles";
import { Provider } from "mobx-react";
import { appStore, authStore } from "./Stores";
import CustomThemeProvider from "./CustomThemeProvider";
import App from "./App";
import Dashboard from "./Dashboard/Dashboard";
import { router } from "@inertiajs/react";

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
    resolve: name => {
      const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
      const dashboardPages = import.meta.glob('./Dashboard/Pages/**/*.jsx', { eager: true });

      console.log("name", name)
      console.log("dashboardPages", dashboardPages)
      // Verifica se o nome começa com "Dashboard/"
      if (name.startsWith('Dashboard/')) {
        const page = dashboardPages[`./Dashboard/Pages/${name.replace('Dashboard/', '')}.jsx`];
        console.log("page",page)
        if (!page) {
          throw new Error(`Página ${name} não encontrada no Dashboard.`);
        }
        const Component = page.default || page;
        Component.layout = page => <Dashboard>{page}</Dashboard>; // Usa o Dashboard.jsx como layout
        return Component;
      }

      // Pega as páginas normais
      const page = pages[`./Pages/${name}.jsx`];
      if (!page) {
        throw new Error(`Página ${name} não encontrada.`);
      }

      const Component = page.default || page;
      Component.layout = page => <App>{page}</App>; // Usa o App.jsx como layout
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
