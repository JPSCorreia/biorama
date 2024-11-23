import { observer } from 'mobx-react';
import { Container, Box, useMediaQuery } from '@mui/material';
import { Navbar, Footer } from './Components';
import backgroundImage from '../images/background.jpg';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '@mui/material/styles';

const App = observer(({ appStore, children }) =>  {
    const theme = useTheme();
    const biggerThanSm = useMediaQuery(theme.breakpoints.up("sm"));

    return (
        <Container
            className="App"
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
                width: '100%',
                maxWidth: '100% !important',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    minHeight: '100vh',
                    backgroundColor:
                        appStore.themeType === 'dark'
                            ? 'rgba(0, 0, 0, 0.6)'
                            : 'rgba(0, 0, 0, 0.3)',
                    zIndex: 1,
                }}
            />
            <Container
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: '0 !important',
                    zIndex: 1,
                }}
            >
                <Navbar />
                {children}
            </Container>
            <Container
                sx={{
                    zIndex: 1,
                    width: '100%',
                    p: '0 !important',
                    m: '0 !important',
                }}
            >
                {biggerThanSm && <Footer />}
            </Container>
        </Container>
    );
});

export default App;
