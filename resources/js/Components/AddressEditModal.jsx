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
    IconButton,
    Input,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import axios from "axios";
import { homeAddressStore } from "@/Stores/index.js";
import { usePage } from "@inertiajs/react";
import { Formik, Form, Field, useFormik } from "formik";
import * as Yup from "yup";

const AddressEditModal = ({ open, handleClose, address }) => {
    const { auth } = usePage().props;
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        if (address) {
            formik.setValues({
                postal_code: address.postal_code || "",
                address_name: address.address_name || "",
                street_address: address.street_address || "",
                number: address.number || "",
                city: address.city || "",
                phone_number: address.phone_number || "",
                comment: address.comment || "",
                longitude: address.longitude || "",
                latitude: address.latitude || "",
                is_primary: address.is_primary || false,
            });
        }
    }, [address]);

    // Valores iniciais vindos da morada para edição
    const initialValues = {
        postal_code: address.postal_code || "",
        address_name: address.address_name || "",
        street_address: address.street_address || "",
        number: address.number || "",
        city: address.city || "",
        phone_number: address.phone_number || "",
        comment: address.comment || "",
        longitude: address.longitude || "",
        latitude: address.latitude || "",
        is_primary: address.is_primary || false,
    };

    // Função de submissão
    const handleFormSubmit = async (values, { resetForm }) => {
        try {
            if (
                values.postal_code !== address.postal_code &&
                homeAddressStore.addresses.find(
                    (existingAddress) =>
                        existingAddress.postal_code === values.postal_code,
                )
            ) {
                throw new Error("Já existe uma morada com este código postal.");
            }

            const response = await axios.post(`/editar-morada/${address.id}`, {
                ...values,
                user_id: auth.user.id,
            });

            if (response.status === 200) {
                homeAddressStore.updateAddress(address.id, response.data.data);
                resetForm();
                handleClose();
            }
        } catch (error) {
            console.error("Erro ao atualizar morada:", error.message);
        }
    };

    // Configuração do `useFormik`
    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object({
            postal_code: Yup.string()
                .matches(
                    /^\d{4}-\d{3}$/,
                    "Código Postal inválido (formato: 0000-000)",
                )
                .required("O Código Postal é obrigatório"),
            address_name: Yup.string()
                .max(20, "Defina um nome mais curto para a sua morada")
                .required("O Nome da morada é obrigatório"),
            street_address: Yup.string()
                .max(255, "Rua deve ter no máximo 255 caracteres")
                .required("A Rua é obrigatória"),
            city: Yup.string()
                .max(50, "Cidade deve ter no máximo 50 caracteres")
                .required("A Cidade é obrigatória"),
            number: Yup.string().required("O Número é obrigatório"),
            phone_number: Yup.string()
                .nullable()
                .matches(/^\d{9,15}$/, "Número de telefone inválido"),
            comment: Yup.string()
                .nullable()
                .max(40, "O Comentário deve ter no máximo 40 caracteres"),
            is_primary: Yup.boolean().required("O campo é obrigatório"),
        }),
        onSubmit: handleFormSubmit,
        context: {
            originalPostalCode: address.postal_code,
        },
    });

    // Função para mudança do código postal
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
                } else {
                    formik.setFieldError(
                        "postal_code",
                        "Código Postal não encontrado",
                    );
                }
            } catch {
                formik.setFieldError(
                    "postal_code",
                    "Erro ao validar o Código Postal",
                );
            }
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
                    padding: 2,
                    borderRadius: "8px",
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
                    <Typography
                        id="modal-title"
                        variant="h5"
                        component="h2"
                        sx={{ fontWeight: "bold" }}
                    >
                        Editar Morada
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
                        error={
                            formik.touched.address_name &&
                            Boolean(formik.errors.address_name)
                        }
                        helperText={
                            formik.touched.address_name &&
                            formik.errors.address_name
                        }
                        required
                    />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        <TextField
                            margin="normal"
                            label="Código Postal"
                            name="postal_code"
                            value={formik.values.postal_code}
                            onChange={handlePostalCodeChange}
                            error={
                                formik.touched.postal_code &&
                                Boolean(formik.errors.postal_code)
                            }
                            helperText={
                                formik.touched.postal_code &&
                                formik.errors.postal_code
                            }
                            required
                            sx={{ width: "40%" }}
                        />

                        <TextField
                            margin="normal"
                            label="Cidade"
                            name="city"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.city &&
                                Boolean(formik.errors.city)
                            }
                            helperText={
                                formik.touched.city && formik.errors.city
                            }
                            required
                            disabled={isDisabled}
                            sx={{ width: "40%" }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Número"
                            name="number"
                            value={formik.values.number}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.number &&
                                Boolean(formik.errors.number)
                            }
                            helperText={
                                formik.touched.number && formik.errors.number
                            }
                            required
                            disabled={isDisabled}
                            sx={{ width: "40%" }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Nrº Telemóvel"
                            name="phone_number"
                            value={formik.values.phone_number}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.phone_number &&
                                Boolean(formik.errors.phone_number)
                            }
                            helperText={
                                formik.touched.phone_number &&
                                formik.errors.phone_number
                            }
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
                        error={
                            formik.touched.street_address &&
                            Boolean(formik.errors.street_address)
                        }
                        helperText={
                            formik.touched.street_address &&
                            formik.errors.street_address
                        }
                        required
                        disabled={isDisabled}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            mt: 1,
                            mb: 2,
                        }}
                    >
                        <Input
                            aria-label="Demo input"
                            multiline
                            placeholder="Nota sobre a morada (opcional)"
                            name="comment"
                            value={formik.values.comment || ""}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.comment &&
                                Boolean(formik.errors.comment)
                            }
                            fullWidth
                        />
                        {/* Contador de caracteres */}
                        <Typography
                            variant="caption"
                            sx={{ alignSelf: "flex-end", mt: 1 }}
                        >
                            {formik.values.comment.length}/40
                        </Typography>
                        {formik.touched.comment && formik.errors.comment && (
                            <Typography variant="caption" color="error.main">
                                {formik.errors.comment}
                            </Typography>
                        )}
                    </Box>
                    <FormControlLabel
                        control={
                            <Switch
                                name="is_primary"
                                checked={!!formik.values.is_primary}
                                onChange={formik.handleChange}
                                disabled={
                                    !!(homeAddressStore.addresses.filter(
                                        (address) => address.is_primary,
                                    ).length === 1 && address.is_primary )
                                }
                            />
                        }
                        label="Morada Favorita?"
                    />
                    <Box sx={{ mt: 2, justifySelf: "flex-end" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={formik.isSubmitting}
                        >
                            Atualizar
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default AddressEditModal;
