import { Modal, Box, Button } from "@mui/material";
import HomeMap from "./HomeMap";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";


const MapModal = ({ open, onClose }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* HomeMap dentro do Modal */}
                <Box
                    sx={{
                        flex: 1,
                        width: "100%",
                        height: "100%",
                        zIndex: 1, // Mantém o mapa no fundo
                    }}
                >
                    <HomeMap/>
                </Box>

                {/* Botão "Ver Lista" fixo acima do mapa */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "80%",
                        zIndex: 1000, // Garante que está acima do mapa
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                            borderRadius: "30px",
                            fontWeight: "bold",
                            padding: "12px 24px",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px", // Espaçamento entre o texto e o ícone
                        }}
                        onClick={onClose} // Fecha o modal ao clicar
                    >
                        Ver Lista
                        <FormatListBulletedIcon sx={{ fontSize: "1.5rem" }} />
                    </Button>

                </Box>
            </Box>
        </Modal>
    );
};

export default MapModal;
