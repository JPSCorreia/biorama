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
import {useEffect, useState} from "react";
import axios from "axios";


dayjs.locale('pt'); // Define o locale globalmente

const FormCompanyRegistration = observer(({passFormik, onCloseCompanyForm}) => {
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
            nif: "",
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


    useEffect(() => {
        if (passFormik) {
            passFormik(formik); // Passa o formik ao componente pai
        }
        vendorRegistrationStore.setCompanyFormValid(formik.isValid); // Mantém o estado sincronizado
        console.log("useEffect do componente do form dados empresa");
    }, [formik.isValid, passFormik]); // Apenas dependências estáveis


    return (
        <Paper
            sx={{
                mt: 4,
                width: "100%",
                m: "auto",
                position: "relative",
                pr:5,
                pl:5,
                pb: 5,
                pt: 3,

            }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
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
                >
                    <IconButton onClick={onCloseCompanyForm}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>
            <form onSubmit={formik.handleSubmit}>
                <Grid
                    container
                    spacing={10}
                >
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Nome da Empresa"
                            name="name"
                            fullWidth
                            typre="text"
                            margin="normal"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={
                                <Box sx={{ minHeight: "20px" }}>
                                    {formik.touched.name && formik.errors.name}
                                </Box>
                            }
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            fullWidth
                            typre="text"
                            margin="normal"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={
                                <Box sx={{ minHeight: "20px" }}>
                                    {formik.touched.email && formik.errors.email}
                                </Box>
                            }
                            required
                        />
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Nrº de Telemóvel"
                                    name="phone"
                                    typre="text"
                                    margin="normal"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={
                                        <Box sx={{ minHeight: "20px" }}>
                                            {formik.touched.phone && formik.errors.phone}
                                        </Box>
                                    }
                                    required
                                    sx={{
                                        width: '80%',
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
                                <TextField
                                    label="NIF"
                                    name="nif"
                                    fullWidth
                                    typre="text"
                                    margin="normal"
                                    value={formik.values.nif}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.nif && Boolean(formik.errors.nif)}
                                    helperText={
                                        <Box sx={{ minHeight: "20px" }}>
                                            {formik.touched.nif && formik.errors.nif}
                                        </Box>
                                    }
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
                            typre="text"
                            margin="normal"
                            value={formik.values.street}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.street && Boolean(formik.errors.street)}
                            helperText={
                                <Box sx={{ minHeight: "20px" }}>
                                    {formik.touched.street && formik.errors.street}
                                </Box>
                            }
                            required
                            disabled={isReadOnly} // Desativa quando é apenas leitura ou está a carregar

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
                                    helperText={
                                        <Box sx={{ minHeight: "20px" }}>
                                            {formik.touched.postal_code && formik.errors.postal_code}
                                        </Box>
                                    }
                                    required
                                    sx={{
                                        width: '80%',
                                    }}
                                />
                                <TextField
                                    label="Número"
                                    name="number"
                                    typre="text"
                                    margin="normal"
                                    value={formik.values.number}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.number && Boolean(formik.errors.number)}
                                    helperText={
                                        <Box sx={{ minHeight: "20px" }}>
                                            {formik.touched.number && formik.errors.number}
                                        </Box>
                                    }
                                    required
                                    disabled={isReadOnly || loading} // Desativa quando é apenas leitura ou está a carregar

                                    sx={{
                                        width: '80%',
                                    }}
                                />
                            </Grid>
                            <Grid
                                item xs={12}
                                md={6}
                                sx={{ textAlign: 'right' }}
                            >
                                <TextField
                                    label="Cidade"
                                    name="district"
                                    typre="text"
                                    margin="normal"
                                    value={formik.values.district}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.district && Boolean(formik.errors.district)}
                                    helperText={
                                        <Box sx={{ minHeight: "20px" }}>
                                            {formik.touched.district && formik.errors.district}
                                        </Box>
                                    }
                                    required
                                    disabled={isReadOnly || loading} // Desativa quando é apenas leitura ou está a carregar

                                    sx={{
                                        width: '80%',
                                    }}
                                />
                                <TextField
                                    label="Pais"
                                    name="country"
                                    typre="text"
                                    margin="normal"
                                    value={formik.values.country}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.country && Boolean(formik.errors.country)}
                                    helperText={
                                        <Box sx={{ minHeight: "20px" }}>
                                            {formik.touched.country && formik.errors.country}
                                        </Box>
                                    }
                                    required
                                    disabled={isReadOnly || loading} // Desativa quando é apenas leitura ou está a carregar

                                    sx={{
                                        width: '80%',
                                    }}
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
