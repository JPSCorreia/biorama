import { Box, Container, Typography, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
    return (
        <Box
            sx={{
                // bgcolor: 'background.paper',
                width: '100%',
                mt: 3,
            }}
        >
            <Container >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="body2" color="textSecondary">
                        &copy; {new Date().getFullYear()} Biorama. Todos os
                        direitos reservados.
                    </Typography>
                        <Box sx={{ mb: 0.5}}>
                            <IconButton href="#" color="textSecondary">
                                <Facebook />
                            </IconButton>
                            <IconButton href="#" color="textSecondary">
                                <Twitter />
                            </IconButton>
                            <IconButton href="#" color="textSecondary">
                                <Instagram />
                            </IconButton>
                            <IconButton href="#" color="textSecondary">
                                <LinkedIn />
                            </IconButton>
                        </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
