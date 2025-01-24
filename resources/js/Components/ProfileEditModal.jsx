import React, { useState } from "react";
import {
    Box,
    Button,
    Modal,
    TextField,
    useMediaQuery,
    useTheme,
    Avatar,
    IconButton,
    Typography,
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
import ImageCropModal from "./ImageCropModal"; // Importa o modal de recorte

const ProfileEditModal = observer(({ open, handleClose }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const { genders } = usePage().props;

    // Estado para o modal de recorte
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);

    function base64ToFile(base64String, filename) {
        const arr = base64String.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    // Função para abrir o modal de crop ao fazer upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageToCrop(reader.result); // Define a imagem carregada para recorte
                setCropModalOpen(true); // Abre o modal de crop
            };
            reader.readAsDataURL(file);
        }
    };

    // Callback para salvar a imagem recortada
    const handleCropComplete = (croppedImage) => {
        formik.setFieldValue('image_profile', croppedImage); // Atualiza o campo no formik
        setCropModalOpen(false); // Fecha o modal de crop
    };

    const validationSchema = yup.object().shape({
        first_name: yup.string().required("O nome é obrigatório"),
        last_name: yup.string().required("O apelido é obrigatório"),
        email: yup.string().email("Email inválido").required("O email é obrigatório"),
        phone: yup.string().required("O nrº de telemóvel é obrigatório"),
        nif: yup.string().required("O NIF é obrigatório"),
        gender_id: yup.number()
            .required("O género é obrigatório.")
            .integer("O ID deve ser um número inteiro."),
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

            // Cria o FormData para enviar como multipart/form-data
            const formData = new FormData();
            const values = formik.values;

            // Adiciona os campos do formulário
            formData.append('first_name', values.first_name);
            formData.append('last_name', values.last_name);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('nif', values.nif);
            formData.append('gender_id', values.gender_id);
            formData.append('date_of_birth', values.date_of_birth
                ? dayjs(values.date_of_birth).format('YYYY-MM-DD')
                : null);
            formData.append('image_profile', values.image_profile);
            // Atualizar authStore
            await authStore.submitDataUser(formData);

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
            gender_id: authStore.user.gender ? authStore.user.gender.id : null,
            date_of_birth: authStore.user.date_of_birth ? dayjs(authStore.user.date_of_birth) : null,
            image_profile: authStore.user.image_profile || '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {},
    });

    return (
        <>
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
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: isSmallScreen ? '80%' : '30%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        m: 'auto',
                        padding: isSmallScreen ? '10px' : '30px',
                        borderRadius: "10px",
                        backgroundColor: 'background.paper',
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            mb: 2,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '1.8rem',
                            }}
                        >
                            Editar Perfil
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 0,
                            mb: 2,
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
                            {!formik.values.image_profile &&
                                `${authStore.user?.first_name?.[0] || ''}${authStore.user?.last_name?.[0] || ''}`}
                        </Avatar>

                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUploadIcon />}
                            sx={{ ml: 2 }}
                        >
                            Upload File
                            <input
                                type="file"
                                hidden
                                onChange={handleImageUpload}
                                accept="image/*"
                            />
                        </Button>
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
                                    sx={{width: isSmallScreen ? '100%' : "45%"}}
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
                                    sx={{width:isSmallScreen ? '100%' : "45%"}}
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
                                    sx={{width : isSmallScreen ? '100%' : "45%"}}
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
                                    sx={{width: isSmallScreen ? '100%' : "45%"}}
                                />
                            </Box>
                            <Box
                                sx={{
                                display: 'flex',
                                flexDirection: isSmallScreen ? 'column' : "row",
                                justifyContent: 'space-between',
                                width: '100%',
                            }}>
                                <TextField
                                    select
                                    margin="normal"
                                    name="gender_id"
                                    value={formik.values.gender_id || ""} // Garante que nunca é undefined
                                    onChange={formik.handleChange}
                                    error={formik.touched.gender_id && Boolean(formik.errors.gender_id)}
                                    helperText={formik.touched.gender_id && formik.errors.gender_id}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    sx={{width: isSmallScreen ? '100%' : "45%"}}
                                >
                                    <option value="" disabled>
                                        Selecione um género
                                    </option>
                                    {genders.map((gender) => (
                                        <option key={gender.id} value={gender.id}>
                                            {gender.name}
                                        </option>
                                    ))}
                                </TextField>
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
                                            width: "45%"
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
        <ImageCropModal
            open={cropModalOpen}
            image={imageToCrop}
            onClose={() => setCropModalOpen(false)}
            onCropComplete={handleCropComplete}
        />
    </>
    );
});

export default ProfileEditModal;
