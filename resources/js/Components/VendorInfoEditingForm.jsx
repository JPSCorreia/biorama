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
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { observer } from "mobx-react";
import SaveIcon from "@mui/icons-material/Save";
import * as React from "react";

/**
 * Component: VendorInfoEditingForm
 * Description: Form for editing and submitting vendor's personal information.
 */
const VendorInfoEditingForm = observer(
    ({ handleInfoSubmit, vendor, genders, isSmallScreen }) => {
        const theme = useTheme();
        const smallerThanLarge = useMediaQuery(theme.breakpoints.down("lg"));

        /**
         * Validation schema using Yup
         * Defines required fields and validation rules for the form.
         */
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
            date_of_birth: Yup.date()
                .nullable()
                .required("A data de nascimento é obrigatória"),
            iban: Yup.string().required("O IBAN é obrigatório."),
            gender_id: Yup.number()
                .required("O sexo é obrigatório")
                .integer("Selecione um sexo válido"),
        });

        /**
         * Formik configuration
         * Initializes form values and handles form submission.
         */
        const formik = useFormik({
            initialValues: {
                email: vendor.email || "",
                phone: vendor.phone || "",
                nif: vendor.nif || "",
                date_of_birth: vendor.date_of_birth
                    ? dayjs(vendor.date_of_birth)
                    : null,
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
                handleInfoSubmit(formattedValues); // Trigger submit function
            },
        });

        return (
            <Box
                sx={{ mt: 2, width: smallerThanLarge ? "100%" : "40%", px: 4 }}
            >
                <form onSubmit={formik.handleSubmit}>
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Typography
                            variant={smallerThanLarge ? "h6" : "h5"}
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            Dados Pessoais
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
                            flexDirection: smallerThanLarge ? "row" : "column",
                            pt: 2,
                            gap: 2,
                            maxHeight: "440px",
                            overflowY: "auto",
                            mb: smallerThanLarge ? 2 : 0,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                width: "100%"
                            }}
                        >
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
                                label="NIF"
                                name="nif"
                                fullWidth
                                value={formik.values.nif}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.nif &&
                                    Boolean(formik.errors.nif)
                                }
                                helperText={
                                    formik.touched.nif && formik.errors.nif
                                }
                            />
                            <TextField
                                label="IBAN"
                                name="iban"
                                fullWidth
                                value={formik.values.iban}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.iban &&
                                    Boolean(formik.errors.iban)
                                }
                                helperText={
                                    formik.touched.iban && formik.errors.iban
                                }
                            />
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                width: "100%"
                            }}
                        >
                            <LocalizationProvider
                                dateAdapter={AdapterDayjs}
                                adapterLocale="pt-br"
                            >
                                <DatePicker
                                    label="Data de Nascimento"
                                    value={formik.values.date_of_birth}
                                    onChange={(value) =>
                                        formik.setFieldValue(
                                            "date_of_birth",
                                            value,
                                        )
                                    }
                                    textField={
                                        <TextField
                                            fullWidth
                                            error={
                                                formik.touched.date_of_birth &&
                                                Boolean(
                                                    formik.errors.date_of_birth,
                                                )
                                            }
                                            helperText={
                                                formik.touched.date_of_birth &&
                                                formik.errors.date_of_birth
                                            }
                                        />
                                    }
                                />
                            </LocalizationProvider>

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
                                select
                                label="Gênero"
                                name="gender_id"
                                fullWidth
                                value={formik.values.gender_id}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.gender_id &&
                                    Boolean(formik.errors.gender_id)
                                }
                                helperText={
                                    formik.touched.gender_id &&
                                    formik.errors.gender_id
                                }
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value="" disabled>
                                    Selecione sexo
                                </option>
                                {genders.map((gender) => (
                                    <option key={gender.id} value={gender.id}>
                                        {gender.name}
                                    </option>
                                ))}
                            </TextField>
                        </Box>
                    </Box>
                </form>
            </Box>
        );
    },
);

export default VendorInfoEditingForm;
