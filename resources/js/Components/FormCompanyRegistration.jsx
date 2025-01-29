import {observer} from "mobx-react";
import {
    TextField,
    Paper,
    Typography,
    Grid,
    IconButton,
    Box,
} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/pt';
import {vendorRegistrationStore} from "../Stores/vendorRegistrationStore.js";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from 'formik';
import * as yup from 'yup';
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import axios from "axios";


dayjs.locale('pt'); // Define o locale globalmente

const FormCompanyRegistration = forwardRef(({formErrors, onCloseCompanyForm}, refCompany) => {
    const [isReadOnly, setIsReadOnly] = useState(true); // Estado para controlar se os campos estão desativados
    const [loading, setLoading] = useState(false); // Estado para mostrar o carregamento da API
    const handlePostalCodeChange = async (e) => {
        let value = event.target.value.replace(/\D/g, "");
        if (value.length > 4) {
            value = `${value.slice(0, 4)}-${value.slice(4, 7)}`;
        }
        formik.setFieldValue("postal_code", value); // Atualiza o campo do código postal no Formik

        const postalCodeRegex = /^\d{4}-\d{3}$/; // Valida o formato do código postal
        if (value.length === 8 && /^\d{4}-\d{3}$/.test(value)) {
            const [cp4, cp3] = value.split("-");
            try {
                const url = `${import.meta.env.VITE_CTT_API_URL}/${import.meta.env.VITE_CTT_API_KEY}/${cp4}-${cp3}`;
                const response = await axios.get(url);
                if (response.status === 200 && response.data.length > 0) {
                    const data = response.data[0];
                    formik.setFieldValue("street", data.morada || "");
                    formik.setFieldValue("district", data.distrito || "");
                    formik.setFieldValue("country", 'Portugal');
                } else {
                    formik.setFieldError("postal_code", "Código Postal não encontrado");
                }
            } catch {
                formik.setFieldError("postal_code", "Erro ao validar o Código Postal");
            } finally {
                setLoading(false); // Remove o estado de carregamento
                setIsReadOnly(false); // Reativa os campos
            }
        } else {
            // Limpa os campos se o código postal não for válido
            formik.setFieldValue("street", "");
            formik.setFieldValue("district", "");
            formik.setFieldValue("country", "");
            setIsReadOnly(false); // Reativa os campos
        }
    };

    const validationSchema = yup.object().shape({
        //Tabela companies
        name: yup
            .string()
            .required('O nome da empresa é obrigatório'),
        nif: yup
            .string()
            .required('O NIF é obrigatório'),

        //Tabela company_contacts
        email: yup
            .string()
            .email('O email é inválido')
            .required('O email é obrigatório'),
        phone: yup
            .string()
            .required('O número de telemóvel é obrigatório'),

        //Tabela company_addresses
        street: yup
            .string()
            .required('A morada é obrigatória'),
        postal_code: yup
            .string()
            .required('O código postal é obrigatório'),
        number: yup
            .string()
            .required('O número é obrigatório'),
        district: yup
            .string()
            .required('A cidade é obrigatória'),
        country: yup
            .string()
            .required('O país é obrigatório'),
    });

    const handleFormSubmit = async (values) => {
        try {
            // Guarda ou envia os dados do formulário
            vendorRegistrationStore.updateCompany(values);
            console.log("Dados da empresa passados para a store:", values);

        } catch (error) {
            console.error("Erro ao submeter o formulário:", error);
        }
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            nif:  "",
            phone: "",
            email: "",
            street: "",
            number: "",
            postal_code: "",
            district: "",
            country: "",
        },
        validationSchema: validationSchema,
        validateOnMount: true,
        onSubmit: handleFormSubmit,
    });

    useImperativeHandle(refCompany, () => {
        console.log("useImperativeHandle foi chamado!"); // Para depuração
        return {
            validateForm: formik.validateForm,
            setTouched: formik.setTouched,
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
        <Paper
            sx={{
                mt: 4,
                width: "100%",
                m: "auto",
                position: "relative",
                pr: 5,
                pl: 5,
                pb: 5,
                pt: 3,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography sx={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                    Registo de Empresa
                </Typography>
                <IconButton onClick={onCloseCompanyForm} arial-label="close">
                    <CloseIcon />
                </IconButton>
            </Box>

            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={10}>
                    {/* Coluna Esquerda */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Nome da Empresa"
                            name="name"
                            fullWidth
                            type="text"
                            margin="normal"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name ? formik.errors.name : ""}
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            fullWidth
                            type="text"
                            margin="normal"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email ? formik.errors.email : ""}
                            required
                        />

                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Nrº de Telemóvel"
                                    name="phone"
                                    type="text"
                                    margin="normal"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone ? formik.errors.phone : ""}
                                    required
                                    sx={{ width: "80%" }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
                                <TextField
                                    label="NIF"
                                    name="nif"
                                    fullWidth
                                    type="text"
                                    margin="normal"
                                    value={formik.values.nif}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.nif && Boolean(formik.errors.nif)}
                                    helperText={formik.touched.nif ? formik.errors.nif : ""}
                                    required
                                    sx={{ width: "80%" }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Coluna Direita */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Morada"
                            name="street"
                            fullWidth
                            type="text"
                            margin="normal"
                            value={formik.values.street}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.street && Boolean(formik.errors.street)}
                            helperText={formik.touched.street ? formik.errors.street : ""}
                            required
                            disabled={isReadOnly}
                        />

                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Código Postal"
                                    name="postal_code"
                                    fullWidth
                                    type="text"
                                    margin="normal"
                                    value={formik.values.postal_code}
                                    onChange={handlePostalCodeChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.postal_code && Boolean(formik.errors.postal_code)}
                                    helperText={formik.touched.postal_code ? formik.errors.postal_code : ""}
                                    required
                                    sx={{ width: "80%" }}
                                />
                                <TextField
                                    label="Número"
                                    name="number"
                                    type="text"
                                    margin="normal"
                                    value={formik.values.number}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.number && Boolean(formik.errors.number)}
                                    helperText={formik.touched.number ? formik.errors.number : ""}
                                    required
                                    disabled={isReadOnly || loading}
                                    sx={{ width: "80%" }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
                                <TextField
                                    label="Cidade"
                                    name="district"
                                    type="text"
                                    margin="normal"
                                    value={formik.values.district}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.district && Boolean(formik.errors.district)}
                                    helperText={formik.touched.district ? formik.errors.district : ""}
                                    required
                                    disabled={isReadOnly || loading}
                                    sx={{ width: "80%" }}
                                />
                                <TextField
                                    label="País"
                                    name="country"
                                    type="text"
                                    margin="normal"
                                    value={formik.values.country}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.country && Boolean(formik.errors.country)}
                                    helperText={formik.touched.country ? formik.errors.country : ""}
                                    required
                                    disabled={isReadOnly || loading}
                                    sx={{ width: "80%" }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
});

export default FormCompanyRegistration;
