import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { StyledEngineProvider } from '@mui/material/styles';
import { Provider } from 'mobx-react';
import { appStore, authStore } from './Stores';
import CustomThemeProvider from './CustomThemeProvider';
import App from './App';
import { router } from '@inertiajs/react';

// Adicionar um listener para atualizar o authStore em cada navegação
router.on('navigate', (event) => {
    const auth = event.detail.page.props.auth;
    if (auth) {
        authStore.setAuth(!!auth.user);
        authStore.setUser(auth.user);
    }
});

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        return pages[`./Pages/${name}.jsx`]
    },
    setup({ el, App: InertiaApp, props }) {
        // Initiate auth state
        const auth = props.initialPage.props.auth;
        if (auth) {
            authStore.setAuth(!!auth.user); // confirm boolean
            authStore.setUser(auth.user);
        }

        createRoot(el).render(
            <Provider appStore={appStore}>
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
