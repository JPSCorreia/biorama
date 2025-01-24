import {observer} from "mobx-react";
import * as Yup from "yup";
import {Box, Button, Container, IconButton, TextField, Typography} from "@mui/material";
import * as React from "react";
import {Field, Form, Formik} from "formik";
import SaveIcon from "@mui/icons-material/Save";

const VendorCompanyEditingForm = observer(({vendor, handleCompanyInfoSubmit, isSmallScreen}) => {


    const companyvalidationSchema = Yup.object({
        name: Yup.string()
            .max(100, "O Primeiro nome não pode ter mais de 100 caracteres.")
            .required("Primeiro nome é obrigatorio."),
        email: Yup.string()
            .email("Insira um email valido")
            .required("O email é obrigatorio"),
        website: Yup.string().required("O website é obrigatorio"),
        nif: Yup.string()
            .max(20, "Nif Pode ser mais que 20 caracteres.")
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
            .max(100, "O nome da ruanão pode ter mais de 100 caracteres.")
            .required("O nome da rua é obrigatorio."),
        number: Yup.string()
            .max(100, "O numero e o andar  não podem ter mais de 100 caracteres.")
            .required("O numero e o andar obrigatorio."),
        postal_code: Yup.string()
            .max(100, "O codigo Postal não pode ter mais de 100 caracteres.")
            .required("O codigo Postal é obrigatorio."),
        district: Yup.string()
            .max(100, "O distrito não pode ter mais de 100 caracteres.")
            .required("O distrito Postal é obrigatorio."),
        country: Yup.string()
            .max(100, "O Pais não pode ter mais de 100 caracteres.")
            .required("O Pais Postal é obrigatorio."),
        description:Yup.string()
            .min(25, "A discrição nao pode conter menos de 25 caracteres.")
            .max(1000, "A discrição não pode ter mais de 1000 caracteres"),
    });


    return (
        <Container sx={{ marginTop: "2%" }}>
            <Typography
                sx={{
                    marginBottom: 2,
                    fontSize: "2rem",
                    fontWeight: "bold",
                }}
            >
                Editar Dados da Empresa
            </Typography>

            <Formik
                initialValues={{
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
                    description:vendor.company.description || "",
                }}
                validationSchema={companyvalidationSchema}
                onSubmit={handleCompanyInfoSubmit}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <Field
                                as={TextField}
                                label="Nome da Empresa"
                                name="name"
                                fullWidth
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                            />

                            <Field
                                as={TextField}
                                label="Email"
                                name="email"
                                fullWidth
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                            />

                            <Field
                                as={TextField}
                                label="Website"
                                name="website"
                                fullWidth
                                error={touched.website && Boolean(errors.website)}
                                helperText={touched.website && errors.website}
                            />

                            <Field
                                as={TextField}
                                label="NIF"
                                name="nif"
                                fullWidth
                                error={touched.nif && Boolean(errors.nif)}
                                helperText={touched.nif && errors.nif}
                            />

                            <Field
                                as={TextField}
                                label="Telefone"
                                name="phone"
                                fullWidth
                                error={touched.phone && Boolean(errors.phone)}
                                helperText={touched.phone && errors.phone}
                            />

                            <Field
                                as={TextField}
                                label="Data de Fundação"
                                name="founded_at"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={touched.founded_at && Boolean(errors.founded_at)}
                                helperText={touched.founded_at && errors.founded_at}
                            />

                            <Field
                                as={TextField}
                                label="Setor"
                                name="sector"
                                fullWidth
                                error={touched.sector && Boolean(errors.sector)}
                                helperText={touched.sector && errors.sector}
                            />

                            <Field
                                as={TextField}
                                label="Rua"
                                name="street"
                                fullWidth
                                error={touched.street && Boolean(errors.street)}
                                helperText={touched.street && errors.street}
                            />

                            <Field
                                as={TextField}
                                label="Número/Andar"
                                name="number"
                                fullWidth
                                error={touched.number && Boolean(errors.number)}
                                helperText={touched.number && errors.number}
                            />

                            <Field
                                as={TextField}
                                label="Código Postal"
                                name="postal_code"
                                fullWidth
                                error={touched.postal_code && Boolean(errors.postal_code)}
                                helperText={touched.postal_code && errors.postal_code}
                            />

                            <Field
                                as={TextField}
                                label="Distrito"
                                name="district"
                                fullWidth
                                error={touched.district && Boolean(errors.district)}
                                helperText={touched.district && errors.district}
                            />

                            <Field
                                as={TextField}
                                label="País"
                                name="country"
                                fullWidth
                                error={touched.country && Boolean(errors.country)}
                                helperText={touched.country && errors.country}
                            />
                            <Field
                                as={TextField}
                                label="Descrição"
                                name="description"
                                fullWidth
                                multiline // Permite que o campo se torne uma textarea
                                rows={4} // Define o número de linhas visíveis
                                error={touched.description && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                            />
                        </Box>

                        <Box sx={{ textAlign: "right", mt: 3 }}>
                            {isSmallScreen ?(
                                <IconButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    >
                                    <SaveIcon/>
                                </IconButton>
                            ) : (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                >
                                    Guardar
                                </Button>
                            )}
                        </Box>
                    </Form>
                )}
            </Formik>
        </Container>
    )
})

export default VendorCompanyEditingForm;
