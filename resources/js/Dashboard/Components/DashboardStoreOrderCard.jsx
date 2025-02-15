import { Box, Paper, Typography, useTheme, useMediaQuery } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';


const DashboardStoreOrderCard = ({ store, onViewStoreOrders }) => {

    const theme = useTheme();
    const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Paper
            elevation={4}
            onClick={() => onViewStoreOrders(store.id)}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '120px',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                width: '100%',
                maxWidth: smallerThanMedium? '96%' : '300px',
                '&:hover': {
                    transform: 'scale(1.05)',
                },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '5px',
                    backgroundColor: theme.palette.primary.main,
                }}
            ></Box>
            <Box sx={{ textAlign: 'center', padding: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 1 }}>
                    {store.name || "Loja"}
                </Typography>
                <StoreIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
            </Box>
        </Paper>
    );
};

export default DashboardStoreOrderCard;
