import React from 'react';
import { Box, Typography } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';

const DashboardStoreOrderCard = ({ store, onViewStoreOrders }) => {
    return (
        <Box
            onClick={() => onViewStoreOrders(store.id)}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '120px',
                flex: '1 1 25%',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                width: '60%',
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
                    backgroundColor: '#27AE60',
                }}
            ></Box>

            <Box sx={{ textAlign: 'center', padding: '16px' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                    {store.name || "Loja"}
                </Typography>
                <StoreIcon fontSize="large" sx={{ color: '#27AE60' }} />
            </Box>
        </Box>
    );
};

export default DashboardStoreOrderCard;
