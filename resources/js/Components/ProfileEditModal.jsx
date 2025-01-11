import {
    Box,
    Button,
    Modal,
    styled,
    TextField,
    useMediaQuery,
    useTheme,
    Avatar, IconButton
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import {observer} from "mobx-react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {authStore} from "../Stores/index.js";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const ProfileEditModal = observer(({ open, handleClose, user }) => {

    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const [first_name, setFirstName] = useState(user.first_name || '');
    const [last_name, setLastName] = useState(user.last_name || '');
    const [previewImage, setPreviewImage] = useState(null);
    const [email, setEmail] = useState(user.email || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [photo, setphoto] = useState(user.photo || '');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setphoto(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("user_id", user.id);
        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("email", email);
        formData.append("phone", phone);
        if (photo) {
            formData.append("photo", photo);
        }

        try {
            const response = await axios.post(`/editar-perfil/${user.id}`,
                formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },

                });
            if (response.status === 200) {
                console.log('User atualizado com sucesso!', response.data.data);
                authStore.updateUserData(response.data.data);
                handleClose();
            }
        } catch (error) {
            console.error('Erro ao atualizar o user:', error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: isSmallScreen ? '80%' : '30%',
                justifyContent: 'center',
                alignItems: 'center',
                m: 'auto',
                padding : isSmallScreen ? '10px' : '20px',
                borderRadius : "10px",
                backgroundColor: 'background.paper',
            }}>
                <Box
                    sx={{
                        p: 0,
                        bgcolor: "white",
                        borderRadius: 2,
                        width: "100%",
                        m: "auto",
                        position: "relative",
                    }}
                >
                    {/* Avatar e Botão de Upload */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 0,
                            mb:2
                        }}
                    >
                        <Avatar
                            alt="Profile Image"
                            src={previewImage || ""}
                            sx={{
                                width: isSmallScreen ? 90 : 110,
                                height: isSmallScreen ? 90 : 110,
                                color: "background.secondary",
                                bgcolor: "primary.main",
                                fontSize: "3rem",
                                borderRadius: isSmallScreen ? "50%" : "10px", // Redondo no ecrã pequeno, arredondado no grande
                            }}
                        >
                            {!previewImage && `${user.first_name[0]}${user.last_name[0]}`}
                        </Avatar>

                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUploadIcon />}
                            sx={{
                                ml: 2,
                            }}
                        >
                            Upload File
                            <input
                                type="file"
                                hidden
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </Button>
                    </Box>
                    {/* Botão de Fechar */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 6,
                            right: 6,
                        }}
                    >
                        <IconButton>
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Primeiro Nome"
                        name="first_name"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Apelido"
                        name="last_name"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nrº de Telemóvel"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button type="submit" variant="contained" color="primary">
                            Atualizar
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
});

export default ProfileEditModal;
