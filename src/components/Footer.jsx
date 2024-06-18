import { Box, Container, Typography, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
    
    const theme = useTheme();

    return (
        <Box
            sx={{
                bgcolor: 'footer.background',
                maxWidth: '1200px',
                width: '100%',
                pt: 0.25,
                // borderTop: '1px solid white',
                borderTop: `1px solid ${theme.palette.primary.main}`,
                borderRadius: '5px 5px 0 0',
            }}
        >
            <Container>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography
                        variant="body2"
                        color="footer.text"
                        sx={{ mt: 0.2 }}
                    >
                        &copy; {new Date().getFullYear()} Biorama. Todos os
                        direitos reservados.
                    </Typography>
                    <Box>
                        <IconButton href="#" sx={{ color: 'footer.text' }}>
                            <Facebook />
                        </IconButton>
                        <IconButton href="#" sx={{ color: 'footer.text' }}>
                            <Twitter />
                        </IconButton>
                        <IconButton href="#" sx={{ color: 'footer.text' }}>
                            <Instagram />
                        </IconButton>
                        <IconButton href="#" sx={{ color: 'footer.text' }}>
                            <LinkedIn />
                        </IconButton>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
