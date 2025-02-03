import {
    Box,
    FormControl,
    Grid2,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    useTheme,
    useMediaQuery,
    Typography,
    IconButton,
} from "@mui/material";
import { vendorRegistrationStore, authStore } from "../Stores";
import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect, forwardRef, useImperativeHandle } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import CloseIcon from "@mui/icons-material/Close";

const FormVendorRegistration = forwardRef(
    (
        { genders, formErrors, handleCloseCompanyForm, refCompany, isCompany },
        ref
    ) => {
        const isSmallScreen = useMediaQuery(useTheme().breakpoints.down("sm"));

        const validationSchema = yup.object().shape({
            first_name: yup.string().required("O nome é obrigatório"),
            last_name: yup.string().required("O apelido é obrigatório"),
            email: yup
                .string()
                .email("O email é inválido")
                .required("O email é obrigatório"),
            nif: yup.string().required("O NIF é obrigatório"),
            iban: yup
                .string()
                .min(25, "O IBAN deve ter 25 caracteres")
                .max(25, "O IBAN deve ter 25 caracteres")
                .required("O IBAN é obrigatório"),
            phone: yup.string().required("O nrº de telemóvel é obrigatório"),
            date_of_birth: yup
                .mixed()
                .test(
                    "is-date",
                    "A data de nascimento deve ser uma data válida",
                    (value) => value === null || dayjs(value).isValid()
                )
                .required("A data de nascimento é obrigatória"),
            gender_id: yup.number().required("O género é obrigatório"),
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
                first_name: "Lucas",
                last_name: "Silvestre",
                email: "lucassilvestre4@gmail.com",
                nif: "245910069",
                iban: "PT50000201231234567890154",
                phone: "961970027",
                date_of_birth: null,
                gender_id: "1",
                is_company: false,
            },
            validationSchema: validationSchema,
            onSubmit: handleFormSubmit,
        });

        useImperativeHandle(
            ref,
            () => {
                console.log("useImperativeHandle foi chamado!"); // Para depuração
                return {
                    validateForm: formik.validateForm,
                    setTouched: formik.setTouched,
                    setFieldValue: formik.setFieldValue,
                    values: formik.values,
                    handleSubmit: formik.handleSubmit,
                };
            },
            [formik]
        );

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
                <Box
                    sx={{
                        mt: 4,
                        width: "100%",
                        m: "auto",
                        position: "relative",
                        pt: 3,
                        pr: 5,
                        pl: 5,
                        pb: 5,
                        border: "1px solid #ccc",
                        borderRadius: "15px",
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {/* Cabeçalho com título e botão de fechar */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                        }}
                    >
                        <Typography sx={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                            Dados Pessoais
                        </Typography>
                    </Box>
                    {/* Texto explicativo */}
                    <Typography
                        sx={{
                            color: "#757575",
                            fontSize: "0.875rem",
                            fontStyle: "italic",
                            mb: 2,
                        }}
                    >
                        *Certifique-se que preenche corretamente os seus dados antes de avançar no
                        processo de registo enquanto vendedor.
                    </Typography>

                    <form onSubmit={formik.handleSubmit}>
                        <Grid2 container >
                            {/* Coluna Esquerda */}
                            <Grid2 item xs={12} md={6}>
                                <TextField
                                    label="Nome"
                                    name="first_name"
                                    fullWidth
                                    margin="normal"
                                    value={formik.values.first_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.first_name &&
                                        Boolean(formik.errors.first_name)
                                    }
                                    helperText={
                                        formik.touched.first_name ? formik.errors.first_name : ""
                                    }
                                    required
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
                                    helperText={
                                        formik.touched.email ? formik.errors.email : ""
                                    }
                                    required
                                />

                                <Grid2 container>
                                    <Grid2 item xs={12} md={6}>
                                        <FormControl
                                            sx={{ width: "80%", mt: 2 }}
                                            error={
                                                formik.touched.gender_id &&
                                                Boolean(formik.errors.gender_id)
                                            }
                                        >
                                            <InputLabel id="gender-select-label">
                                                Género
                                            </InputLabel>
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
                                    </Grid2>
                                    <Grid2
                                        item
                                        xs={12}
                                        md={6}
                                        sx={{ textAlign: isSmallScreen ? "left":"right" }}
                                    >
                                        <TextField
                                            label="NIF"
                                            name="nif"
                                            fullWidth
                                            margin="normal"
                                            value={formik.values.nif}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.nif && Boolean(formik.errors.nif)
                                            }
                                            helperText={formik.touched.nif ? formik.errors.nif : ""}
                                            required
                                            sx={{ width: isSmallScreen ? "80%":"70%" }}
                                        />
                                    </Grid2>
                                </Grid2>
                            </Grid2>

                            {/* Coluna Direita */}
                            <Grid2 item xs={12} md={6}>
                                <TextField
                                    label="Apelido"
                                    name="last_name"
                                    fullWidth
                                    margin="normal"
                                    value={formik.values.last_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.last_name &&
                                        Boolean(formik.errors.last_name)
                                    }
                                    helperText={
                                        formik.touched.last_name ? formik.errors.last_name : ""
                                    }
                                    required
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
                                    required
                                />

                                <Grid2 container>
                                    <Grid2 item xs={12} md={6}>
                                        <Box sx={{ width: "80%", mt: 2 }}>
                                            {/* MobileDatePicker (para telas pequenas) */}
                                            <MobileDatePicker
                                                label="Data de Nascimento"
                                                value={formik.values.date_of_birth}
                                                onChange={(value) =>
                                                    formik.setFieldValue("date_of_birth", value)
                                                }
                                                onBlur={() =>
                                                    formik.setFieldTouched("date_of_birth", true)
                                                }
                                                slotProps={{
                                                    textField: {
                                                        error:
                                                            formik.touched.date_of_birth &&
                                                            Boolean(formik.errors.date_of_birth),
                                                        helperText: formik.touched.date_of_birth
                                                            ? formik.errors.date_of_birth
                                                            : "",
                                                    },
                                                }}
                                                sx={{
                                                    display: isSmallScreen ? "block" : "none",
                                                }}
                                            />

                                            {/* DatePicker (para telas maiores) */}
                                            <DatePicker
                                                label="Data de Nascimento"
                                                value={formik.values.date_of_birth}
                                                onChange={(value) =>
                                                    formik.setFieldValue("date_of_birth", value)
                                                }
                                                onBlur={() =>
                                                    formik.setFieldTouched("date_of_birth", true)
                                                }
                                                slotProps={{
                                                    textField: {
                                                        error:
                                                            formik.touched.date_of_birth &&
                                                            Boolean(formik.errors.date_of_birth),
                                                        helperText: formik.touched.date_of_birth
                                                            ? formik.errors.date_of_birth
                                                            : "",
                                                    },
                                                }}
                                                sx={{
                                                    display: isSmallScreen ? "none" : "block",
                                                }}
                                            />
                                        </Box>
                                    </Grid2>
                                    <Grid2
                                        item
                                        xs={12}
                                        md={6}
                                        sx={{ textAlign: isSmallScreen ? "left" : "right" }}
                                    >
                                        <TextField
                                            label="Nrº Telemóvel"
                                            name="phone"
                                            margin="normal"
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.phone &&
                                                Boolean(formik.errors.phone)
                                            }
                                            helperText={
                                                formik.touched.phone ? formik.errors.phone : ""
                                            }
                                            sx={{ width: "70%" }}
                                            required

                                        />
                                    </Grid2>
                                </Grid2>
                            </Grid2>
                        </Grid2>
                    </form>
                </Box>
            </LocalizationProvider>
        );
    }
);

export default FormVendorRegistration;
