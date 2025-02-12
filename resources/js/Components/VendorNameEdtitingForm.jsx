import { observer } from "mobx-react";
import { Field, Form, Formik } from "formik";
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import * as React from "react";
import * as Yup from "yup";

const VendorNameEdtitingForm = observer(
    ({ handleNameSubmit, vendor, isSmallScreen }) => {
        const namevalidationSchema = Yup.object({
            first_name: Yup.string()
                .max(
                    100,
                    "O Primeiro nome não pode ter mais de 100 caracteres.",
                )
                .required("Primeiro nome é obrigatorio."),
            last_name: Yup.string()
                .max(100, "O ultimo nome não pode ter mais de 100 caracteres.")
                .required("Ultimo nome é obrigatorio."),
        });

        return (
            <Formik
                initialValues={{
                    first_name: vendor?.first_name || "",
                    last_name: vendor?.last_name || "",
                }}
                validationSchema={namevalidationSchema}
                onSubmit={handleNameSubmit}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Box
                        component={Form}
                        sx={{
                            ml: 2,
                            display: "flex",
                            flexDirection: isSmallScreen ? "column" : "row",
                            width: "380px",
                            gap: 2,
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}
                    >
                        {/* Campo Primeiro Nome */}
                        <Field
                            as={TextField}
                            name="first_name"
                            label="Primeiro Nome"
                            sx={{ width: "50%"}}
                            error={
                                touched.first_name && Boolean(errors.first_name)
                            }
                            helperText={touched.first_name && errors.first_name}
                        />

                        {/* Campo Último Nome */}
                        <Field
                            as={TextField}
                            name="last_name"
                            label="Último Nome"
                            sx={{ width: "50%"}}
                            error={
                                touched.last_name && Boolean(errors.last_name)
                            }
                            helperText={touched.last_name && errors.last_name}
                        />

                        {/* Botão Salvar */}
                        <Tooltip title="Salvar">
                            <IconButton
                                type="submit"
                                color="primary"
                                disabled={isSubmitting}
                                sx={{
                                    display: "flex",
                                    // ml: 1,
                                    maxWidth: "10%",
                                }}
                            >
                                <SaveIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            </Formik>
        );
    },
);

export default VendorNameEdtitingForm;
