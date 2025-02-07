import {
    Box,
    Button,
    Radio,
    Typography,
    useMediaQuery,
    CircularProgress,
} from "@mui/material";
import { homeAddressStore } from "../../Stores";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useTheme } from "@mui/material/styles";
import AddressCard from "../../Components/AddressCard.jsx";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddressModal from "../../Components/AddressModal.jsx";

const AddressStep = observer(({ selectedAddress, setSelectedAddress }) => {
    const theme = useTheme();

    // useEffect(() => {
    //     homeAddressStore.fetchAddresses();
    // }, []);

    if (
        !homeAddressStore.addresses ||
        homeAddressStore.addresses.length === 0
    ) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                <CircularProgress
                    size={60}
                    sx={{ color: theme.palette.primary.main }}
                />
            </Box>
        );
    }
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const smallerThanLg = useMediaQuery(theme.breakpoints.down("lg"));
    const smallerThanMd = useMediaQuery(theme.breakpoints.down("md"));
    const addresses = homeAddressStore.addresses;
    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const handleAddressModalOpen = () => setAddressModalOpen(true);
    const handleAddressModalClose = () => setAddressModalOpen(false);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                maxWidth: 1200,
            }}
        >
            {addresses.length > 0 ? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: isSmallScreen ? "column" : "row",
                        alignItems: "center",
                        height: "58vh",
                        width: "100%",
                        justifyContent: "center" ,
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
                                checkout={true}
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
                                backgroundColor: "#388e3c26",
                                border: "2px dashed",
                                borderColor: theme.palette.primary.main,
                                borderRadius: "10px",
                                minHeight: "352px",
                                minWidth: "250px",
                                width: isSmallScreen ? "100%" : "250px",
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
                        justifySelf: "flex-start",
                        border: "2px dashed #9e9e9e", // Borda estilizada
                        borderRadius: "10px", // Cantos arredondados
                        minWidth: "250px",
                        minHeight: "352px", // Altura do card
                        width: isSmallScreen ? "100%" : "250px",
                        cursor: "pointer", // Indica que é clicável
                        transition: "all 0.3s ease", // Animação suave no hover
                        "&:hover": {
                            backgroundColor: "#e0e0e0", // Cor de fundo no hover
                            transform: "scale(1.05)", // Leve aumento no hover
                        },
                    }}
                >
                    <AddCircleIcon sx={{ fontSize: 40, color: "#757575" }} />{" "}
                    {/* Ícone central */}
                    <Typography
                        sx={{ mt: 1, fontWeight: "bold", color: "#757575" }}
                    >
                        Adicionar Morada
                    </Typography>
                </Box>
            )}
            <AddressModal
                open={addressModalOpen}
                handleClose={handleAddressModalClose}
            />
        </Box>
    );
});

export default AddressStep;
