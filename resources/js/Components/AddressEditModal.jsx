import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState } from "react";
import axios from "axios";
import {FormControlLabel, Switch, IconButton, useMediaQuery, useTheme} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import {usePage} from "@inertiajs/react";
import {observer} from "mobx-react";
import {homeAddressStore} from "@/Stores/index.js";


const AddressEditModal = observer(({ open, handleClose, address }) => {

    const { auth } = usePage().props;
    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const [postalCode, setPostalCode] = useState(address.postal_code || '');
    const [address_name, setAddressName] = useState(address.address_name || '');
    const [street_address, setStreet] = useState(address.street_address || '');
    const [city, setCity] = useState(address.city || '');
    const [phone_number, setPhoneNumber] = useState(address.phone_number || '');
    const [comment, setComment] = useState(address.comment || '');
    const [isPrimary, setIsPrimary] = useState(Boolean(address.is_primary));

    const handleSwitchChange = async (e) => {
        const newValue = e.target.checked;
        setIsPrimary(newValue);
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
                    setStreet(data.morada || '');
                    setCity(data.distrito || '');
                } else {
                    console.error('Erro ao buscar dados da API:', response.status);
                }
            } catch (error) {
                console.error('Erro no pedido à API:', error);
            }
        } else {
            setStreet('');
            setCity('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log( 'MORADA ANTES DE EDITAR: ', address);

        const formData = {
            user_id : auth.user.id,
            address_name : address_name ,
            phone_number: phone_number,
            street_address: street_address,
            postal_code: postalCode,
            city: city,
            is_primary : isPrimary,
            comment: comment,
        };
        try {
            const response = await axios.post(`/editar-morada/${address.id}`,
                formData, {
                    headers: {
                    'Content-Type': 'application/json',
                    },

            });
            if (response.status === 200) {
                console.log('Morada atualizada com sucesso!', response.data.data);
                homeAddressStore.updateAddress(address.id, response.data.data);
                handleClose();
            }
        } catch (error) {
            console.error('Erro ao atualizar a morada:', error);
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
                        Editar Morada
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
                        name="postal_code"
                        value={postalCode}
                        onChange={handlePostalCodeChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nome da Morada"
                        name="address_name"
                        value={address_name}
                        onChange={(e) => setAddressName(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Rua"
                        name="street_address"
                        value={street_address}
                        onChange={(e) => setStreet(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Cidade"
                        name="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Contacto"
                        name="phone_number"
                        value={phone_number}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isPrimary} // Estado booleano
                                onChange={handleSwitchChange} // Atualiza o estado booleano
                                name="is_primary"
                            />
                        }
                        label="Tornar Morada Favorita?"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Comentário"
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
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

export default AddressEditModal;
