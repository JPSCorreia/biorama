import { observer } from "mobx-react";
import axios from "axios";
import { homeAddressStore } from "../Stores/index.js";
import {
    Box,
    Typography,
    useMediaQuery,
    IconButton,
    Paper,
    Tooltip,
} from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import AddressEditModal from "./AddressEditModal.jsx";
import React from "react";

const AddressCard = observer(
    ({ address, theme, checkout = false, review = false }) => {
        const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
        const isMediumScreen = useMediaQuery(
            theme.breakpoints.between("sm", "md"),
        );

        const [open, setOpen] = React.useState(false);
        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);

        const handleSetPrimary = async (address) => {
            homeAddressStore.setPrimaryAddress(address.id);
        };

        const handleDeleteAddress = async (id) => {
            await homeAddressStore.deleteAddress(id);
            console.log("Morada Apagada com sucesso");
        };
        return (
            <Paper
                elevation={4}
                sx={{
                    py: 1,
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    borderRadius: "10px",
                    width: isSmallScreen ? "100%" : "250px",
                    minHeight: "354px",
                    cursor: checkout && !review ? "pointer" : "default",
                    // border: address.is_primary ? "1px solid gold" : "1px solid white",
                    boxShadow: address.is_primary
                        ? `0px 0px 10px ${theme.palette.primary.main}`
                        : "",
                }}
                onClick={checkout ? () => handleSetPrimary(address) : ""}
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
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                fontSize: "1.2rem",
                                mb: 1,
                                mt: 1,
                            }}
                            color="terciary"
                        >
                            {address.address_name || "Nome da Morada"}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", mb: 1 }}>
                    <Typography sx={{ fontWeight: "bold" }}>Morada:</Typography>
                    <Typography>
                        {`${address.street_address}, ${address.number}` ||
                            "Rua não fornecida"}
                    </Typography>
                    <Typography>
                        {`${address.postal_code}, ${address.city}` ||
                            "Cidade não fornecida"}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", mb: 1 }}>
                    <Typography sx={{ fontWeight: "bold" }}>
                        Telefone:
                    </Typography>
                    <Typography sx={{ mt: 0.5 }}>
                        {address.phone_number || "Contacto não fornecido"}
                    </Typography>
                </Box>
                <Typography sx={{ fontWeight: "bold" }}>Comentário</Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        width: "100%",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {address.comment || "Descrição não fornecida"}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    {!address.is_primary ? (
                        <Tooltip title="Marcar como morada principal">
                            <IconButton
                                onClick={() => handleSetPrimary(address)}
                            >
                                <StarBorderIcon sx={{ fontSize: "1.5rem" }} />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <>
                            {!review && (
                                <Tooltip title="Marcar como morada principal">
                                    <IconButton
                                        onClick={() =>
                                            handleSetPrimary(address)
                                        }
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "#ffd7001f",
                                            },
                                        }}
                                    >
                                        <StarIcon
                                            sx={{
                                                fontSize: "1.5rem",
                                                color: "gold",
                                            }}
                                        />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </>
                    )}
                    {!review && (
                        <>
                            <Tooltip title="Editar morada">
                                <IconButton
                                    aria-label="edit"
                                    onClick={handleOpen}
                                >
                                    <EditIcon
                                        sx={{
                                            color: theme.palette.primary.main,
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                            <AddressEditModal
                                open={open}
                                handleClose={handleClose}
                                address={address}
                            />
                            <Tooltip title="Apagar morada">
                                <IconButton
                                    aria-label="delete"
                                    onClick={() =>
                                        handleDeleteAddress(address.id)
                                    }
                                >
                                    <DeleteIcon
                                        sx={{
                                            color: theme.palette.error.main,
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </Box>
            </Paper>
        );
    },
);

export default AddressCard;
