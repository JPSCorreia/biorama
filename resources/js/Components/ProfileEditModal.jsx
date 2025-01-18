import {
    Box,
    Button,
    Modal,
    TextField,
    useMediaQuery,
    useTheme,
    Avatar, IconButton
} from "@mui/material";
import {
    LocalizationProvider,
    DatePicker,
    MobileDatePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { useState } from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import {observer} from "mobx-react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {authStore} from "../Stores/index.js";
import dayjs from 'dayjs';
import 'dayjs/locale/pt';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';

const ProfileEditModal = observer(({ open, handleClose, user }) => {

    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [first_name, setFirstName] = useState(user.first_name || '');
    const [last_name, setLastName] = useState(user.last_name || '');
    const [previewImage, setPreviewImage] = useState(null);
    const [email, setEmail] = useState(user.email || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [image_profile, setImageProfile] = useState(user.image_profile || '');
    const [nif, setnif] = useState(user.nif || '');
    const [gender, setgender] = useState(user.gender || '');
    const [date_of_birth, setValue] = useState(user.date_of_birth || null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setImageProfile(file);
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
        formData.append("date_of_birth", date_of_birth);
        formData.append("nif", nif);
        formData.append('gender', gender);
        if (image_profile) {
            formData.append("photo", image_profile);
        }

        try {
            const response = await axios.post(`/editar-perfil/${user.id}`,
                formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },

                });
            if (response.status === 200) {
                console.log('PRINT DO RESPONSE', response.data);
                authStore.updateUserData(response.data.data);
                console.log('Dados após a atualização:', authStore.user);
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
                            src={previewImage || image_profile}
                            sx={{
                                width: isSmallScreen ? 90 : 110,
                                height: isSmallScreen ? 90 : 110,
                                color: "background.secondary",
                                bgcolor: "primary.main",
                                fontSize: "3rem",
                                borderRadius: isSmallScreen ? "50%" : "10px", // Redondo no ecrã pequeno, arredondado no grande
                            }}
                        >
                            {!previewImage && `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`}
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
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
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
                        label="Género"
                        name="gender"
                        value={gender}
                        onChange={(e) => setgender(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="NIF"
                        name="nif"
                        value={nif}
                        onChange={(e) => setnif(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nrº de Telemóvel"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale={dayjs.locale(navigator.language) || dayjs.locale('pt')}
                    >
                        <MobileDatePicker
                            sx={{
                                mt: 2,
                                display: isSmallScreen ? 'block' : 'none',
                            }}
                            label="Data de Nascimento"
                            name="date_of_birth"
                            value={date_of_birth}
                            onChange={(newValue) => setValue(newValue)}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale={dayjs.locale(navigator.language) || dayjs.locale('pt')}
                    >
                        <DatePicker
                            sx={{
                                mt: 2,
                                display: isSmallScreen ? 'none' : 'block',
                            }}
                            label="Data de Nascimento"
                            name="date_of_birth"
                            value={date_of_birth}
                            onChange={(newValue) => setValue(newValue)}
                        />
                    </LocalizationProvider>
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
