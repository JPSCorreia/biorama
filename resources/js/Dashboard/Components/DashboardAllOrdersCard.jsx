import { Box, Paper, useTheme, Typography, useMediaQuery } from '@mui/material';
import StoreIcon from "@mui/icons-material/Store";

const DashboardAllOrdersCard = ({ totalOrders, onViewAllOrders }) => {

    const theme = useTheme();
    const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Paper
            onClick={onViewAllOrders}
            elevation={4}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '120px',
                borderRadius: '12px',
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
                    Todas as Lojas
                </Typography>
                <StoreIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
            </Box>
        </Paper>
    );
};

export default DashboardAllOrdersCard;
