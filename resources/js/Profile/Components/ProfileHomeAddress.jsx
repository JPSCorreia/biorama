import {observer} from "mobx-react";
import {Box, Typography, useMediaQuery, useTheme,} from "@mui/material";
import AddressCard from "../../Components/AddressCard.jsx";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddressModal from "../../Components/AddressModal.jsx";
import {homeAddressStore} from "../../Stores/index";
import { useState } from "react";


const ProfileHomeAddress = observer(() => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const addresses = homeAddressStore.addresses; // Obter moradas do Store

    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const handleAddressModalOpen = () => setAddressModalOpen(true);
    const handleAddressModalClose = () => setAddressModalOpen(false);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Typography sx={{ fontWeight: "bold", fontSize: "2rem", mb: 2, width: "100%" }}>Gestão de Moradas</Typography>
            {addresses.length > 0 ? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: isSmallScreen ? "column" : "row",
                        alignItems: isSmallScreen ? "baseline" : "center",
                        width: "100%",
                        justifyContent: "start",
                        flexWrap: "wrap",
                        gap: 3,
                    }}
                >
                    {addresses.map((address) => {
                        return (
                            <AddressCard
                                key={address.id}
                                address={address}
                                theme={theme}
                                sx={{ maxHeight: "350px" }}
                            />
                        );
                    })}

                    {addresses.length < 3 && (
                        <Box
                            onClick={handleAddressModalOpen}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                ml: isSmallScreen ? "auto" : 0,
                                mr: isSmallScreen ? "auto" : 0,
                                backgroundColor: "#388e3c26",
                                border: "2px dashed",
                                borderColor: theme.palette.primary.main,
                                borderRadius: "10px",
                                minHeight: "410px",
                                minWidth: "250px",
                                cursor: "pointer",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                },
                            }}
                        >
                            <AddCircleIcon
                                sx={{
                                    fontSize: 40,
                                    color: theme.palette.primary.main,
                                }}
                            />
                            <Typography
                                sx={{
                                    mt: 1,
                                    fontWeight: "bold",
                                    color: theme.palette.primary.main,
                                }}
                            >
                                Adicionar Morada
                            </Typography>
                        </Box>
                    )}
                </Box>
            ) : (
                <Box
                    onClick={handleAddressModalOpen} // Abre o modal para adicionar uma nova morada
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f5f5f5", // Cor de fundo do card
                        border: "2px dashed #9e9e9e", // Borda estilizada
                        borderRadius: "10px", // Cantos arredondados
                        width: isSmallScreen? "100%" : "30%", // Largura do card
                        height: "150px", // Altura do card
                        cursor: "pointer", // Indica que é clicável
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra para dar efeito de card
                        transition: "all 0.3s ease", // Animação suave no hover
                        "&:hover": {
                            backgroundColor: "#e0e0e0", // Cor de fundo no hover
                            transform: "scale(1.05)", // Leve aumento no hover
                        },
                    }}
                >
                    <AddCircleIcon sx={{ fontSize: 40, color: "#757575" }} /> {/* Ícone central */}
                    <Typography sx={{ mt: 1, fontWeight: "bold", color: "#757575" }}>
                        Adicionar Morada
                    </Typography>
                </Box>
            )}
            <AddressModal open={addressModalOpen} handleClose={handleAddressModalClose} />
        </Box>

    )

});

export default ProfileHomeAddress;
