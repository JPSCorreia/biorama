import {observer} from "mobx-react";
import {Field, Form, Formik} from "formik";
import {
    Box,
    Button,
    Container,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem, Select,
    TextField,
    Typography
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import * as React from "react";
import * as Yup from "yup";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Usando Day.js como adaptador de datas
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

const VendorInfoEditingForm = observer(({handleInfoSubmit, vendor, isSmallScreen, genders}) => {

    const infoValidationSchema = Yup.object({

        email: Yup.string()//Dado do vendor e Empresa
            .email("Insira um email valido")
            .required("O email é obrigatorio"),
        nif: Yup.string()
            .max(20, "Nif Pode ser mais que 20 caracteres.")
            .required("Nif é Obrigatorio"),
        phone: Yup.string()
            .min(9, "o numero não pode ser inferior a 9 caracteres.")
            .required("Numero é obrigatorio"),
        date_of_birth: Yup.date().nullable()
            .required("A data de nascimento é obrigatória"),
        iban: Yup.string()
            .required("iban é obrigatorio."),
        gender_id: Yup.number()
            .required("O gênero é obrigatório")
            .integer("Selecione um gênero válido"),
    });

    console.log("Genders disponíveis:", genders);
    console.log("Gênero atual do vendor:", vendor.gender_id);

    return (
        <Formik
            initialValues={{
                email: vendor.email || "",
                phone: vendor.phone || "",
                nif: vendor.nif || "",
                date_of_birth: vendor.date_of_birth || "",
                iban: vendor.iban || "",
                gender: vendor.gender.name || "",
            }}
            validationSchema={infoValidationSchema} // Defina o esquema Yup para validar os campos
            onSubmit={handleInfoSubmit} // Função para tratar a submissão
        >
            {({errors, touched, isSubmitting}) => (
                <Form>
                    <Container sx={{marginTop: "2%", marginLeft: "0%"}}>
                        <Typography
                            sx={{
                                marginBottom: 1,
                                fontSize: "2rem",
                                fontWeight: "bold",
                            }}
                        >
                            Editar Dados Pessoais
                        </Typography>
                        <Box sx={{marginBottom: "3%", p: 2}}>
                            {/* Linha 1 - Email & Telefone */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: isSmallScreen ? "column" : "row",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    mb: 3,
                                }}
                            >
                                <Box sx={{flex: "1 1 45%"}}>
                                    <Field
                                        as={TextField}
                                        name="email"
                                        label="Email"
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={touched.email && errors.email}
                                        fullWidth
                                    />
                                </Box>
                                <Box sx={{flex: "1 1 45%"}}>
                                    <Field
                                        as={TextField}
                                        name="phone"
                                        label="Telefone"
                                        error={touched.phone && Boolean(errors.phone)}
                                        helperText={touched.phone && errors.phone}
                                        fullWidth
                                    />
                                </Box>
                            </Box>

                            {/* Linha 2 - NIF & Data de Nascimento */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: isSmallScreen ? "column" : "row",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    mb: 3,
                                }}
                            >
                                <Box sx={{flex: "1 1 45%"}}>
                                    <Field
                                        as={TextField}
                                        name="nif"
                                        label="NIF"
                                        error={touched.nif && Boolean(errors.nif)}
                                        helperText={touched.nif && errors.nif}
                                        fullWidth
                                    />
                                </Box>
                                <Box sx={{flex: "1 1 45%"}}>
                                    <Field name="date_of_birth">
                                        {({ field, form }) => (
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                adapterLocale="pt-br" // Configura o calendário para português
                                            >
                                                <DatePicker
                                                    label="Data de Nascimento"
                                                    value={field.value ? dayjs(field.value, "YYYY/MM/DD") : null} // Formata para Day.js
                                                    onChange={(value) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            value ? value.format("YYYY/MM/DD") : "" // Formato "Ano/Mês/Dia"
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            error={
                                                                form.touched.date_of_birth &&
                                                                Boolean(form.errors.date_of_birth)
                                                            }
                                                            helperText={
                                                                form.touched.date_of_birth && form.errors.date_of_birth
                                                            }
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    </Field>
                                </Box>
                            </Box>

                            {/* Linha 3 - Iban & Gênero */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: isSmallScreen ? "column" : "row",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    mb: 3,
                                }}
                            >
                                <Box sx={{flex: "1 1 45%"}}>
                                    <Field
                                        as={TextField}
                                        name="iban"
                                        label="Iban"
                                        error={touched.iban && Boolean(errors.iban)}
                                        helperText={touched.iban && errors.iban}
                                        fullWidth
                                    />
                                </Box>
                                <Box sx={{ flex: "1 1 45%" }}>
                                    <Field name="gender_id">
                                        {({ field }) => (
                                            <Box>
                                                <label htmlFor="gender_id">Gênero</label>
                                                <select
                                                    id="gender_id"
                                                    {...field}
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px",
                                                        borderRadius: "4px",
                                                        border: "1px solid #ccc",
                                                    }}
                                                >
                                                    {/* Verifica se genders é um array válido */}
                                                    {Array.isArray(genders) && genders.length > 0 ? (
                                                        genders.map((gender) => (
                                                            <option key={gender.id} value={gender.id}>
                                                                {gender.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="" disabled>
                                                            Nenhuma opção disponível
                                                        </option>
                                                    )}
                                                </select>
                                                {touched.gender_id && errors.gender_id && (
                                                    <p style={{ color: "red", fontSize: "0.875rem" }}>
                                                        {errors.gender_id}
                                                    </p>
                                                )}
                                            </Box>
                                        )}
                                    </Field>
                                </Box>
                            </Box>
                            {/* Botão de guardar */}
                            <Box sx={{ textAlign: "right", mt: 2 }}>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    variant="outlined"
                                    sx={{

                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1, // Adiciona espaçamento entre o texto e o ícone
                                    }}
                                >
                                    <SaveIcon />
                                    {!isSmallScreen && "Guardar"} {/* Mostra o texto "Guardar" apenas em telas grandes */}
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </Form>
            )}
        </Formik>

    )
})

export default VendorInfoEditingForm;
