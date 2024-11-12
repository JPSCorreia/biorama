import { observer } from 'mobx-react';
import { Container, Box } from '@mui/material';
import { Navbar, Footer } from './Components';
import backgroundImage from '../images/background.jpg';
import 'leaflet/dist/leaflet.css';

const App = observer(({ appStore, children }) =>  {
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
                height: '100vh',
                width: '100%',
                maxWidth: '100% !important',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
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
                    height: '100%',
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
                <Footer />
            </Container>
        </Container>
    );
});

export default App;
