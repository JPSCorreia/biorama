import {observer} from "mobx-react";
import React from 'react';
import { Box, Typography, Paper, Button, Avatar } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import {fixImagePath} from "../utils/utils.js";

const DashboarShowStoreInfo = observer(({ store, user })=>{
    console.log("Store", store);
    const backgroundImage = fixImagePath(store?.galleries?.[0]?.image_link)
        || "https://www.france-voyage.com/visuals/photos/frutas-vermelhas-7713_w1400.webp";
    const profileImage = fixImagePath(user?.image_profile)
        || "https://img.freepik.com/free-photo/sideways-black-person-looking-away_23-2148749548.jpg?t=st=1738098181~exp=1738101781~hmac=37201112c86819d842272cc0f3c10da8c78de0e39ee9a77845680f10018abde5&w=1800";
    return (

        <Box sx={{ position: 'relative', p: 4 }}>
            {/* Carousel Section */}
            <Box sx={{ position: 'absolute', top: 0, width: '100%', height: '200px', zIndex: -1 }}>
                <Carousel autoPlay={true} indicators={true}>
                    {store?.galleries?.map((gallery, index) => (
                        <Box
                            key={index}
                            sx={{
                                height: '200px',
                                backgroundImage: `url(${fixImagePath(gallery.image_link)})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        ></Box>
                    ))}
                </Carousel>
            </Box>

            {/* Store Information Section */}
            <Paper elevation={3} sx={{ p: 4, mt: 10, position: 'relative' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        src={profileImage}
                        alt="User Avatar"
                        sx={{ width: 100, height: 100, mr: 2 }}
                    />
                    <Typography variant="h4" component="div">
                        {store.name}
                    </Typography>
                </Box>

                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Morada:</strong> {store?.addresses?.[0]?.street_address || "Morada não disponível"}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Código Postal:</strong> {store?.addresses?.[0]?.postal_code || "Código postal não disponível"}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Cidade:</strong> {store?.addresses?.[0]?.city || "Cidade não disponível"}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Descrição:</strong> {store?.description || "Sem descrição"}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Número de Telemóvel:</strong> {store?.phone_number || "Sem número de telemóvel"}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {store?.email || "Sem email"}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Comentário:</strong> {store?.addresses?.[0]?.comment || "Sem comentário"}
                </Typography>


                <Box sx={{ mt: 3, textAlign: 'right' }}>
                    <Button variant="contained" color="primary">
                        Edit Info
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
})
export default DashboarShowStoreInfo;

