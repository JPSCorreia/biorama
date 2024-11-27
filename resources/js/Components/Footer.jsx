import { Box, Container, Typography, IconButton, Paper } from "@mui/material";
import {
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
    LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const Footer = () => {
    const theme = useTheme();

    return (
        <Container
            sx={{
                bgcolor: "footer.background",
                maxWidth: "1200px",
                width: "100%",
                pt: 0.25,
                borderTop: `1px solid ${theme.palette.primary.main}`,
                borderRadius: "5px 5px 0 0",
            }}
        >
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="body2"
                        color="footer.text"
                        sx={{ mt: 0.2, display: { xs: "none", sm: "block" } }}
                    >
                        &copy; {new Date().getFullYear()} Biorama. Todos os
                        direitos reservados.
                    </Typography>
                    <Box>
                        <IconButton href="#" sx={{ color: "footer.text" }}>
                            <FacebookIcon />
                        </IconButton>
                        <IconButton href="#" sx={{ color: "footer.text" }}>
                            <TwitterIcon />
                        </IconButton>
                        <IconButton href="#" sx={{ color: "footer.text" }}>
                            <InstagramIcon />
                        </IconButton>
                        <IconButton href="#" sx={{ color: "footer.text" }}>
                            <LinkedInIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Footer;
