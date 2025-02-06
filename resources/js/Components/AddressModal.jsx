import {
    Box,
    Button,
    FormControlLabel,
    Modal,
    Switch,
    TextField,
    Typography,
    useTheme,
    useMediaQuery,
    IconButton, Input
} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import axios from "axios";
import {homeAddressStore, vendorRegistrationStore} from "@/Stores/index.js";
import { usePage } from "@inertiajs/react";
import {Formik, Form, Field, useFormik} from "formik";
import * as Yup from "yup";


const AddressModal = ({ open, handleClose }) => {
    const { auth } = usePage().props;
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [isDisabled, setisDisabled] = useState(true);

    const initialValues = {
        postal_code: "",
        address_name: "",
        street_address: "",
        city: "",
        phone_number: "",
        comment: "",
        number: "",
        is_primary: false,
        longitude: "",
        latitude: "",
    };

    const handleFormSubmit = async (values, { resetForm }) => {
        try {
            const response = await axios.post("/adicionar-morada", {
                ...values,
                user_id: auth.user.id,
            });

            if (response.status === 201) {
                homeAddressStore.addAddress(response.data.data);
                setisDisabled(true);
                resetForm();
                handleClose();
            }
        } catch (error) {
            console.error("Erro ao criar morada:", error);
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object({
            postal_code: Yup.string()
                .test(
                    "check-duplicate-address",
                    "Já existe uma morada com este Código Postal e Número",
                    function (value) {
                        const { number } = this.parent; // Acessa o campo número
                        if (!value || !number) return true; // Ignora se um dos campos estiver vazio
                        // Verifica duplicação usando a store
                        return !homeAddressStore.checkDuplicatePostalCode(value, number, this.options.context?.excludeId);
                    }
                ),
            address_name: Yup.string()
                .max(20, "Defina um nome mais curto para a sua morada")
                .required("O Nome da morada é obrigatório"),
            street_address: Yup.string()
                .max(255, "Rua deve ter no máximo 255 caracteres")
                .required("A Rua é obrigatória"),
            city: Yup.string()
                .max(50, "Cidade deve ter no máximo 50 caracteres")
                .required("A Cidade é obrigatória"),
            phone_number: Yup.string()
                .nullable()
                .matches(/^\d{9,15}$/, "Número de telefone inválido"),
            comment: Yup.string().nullable(),
            number: Yup.string().required("O Número é obrigatório"),
            is_primary: Yup.boolean(),
        }),
        onSubmit: handleFormSubmit,
    });

    const handlePostalCodeChange = async (event) => {
        let value = event.target.value.replace(/\D/g, "");
        if (value.length > 4) {
            value = `${value.slice(0, 4)}-${value.slice(4, 7)}`;
        }
        formik.setFieldValue("postal_code", value);

        if (value.length === 8 && /^\d{4}-\d{3}$/.test(value)) {
            const [cp4, cp3] = value.split("-");
            try {
                const url = `${import.meta.env.VITE_CTT_API_URL}/${import.meta.env.VITE_CTT_API_KEY}/${cp4}-${cp3}`;
                const response = await axios.get(url);
                if (response.status === 200 && response.data.length > 0) {
                    const data = response.data[0];
                    formik.setFieldValue("street_address", data.morada || "");
                    formik.setFieldValue("city", data.distrito || "");
                    formik.setFieldValue("longitude", data.longitude || "");
                    formik.setFieldValue("latitude", data.latitude || "");
                    setisDisabled(false);
                } else {
                    formik.setFieldError("postal_code", "Código Postal não encontrado na API");
                    formik.setFieldValue("street_address", "");
                    formik.setFieldValue("city", "");
                    formik.setFieldValue("number", "");
                    formik.setFieldValue("longitude", "");
                    formik.setFieldValue("latitude", "");
                    setisDisabled(true);
                }
            } catch {
                formik.setFieldError("postal_code", "Erro ao validar o Código Postal");
                formik.setFieldValue("street_address", "");
                formik.setFieldValue("city", "");
                formik.setFieldValue("longitude", "");
                formik.setFieldValue("latitude", "");
                setisDisabled(true);
            }
        } else {
            formik.setFieldValue("street_address", "");
            formik.setFieldValue("city", "");
            formik.setFieldValue("number", "");
            formik.setFieldValue("longitude", "");
            formik.setFieldValue("latitude", "");
            setisDisabled(true);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: isSmallScreen ? "90%" : "400px",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: isSmallScreen ? "10px" : "20px",
                    borderRadius: "10px",
                    backgroundColor: "background.paper",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <Typography id="modal-title" variant="h5" component="h2" sx={{ fontWeight: "bold"}}>
                        Criar morada
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nome da Morada"
                        name="address_name"
                        value={formik.values.address_name}
                        onChange={formik.handleChange}
                        error={formik.touched.address_name && Boolean(formik.errors.address_name)}
                        helperText={formik.touched.address_name && formik.errors.address_name}
                        FormHelperTextProps={{
                            sx: {
                                minHeight: "20px", // Altura mínima
                                // background: "white", // Fundo branco
                                padding: "2px 4px", // Espaçamento interno (opcional)
                                borderRadius: "4px", // Bordas arredondadas (opcional)
                            },
                        }}
                        required
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <TextField
                            margin="normal"
                            label="Código Postal"
                            name="postal_code"
                            value={formik.values.postal_code}
                            onChange={handlePostalCodeChange}
                            error={formik.touched.postal_code && Boolean(formik.errors.postal_code)}
                            helperText={formik.touched.postal_code && formik.errors.postal_code}
                            FormHelperTextProps={{
                                sx: {
                                    minHeight: "20px", // Altura mínima
                                    // background: "white", // Fundo branco
                                    padding: "2px 4px", // Espaçamento interno (opcional)
                                    borderRadius: "4px", // Bordas arredondadas (opcional)
                                },
                            }}
                            required
                            sx={{
                                width: "40%",
                            }}
                        />
                        <TextField
                            margin="normal"
                            label="Cidade"
                            name="city"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            error={formik.touched.city && Boolean(formik.errors.city)}
                            helperText={formik.touched.city && formik.errors.city}
                            FormHelperTextProps={{
                                sx: {
                                    minHeight: "20px", // Altura mínima
                                    // background: "white", // Fundo branco
                                },
                            }}
                            required
                            disabled={isDisabled}
                            sx={{
                                width: "40%",
                                // backgroundColor: isDisabled ? "#d3d3d3" : "transparent",
                            }}
                        />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <TextField
                            margin="normal"
                            label="Número"
                            name="number"
                            value={formik.values.number}
                            onChange={formik.handleChange}
                            error={formik.touched.number && Boolean(formik.errors.number)}
                            helperText={formik.touched.number && formik.errors.number}
                            FormHelperTextProps={{
                                sx: {
                                    minHeight: "20px", // Altura mínima
                                    // background: "white", // Fundo branco
                                },
                            }}
                            required
                            disabled={isDisabled}
                            sx={{
                                width: "40%",
                                // backgroundColor: isDisabled ? "#d3d3d3" : "transparent",
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Nrº Telemóvel"
                            name="phone_number"
                            value={formik.values.phone_number}
                            onChange={formik.handleChange}
                            error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                            helperText={formik.touched.phone_number && formik.errors.phone_number}
                            FormHelperTextProps={{
                                sx: {
                                    minHeight: "20px", // Altura mínima
                                    // background: "white", // Fundo branco
                                },
                            }}
                            sx={{ width: "40%" }}
                        />
                    </Box>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Rua"
                        name="street_address"
                        value={formik.values.street_address}
                        onChange={formik.handleChange}
                        error={formik.touched.street_address && Boolean(formik.errors.street_address)}
                        helperText={formik.touched.street_address && formik.errors.street_address}
                        FormHelperTextProps={{
                            sx: {
                                minHeight: "20px", // Altura mínima
                                // background: "white", // Fundo branco
                            },
                        }}
                        required
                        disabled={isDisabled}
                        sx={{
                            // backgroundColor: isDisabled ? "#d3d3d3" : "transparent",
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                name="is_primary"
                                checked={formik.values.is_primary}
                                onChange={formik.handleChange}
                            />
                        }
                        label="Morada Favorita?"
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={formik.isSubmitting}
                        >
                            Criar morada
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};



export default AddressModal;
