import React, { useState } from "react";
import {
    Box,
    Button,
    Modal,
    TextField,
    useMediaQuery,
    useTheme,
    Avatar,
    IconButton,
    Typography,
} from "@mui/material";
import {
    LocalizationProvider,
    DatePicker,
    MobileDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormik } from "formik";
import * as yup from "yup";
import { observer } from "mobx-react";
import { usePage } from "@inertiajs/react";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { authStore } from "../Stores/index.js";
import dayjs from "dayjs";
import { useEffect } from "react";
import ImageCropModal from "./ImageCropModal"; // Importa o modal de recorte

const ProfileEditModal = observer(({ open, handleClose }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const { genders } = usePage().props;

    // Estado para armazenar a URL da imagem carregada
    const [previewImageURL, setPreviewImageURL] = useState(
        authStore.user?.image_profile || "",
    );

    // Função para processar o upload da imagem diretamente
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const timestamp = dayjs().format("YYYYMMDD_HHmmss"); // Gera timestamp
            const fileExtension = file.name.split(".").pop(); // Obtém a extensão do ficheiro
            const newFileName = `profile_${timestamp}.${fileExtension}`; // Novo nome único
    
            const renamedFile = new File([file], newFileName, { type: file.type }); // Cria um novo ficheiro com o nome alterado
    
            const objectURL = URL.createObjectURL(renamedFile);
            setPreviewImageURL(objectURL); // Atualiza a pré-visualização
            formik.setFieldValue("image_profile", renamedFile); // Armazena o ficheiro no formik
        }
    };

    const validationSchema = yup.object().shape({
        first_name: yup.string().required("O nome é obrigatório"),
        last_name: yup.string().required("O apelido é obrigatório"),
        email: yup
            .string()
            .email("Email inválido")
            .required("O email é obrigatório"),
        phone: yup.string().required("O nrº de telemóvel é obrigatório"),
        nif: yup.string().required("O NIF é obrigatório"),
        gender_id: yup
            .number()
            .required("O género é obrigatório")
            .integer("O ID deve ser um número inteiro."),
        date_of_birth: yup
            .date()
            .nullable()
            .required("A data de nascimento é obrigatória"),
        image_profile: yup.mixed().required("A imagem de perfil é obrigatória"),
    });

    const submitForm = async () => {
        try {
            await formik.validateForm();
            if (!formik.isValid) {
                console.error("Erro na validação:", formik.errors);
                return;
            }

            // Criar FormData para envio ao backend
            const formData = new FormData();
            const values = formik.values;

            formData.append("first_name", values.first_name);
            formData.append("last_name", values.last_name);
            formData.append("email", values.email);
            formData.append("phone", values.phone);
            formData.append("nif", values.nif);
            formData.append("gender_id", values.gender_id);
            formData.append(
                "date_of_birth",
                values.date_of_birth
                    ? dayjs(values.date_of_birth).format("YYYY-MM-DD")
                    : null,
            );

            // Se houver imagem carregada, adicionar ao FormData
            if (values.image_profile instanceof File) {
                formData.append("image_profile", values.image_profile);
            }

            await authStore.submitDataUser(formData);

            formik.resetForm();
            setPreviewImageURL("");
            handleClose();
        } catch (error) {
            console.error("Erro ao submeter o formulário:", error);
        }
    };

    const formik = useFormik({
        initialValues: {
            first_name: authStore.user?.first_name || "",
            last_name: authStore.user?.last_name || "",
            email: authStore.user?.email || "",
            phone: authStore.user?.phone || "",
            nif: authStore.user?.nif || "",
            gender_id: authStore.user?.gender ? authStore.user?.gender.id : "",
            date_of_birth: authStore.user?.date_of_birth
                ? dayjs(authStore.user?.date_of_birth)
                : null,
            image_profile: authStore.user?.image_profile || "",
        },
        validationSchema: validationSchema,
        onSubmit: submitForm,
    });

    useEffect(() => {
        if (open) {
            setPreviewImageURL(authStore.user?.image_profile || "");
            formik.resetForm({
                values: {
                    first_name: authStore.user?.first_name || "",
                    last_name: authStore.user?.last_name || "",
                    email: authStore.user?.email || "",
                    phone: authStore.user?.phone || "",
                    nif: authStore.user?.nif || "",
                    gender_id: authStore.user?.gender ? authStore.user?.gender.id : "",
                    date_of_birth: authStore.user?.date_of_birth
                        ? dayjs(authStore.user?.date_of_birth)
                        : null,
                    image_profile: authStore.user?.image_profile || "",
                },
            });
        }
    }, [open]);

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: isSmallScreen ? "90%" : "550px",
                        alignItems: "flex-start",
                        padding: 2,
                        borderRadius: "8px",
                        backgroundColor: "background.paper",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            mb: 2,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                fontSize: "1.8rem",
                            }}
                        >
                            Editar Perfil
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 0,
                            mb: 2,
                        }}
                    >
                        <Avatar
                            alt="Profile Image"
                            src={
                                previewImageURL ||
                                (typeof formik.values.image_profile === "string"
                                    ? formik.values.image_profile
                                    : "")
                            }
                            sx={{
                                width: isSmallScreen ? 90 : 120,
                                height: isSmallScreen ? 90 : 120,
                                borderRadius: "8px",
                                border: `1px solid ${theme.palette.primary.main}`,
                            }}
                        >
                            {!previewImageURL &&
                                !formik.values.image_profile &&
                                `${authStore.user?.first_name?.[0] || ""}${authStore.user?.last_name?.[0] || ""}`}
                        </Avatar>

                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUploadIcon />}
                            sx={{ ml: 2 }}
                        >
                            Mudar Foto
                            <input
                                type="file"
                                hidden
                                onChange={handleImageUpload}
                                accept="image/*"
                            />
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                        }}
                    >
                        <form onSubmit={formik.handleSubmit}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen
                                            ? "column"
                                            : "row",
                                        justifyContent: "space-between",
                                        width: "100%",
                                    }}
                                >
                                    <TextField
                                        label="Nome"
                                        name="first_name"
                                        sx={{
                                            width: isSmallScreen
                                                ? "100%"
                                                : "250px",
                                        }}
                                        type="text"
                                        required
                                        margin="normal"
                                        value={formik.values.first_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.first_name &&
                                            Boolean(formik.errors.first_name)
                                        }
                                        helperText={
                                            formik.touched.first_name &&
                                            formik.errors.first_name
                                        }
                                    />
                                    <TextField
                                        label="Apelido"
                                        name="last_name"
                                        type="text"
                                        required
                                        sx={{
                                            width: isSmallScreen
                                                ? "100%"
                                                : "250px",
                                        }}
                                        margin="normal"
                                        value={formik.values.last_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.last_name &&
                                            Boolean(formik.errors.last_name)
                                        }
                                        helperText={
                                            formik.touched.last_name &&
                                            formik.errors.last_name
                                        }
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen
                                            ? "column"
                                            : "row",
                                        justifyContent: "space-between",
                                        width: "100%",
                                    }}
                                >
                                    <TextField
                                        label="NIF"
                                        name="nif"
                                        type="text"
                                        margin="normal"
                                        value={formik.values.nif}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.nif &&
                                            Boolean(formik.errors.nif)
                                        }
                                        helperText={
                                            formik.touched.last_name &&
                                            formik.errors.last_name
                                        }
                                        required
                                        sx={{
                                            width: isSmallScreen
                                                ? "100%"
                                                : "250px",
                                        }}
                                    />
                                    <TextField
                                        label="Nrº Telemóvel"
                                        name="phone"
                                        type="text"
                                        margin="normal"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        required
                                        error={
                                            formik.touched.phone &&
                                            Boolean(formik.errors.phone)
                                        }
                                        helperText={
                                            formik.touched.last_name &&
                                            formik.errors.last_name
                                        }
                                        sx={{
                                            width: isSmallScreen
                                                ? "100%"
                                                : "250px",
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen
                                            ? "column"
                                            : "row",
                                        width: "100%",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <TextField
                                        select
                                        label="Género"
                                        margin="normal"
                                        name="gender_id"
                                        required
                                        value={formik.values.gender_id || ""} // Garante que nunca é undefined
                                        onChange={formik.handleChange}
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
                                        sx={{
                                            width: isSmallScreen
                                                ? "100%"
                                                : "250px",
                                        }}
                                    >
                                        <option value="" disabled>
                                            Selecione um género
                                        </option>
                                        {genders.map((gender) => (
                                            <option
                                                key={gender.id}
                                                value={gender.id}
                                            >
                                                {gender.name}
                                            </option>
                                        ))}
                                    </TextField>
                                    <Box
                                        sx={{
                                            width: isSmallScreen
                                                ? "100%"
                                                : "250px",
                                            display: "flex",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                        >
                                            <MobileDatePicker
                                                sx={{
                                                    mt: 2,
                                                    display: isSmallScreen
                                                        ? "block"
                                                        : "none",
                                                    width: isSmallScreen
                                                        ? "100%"
                                                        : "250px",
                                                }}
                                                label="Data de Nascimento"
                                                required
                                                value={
                                                    formik.values.date_of_birth
                                                }
                                                onChange={(value) =>
                                                    formik.setFieldValue(
                                                        "date_of_birth",
                                                        value,
                                                    )
                                                } // Atualiza o valor manualmente
                                                onBlur={() =>
                                                    formik.setFieldTouched(
                                                        "date_of_birth",
                                                        true,
                                                    )
                                                } // Marca o campo como tocado
                                                textField={
                                                    <TextField
                                                        error={
                                                            formik.touched
                                                                .date_of_birth &&
                                                            Boolean(
                                                                formik.errors
                                                                    .date_of_birth,
                                                            )
                                                        }
                                                        helperText={
                                                            formik.touched
                                                                .last_name &&
                                                            formik.errors
                                                                .last_name
                                                        }
                                                    />
                                                }
                                            />
                                            <DatePicker
                                                sx={{
                                                    mt: 2,
                                                    display: isSmallScreen
                                                        ? "none"
                                                        : "block",
                                                    textAlign: "left",
                                                }}
                                                label="Data de Nascimento"
                                                required
                                                value={
                                                    formik.values.date_of_birth
                                                }
                                                onChange={(value) =>
                                                    formik.setFieldValue(
                                                        "date_of_birth",
                                                        value,
                                                    )
                                                } // Atualiza o valor manualmente
                                                onBlur={() =>
                                                    formik.setFieldTouched(
                                                        "date_of_birth",
                                                        true,
                                                    )
                                                } // Marca o campo como tocado
                                                textField={
                                                    <TextField
                                                        error={
                                                            formik.touched
                                                                .date_of_birth &&
                                                            Boolean(
                                                                formik.errors
                                                                    .date_of_birth,
                                                            )
                                                        }
                                                        helperText={
                                                            formik.touched
                                                                .last_name &&
                                                            formik.errors
                                                                .last_name
                                                        }
                                                    />
                                                }
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Box>
                            </Box>
                            <Box>
                                <TextField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    required
                                    fullWidth
                                    margin="normal"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.email &&
                                        Boolean(formik.errors.email)
                                    }
                                    helperText={
                                        formik.touched.last_name &&
                                        formik.errors.last_name
                                    }
                                />
                            </Box>
                            <Box
                                sx={{
                                    mt: 1,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={submitForm}
                                >
                                    Atualizar
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Modal>
        </>
    );
});

export default ProfileEditModal;
