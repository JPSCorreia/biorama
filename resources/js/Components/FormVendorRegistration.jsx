import {vendorRegistrationStore} from "../Stores";
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
} from "@mui/material";
import {DatePicker, MobileDatePicker} from "@mui/x-date-pickers";
import { useFormik } from 'formik';
import * as yup from 'yup';
import {useEffect} from "react";
import {observer} from "mobx-react";

const FormVendorRegistration = observer(({ genders, passFormik, showWarning }) => {

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
            .required("O IBAN é obrigatório"),
        phone: yup
            .string()
            .required("O nrº de telemóvel é obrigatório"),
        date_of_birth: yup
            .date()
            .nullable()
            .required("A data de nascimento é obrigatória"),
        gender: yup
            .number()
            .required("O género é obrigatório"),
    });

    const handleFormSubmit = async (values) => {
        try {
            // Guarda ou envia os dados do formulário
            vendorRegistrationStore.updateUser(values);
            console.log("Dados do passo atual guardados:", values);

        } catch (error) {
            console.error("Erro ao submeter o formulário:", error);
        }
    };


    const formik = useFormik({
        initialValues: {
            first_name: vendorRegistrationStore.user.first_name || "",
            last_name: vendorRegistrationStore.user.last_name || "",
            email: vendorRegistrationStore.user.email || "",
            nif: vendorRegistrationStore.user.nif || "",
            iban: vendorRegistrationStore.user.iban || "",
            phone: vendorRegistrationStore.user.phone || "",
            date_of_birth: vendorRegistrationStore.user.date_of_birth || null,
            gender: vendorRegistrationStore.user.gender || ""
        },
        validationSchema: validationSchema,
        validateOnMount: true,
        onSubmit: handleFormSubmit,
    });



    useEffect(() => {
        if (passFormik) {
            passFormik(formik); // Passa o formik ao componente pai
        }

        vendorRegistrationStore.setFormValid(formik.isValid); // Mantém o estado sincronizado
    }, [formik, passFormik, formik.isValid]);






    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={10}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Nome"
                        name="first_name"
                        fullWidth
                        type="text"
                        margin="normal"
                        value={formik.values.first_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                        helperText={formik.touched.first_name && formik.errors.first_name}
                        disabled={!showWarning}
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
                        helperText={formik.touched.email && formik.errors.email}
                        disabled={!showWarning}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
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
                            helperText={formik.touched.nif && formik.errors.nif}
                            sx={{width: "45%"}}
                            disabled={!showWarning}
                        />
                        <FormControl
                            sx={{ width: "45%", mt: 2 }}
                            error={formik.touched.gender && Boolean(formik.errors.gender)}
                            disabled={!showWarning}
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
                                <FormHelperText>{formik.errors.gender}</FormHelperText>
                            )}
                        </FormControl>

                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Apelido"
                        name="last_name"
                        type="text"
                        fullWidth
                        margin="normal"
                        value={formik.values.last_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                        helperText={formik.touched.last_name && formik.errors.last_name}
                        disabled={!showWarning}
                    />
                    <TextField
                        label="IBAN"
                        name="iban"
                        type="text"
                        fullWidth
                        margin="normal"
                        value={formik.values.iban}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.iban && Boolean(formik.errors.iban)}
                        helperText={formik.touched.iban && formik.errors.iban}
                        disabled={!showWarning}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        <TextField
                            label="Nrº Telemóvel"
                            name="phone"
                            type="text"
                            margin="normal"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                            disabled={!showWarning}
                            sx={{width: "45%"}}
                        />
                        <MobileDatePicker
                            sx={{
                                mt: 2,
                                display: isSmallScreen ? "block" : "none",
                                width: "45%",
                            }}
                            label="Data de Nascimento"
                            value={formik.values.date_of_birth}
                            onChange={(value) => formik.setFieldValue("date_of_birth", value)} // Atualiza o valor manualmente
                            onBlur={() => formik.setFieldTouched("date_of_birth", true)} // Marca o campo como tocado
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
                                    helperText={formik.touched.date_of_birth && formik.errors.date_of_birth}
                                />
                            )}
                            disabled={!showWarning}
                        />
                        <DatePicker
                            sx={{
                                mt: 2,
                                display: isSmallScreen ? "none" : "block",
                                width: "45%",
                                textAlign: 'right'
                            }}
                            label="Data de Nascimento"
                            value={formik.values.date_of_birth}
                            onChange={(value) => formik.setFieldValue("date_of_birth", value)} // Atualiza o valor manualmente
                            onBlur={() => formik.setFieldTouched("date_of_birth", true)} // Marca o campo como tocado
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
                                    helperText={formik.touched.date_of_birth && formik.errors.date_of_birth}
                                />
                            )}
                            disabled={!showWarning}
                        />
                    </Box>
                </Grid>
            </Grid>
        </form>
    )
});
export default FormVendorRegistration;
