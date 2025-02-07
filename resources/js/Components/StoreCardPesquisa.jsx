import { observer } from 'mobx-react-lite';
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import {useState} from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
const StoreCardPesquisa = observer(({store}) => {
    const [previewIndex, setPreviewIndex] = useState(0);

    return (
        <Card sx={{ width: 260, height: 445,boxShadow: 3, borderRadius: 2, p: 2 }}>
            {/* Carrossel de Imagens */}
            <Box sx={{ mb: 2, borderRadius: 2, overflow: "hidden", height: "200px" }}>
                <Carousel
                    autoPlay={false}
                    indicators={false}
                    navButtonsAlwaysVisible={true}
                    index={previewIndex}
                    onChange={(index) => setPreviewIndex(index)}
                    sx={{
                        width: "100%",
                        height: "100%",
                        "& .MuiButtonBase-root": {
                            backgroundColor: "rgba(0, 0, 0, 0.2) !important",
                            color: "#fff",
                            boxShadow: "none !important",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            opacity: 0,
                            transition: "opacity 0.3s ease-in-out, background-color 0.3s ease-in-out",
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.3) !important",
                            },
                        },
                        "& .MuiSvgIcon-root": {
                            fontSize: "2rem",
                        }
                    }}
                >
                    {store.galleries?.length > 0 ? (
                        store.galleries.map((img, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: "100%",
                                    height: "200px",
                                    backgroundImage: `url(${img.image_link})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}
                            />
                        ))
                    ) : (
                        <Box
                            sx={{
                                width: "100%",
                                height: "200px",
                                backgroundImage: "url('/images/default-store.jpg')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                        />
                    )}
                </Carousel>
            </Box>

            {/* Informações da Loja */}
            <CardContent sx={{
                textAlign: "left",
                p:0,
                ml: 1,
                display: "flex",
                flexDirection: "column",
                height: "150px"
            }}
            >
                <Box
                    sx={{
                        mb:1
                    }}
                >
                    <Typography fontWeight="bold" sx={{fontSize:"1.2rem"}}>
                        {store.name}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        {store.addresses[0].street_address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {store.addresses[0].postal_code}, {store.addresses[0].city}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            mt: 1
                        }}
                    >
                        <CallIcon sx={{fontSize:"1.1rem", color: "#A5C686"}}/>
                        <Typography variant="body2" color="text.secondary">
                            {store.phone_number}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center"
                        }}
                    >
                        <EmailIcon sx={{fontSize:"1.1rem", color: "#A5C686"}}/>
                        <Typography variant="body2" color="text.secondary">
                            {store.email}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>

            {/* Mais Informações */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center", // Alinha os itens verticalmente
                        justifyContent: "center",
                        gap: 1,
                        color: "#A5C686",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "color 0.3s ease-in-out",
                        "&:hover": {
                            color: "#7DA25A",
                        },
                    }}
                >
                    {/* Ícones com sobreposição */}
                    <Box sx={{ position: "relative", width: "18px", height: "16px", display: "flex", alignItems: "center" }}>
                        <ArrowForwardIosIcon
                            sx={{
                                fontSize: "20px",
                                color: "inherit",
                                position: "absolute",
                                left: "0px",
                            }}
                        />
                        <ArrowForwardIosIcon
                            sx={{
                                fontSize: "20px",
                                color: "inherit",
                                position: "absolute",
                                left: "6px", // Sobreposição ajustada
                            }}
                        />
                    </Box>

                    {/* Texto centralizado */}
                    <Typography
                        variant="button"
                        sx={{
                            fontSize: "16px", // Pequeno como na imagem
                            fontWeight: "bold", // Negrito
                            color: "inherit", // Para manter a mesma cor
                            display: "flex",
                            alignItems: "center", // Alinha verticalmente ao centro
                        }}
                    >
                        MAIS INFORMAÇÕES
                    </Typography>
                </Box>

            </Box>
        </Card>
    );
});

export default StoreCardPesquisa;
