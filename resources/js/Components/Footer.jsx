import { Box, Container, Typography, IconButton, Paper } from "@mui/material";
import {
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const Footer = () => {
    const theme = useTheme();

    return (
        <Container
            sx={{
                bgcolor: "footer.background",
                minWidth: "100% !important",
                pt: 0.25,
                borderTop: `1px solid ${theme.palette.primary.main}`,
                borderRadius: "5px 5px 0 0",
                justifyContent: "center",
                display: "flex",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "80%" }}>

                    <Typography
                        variant="body2"
                        color="footer.text"
                        sx={{ mt: 0.75, display: { xs: "none", sm: "block" }, alignContent: "center" }}
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
                    </Box>
            </Box>
        </Container>
    );
};

export default Footer;
