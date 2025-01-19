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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { observer } from "mobx-react";
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { authStore } from "../Stores/index.js";
import dayjs from 'dayjs';
import 'dayjs/locale/pt';

const ProfileEditModal = observer(({ open, handleClose}) => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const validationSchema = yup.object().shape({
        first_name: yup.string().required("O nome é obrigatório"),
        last_name: yup.string().required("O apelido é obrigatório"),
        email: yup.string().email("Email inválido").required("O email é obrigatório"),
        phone: yup.string().required("O nrº de telemóvel é obrigatório"),
        nif: yup.string().required("O NIF é obrigatório"),
        gender: yup.string().required("O género é obrigatório"),
        date_of_birth: yup.date().nullable().required("A data de nascimento é obrigatória"),
    });

    const submitForm = async () => {
        try {
            // Execute validação antes de submeter
            await formik.validateForm();
            if (!formik.isValid) {
                console.error("Erro na validação:", formik.errors);
                return;
            }

            // Formatar valores
            const formattedValues = {
                ...formik.values,
                date_of_birth: formik.values.date_of_birth
                    ? dayjs(formik.values.date_of_birth).format('YYYY-MM-DD')
                    : null,
            };

            console.log("Valores enviados para o MySQL:", formattedValues);

            // Atualizar authStore
            authStore.updateUserData(formattedValues);

            // Fechar modal
            handleClose();
        } catch (error) {
            console.error("Erro ao submeter o formulário:", error);
        }
    };

    const formik = useFormik({
        initialValues: {
            first_name: authStore.user.first_name || '',
            last_name: authStore.user.last_name || '',
            email: authStore.user.email || '',
            phone: authStore.user.phone || '',
            nif: authStore.user.nif || '',
            gender: authStore.user.gender.name || '',
            date_of_birth: authStore.user.date_of_birth ? dayjs(authStore.user.date_of_birth) : null,
            image_profile: authStore.user.image_profile || '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {},
    });

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
                padding: isSmallScreen ? '10px' : '20px',
                borderRadius: "10px",
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
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 0,
                            mb: 2
                        }}
                    >
                        <Avatar
                            alt="Profile Image"
                            src={formik.values.image_profile}
                            sx={{
                                width: isSmallScreen ? 90 : 110,
                                height: isSmallScreen ? 90 : 110,
                                color: "background.secondary",
                                bgcolor: "primary.main",
                                fontSize: "3rem",
                                borderRadius: isSmallScreen ? "50%" : "10px",
                            }}
                        >
                            {!formik.values.image_profile && `${authStore.user?.first_name?.[0] || ''}${authStore.user?.last_name?.[0] || ''}`}
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
                                onChange={(e) => formik.setFieldValue('image_profile', e.target.files[0])}
                                accept="image/*"
                            />
                        </Button>
                    </Box>
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
                <form onSubmit={(e) => e.preventDefault()}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Primeiro Nome"
                        name="first_name"
                        value={formik.values.first_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                        helperText={formik.touched.first_name && formik.errors.first_name}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Apelido"
                        name="last_name"
                        value={formik.values.last_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                        helperText={formik.touched.last_name && formik.errors.last_name}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Género"
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.gender && Boolean(formik.errors.gender)}
                        helperText={formik.touched.gender && formik.errors.gender}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="NIF"
                        name="nif"
                        value={formik.values.nif}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.nif && Boolean(formik.errors.nif)}
                        helperText={formik.touched.nif && formik.errors.nif}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nrº de Telemóvel"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={dayjs.locale('pt')}>
                        <MobileDatePicker
                            sx={{ mt: 2, display: isSmallScreen ? 'block' : 'none' }}
                            label="Data de Nascimento"
                            name="date_of_birth"
                            value={formik.values.date_of_birth}
                            onChange={(value) => formik.setFieldValue('date_of_birth', value)}
                            onBlur={() => formik.setFieldTouched('date_of_birth', true)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
                                    helperText={formik.touched.date_of_birth && formik.errors.date_of_birth}
                                />
                            )}
                        />
                        <DatePicker
                            label="Data de Nascimento"
                            name="date_of_birth"
                            value={formik.values.date_of_birth} // Certifique-se de que é um objeto dayjs ou null
                            onChange={(value) => formik.setFieldValue('date_of_birth', value)} // Atualiza o estado corretamente
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
                                    helperText={formik.touched.date_of_birth && formik.errors.date_of_birth}
                                />
                            )}
                        />
                    </LocalizationProvider>
                    <Box sx={{ mt: 2 }}>
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={submitForm}
                        >
                            Atualizar
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
});

export default ProfileEditModal;
