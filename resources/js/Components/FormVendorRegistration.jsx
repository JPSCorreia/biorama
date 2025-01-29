import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    useTheme,
    useMediaQuery,
    FormHelperText,
    Typography,
    Link,
    Paper, Grid2, Button,
} from "@mui/material";
import { vendorRegistrationStore, authStore } from "../Stores";
import {DatePicker, MobileDatePicker} from "@mui/x-date-pickers";
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useEffect} from "react";
import {observer} from "mobx-react";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { FormCompanyRegistration } from "./";
import {forwardRef, useImperativeHandle} from "react";

const FormVendorRegistration = forwardRef(({genders, formErrors, handleCloseCompanyForm, refCompany, isCompany}, ref) => {

    const isSmallScreen = useMediaQuery(useTheme().breakpoints.down('sm'));

    const validationSchema = yup.object().shape({
        first_name: yup
            .string()
            .required("O nome é obrigatório"),
        last_name: yup
            .string()
            .required("O apelido é obrigatório"),
        email: yup
            .string()
            .email("O email é inválido")
            .required("O email é obrigatório"),
        nif: yup
            .string()
            .required("O NIF é obrigatório"),
        iban: yup
            .string()
            .min(25, "O IBAN deve ter 25 caracteres")
            .max(25, "O IBAN deve ter 25 caracteres")
            .required("O IBAN é obrigatório"),
        phone: yup
            .string()
            .required("O nrº de telemóvel é obrigatório"),
        date_of_birth: yup
            .mixed()
            .test(
                "is-date",
                "A data de nascimento deve ser uma data válida",
                (value) => value === null || dayjs(value).isValid()
            )
            .required("A data de nascimento é obrigatória"),

        gender_id: yup
            .number()
            .required("O género é obrigatório"),
    });

    const handleFormSubmit = async (values) => {
        const isValid = await validationSchema.isValid(values);
        console.log("SUBMETER", isValid);
        if (isValid) {
            vendorRegistrationStore.setPersonalFormik(formik);
        }
    };

    const formik = useFormik({
        initialValues: {
            user_id: authStore.user.id || "",
            first_name:  "",
            last_name:  "",
            email:  "",
            nif:  "",
            iban:  "",
            phone:  "",
            date_of_birth: null,
            gender_id: "",
            image_profile:  "",
            is_company: false,
        },
        validationSchema: validationSchema,
        onSubmit: handleFormSubmit,
    });

    useImperativeHandle(ref, () => {
        console.log("useImperativeHandle foi chamado!"); // Para depuração
        return {
            validateForm: formik.validateForm,
            setTouched: formik.setTouched,
            setFieldValue: formik.setFieldValue,
            values: formik.values,
            handleSubmit: formik.handleSubmit,
        };
    }, [formik]);
    useEffect(() => {
        if (formErrors) {
            formik.setErrors(formErrors);

            // Marca todos os campos como "touched" para que os erros apareçam sempre
            formik.setTouched(
                Object.keys(formErrors).reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                }, {})
            );

            // Força uma revalidação para garantir que os erros aparecem
            console.log("Revalidar formulário"); // Para depuração
            formik.validateForm();
        }
    }, [formErrors]);

    return (
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={dayjs.locale(navigator.language) || dayjs.locale("pt")}
        >
            <Paper sx={{ mt: 4, width: "100%", m: "auto", p: 5 }}>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Typography sx={{ fontSize: "2.5rem", fontWeight: "bold", mb: 0 }}>
                        Dados Pessoais
                    </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography
                        sx={{
                            color: "#757575",
                            fontSize: "0.875rem",
                            fontStyle: "italic",
                        }}
                    >
                        *Certifique-se de que todos os campos obrigatórios estão preenchidos para avançar para a próxima etapa.
                    </Typography>
                </Box>

                <form onSubmit={formik.handleSubmit}>
                    <Grid2 container spacing={10}>
                        {/* Coluna Esquerda */}
                        <Grid2 xs={12} md={6}>
                            <TextField
                                label="Nome"
                                name="first_name"
                                fullWidth
                                margin="normal"
                                value={formik.values.first_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                                helperText={formik.touched.first_name ? formik.errors.first_name : ""}
                            />

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
                                helperText={formik.touched.email ? formik.errors.email : ""}
                            />

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <TextField
                                    label="NIF"
                                    name="nif"
                                    fullWidth
                                    margin="normal"
                                    value={formik.values.nif}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.nif && Boolean(formik.errors.nif)}
                                    helperText={formik.touched.nif ? formik.errors.nif : ""}
                                    sx={{ width: "45%" }}
                                />

                                <FormControl
                                    sx={{ width: "45%", mt: 2 }}
                                    error={formik.touched.gender_id && Boolean(formik.errors.gender_id)}
                                >
                                    <InputLabel id="gender-select-label">Género</InputLabel>
                                    <Select
                                        labelId="gender-select-label"
                                        id="gender-select"
                                        name="gender_id"
                                        value={formik.values.gender_id}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        {Array.isArray(genders) &&
                                            genders.map((gender) => (
                                                <MenuItem key={gender.id} value={gender.id}>
                                                    {gender.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid2>

                        {/* Coluna Direita */}
                        <Grid2 xs={12} md={6}>
                            <TextField
                                label="Apelido"
                                name="last_name"
                                fullWidth
                                margin="normal"
                                value={formik.values.last_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                                helperText={formik.touched.last_name ? formik.errors.last_name : ""}
                            />

                            <TextField
                                label="IBAN"
                                name="iban"
                                fullWidth
                                margin="normal"
                                value={formik.values.iban}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.iban && Boolean(formik.errors.iban)}
                                helperText={formik.touched.iban ? formik.errors.iban : ""}
                            />

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <TextField
                                    label="Nrº Telemóvel"
                                    name="phone"
                                    fullWidth
                                    margin="normal"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone ? formik.errors.phone : ""}
                                    sx={{ width: "45%" }}
                                />

                                {/* MobileDatePicker (Para telas pequenas) */}
                                <MobileDatePicker
                                    label="Data de Nascimento"
                                    value={formik.values.date_of_birth}
                                    onChange={(value) => formik.setFieldValue("date_of_birth", value)}
                                    onBlur={() => formik.setFieldTouched("date_of_birth", true)}
                                    slotProps={{
                                        textField: {
                                            error: formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth),
                                            helperText: formik.touched.date_of_birth ? formik.errors.date_of_birth : "",
                                        }
                                    }}
                                    sx={{
                                        mt: 2,
                                        display: isSmallScreen ? "block" : "none",
                                        width: "45%",
                                    }}
                                />

                                {/* DatePicker (Para telas maiores) */}
                                <DatePicker
                                    label="Data de Nascimento"
                                    value={formik.values.date_of_birth}
                                    onChange={(value) => formik.setFieldValue("date_of_birth", value)}
                                    onBlur={() => formik.setFieldTouched("date_of_birth", true)}
                                    slotProps={{
                                        textField: {
                                            error: formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth),
                                            helperText: formik.touched.date_of_birth ? formik.errors.date_of_birth : "",
                                        }
                                    }}
                                    sx={{
                                        mt: 2,
                                        display: isSmallScreen ? "none" : "block",
                                        width: "45%",
                                        textAlign: "right",
                                    }}
                                />
                            </Box>
                        </Grid2>
                    </Grid2>
                </form>
            </Paper>
        </LocalizationProvider>
    );
});
export default FormVendorRegistration;
