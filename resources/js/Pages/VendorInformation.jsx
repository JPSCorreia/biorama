import {
    Avatar,
    Button,
    Paper,
    Typography,
    Box,
    Divider,
    useTheme,
    useMediaQuery,
    Container,
    TextField,
    IconButton,
} from "@mui/material";
import { observer } from "mobx-react";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Edit as EditIcon, Save as SaveIcon } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { vendorStore } from "../Stores";

const VendorInformation = observer(() => {
    // Retrieve user data from Inertia props
    const { user } = usePage().props;

    // Load vendor data into the MobX store when component mounts or user changes
    useEffect(() => {
        if (user?.vendor) {
            vendorStore.setVendorData(user.vendor);
        }
    }, [user]);

    // Get the current vendor data from the MobX store
    const vendor = vendorStore.currentVendor;

    // Check if the authenticated user is associated with a company
    const isCompany = user.vendor.is_company;

    // State to control which fields are currently being edited
    const [isEditing, setIsEditing] = useState({
        vendorName: false,
        vendorPersonaAndVendorlInfo: false,
    });

    // Function to toggle the edit state for a specific field
    const handleEditToggle = (field) => {
        setIsEditing((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    // Validation schema for vendor's first and last name
    const namevalidationSchema = Yup.object({
        first_name: Yup.string()
            .max(100, "O Primeiro nome não pode ter mais de 100 caracteres.")
            .required("Primeiro nome é obrigatorio."),
        last_name: Yup.string()
            .max(100, "O ultimo nome não pode ter mais de 100 caracteres.")
            .required("Ultimo nome é obrigatorio."),
    });

    // Function to handle form submission for vendor's first and last name
    const handleNameSubmit = async (values, { setSubmitting }) => {
        try {
            // Update vendor's first and last name
            await vendorStore.updateVendorName(values);

            // Toggle the edit state
            handleEditToggle("vendorName");
        } catch (error) {
            console.error("Erro ao atualizar os nomes no Vendor info:", error);
        } finally {
            setSubmitting(false);
        }
    };

    //TODO: not being used?
    const personalvalidationSchema = Yup.object({
        email: Yup.string()
            .email("Insira um email valido")
            .required("O email é obrigatorio"),
        nif: Yup.string()
            .max(20, "Nif Pode ser mais que 20 caracteres.")
            .required("Nif é Obrigatorio"),
        phone: Yup.string()
            .min(9, "o numero não pode ser inferior a 9 caracteres.")
            .required("Numero é obrigatorio"),
        date_of_birth: Yup.date()
            .nullable()
            .required("A data de nascimento é obrigatória"),
        iban: Yup.string().required("iban é obrigatorio."),
        gender_id: Yup.number()
            .required("O género é obrigatório.")
            .integer("O ID deve ser um número inteiro."),
    });

    //TODO: not being used?
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
            .max(
                100,
                "O numero e o andar  não podem ter mais de 100 caracteres.",
            )
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
    });

    // Access theme properties using Material UI's theme hook
    const theme = useTheme();

    // Get media queries
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Faz a query para mobile

    return (
        <Paper
            elevation={4}
            sx={{
                p: 2,
                width: isSmallScreen ? "100%" : "80%",
                m: "auto",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                borderRadius: "10px",
            }}
        >
            <Box
                sx={{
                    margin: "2%",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        marginBottom: "2%",
                    }}
                >
                    {/* Vendor's Avatar displaying initials */}
                    <Avatar
                        alt="Profile Image"
                        variant={isSmallScreen ? "" : "rounded"}
                        sx={{
                            width: isSmallScreen ? 90 : 110,
                            height: isSmallScreen ? 90 : 110,
                            color: "background.secondary",
                            bgcolor: "primary.main",
                            borderRadius: isSmallScreen ? "50%" : "10px",
                            fontSize: isSmallScreen ? "1.5rem" : "3rem",
                        }}
                    >
                        {user.vendor.first_name[0]}
                        {user.vendor.last_name[0]}
                    </Avatar>

                    {/* Editable name section */}
                    {isEditing.vendorName ? (
                        <Formik
                            initialValues={{
                                first_name: vendor.first_name || "",
                                last_name: vendor.last_name || "",
                            }}
                            validationSchema={namevalidationSchema}
                            onSubmit={handleNameSubmit}
                        >
                            {({ errors, touched, isSubmitting }) => (
                                <Form>
                                    <Box
                                        sx={{
                                            ml: 2,
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        {/* First name input field */}
                                        <Box>
                                            <Field
                                                as={TextField}
                                                name="first_name"
                                                label="Primeiro Nome"
                                                error={
                                                    touched.first_name &&
                                                    Boolean(errors.first_name)
                                                }
                                                helperText={
                                                    touched.first_name &&
                                                    errors.first_name
                                                }
                                            />
                                        </Box>

                                        {/* Last name input field */}
                                        <Box sx={{ ml: 2 }}>
                                            <Field
                                                as={TextField}
                                                name="last_name"
                                                label="Último Nome"
                                                error={
                                                    touched.last_name &&
                                                    Boolean(errors.last_name)
                                                }
                                                helperText={
                                                    touched.last_name &&
                                                    errors.last_name
                                                }
                                            />
                                        </Box>

                                        {/* Save button */}
                                        <Box>
                                            <IconButton
                                                type="submit"
                                                disabled={isSubmitting}
                                                sx={{
                                                    display: "flex",
                                                    ml: 1,
                                                }}
                                            >
                                                <SaveIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    ) : (
                        <Box
                            sx={{
                                ml: 2,
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: "2.3rem",
                                    }}
                                >
                                    {vendor.first_name} {vendor.last_name}
                                </Typography>
                            </Box>
                            <Box>
                                <IconButton
                                    onClick={() =>
                                        handleEditToggle("vendorName")
                                    }
                                    sx={{ ml: 1 }}
                                >
                                    <EditIcon
                                        sx={{
                                            color: theme.palette.primary.main,
                                        }}
                                    />
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                </Box>

                <Divider />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            textAlign: !isCompany ? "left" : "start",
                            flexDirection: isSmallScreen ? "column" : "row",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        {/* Personal Information Section */}
                        <Container sx={{ marginTop: "2%", marginLeft: "0%" }}>
                            <Typography
                                sx={{
                                    marginBottom: 1,
                                    fontSize: "2rem",
                                    fontWeight: "bold",
                                }}
                            >
                                Dados Pessoais
                            </Typography>
                            <Box sx={{ marginBottom: "3%", p: 2 }}>
                                {/* Email & Telephone */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen
                                            ? "column"
                                            : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Email:
                                        </Typography>
                                        <Typography>
                                            {user.vendor.email}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Telefone:
                                        </Typography>
                                        <Typography>
                                            {user.vendor.phone ||
                                                "Não disponível"}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* NIF & Birthdate */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen
                                            ? "column"
                                            : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            NIF:
                                        </Typography>
                                        <Typography>
                                            {user.vendor.nif}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Data de Nascimento:
                                        </Typography>
                                        <Typography>
                                            {user.vendor.date_of_birth ||
                                                "Não disponível"}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Address & Postal Code */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen
                                            ? "column"
                                            : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Morada:
                                        </Typography>
                                        <Typography>Exemplo</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Cod. Postal & Cidade:
                                        </Typography>
                                        <Typography>2845-210 Seixal</Typography>
                                    </Box>
                                </Box>

                                {/* Gender */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen
                                            ? "column"
                                            : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Gênero:
                                        </Typography>
                                        <Typography>
                                            {user.vendor.gender?.name ||
                                                "Não disponível"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Container>
                        {isCompany && (
                            <Container sx={{ marginTop: "2%" }}>
                                <Typography
                                    sx={{
                                        marginBottom: 1,
                                        fontSize: "2rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Dados de Empresa
                                </Typography>
                                <Box sx={{ marginBottom: "3%", p: 2 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: isSmallScreen
                                                ? "column"
                                                : "row",
                                            flexWrap: "wrap",
                                            gap: 2,
                                            mb: 3,
                                        }}
                                    >
                                        <Box sx={{ flex: "1 1 45%" }}>
                                            <Typography fontWeight="bold">
                                                Nome da Empresa:
                                            </Typography>
                                            <Typography>
                                                {user.vendor?.company.name}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Email & Telephone */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: isSmallScreen
                                                ? "column"
                                                : "row",
                                            flexWrap: "wrap",
                                            gap: 2,
                                            mb: 3,
                                        }}
                                    >
                                        <Box sx={{ flex: "1 1 45%" }}>
                                            <Typography fontWeight="bold">
                                                Email:
                                            </Typography>
                                            <Typography>
                                                {
                                                    user.vendor.company.contacts
                                                        .email
                                                }
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: "1 1 45%" }}>
                                            <Typography fontWeight="bold">
                                                Telefone:
                                            </Typography>
                                            <Typography>
                                                {
                                                    user.vendor.company.contacts
                                                        .phone
                                                }
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* NIF & Sector */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: isSmallScreen
                                                ? "column"
                                                : "row",
                                            flexWrap: "wrap",
                                            gap: 2,
                                            mb: 3,
                                        }}
                                    >
                                        <Box sx={{ flex: "1 1 45%" }}>
                                            <Typography fontWeight="bold">
                                                NIF:
                                            </Typography>
                                            <Typography>
                                                {user.vendor.company.nif}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: "1 1 45%" }}>
                                            <Typography fontWeight="bold">
                                                Sector
                                            </Typography>
                                            <Typography>
                                                {user.vendor.company.sector}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Address & Postal Code */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: isSmallScreen
                                                ? "column"
                                                : "row",
                                            flexWrap: "wrap",
                                            gap: 2,
                                            mb: 3,
                                        }}
                                    >
                                        <Box sx={{ flex: "1 1 45%" }}>
                                            <Typography fontWeight="bold">
                                                Morada:
                                            </Typography>
                                            <Typography>
                                                {user.vendor.company.addresses
                                                    .street +
                                                    " " +
                                                    user.vendor.company
                                                        .addresses.number}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: "1 1 45%" }}>
                                            <Typography fontWeight="bold">
                                                Cod. Postal & Cidade:
                                            </Typography>
                                            <Typography>
                                                {user.vendor.company.addresses
                                                    .postal_code +
                                                    " " +
                                                    user.vendor.company
                                                        .addresses.district}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Container>
                        )}
                    </Box>
                </Box>
            </Box>
            {/* Edit Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    component="label"
                    variant="outlined"
                    sx={{
                        borderRadius: "5px",
                    }}
                >
                    <Typography sx={{ display: "flex", alignItems: "center" }}>
                        <EditIcon sx={{ marginRight: 1 }} />
                        Editar
                    </Typography>
                </Button>
            </Box>
        </Paper>
    );
});

export default VendorInformation;
