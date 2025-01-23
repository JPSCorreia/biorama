import {observer} from "mobx-react";
import {Field, Form, Formik} from "formik";
import {Box, IconButton, TextField} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import * as React from "react";
import * as Yup from "yup";

const VendorNameEdtitingForm = observer(({handleNameSubmit, vendor}) => {

    const namevalidationSchema = Yup.object({

        first_name: Yup.string()
            .max(100, "O Primeiro nome não pode ter mais de 100 caracteres.")
            .required("Primeiro nome é obrigatorio."),
        last_name: Yup.string()
            .max(100, "O ultimo nome não pode ter mais de 100 caracteres.")
            .required("Ultimo nome é obrigatorio."),
    });

    return (

        <Formik
            initialValues={{
                first_name: vendor.first_name || "",
                last_name: vendor.last_name || "",
            }}
            validationSchema={namevalidationSchema}
            onSubmit={handleNameSubmit}
        >
            {({errors, touched, isSubmitting}) => (
                <Form>
                    <Box
                        sx={{
                            ml: 2,
                            display: "flex",
                            flexDirection: "row",
                        }}
                    >
                        {/* Campo Primeiro Nome */}
                        <Box>
                            <Field
                                as={TextField}
                                name="first_name"
                                label="Primeiro Nome"
                                error={touched.first_name && Boolean(errors.first_name)}
                                helperText={touched.first_name && errors.first_name}
                            />
                        </Box>

                        {/* Campo Último Nome */}
                        <Box sx={{ml: 2}}>
                            <Field
                                as={TextField}
                                name="last_name"
                                label="Último Nome"
                                error={touched.last_name && Boolean(errors.last_name)}
                                helperText={touched.last_name && errors.last_name}
                            />
                        </Box>

                        {/* Botão Salvar */}
                        <Box>
                            <IconButton
                                type="submit"
                                disabled={isSubmitting}
                                sx={{
                                    display: "flex",
                                    ml: 1,
                                }}
                            >
                                <SaveIcon/>
                            </IconButton>
                        </Box>
                    </Box>
                </Form>
            )}
        </Formik>
    )
})

export default VendorNameEdtitingForm;
