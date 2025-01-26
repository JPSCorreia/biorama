import { observer } from "mobx-react";
import { Container, Box, useMediaQuery } from "@mui/material";
import { Navbar, Footer } from "./Components";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@mui/material/styles";
import { usePage } from "@inertiajs/react";

const App = observer(({ children }) => {
    // Access theme properties using Material UI's theme hook
    const theme = useTheme();

    // Get media queries
    const biggerThanSm = useMediaQuery(theme.breakpoints.up("sm"));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <>
            {

                // When user is on dashboard, render only the children
                usePage().component === "Dashboard" ? (
                    <>{children}</>
                ) : (
                    // Else render normal app layout with navbar and footer
                    <Box
                        className="App"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            minHeight: "100vh",
                            minWidth: "100%",
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
                            <Navbar />
                            <Box sx={{ width: isSmallScreen ? "90%" : "80%" }}>{children}</Box>
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
                            {/* Render footer only when screen is bigger than sm */}
                            {biggerThanSm && <Footer />}
                        </Container>
                    </Box>
                )
            }
        </>
    );
});

export default App;
