import {
    Box,
    Button,
    FormControlLabel,
    Modal,
    Switch,
    TextField,
    Typography,
    useTheme,
    useMediaQuery,
    IconButton
} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import axios from "axios";
import { homeAddressStore } from "@/Stores/index.js";
import {usePage} from "@inertiajs/react";

const AddressModal = ({ open, handleClose}) => {
    const {auth} = usePage().props;
    const theme = useTheme();
    const [postalCode, setPostalCode] = useState('');
    const [addressName, setAddressName] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [comment, setComment] = useState('');
    const [isPrimary, setIsPrimary] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(true);

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const resetForm = () => {
        setPostalCode('');
        setAddressName('');
        setStreetAddress('');
        setCity('');
        setPhoneNumber('');
        setComment('');
        setIsPrimary(false);
        setIsReadOnly(true);
    };


    const handlePostalCodeChange = async (e) => {
        const value = e.target.value;
        setPostalCode(value);

        const postalCodeRegex = /^\d{4}-\d{3}$/;
        if (postalCodeRegex.test(value)) {
            const [cp4, cp3] = value.split('-');
            const apiKey = import.meta.env.VITE_CTT_API_KEY;
            const apiUrl = import.meta.env.VITE_CTT_API_URL;

            try {
                const url = `${apiUrl}/${apiKey}/${cp4}-${cp3}`;
                const response = await axios.get(url);

                if (response.status === 200) {
                    const data = response.data[0];
                    setStreetAddress(data.morada || '');
                    setCity(data.distrito || '');
                    setIsReadOnly(false);
                } else {
                    console.error('Erro ao buscar dados da API:', response.status);
                }
            } catch (error) {
                console.error('Erro no pedido à API:', error);
            }
        } else {
            setStreetAddress('');
            setCity('');
            setIsReadOnly(true);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            user_id: auth.user.id,
            address_name: addressName,
            phone_number: phoneNumber || null,
            street_address: streetAddress,
            postal_code: postalCode,
            city: city,
            is_primary: isPrimary,
            comment: comment || null,
        };

        try {
            const response = await axios.post('/adicionar-morada', formData);
            if (response.status === 201) {
                console.log('Dados enviados para o store', response.data);
                homeAddressStore.addAddress(response.data.data);
                resetForm();
                handleClose();
            }
        } catch (error) {
            console.error('Erro ao criar morada:', error);
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
                justifyContent: 'center',
                alignItems: 'center',
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


                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography
                        id="modal-title"
                        variant="h5"
                        component="h2"

                        sx={{
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                        }}
                    >
                        Criar Morada
                    </Typography>
                    <IconButton
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Código Postal"
                        value={postalCode}
                        onChange={handlePostalCodeChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nome da Morada"
                        value={addressName}
                        onChange={(e) => setAddressName(e.target.value)}
                        InputProps={{ readOnly: isReadOnly }}
                        disabled={isReadOnly}
                        required

                        sx={{
                            backgroundColor: isReadOnly ? 'rgba(0, 0, 0, 0.05)' : 'transparent', // Fundo cinzento claro com opacidade
                            '& .MuiInputBase-root': {
                                backgroundColor: isReadOnly ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Rua"
                        value={streetAddress}
                        InputProps={{ readOnly: isReadOnly }}
                        required
                        disabled={isReadOnly}

                        sx={{
                            backgroundColor: isReadOnly ? 'rgba(0, 0, 0, 0.05)' : 'transparent', // Fundo cinzento claro com opacidade
                            '& .MuiInputBase-root': {
                                backgroundColor: isReadOnly ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                            },
                        }}

                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Cidade"
                        value={city}
                        InputProps={{ readOnly: isReadOnly }}
                        required
                        disabled={isReadOnly}
                        sx={{
                            backgroundColor: isReadOnly ? 'rgba(0, 0, 0, 0.05)' : 'transparent', // Fundo cinzento claro com opacidade
                            '& .MuiInputBase-root': {
                                backgroundColor: isReadOnly ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                            },
                        }}

                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nrº Telemóvel"
                        value={phoneNumber}
                        InputProps={{ readOnly: isReadOnly }}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isReadOnly}
                        sx={{
                            backgroundColor: isReadOnly ? 'rgba(0, 0, 0, 0.05)' : 'transparent', // Fundo cinzento claro com opacidade
                            '& .MuiInputBase-root': {
                                backgroundColor: isReadOnly ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                            },
                        }}

                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Comentário"
                        value={comment}
                        InputProps={{ readOnly: isReadOnly }}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={isReadOnly}
                        sx={{
                            backgroundColor: isReadOnly ? 'rgba(0, 0, 0, 0.05)' : 'transparent', // Fundo cinzento claro com opacidade
                            '& .MuiInputBase-root': {
                                backgroundColor: isReadOnly ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                            },
                            border: isReadOnly ? 'none': '1px solid #e0e0e0',
                        }}

                    />
                    {!isReadOnly && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isPrimary}
                                    onChange={(e) => setIsPrimary(e.target.checked)}
                                />
                            }
                            label="Morada Favorita?"
                        />
                    )}
                    <Box sx={{ mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isReadOnly}

                            sx={{
                                width: '25%',
                            }}
                        >
                            Criar
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default AddressModal;
