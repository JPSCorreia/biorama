import {
    Box,
    Typography,
    Button,
    Modal,
    TextField,
    useMediaQuery,
    useTheme,
    Avatar, IconButton, InputLabel, Select, MenuItem, FormHelperText, FormControl, Grid
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
import { usePage } from "@inertiajs/react";
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { authStore } from "../Stores/index.js";
import dayjs from 'dayjs';
import 'dayjs/locale/pt';

const ProfileEditModal = observer(({ open, handleClose}) => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const {genders} = usePage().props;


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
            gender: authStore.user.gender || '',
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
                width: isSmallScreen ? '80%' : '45%',
                justifyContent: 'center',
                alignItems: 'center',
                m: 'auto',
                padding: isSmallScreen ? '10px' : '30px',
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
                                width: isSmallScreen ? 90 : 125,
                                height: isSmallScreen ? 90 : 125,
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

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: isSmallScreen ? '90%' : '65%',
                    }}
                >
                    <form onSubmit={formik.handleSubmit} >
                        <Box sx={{
                            display:'flex',
                            flexDirection: 'column',
                            width: '100%',

                        }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: isSmallScreen ? 'column' : 'row',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}
                            >
                                <TextField
                                    label="Nome"
                                    name="first_name"
                                    sx={{width: isSmallScreen ? '100%' : "40%"}}
                                    type="text"
                                    margin="normal"
                                    value={formik.values.first_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                                    helperText={
                                        <Box>
                                            {formik.touched.first_name && formik.errors.first_name}
                                        </Box>
                                    }
                                />
                                <TextField
                                    label="Apelido"
                                    name="last_name"
                                    type="text"
                                    sx={{width:isSmallScreen ? '100%' : "40%"}}
                                    margin="normal"
                                    value={formik.values.last_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                                    helperText={
                                        <Box>
                                            {formik.touched.last_name && formik.errors.last_name}
                                        </Box>
                                    }
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: isSmallScreen ? 'column' : "row",
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}
                            >
                                <TextField
                                    label="NIF"
                                    name="nif"
                                    type="text"
                                    margin="normal"
                                    value={formik.values.nif}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.nif && Boolean(formik.errors.nif)}
                                    helperText={
                                        <Box>
                                            {formik.touched.last_name && formik.errors.last_name}
                                        </Box>
                                    }
                                    sx={{width : isSmallScreen ? '100%' : "40%"}}
                                />
                                <TextField
                                    label="Nrº Telemóvel"
                                    name="phone"
                                    type="text"
                                    margin="normal"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={
                                        <Box>
                                            {formik.touched.last_name && formik.errors.last_name}
                                        </Box>
                                    }
                                    sx={{width: isSmallScreen ? '100%' : "40%"}}
                                />
                            </Box>
                            <Box
                                sx={{
                                display: 'flex',
                                flexDirection: isSmallScreen ? 'column' : "row",
                                justifyContent: 'space-between',
                                width: '100%',
                            }}>
                                <FormControl
                                    sx={{mt: 2, width: isSmallScreen ? '100%' : "40%"}}
                                    error={formik.touched.gender && Boolean(formik.errors.gender)}
                                >
                                    <InputLabel id="gender-select-label">Género</InputLabel>
                                    <Select
                                        labelId="gender-select-label"
                                        id="gender-select"
                                        name="gender"
                                        type="number"
                                        value={formik.values.gender}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        label="Género"
                                    >
                                        {Array.isArray(genders) &&
                                            genders.map((gender) => (
                                                <MenuItem key={gender.id} value={gender.id}>
                                                    {gender.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                    {formik.touched.gender && formik.errors.gender && (
                                        <FormHelperText>
                                            {formik.errors.gender}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                        sx={{
                                            mt: 2,
                                            display: isSmallScreen ? "block" : "none",
                                            width: "100%",
                                        }}
                                        label="Data de Nascimento"
                                        value={formik.values.date_of_birth}
                                        onChange={(value) => formik.setFieldValue("date_of_birth", value)} // Atualiza o valor manualmente
                                        onBlur={() => formik.setFieldTouched("date_of_birth", true)} // Marca o campo como tocado
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
                                                helperText={
                                                    <Box>
                                                        {formik.touched.last_name && formik.errors.last_name}
                                                    </Box>
                                                }
                                            />
                                        )}
                                    />
                                    <DatePicker
                                        sx={{
                                            mt: 2,
                                            display: isSmallScreen ? "none" : "block",
                                            textAlign: 'left',
                                            width: "40%"
                                        }}
                                        label="Data de Nascimento"
                                        value={formik.values.date_of_birth}
                                        onChange={(value) => formik.setFieldValue("date_of_birth", value)} // Atualiza o valor manualmente
                                        onBlur={() => formik.setFieldTouched("date_of_birth", true)} // Marca o campo como tocado
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
                                                helperText={
                                                    <Box>
                                                        {formik.touched.last_name && formik.errors.last_name}
                                                    </Box>
                                                }
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Box>
                        </Box>
                        <Box sx={{ mt: 2 }}>

                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                fullWidth
                                margin="normal"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={
                                    <Box>
                                        {formik.touched.last_name && formik.errors.last_name}
                                    </Box>
                                }
                            />
                        </Box>
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
            </Box>
        </Modal>
    );
});

export default ProfileEditModal;
