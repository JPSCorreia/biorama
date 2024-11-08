import { Box, Typography } from '@mui/material';
import MapComponent from './MapComponent';

const HomeContainer = () => {
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
            <MapComponent />
        </Box>
    );
};

export default HomeContainer;
