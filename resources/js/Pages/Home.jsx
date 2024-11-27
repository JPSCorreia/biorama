import { Box, Container, Typography } from "@mui/material";
import { HomeMap } from "../Components";

const Home = () => {
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                marginTop: "5%",
                marginBottom: "5%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >
                <Box sx={{ bgcolor: "primary.main" }}>
                    <Typography variant="h4" gutterBottom textAlign="center">
                        Conteudo extra
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Descubra as lojas mais perto de si!
                    </Typography>
                    <HomeMap />
                </Box>
                <Box  sx={{ bgcolor: "primary.main" }}>
                    <Typography variant="h4" gutterBottom textAlign="center">
                        Conteudo extra
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ bgcolor: "primary.main", mt: 4 }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Conteudo extra
                </Typography>
            </Box>
        </Container>
    );
};

export default Home;
