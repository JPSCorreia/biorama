import { Box, Typography } from '@mui/material';
import { HomeMap } from '../Components';

const Home = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                alignItems: 'center',
                marginTop: '5%',
                marginBottom: '5%',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Descubra as lojas mais perto de si!
            </Typography>
            <HomeMap />
        </Box>
    );
};

export default Home;
