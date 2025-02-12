import { observer } from "mobx-react";
import * as Yup from "yup";
import {
    Box,
    Button,
    Container,
    IconButton,
    TextField,
    Typography,
    Tooltip,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import * as React from "react";
import { Field, Form, Formik, useFormik } from "formik";
import SaveIcon from "@mui/icons-material/Save";

/**
 * Component: VendorCompanyEditingForm
 * Description: Form for editing Company information.
 */
const VendorCompanyEditingForm = observer(
    ({ vendor, handleCompanyInfoSubmit, isSmallScreen }) => {
        const theme = useTheme();
        const smallerThanLarge = useMediaQuery(theme.breakpoints.down("lg"));
        const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));
        const smallerThanSmall = useMediaQuery(theme.breakpoints.down("sm"));

        /**
         * Validation schema using Yup
         * Defines required fields and validation rules for the form.
         */
        const companyValidationSchema = Yup.object({
            name: Yup.string()
                .max(
                    100,
                    "O Primeiro nome não pode ter mais de 100 caracteres.",
                )
                .required("Primeiro nome é obrigatorio."),
            email: Yup.string()
                .email("Insira um email valido")
                .required("O email é obrigatorio"),
            website: Yup.string().required("O website é obrigatorio"),
            nif: Yup.string()
                .max(20, "Nif não pode ser mais que 20 caracteres.")
                .required("Nif é Obrigatorio"),
            phone: Yup.string()
                .min(9, "o numero não pode ser inferior a 9 caracteres.")
                .required("Numero é obrigatorio"),
            founded_at: Yup.date()
                .nullable()
                .required("A data de criação da Empresa é obrigatoria"),
            sector: Yup.string()
                .max(100, "O setornão pode ter mais de 100 caracteres.")
                .required("O sector nome é obrigatorio."),
            street: Yup.string()
                .max(100, "O nome da rua não pode ter mais de 100 caracteres.")
                .required("O nome da rua é obrigatorio."),
            number: Yup.string()
                .max(
                    100,
                    "O numero e o andar  não podem ter mais de 100 caracteres.",
                )
                .required("O numero e o andar obrigatorio."),
            postal_code: Yup.string()
                .max(
                    100,
                    "O codigo Postal não pode ter mais de 100 caracteres.",
                )
                .required("O codigo Postal é obrigatorio."),
            district: Yup.string()
                .max(100, "O distrito não pode ter mais de 100 caracteres.")
                .required("O distrito Postal é obrigatorio."),
            country: Yup.string()
                .max(100, "O Pais não pode ter mais de 100 caracteres.")
                .required("O Pais Postal é obrigatorio."),
            description: Yup.string()
                .min(25, "A discrição nao pode conter menos de 25 caracteres.")
                .max(1000, "A discrição não pode ter mais de 1000 caracteres"),
        });

        const formik = useFormik({
            initialValues: {
                name: vendor.company.name || "",
                email: vendor.company.contacts.email || "",
                website: vendor.company.contacts.website || "",
                nif: vendor.company.nif || "",
                phone: vendor.company.contacts.phone || "",
                founded_at: vendor.company.founded_at || "",
                sector: vendor.company.sector || "",
                street: vendor.company.addresses?.street || "",
                number: vendor.company.addresses?.number || "",
                postal_code: vendor.company.addresses?.postal_code || "",
                district: vendor.company.addresses?.district || "",
                country: vendor.company.addresses?.country || "",
                description: vendor.company.description || "",
            },
            validationSchema: companyValidationSchema,
            onSubmit: (values) => {
                handleCompanyInfoSubmit(values); // Trigger submit function
            },
        });

        return (
            <Box sx={{ mt: 2, pl: smallerThanMedium? 2 : 6, pr: 0, width: smallerThanLarge ? "100%" : "60%" }}>
                <form onSubmit={formik.handleSubmit}>
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            alignItems: "center",
                            gap: 2,
                            mr: 2,
                        }}
                    >
                        <Typography
                            variant={smallerThanMedium ? "h7" : smallerThanLarge ? "h6" : "h5"}
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            Dados da Empresa
                        </Typography>
                        <Tooltip title="Guardar dados">
                            <IconButton
                                type="submit"
                                sx={{
                                    height: 40,
                                    width: 40,
                                }}
                            >
                                <SaveIcon
                                    sx={{
                                        color: theme.palette.primary.main,
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            // mt: 2,
                            pt: 2,
                            gap: 2,
                            pr: 4,
                            maxHeight: smallerThanSmall? "696px" : smallerThanMedium? "620px" : smallerThanLarge? "400px" : "432px",
                            overflowY: "auto",
                        }}
                    >
                        <TextField
                            label="Nome"
                            name="name"
                            fullWidth
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.name &&
                                Boolean(formik.errors.name)
                            }
                            helperText={
                                formik.touched.name && formik.errors.name
                            }
                        />

                        <TextField
                            label="Email"
                            name="email"
                            fullWidth
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.email &&
                                Boolean(formik.errors.email)
                            }
                            helperText={
                                formik.touched.email && formik.errors.email
                            }
                        />

                        <TextField
                            label="Website"
                            name="website"
                            fullWidth
                            value={formik.values.website}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.website &&
                                Boolean(formik.errors.website)
                            }
                            helperText={
                                formik.touched.website && formik.errors.website
                            }
                        />

                        <TextField
                            label="NIF"
                            name="nif"
                            fullWidth
                            value={formik.values.nif}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.nif && Boolean(formik.errors.nif)
                            }
                            helperText={formik.touched.nif && formik.errors.nif}
                        />

                        <TextField
                            label="Telefone"
                            name="phone"
                            fullWidth
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.phone &&
                                Boolean(formik.errors.phone)
                            }
                            helperText={
                                formik.touched.phone && formik.errors.phone
                            }
                        />

                        <TextField
                            label="Data de Fundação"
                            name="founded_at"
                            type="date"
                            fullWidth
                            value={formik.values.founded_at}
                            // InputLabelProps={{ shrink: true }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.founded_at &&
                                Boolean(formik.errors.founded_at)
                            }
                            helperText={
                                formik.touched.founded_at &&
                                formik.errors.founded_at
                            }
                        />

                        <TextField
                            label="Setor"
                            name="sector"
                            fullWidth
                            value={formik.values.sector}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.sector &&
                                Boolean(formik.errors.sector)
                            }
                            helperText={
                                formik.touched.sector && formik.errors.sector
                            }
                        />

                        <TextField
                            label="Rua"
                            name="street"
                            fullWidth
                            value={formik.values.street}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.street &&
                                Boolean(formik.errors.street)
                            }
                            helperText={
                                formik.touched.street && formik.errors.street
                            }
                        />

                        <TextField
                            label="Número/Andar"
                            name="number"
                            fullWidth
                            value={formik.values.number}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.number &&
                                Boolean(formik.errors.number)
                            }
                            helperText={
                                formik.touched.number && formik.errors.number
                            }
                        />

                        <TextField
                            label="Código Postal"
                            name="postal_code"
                            fullWidth
                            value={formik.values.postal_code}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.postal_code &&
                                Boolean(formik.errors.postal_code)
                            }
                            helperText={
                                formik.touched.postal_code &&
                                formik.errors.postal_code
                            }
                        />

                        <TextField
                            label="Distrito"
                            name="district"
                            fullWidth
                            value={formik.values.district}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.district &&
                                Boolean(formik.errors.district)
                            }
                            helperText={
                                formik.touched.district &&
                                formik.errors.district
                            }
                        />

                        <TextField
                            label="País"
                            name="country"
                            fullWidth
                            value={formik.values.country}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.country &&
                                Boolean(formik.errors.country)
                            }
                            helperText={
                                formik.touched.country && formik.errors.country
                            }
                        />
                        <TextField
                            label="Descrição"
                            name="description"
                            fullWidth
                            multiline // Permite que o campo se torne uma textarea
                            rows={4} // Define o número de linhas visíveis
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.description &&
                                Boolean(formik.errors.description)
                            }
                            helperText={
                                formik.touched.description &&
                                formik.errors.description
                            }
                        />
                    </Box>
                </form>
            </Box>
        );
    },
);

export default VendorCompanyEditingForm;
