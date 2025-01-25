
import {observer} from "mobx-react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Divider,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";



const DashboardStoresCard = observer(({store})=>{
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Faz a query para mobile
    return(
        <Card
            sx={{
                maxWidth: 450,
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: 3,
                margin: "auto",
                mt: 5,
                minHeight: "100%",
            }}
        >
            {/* Cabeçalho */}
            <CardContent>
                <Typography variant="h6" component="div" fontWeight="bold">
                    {store.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ color: "#aaa" }}>
                    {store.addresses[0].city}
                </Typography>
            </CardContent>

            {/* Imagem */}
            <CardMedia
                component="img"
                sx={{
                    height: 200,         // Altura da imagem
                    width: "95%",        // Largura da imagem reduzida
                    margin: "0 auto",    // Centralizar horizontalmente
                    borderRadius: "8px",
                    pb:2,// Bordas arredondadas para um visual mais suave
                }}
                height="200"
                image="https://www.france-voyage.com/visuals/photos/frutas-vermelhas-7713_w1400.webp" // Substitui pelo URL da tua imagem
                alt="Yosemite National Park"
            />
            <Box>
                <Divider
                    sx={{
                        left: 0,
                        transform: "translateY(-50%)",
                        height: "1px", // Grossura
                        background: "linear-gradient(to right, transparent, #000, transparent)", // Gradiente
                        border: "none",
                    }}
                />
            </Box>

            <CardContent>
                <Box sx={{marginBottom: "3%", p: 2}}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3
                    }}>
                        <Box sx={{display: "flex", flexDirection: "row", gap: 1}}>
                            <Typography fontWeight="bold">Morada</Typography>
                            <Typography>{store.addresses[0].street_address}</Typography>
                        </Box>
                        <Box sx={{flex: "1 1 45%", flexDirection: "row", minHeight: "80px"}}>
                            <Typography fontWeight="bold">Discrição:</Typography>
                            <Typography>{store.description}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: isSmallScreen ? "column" : "row",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3
                    }}>
                        <Box sx={{flex: "1 1 45%"}}>
                            <Typography fontWeight="bold">Rating</Typography>
                            <Typography>{store.rating}</Typography>
                        </Box>
                        <Box sx={{flex: "1 1 45%"}}>
                            <Typography fontWeight="bold">Encomendas</Typography>
                            <Typography>Exmplo</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: "right", mt: 2 }}>
                        <Button variant="contained" color="primary">
                            Ver
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>


    )
})

export default DashboardStoresCard;
