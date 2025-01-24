import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {
    LocalizationProvider,
    DatePicker
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { observer } from "mobx-react";

const VendorInfoEditingForm = observer(({ handleInfoSubmit, vendor, genders }) => {
    const theme = useTheme();

    console.log("VendorInfoEditingForm", vendor.gender.id);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Insira um email válido")
            .required("O email é obrigatório"),
        phone: Yup.string()
            .min(9, "O número não pode ser inferior a 9 caracteres.")
            .required("O número é obrigatório"),
        nif: Yup.string()
            .max(20, "O NIF não pode ter mais de 20 caracteres.")
            .required("O NIF é obrigatório"),
        date_of_birth: Yup.date().nullable().required("A data de nascimento é obrigatória"),
        iban: Yup.string().required("O IBAN é obrigatório."),
        gender_id: Yup.number()
            .required("O gênero é obrigatório")
            .integer("Selecione um gênero válido"),
    });

    const formik = useFormik({
        initialValues: {
            email: vendor.email || "",
            phone: vendor.phone || "",
            nif: vendor.nif || "",
            date_of_birth: vendor.date_of_birth ? dayjs(vendor.date_of_birth) : null,
            iban: vendor.iban || "",
            gender_id: vendor.gender?.id || "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const formattedValues = {
                ...values,
                date_of_birth: values.date_of_birth
                    ? dayjs(values.date_of_birth).format("YYYY-MM-DD")
                    : null,
            };
            handleInfoSubmit(formattedValues);
        },
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
                Editar Dados Pessoais
            </Typography>

            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Email"
                        name="email"
                        fullWidth
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />

                    <TextField
                        label="Telefone"
                        name="phone"
                        fullWidth
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                    />

                    <TextField
                        label="NIF"
                        name="nif"
                        fullWidth
                        value={formik.values.nif}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.nif && Boolean(formik.errors.nif)}
                        helperText={formik.touched.nif && formik.errors.nif}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                        <DatePicker
                            label="Data de Nascimento"
                            value={formik.values.date_of_birth}
                            onChange={(value) => formik.setFieldValue("date_of_birth", value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    error={
                                        formik.touched.date_of_birth &&
                                        Boolean(formik.errors.date_of_birth)
                                    }
                                    helperText={
                                        formik.touched.date_of_birth &&
                                        formik.errors.date_of_birth
                                    }
                                />
                            )}
                        />
                    </LocalizationProvider>

                    <TextField
                        label="IBAN"
                        name="iban"
                        fullWidth
                        value={formik.values.iban}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.iban && Boolean(formik.errors.iban)}
                        helperText={formik.touched.iban && formik.errors.iban}
                    />

                    <TextField
                        select
                        label="Gênero"
                        name="gender_id"
                        fullWidth
                        value={formik.values.gender_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.gender_id && Boolean(formik.errors.gender_id)}
                        helperText={formik.touched.gender_id && formik.errors.gender_id}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="" disabled>
                            Selecione um gênero
                        </option>
                        {genders.map((gender) => (
                            <option key={gender.id} value={gender.id}>
                                {gender.name}
                            </option>
                        ))}
                    </TextField>
                </Box>

                <Box sx={{ textAlign: "right", mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Guardar
                    </Button>
                </Box>
            </form>
        </Container>
    );
});

export default VendorInfoEditingForm;
