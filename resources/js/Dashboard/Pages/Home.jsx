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
import {
    VendorCompanyEditingForm,
    VendorInfoEditingForm,
    VendorNameEditingForm,
} from "@/Dashboard/Components/";
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
    const smallerThanLarge = useMediaQuery(theme.breakpoints.down("lg"));
    const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));
    const smallerThanSmall = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                mt: 4,
                justifyContent: "center",
                alignItems: "center",
                height: smallerThanLarge ? "auto" : "810px",
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
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "8px",
                    flexGrow: 1,
                }}
            >
                {/* Vendor name and profile section */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                    }}
                >
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
                            sx={{
                                width: 90,
                                height: 90,
                                color: "background.secondary",
                                bgcolor: "primary.main",
                                borderRadius: "8px",
                                display: isSmallScreen ? "none" : "block",
                                border: `1px solid ${theme.palette.primary.main}`,
                            }}
                        >
                            {vendor.first_name[0]}
                            {vendor.last_name[0]}
                        </Avatar>

                        {/* Name editing section */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                minHeight: "56px",
                            }}
                        >
                            {isEditing.vendorName ? (
                                <VendorNameEdtitingForm
                                    handleNameSubmit={handleNameSubmit}
                                    vendor={vendor}
                                    isSmallScreen={isSmallScreen}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        ml: smallerThanSmall? 0 : 2,
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 2,
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    <Typography
                                        variant={smallerThanMedium ? "h5" : smallerThanLarge ? "h5" : "h4"}
                                        sx={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {vendor.first_name}
                                    </Typography>
                                    <Typography
                                        variant={smallerThanMedium ? "h5" : smallerThanLarge ? "h5" : "h4"}
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

                    <Divider sx={{ mb: 1 }} />

                    {/* Vendor personal and company information section */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: smallerThanLarge? "column" : "row",
                            justifyContent: "space-between",
                            width: "100%",
                            height: "100%",
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
                            <Box sx={{ mt: 2, px: 4, width: smallerThanLarge ? "100%" : "40%" }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        width: "100%",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Typography
                                    variant={smallerThanLarge? "h6" : "h5"}
                                        sx={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Dados Pessoais
                                    </Typography>
                                    <Tooltip title="Editar dados">
                                        <IconButton
                                            onClick={() =>
                                                handleEditToggle(
                                                    "vendorPersonalInfo",
                                                )
                                            }
                                            sx={{
                                                height: 40,
                                                width: 40,
                                            }}
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
                                {/* Display vendor personal details */}
                                <Box sx={{ mt: 2 }}>
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
                            </Box>
                        )}
                        <Divider orientation={smallerThanLarge? "horizontal" : "vertical"} sx={{ mt: 1 }} />
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
                                <Box
                                    sx={{
                                        marginTop: 2,
                                        pr: 4,
                                        pl: smallerThanMedium ? 2 : 6,
                                        width: smallerThanLarge ? "100%" : "60%",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            width: "100%",
                                            alignItems: "center",
                                            gap: 2,
                                        }}
                                    >
                                        <Typography
                                            variant={smallerThanMedium ? "h7" : smallerThanLarge ? "h6" : "h5"}
                                            sx={{
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Dados da Empresa
                                        </Typography>
                                        <Tooltip title="Editar dados">
                                        <IconButton
                                                    onClick={() =>
                                                        handleEditToggle(
                                                            "companyInfo",
                                                        )
                                                    }
                                            sx={{
                                                height: 40,
                                                width: 40,
                                            }}
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

                                    {/* Display company details like name, email, and address */}
                                    <Box sx={{ mt: 2 }}>
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
                                                    Nome:
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
                                                        vendor?.company.contacts
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
                                                        vendor?.company.contacts
                                                            .email
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
                                                        vendor?.company.contacts
                                                            .phone
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
                                                            .addresses?.street
                                                    }{" "}
                                                    {
                                                        vendor?.company
                                                            .addresses?.number
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
                                                            .addresses?.district
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
                                                    {vendor?.company.founded_at}
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
                                </Box>
                            ))}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
});

export default Home;
