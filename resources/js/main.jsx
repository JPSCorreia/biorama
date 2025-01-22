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

// update authStore on every navigation
router.on("navigate", (event) => {
    const auth = event.detail.page.props.auth;
    authStore.updateAuth(auth);
});

// Configure Inertia App
createInertiaApp({
    resolve: (name) => {
        // Import normal app pages
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });

        // Import dashboard pages
        const dashboardPages = import.meta.glob("./Dashboard/Pages/**/*.jsx", {
            eager: true,
        });

        // Verify if it's a dashboard url
        if (name.startsWith("Dashboard/")) {
            // Get dashboard page
            const page =
                dashboardPages[
                    `./Dashboard/Pages/${name.replace("Dashboard/", "")}.jsx`
                ];

            // Throw error if page not found
            if (!page) {
                throw new Error(`Página ${name} não encontrada no Dashboard.`);
            }

            // Set dashboard layout
            const Component = page.default || page;
            Component.layout = (page) => <Dashboard>{page}</Dashboard>;
            return Component;
        }

        // Get normal app page
        const page = pages[`./Pages/${name}.jsx`];

        // Throw error if page not found
        if (!page) {
            throw new Error(`Página ${name} não encontrada.`);
        }

        // Set normal app layout
        const Component = page.default || page;
        Component.layout = (page) => <App>{page}</App>;
        return Component;
    },
    // Setup Inertia Application
    setup({ el, App: InertiaApp, props }) {
        // Update authStore with initial props
        authStore.updateAuth(props.initialPage.props.auth);

        // Render Application
        createRoot(el).render(
            <>
                {/* Mobx Provider */}
                <Provider appStore={appStore} authStore={authStore}>
                    {/* MUI Provider */}
                    <StyledEngineProvider injectFirst>
                        {/* MUI Custom Theme Provider */}
                        <CustomThemeProvider appStore={appStore}>
                            {/* App wrapped in Inertia Application */}
                            <InertiaApp {...props} />
                        </CustomThemeProvider>
                    </StyledEngineProvider>
                </Provider>
            </>,
        );
    },
});
