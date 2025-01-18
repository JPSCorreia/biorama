import {observer} from "mobx-react";
import axios from "axios";
import {homeAddressStore} from "../Stores/index.js";
import {Box, Typography, useMediaQuery, IconButton } from "@mui/material";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import AddressEditModal from "./AddressEditModal.jsx";

const AddressCard = observer(({ address, theme }) => {

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSetPrimary = async (address) => {
        homeAddressStore.setPrimaryAddress(address.id);
    };

    const handleDeleteAddress = async (address) => {
        try {
            const response = await axios.delete(`/del-morada/${address.id}`);
            if (response.status === 200) {
                homeAddressStore.deleteAddress(address.id);
                console.log('Morada Apagada com sucesso');
            }
        } catch (error) {
            console.error('Erro ao apagar a morada:', error);
        }
    };
    return (
        <Box
            sx={{
                backgroundColor: "#f3f0f063",
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
                borderRadius: "10px",
                width: isSmallScreen ? "100%" : "30%",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e0e0e0",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                }}
            >
                <Box
                >
                    <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", color: "#333", mb: 1 }}>
                        {address.address_name || "Nome da Morada"}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {!address.is_primary ? (
                        <IconButton
                            onClick={() => handleSetPrimary(address)}
                        >
                            <StarBorderIcon sx={{ fontSize: "1.5rem" }} />
                        </IconButton>
                    ) : (
                        <IconButton
                            onClick={() => handleSetPrimary(address)}
                            sx = {{
                                "&:hover": {
                                    backgroundColor : "#ffd7001f",
                                },
                            }}
                        >
                            <StarIcon sx={{ fontSize: "1.5rem", color: "gold"}} />
                        </IconButton>
                    )}
                    <IconButton aria-label="edit" onClick={handleOpen}>
                        <EditIcon
                            sx={{
                                color: theme.palette.primary.main,
                            }}
                        />
                    </IconButton>
                    <AddressEditModal open={open} handleClose={handleClose} address={address} />
                    <IconButton aria-label="delete" onClick={handleDeleteAddress}>
                        <DeleteIcon
                            sx={{
                                color: theme.palette.error.main,
                            }}
                        />
                    </IconButton>
                </Box>

            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", mb: 1 }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>Rua</Typography>
                <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                    {address.street_address || "Rua não fornecida"}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", mb: 1 }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>Cidade</Typography>
                <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                    {address.city || "Cidade não fornecida"}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", mb: 1 }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>Código Postal</Typography>
                <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                    {address.postal_code || "Código Postal não fornecido"}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", mb: 1 }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>Contacto</Typography>
                <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                    {address.phone_number || "Contacto não fornecido"}
                </Typography>
            </Box>
        </Box>
    );
});

export default AddressCard;
