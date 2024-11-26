import { Box, Container, Typography } from "@mui/material";
import { HomeMap } from "../Components";

const Home = () => {
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "row",
                height: "100%",
                width: "100%",
                marginTop: "5%",
                marginBottom: "5%",
            }}
        >
            <Box sx={{ width: "60%" }}>
                <Typography variant="h4" gutterBottom>
                    Descubra as lojas mais perto de si!
                </Typography>
                <HomeMap />
            </Box>
            <Box sx={{ width: "40%" }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Conteudo extra
                </Typography>
            </Box>
        </Container>
    );
};

export default Home;
