import {
    TextField,
    Paper,
    Typography,
    Grid,
    useMediaQuery,
    useTheme,
    IconButton,
    Box,
} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/pt';
import {vendorRegistrationStore} from "../Stores/vendorRegistrationStore.js";
import CloseIcon from "@mui/icons-material/Close";


dayjs.locale('pt'); // Define o locale globalmente

const Step1CompanyInfo = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (e) => {
        if (e?.target) {
            const { name, value } = e.target;
            vendorRegistrationStore.updateCompany((prev) => ({ ...prev, [name]: value }));
        } else {
            vendorRegistrationStore.updateCompany((prev) => ({ ...prev, founded_at: e }));
        }
    };

    return (
        <Paper sx={{  mt: 4, width: "85%", m: "auto", p: 5, position: "relative" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "2.5rem",
                        fontWeight: "bold",
                    }}
                >
                    Registo de Empresa
                </Typography>
                <Box
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                    }}
                >
                    <IconButton onClick={() => vendorRegistrationStore.setIsCompany(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>
            <Grid
                container
                spacing={10}
            >
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Nome da Empresa"
                        name="name"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        required
                    />
                    <Grid container>
                        <Grid items xs={12} md={6}>
                            <TextField
                                label="Nrº de Telemóvel"
                                name="phone"
                                margin="normal"
                                onChange={handleChange}
                                required
                                sx={{
                                    width: '80%',
                                }}
                            />
                        </Grid>
                        <Grid
                            items xs={12}
                            md={6}
                            sx={{ textAlign: 'right' }}

                        >
                            <TextField
                                label="NIF"
                                name="nif"
                                fullWidth
                                margin="normal"
                                onChange={handleChange}
                                required
                                sx={{ width:"80%" }}
                            />

                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Morada"
                        name="street"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        required
                    />
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Código Postal"
                                name="postal_code"
                                margin="normal"
                                onChange={handleChange}
                                required
                                sx={{
                                    width: '80%',
                                }}
                            />
                            <TextField
                                label="Número"
                                name="number"
                                margin="normal"
                                onChange={handleChange}
                                required
                                sx={{
                                    width: '80%',
                                }}
                            />
                        </Grid>
                        <Grid
                            items xs={12}
                            md={6}
                            sx={{ textAlign: 'right' }}
                        >
                            <TextField
                                label="Cidade"
                                name="district"
                                margin="normal"
                                onChange={handleChange}
                                required
                                sx={{
                                    width: '80%',
                                }}
                            />
                            <TextField
                                label="Pais"
                                name="country"
                                margin="normal"
                                onChange={handleChange}
                                required
                                sx={{
                                    width: '80%',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Step1CompanyInfo;
