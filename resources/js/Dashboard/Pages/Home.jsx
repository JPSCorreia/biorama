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
    IconButton,
    Tooltip,
} from "@mui/material";
import { observer } from "mobx-react";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { Edit as EditIcon } from "@mui/icons-material";
import VendorNameEdtitingForm from "@/Components/VendorNameEdtitingForm.jsx";
import {
    VendorCompanyEditingForm,
    VendorInfoEditingForm,
} from "@/Components/index.js";
import { vendorStore } from "../../Stores";
import { authStore } from "../../Stores";

const Home = observer(() => {
    // Access page props (genders, user authentication info)
    const { genders, auth } = usePage().props;

    // Initialize vendor data using mobx store
    vendorStore.setVendorData(auth.user.vendor);
    const vendor = vendorStore.currentVendor;

    const isCompany = vendor.is_company; // Check if the vendor represents a company

    // State to handle editing forms visibility
    const [isEditing, setIsEditing] = useState({
        vendorName: false,
        vendorPersonalInfo: false,
        companyInfo: false,
    });

    // Toggles editing form visibility
    const handleEditToggle = (field) => {
        setIsEditing((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    // Handles submission of vendor personal information updates
    const handleNameSubmit = async (values, { setSubmitting }) => {
        try {
            await vendorStore.updateVendorName(values);
            handleEditToggle("vendorName");
        } catch (error) {
            console.error("Erro ao atualizar os nomes ", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Handles submission of vendor company information updates
    const handleInfoSubmit = async (values) => {
        try {
            await vendorStore.updateVendorInfo(values);
            handleEditToggle("vendorPersonalInfo");
        } catch (error) {
            console.error("Erro ao atualizar informações do vendidor:", error);
        }
    };

    // Handles submission of vendor company information updates
    const handleCompanyInfoSubmit = async (values) => {
        try {
            await vendorStore.updateCompanyAndRelations(values);
            handleEditToggle("companyInfo");
        } catch (error) {
            console.error(
                "Erro ao atualizar informações do Empresa no Vendorinfo:",
                error,
            );
        }
    };

    // Responsive design breakpoints
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                mt: 4,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* Header Section */}
            <Paper
                elevation={4}
                sx={{
                    width: "96%",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    padding: 2,
                    borderRadius: "8px",
                }}
            >
                <Typography variant="h4" fontWeight="bold">
                    Informação Pessoal
                </Typography>
            </Paper>
            <Paper
                elevation={4}
                sx={{
                    p: 3,
                    my: 4,
                    width: "94%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "8px",
                }}
            >
                {/* Vendor name and profile section */}
                <Box sx={{}}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        {/* Avatar displaying initials */}
                        <Avatar
                            alt="Profile Image"
                            src={authStore.user?.image_profile}
                            variant={
                                isSmallScreen
                                    ? ""
                                    : isMediumScreen
                                      ? "circular"
                                      : "rounded"
                            }
                            sx={{
                                width: isSmallScreen
                                    ? 90
                                    : isMediumScreen
                                      ? 100
                                      : 110,
                                height: isSmallScreen
                                    ? 90
                                    : isMediumScreen
                                      ? 100
                                      : 110,
                                color: "background.secondary",
                                bgcolor: "primary.main",
                                borderRadius: isSmallScreen
                                    ? "50%"
                                    : isMediumScreen
                                      ? "20%"
                                      : "10px",
                                fontSize: isSmallScreen
                                    ? "1.5rem"
                                    : isMediumScreen
                                      ? "2rem"
                                      : "3rem",
                            }}
                        >
                            {vendor.first_name[0]}
                            {vendor.last_name[0]}
                        </Avatar>

                        {/* Name editing section */}
                        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                            {isEditing.vendorName ? (
                                <VendorNameEdtitingForm
                                    handleNameSubmit={handleNameSubmit}
                                    vendor={vendor}
                                    isSmallScreen={isSmallScreen}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        ml: 2,
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 2,
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {vendor.first_name}
                                    </Typography>
                                    <Typography
                                    variant="h4"
                                        sx={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {vendor.last_name}
                                    </Typography>
                                    <Tooltip title="Editar nome">
                                    <IconButton
                                        onClick={() =>
                                            handleEditToggle("vendorName")
                                        }
                                    >
                                        <EditIcon
                                            sx={{
                                                color: theme.palette.primary
                                                    .main,
                                            }}
                                        />
                                    </IconButton>
                                    </Tooltip>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <Divider />

                    {/* Vendor personal and company information section */}
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
                                flexDirection: isSmallScreen
                                    ? "column"
                                    : isMediumScreen
                                      ? "column"
                                      : "row",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            {/* Personal information section */}
                            {isEditing.vendorPersonalInfo ? (
                                //Vendor Editing component
                                <VendorInfoEditingForm
                                    handleInfoSubmit={handleInfoSubmit}
                                    vendor={vendor}
                                    isSmallScreen={isSmallScreen}
                                    genders={genders}
                                />
                            ) : (
                                <Container
                                    sx={{ marginTop: 2, marginLeft: "0%" }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            width: "100%",
                                            gap: isMediumScreen ? 5 : 10,
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                sx={{
                                                    marginBottom: 1,
                                                    fontSize: isSmallScreen
                                                        ? "1.5rem"
                                                        : isMediumScreen
                                                          ? "1.8rem"
                                                          : "2rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Dados Pessoais
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            {isSmallScreen || isMediumScreen ? (
                                                <IconButton
                                                    onClick={() =>
                                                        handleEditToggle(
                                                            "vendorPersonalInfo",
                                                        )
                                                    }
                                                >
                                                    <EditIcon
                                                        sx={{
                                                            color: theme.palette
                                                                .primary.main,
                                                        }}
                                                    />
                                                </IconButton>
                                            ) : (
                                                <Button
                                                    onClick={() =>
                                                        handleEditToggle(
                                                            "vendorPersonalInfo",
                                                        )
                                                    }
                                                    component="label"
                                                    variant="outlined"
                                                    sx={{ borderRadius: "5px" }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <EditIcon
                                                            sx={{
                                                                marginRight: 1,
                                                            }}
                                                        />
                                                        Editar
                                                    </Typography>
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                    {/* Display vendor personal details */}
                                    <Box sx={{ px: 2, pt: 2 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: isSmallScreen
                                                    ? "column"
                                                    : isMediumScreen
                                                      ? "row"
                                                      : "row",
                                                flexWrap: "wrap",
                                                gap: 2,
                                                mb: 3,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    flex: isMediumScreen
                                                        ? "1 1 48%"
                                                        : "1 1 45%",
                                                }}
                                            >
                                                <Typography fontWeight="bold">
                                                    Email:
                                                </Typography>
                                                <Typography>
                                                    {vendor.email}
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    flex: isMediumScreen
                                                        ? "1 1 48%"
                                                        : "1 1 45%",
                                                }}
                                            >
                                                <Typography fontWeight="bold">
                                                    Telefone:
                                                </Typography>
                                                <Typography>
                                                    {vendor.phone ||
                                                        "Não disponível"}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: isSmallScreen
                                                    ? "column"
                                                    : isMediumScreen
                                                      ? "row"
                                                      : "row",
                                                flexWrap: "wrap",
                                                gap: 2,
                                                mb: 3,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    flex: isMediumScreen
                                                        ? "1 1 48%"
                                                        : "1 1 45%",
                                                }}
                                            >
                                                <Typography fontWeight="bold">
                                                    NIF:
                                                </Typography>
                                                <Typography>
                                                    {vendor.nif}
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    flex: isMediumScreen
                                                        ? "1 1 48%"
                                                        : "1 1 45%",
                                                }}
                                            >
                                                <Typography fontWeight="bold">
                                                    Data de Nascimento:
                                                </Typography>
                                                <Typography>
                                                    {vendor.date_of_birth ||
                                                        "Não disponível"}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: isSmallScreen
                                                    ? "column"
                                                    : isMediumScreen
                                                      ? "row"
                                                      : "row",
                                                flexWrap: "wrap",
                                                gap: 2,
                                                mb: 3,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    flex: isMediumScreen
                                                        ? "1 1 48%"
                                                        : "1 1 45%",
                                                }}
                                            >
                                                <Typography fontWeight="bold">
                                                    Iban:
                                                </Typography>
                                                <Typography>
                                                    {vendor?.iban ||
                                                        "Não disponível"}
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    flex: isMediumScreen
                                                        ? "1 1 48%"
                                                        : "1 1 45%",
                                                }}
                                            >
                                                <Typography fontWeight="bold">
                                                    Gênero:
                                                </Typography>
                                                <Typography>
                                                    {vendor.gender.name ||
                                                        "Não disponível"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Container>
                            )}

                            {/* Company information section */}
                            {isCompany &&
                                (isEditing.companyInfo ? (
                                    //Company Editing component
                                    <VendorCompanyEditingForm
                                        vendor={vendor}
                                        handleCompanyInfoSubmit={
                                            handleCompanyInfoSubmit
                                        }
                                    />
                                ) : (
                                    <Container
                                        sx={{
                                            marginTop: 2,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                width: "100%",
                                                gap: isMediumScreen ? 5 : 10,
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        marginBottom: 1,
                                                        fontSize: isSmallScreen
                                                            ? "1.5rem"
                                                            : isMediumScreen
                                                              ? "1.8rem"
                                                              : "2rem",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Dados de Empresa
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {isSmallScreen ||
                                                isMediumScreen ? (
                                                    <IconButton
                                                        onClick={() =>
                                                            handleEditToggle(
                                                                "companyInfo",
                                                            )
                                                        }
                                                    >
                                                        <EditIcon
                                                            sx={{
                                                                color: theme
                                                                    .palette
                                                                    .primary
                                                                    .main,
                                                            }}
                                                        />
                                                    </IconButton>
                                                ) : (
                                                    <Button
                                                        onClick={() =>
                                                            handleEditToggle(
                                                                "companyInfo",
                                                            )
                                                        }
                                                        component="label"
                                                        variant="outlined"
                                                        sx={{
                                                            borderRadius: "5px",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                            }}
                                                        >
                                                            <EditIcon
                                                                sx={{
                                                                    marginRight: 1,
                                                                }}
                                                            />
                                                            Editar
                                                        </Typography>
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>

                                        {/* Display company details like name, email, and address */}
                                        <Box sx={{ px: 2, pt: 2 }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: isSmallScreen
                                                        ? "column"
                                                        : isMediumScreen
                                                          ? "row"
                                                          : "row",
                                                    flexWrap: "wrap",
                                                    gap: 2,
                                                    mb: 3,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        flex: isMediumScreen
                                                            ? "1 1 48%"
                                                            : "1 1 45%",
                                                    }}
                                                >
                                                    <Typography fontWeight="bold">
                                                        Nome da Empresa:
                                                    </Typography>
                                                    <Typography>
                                                        {vendor?.company.name}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        flex: isMediumScreen
                                                            ? "1 1 48%"
                                                            : "1 1 45%",
                                                    }}
                                                >
                                                    <Typography fontWeight="bold">
                                                        Site:
                                                    </Typography>
                                                    <Typography>
                                                        {
                                                            vendor?.company
                                                                .contacts
                                                                .website
                                                        }
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: isSmallScreen
                                                        ? "column"
                                                        : isMediumScreen
                                                          ? "row"
                                                          : "row",
                                                    flexWrap: "wrap",
                                                    gap: 2,
                                                    mb: 3,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        flex: isMediumScreen
                                                            ? "1 1 48%"
                                                            : "1 1 45%",
                                                    }}
                                                >
                                                    <Typography fontWeight="bold">
                                                        Email:
                                                    </Typography>
                                                    <Typography>
                                                        {
                                                            vendor?.company
                                                                .contacts.email
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        flex: isMediumScreen
                                                            ? "1 1 48%"
                                                            : "1 1 45%",
                                                    }}
                                                >
                                                    <Typography fontWeight="bold">
                                                        Telefone:
                                                    </Typography>
                                                    <Typography>
                                                        {
                                                            vendor?.company
                                                                .contacts.phone
                                                        }
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: isSmallScreen
                                                        ? "column"
                                                        : isMediumScreen
                                                          ? "row"
                                                          : "row",
                                                    flexWrap: "wrap",
                                                    gap: 2,
                                                    mb: 3,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        flex: isMediumScreen
                                                            ? "1 1 48%"
                                                            : "1 1 45%",
                                                    }}
                                                >
                                                    <Typography fontWeight="bold">
                                                        NIF:
                                                    </Typography>
                                                    <Typography>
                                                        {vendor?.company.nif}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        flex: isMediumScreen
                                                            ? "1 1 48%"
                                                            : "1 1 45%",
                                                    }}
                                                >
                                                    <Typography fontWeight="bold">
                                                        Setor:
                                                    </Typography>
                                                    <Typography>
                                                        {vendor?.company.sector}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: isSmallScreen
                                                        ? "column"
                                                        : isMediumScreen
                                                          ? "row"
                                                          : "row",
                                                    flexWrap: "wrap",
                                                    gap: 2,
                                                    mb: 3,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        flex: isMediumScreen
                                                            ? "1 1 48%"
                                                            : "1 1 45%",
                                                    }}
                                                >
                                                    <Typography fontWeight="bold">
                                                        Morada:
                                                    </Typography>
                                                    <Typography>
                                                        {
                                                            vendor?.company
                                                                .addresses
                                                                ?.street
                                                        }{" "}
                                                        {
                                                            vendor?.company
                                                                .addresses
                                                                ?.number
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        flex: isMediumScreen
                                                            ? "1 1 48%"
                                                            : "1 1 45%",
                                                    }}
                                                >
                                                    <Typography fontWeight="bold">
                                                        Cod. Postal & Cidade:
                                                    </Typography>
                                                    <Typography>
                                                        {
                                                            vendor?.company
                                                                .addresses
                                                                ?.postal_code
                                                        }{" "}
                                                        {
                                                            vendor?.company
                                                                .addresses
                                                                ?.district
                                                        }
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: isSmallScreen
                                                        ? "column"
                                                        : isMediumScreen
                                                          ? "row"
                                                          : "row",
                                                    flexWrap: "wrap",
                                                    gap: 2,
                                                    mb: 3,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        flex: isMediumScreen
                                                            ? "1 1 48%"
                                                            : "1 1 45%",
                                                    }}
                                                >
                                                    <Typography fontWeight="bold">
                                                        Data de Fundação:
                                                    </Typography>
                                                    <Typography>
                                                        {
                                                            vendor?.company
                                                                .founded_at
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        flex: isMediumScreen
                                                            ? "1 1 48%"
                                                            : "1 1 45%",
                                                    }}
                                                >
                                                    <Typography fontWeight="bold">
                                                        Descrição da Empresa:
                                                    </Typography>
                                                    <Typography>
                                                        {
                                                            vendor?.company
                                                                .description
                                                        }
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Container>
                                ))}
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
});

export default Home;
