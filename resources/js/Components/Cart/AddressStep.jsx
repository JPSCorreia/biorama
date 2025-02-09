import {
    Box,
    Typography,
    useMediaQuery,
    CircularProgress,
} from "@mui/material";
import { homeAddressStore } from "../../Stores";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useTheme } from "@mui/material/styles";
import { AddressCard } from "../../Components/";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { AddressModal } from "../../Components/";

const AddressStep = observer(({ setButtonDisabled }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const addresses = homeAddressStore.addresses;
    const primaryAddress = addresses?.find(address => address.is_primary);
    const [addressModalOpen, setAddressModalOpen] = useState(false);

    const handleAddressModalOpen = () => setAddressModalOpen(true);
    const handleAddressModalClose = () => setAddressModalOpen(false);

    // Atualiza o estado do botão "Avançar" dependendo da existência de uma morada principal
    useEffect(() => {
        setButtonDisabled(!primaryAddress);
    }, [primaryAddress, setButtonDisabled]);

    // Exibe um loader enquanto os dados ainda não estão carregados
    if (addresses === undefined) {
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
                    {addresses.map((address) => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            theme={theme}
                            checkout={true}
                        />
                    ))}

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
                                sx={{ fontSize: 40, color: theme.palette.primary.main }}
                            />
                            <Typography
                                sx={{ mt: 1, fontWeight: "bold", color: theme.palette.primary.main }}
                            >
                                Adicionar Morada
                            </Typography>
                        </Box>
                    )}
                </Box>
            ) : (
                <Box
                    onClick={handleAddressModalOpen}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px dashed #9e9e9e",
                        borderRadius: "10px",
                        minWidth: "250px",
                        minHeight: "352px",
                        width: isSmallScreen ? "100%" : "250px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            backgroundColor: "#e0e0e0",
                            transform: "scale(1.05)",
                        },
                    }}
                >
                    <AddCircleIcon sx={{ fontSize: 40, color: "#757575" }} />
                    <Typography sx={{ mt: 1, fontWeight: "bold", color: "#757575" }}>
                        Adicionar Morada
                    </Typography>
                </Box>
            )}
            <AddressModal open={addressModalOpen} handleClose={handleAddressModalClose} />
        </Box>
    );
});

export default AddressStep;
