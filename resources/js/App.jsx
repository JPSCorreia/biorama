import { observer } from "mobx-react";
import { Container, Box, useMediaQuery } from "@mui/material";
import { Navbar, Footer } from "./Components";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@mui/material/styles";
const App = observer(({ children, auth }) => {
    const theme = useTheme();
    const biggerThanSm = useMediaQuery(theme.breakpoints.up("sm"));

    return (
        <Container
            className="App"
            sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "100vh",
                minWidth: "60%",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    minHeight: "100vh",
                    zIndex: 1,
                    width: "100% !important",
                    minWidth: "100% !important",
                }}
            />
            <Container
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    padding: "0 !important",
                    zIndex: 1,
                    width: "100% !important",
                    minWidth: "100% !important",
                }}
            >
                <Navbar auth={auth} />
                {children}
            </Container>
            <Container
                sx={{
                    zIndex: 1,
                    width: "100%",
                    p: "0 !important",
                    m: "0 !important",
                    minWidth: "100% !important",
                }}
            >
                {biggerThanSm && <Footer />}
            </Container>
        </Container>
    );
});

export default App;
