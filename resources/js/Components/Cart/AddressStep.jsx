import {
    Box,
    Button,
    Radio,
    Typography,
    useMediaQuery,
    CircularProgress,
} from "@mui/material";
import { homeAddressStore, cartStore } from "../../Stores";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useTheme } from "@mui/material/styles";
import { AddressCard } from "../../Components/";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { AddressModal } from "../../Components/";

const AddressStep = observer(({ selectedAddress, setSelectedAddress }) => {
    const theme = useTheme();

    // Calcula o custo de envio baseado na distância
    function calculateShippingCost(distanceKm) {
        const baseCost = 4.0; // Custo fixo até 5 km
        const costPerKm = 0.15; // Custo extra por km após 5 km
        const baseDistance = 5; // Distância incluída no custo base

        let finalCost;

        if (distanceKm <= baseDistance) {
            finalCost = baseCost;
        } else {
            finalCost = baseCost + (distanceKm - baseDistance) * costPerKm;
        }

        return finalCost;
    }

    // Obtém a distância correta entre a loja e o endereço do utilizador
    async function getDistanceFromOSRM(lat1, lon1, lat2, lon2) {
        const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const distanceMeters = data.routes[0].distance; // Distância em METROS
                const distanceKm = distanceMeters / 1000; // 🔹 Converter para KM
                return distanceKm;
            } else {
                console.error("⚠️ Erro ao obter rota do OSRM");
                return null;
            }
        } catch (error) {
            console.error("⚠️ Erro na API OSRM:", error);
            return null;
        }
    }

    // Calcula os portes para cada loja no carrinho
    useEffect(() => {
        async function calculateShipping() {
            for (const [storeId] of Object.entries(cartStore.cart)) {
                if (
                    cartStore.cart[storeId][0].store.latitude &&
                    cartStore.cart[storeId][0].store.longitude &&
                    homeAddressStore?.primaryAddress?.latitude &&
                    homeAddressStore?.primaryAddress?.longitude
                ) {
                    const distance = await getDistanceFromOSRM(
                        cartStore.cart[storeId][0].store.latitude,
                        cartStore.cart[storeId][0].store.longitude,
                        homeAddressStore?.primaryAddress?.latitude,
                        homeAddressStore?.primaryAddress?.longitude,
                    );

                    if (distance !== null) {
                        const cost = calculateShippingCost(distance);
                        cartStore.setShippingCost(storeId, cost); // 🔹 Guarda os custos de envio na `cartStore`
                    }
                }
            }
        }
        calculateShipping();
    }, [cartStore.cart, homeAddressStore?.primaryAddress]);

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
                        width: "100%",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: 3,
                        height: "50vh",
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
