import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { StyledEngineProvider } from '@mui/material/styles';
import { Provider } from 'mobx-react';
import { appStore } from './Stores';
import CustomThemeProvider from './CustomThemeProvider';
import App from './App';

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        return pages[`./Pages/${name}.jsx`]
    },
    setup({ el, App: InertiaApp, props }) {
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
