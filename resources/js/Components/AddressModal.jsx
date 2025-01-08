import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import {useState} from "react";
import axios from "axios";
import {FormControlLabel, Switch} from "@mui/material";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const AddressModal = ({ open, handleClose, user }) => {
    const [postalCode, setPostalCode] = useState('');
    const [address_name, setAddressName] = useState('');
    const [street_address, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [comment, setComment] = useState('');
    const [isReadOnly, setIsReadOnly] = useState(true);


    const handlePostalCodeChange = async (e) => {
        const value = e.target.value;
        setPostalCode(value);

        // Regex para validar formato ####-###
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

                    // Verifica os dados e atualiza o estado
                    setStreet(data.morada); // Certifica que "morada" existe
                    console.log(data.morada);
                    setCity(data.distrito || ''); // Certifica que "distrito" existe
                    setIsReadOnly(false); // Permite edição se os dados forem válidos
                } else {
                    console.error('Erro ao buscar dados da API:', response.status);
                }
            } catch (error) {
                console.error('Erro no pedido à API:', error);
            }
        } else {
            // Limpar campos se o formato do código postal for inválido
            setStreet('');
            setCity('');
            setIsReadOnly(true);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            address_name: address_name, // Nome da morada
            phone_number: phone_number || null, // Telefone (opcional)
            street_address: street_address, // Altera para `street_address`
            postal_code: postalCode,
            city: city,
            is_primary: !!user.home_address?.is_primary, // true ou false
            comment: comment || null, // Comentário (opcional)
        };

        console.log('Form Data:', formData);
        try {
            const response = await axios.post('/adicionar-morada', formData);
            if (response.status === 201) {
                console.log('Morada criada com sucesso!', response.data);
                handleClose();
            }
        } catch (error) {
            console.error('Erro ao criar morada:', error);
        }
    };


    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <Box sx={style}>
                <Typography id="modal-title" variant="h6" component="h2">
                    Criar Morada
                </Typography>
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
                        value={address_name} // Estado que controla este campo
                        onChange={(e) => setAddressName(e.target.value)} // Atualiza o estado
                        InputProps={{
                            readOnly: isReadOnly,
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Rua"
                        name="street_address"
                        value={street_address} // Estado que controla este campo
                        InputProps={{
                            readOnly: isReadOnly,
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Cidade"
                        name="city"
                        value={city} // Estado que controla este campo
                        InputProps={{
                            readOnly: isReadOnly,
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Contacto"
                        name="phone_number"
                        value={phone_number} // Estado que controla este campo
                        onChange={(e) => setPhoneNumber(e.target.value)} // Atualiza o estado
                        InputProps={{
                            readOnly: isReadOnly,
                        }}
                    />
                    {
                        user.home_address > 1 ?? (
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={!!user.home_address?.is_primary} // true ou false
                                        name="is_primary"
                                        disabled={isReadOnly} // Desativa se for apenas leitura
                                    />
                                }
                                label="Morada favorita?"
                            />
                        )
                    }
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Comentário"
                        name="comment"
                        value={comment} // Estado que controla este campo
                        onChange={(e) => setComment(e.target.value)} // Atualiza o estado
                        InputProps={{
                            readOnly: isReadOnly,
                        }}
                    />
                    <Box sx={{mt: 2}}>
                        <Button type="submit" variant="contained" color="primary" disabled={isReadOnly}>
                            Criar
                        </Button>
                    </Box>
                </form>

            </Box>
        </Modal>
    );
};

export default AddressModal;
