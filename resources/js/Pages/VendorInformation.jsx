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
} from "@mui/material";
import {observer} from "mobx-react";
import {usePage} from "@inertiajs/react";
import { useState} from "react";
import {Edit as EditIcon} from "@mui/icons-material";
import VendorNameEdtitingForm from "@/Components/VendorNameEdtitingForm.jsx";
import {VendorCompanyEditingForm, VendorInfoEditingForm} from "@/Components/index.js";
import {vendorStore} from "../Stores";

const VendorInformation = observer(() => {
    const {genders, auth} = usePage().props;

    // Load vendor data into the MobX store when component mounts or user changes
    vendorStore.setVendorData(auth.user.vendor);

    // Get the current vendor data from the MobX store
    const vendor = vendorStore.currentVendor;

    // Check if the authenticated user is associated with a company
    const isCompany = vendor.is_company;

    // State to control which fields are currently being edited
    const [isEditing, setIsEditing] = useState({
        vendorName: false,
        vendorPersonalInfo: false,
        companyInfo: false,
    });

    // Function to toggle the edit state for a specific field
    const handleEditToggle = (field) => {
        setIsEditing((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };


    // Function to handle form submission for vendor's first and last name
    const handleNameSubmit = async (values, {setSubmitting}) => {
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

    // Ação para submeter o formns das restantes informalçoes
    const handleInfoSubmit = async (values) => {
        try {
            // Atualiza os nomes do vendor
            await vendorStore.updateVendorInfo(values);
            // Alterna o estado de edição
            handleEditToggle("vendorPersonalInfo");
        } catch (error) {
            console.error("Erro ao atualizar informações do vendor no Vendor info:", error);
        }

    };

    const handleCompanyInfoSubmit = async (values) => {
        try {
            // Atualiza os nomes do vendor
            await vendorStore.updateCompanyAndRelations(values);
            // Alterna o estado de edição
            handleEditToggle("companyInfo");
        } catch (error) {
            console.error("Erro ao atualizar informações do Empresa no Vendorinfo:", error);
        }
    };


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
                        {vendor.first_name[0]}{vendor.last_name[0]}
                    </Avatar>

                    {/* Editable name section */}
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
                                    sx={{ml: 1}}
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

                <Divider/>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >

                    <Box sx={{
                        display: "flex",
                        textAlign: !isCompany ? "left" : "start",
                        flexDirection: isSmallScreen ? "column" : "row",
                        justifyContent: "space-between",
                        width: "100%"
                    }}>
                        {isEditing.vendorPersonalInfo ? (
                            <VendorInfoEditingForm
                                handleInfoSubmit={handleInfoSubmit}
                                vendor={vendor}
                                isSmallScreen={isSmallScreen}
                                genders={genders}
                            />

                        ) : (
                            <Container sx={{marginTop: "2%", marginLeft: "0%"}}>
                                <Box sx={{display: "flex", width: "100%", gap: 10}}>
                                    <Box>
                                        <Typography
                                            sx={{
                                                marginBottom: 1,
                                                fontSize: "2rem",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Dados Pessoais
                                        </Typography>
                                    </Box>
                                    <Box sx={{m: "auto 0 auto 0"}}>
                                        {isSmallScreen ? (
                                            // Apenas o ícone aparece em telas pequenas
                                            <IconButton onClick={() => handleEditToggle("vendorPersonalInfo")}>
                                                <EditIcon sx={{
                                                    color: theme.palette.primary.main,
                                                }}/>
                                            </IconButton>
                                        ) : (
                                            <Button
                                                onClick={() => handleEditToggle("vendorPersonalInfo")}
                                                component="label"
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: "5px",
                                                }}
                                            >
                                                <Typography sx={{display: "flex", alignItems: "center"}}>
                                                    <EditIcon sx={{marginRight: 1}}/>
                                                    Editar
                                                </Typography>
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                                <Box sx={{marginBottom: "3%", p: 2}}>
                                    {/* Linha 1 - Email & Telefone */}
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen ? "column" : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3
                                    }}>
                                        <Box sx={{flex: "1 1 45%"}}>
                                            <Typography fontWeight="bold">Email:</Typography>
                                            <Typography>{vendor.email}</Typography>
                                        </Box>
                                        <Box sx={{flex: "1 1 45%"}}>
                                            <Typography fontWeight="bold">Telefone:</Typography>
                                            <Typography>{vendor.phone || "Não disponível"}</Typography>
                                        </Box>
                                    </Box>

                                    {/* Linha 2 - NIF & Data de Nascimento */}
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen ? "column" : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3
                                    }}>
                                        <Box sx={{flex: "1 1 45%"}}>
                                            <Typography fontWeight="bold">NIF:</Typography>
                                            <Typography>{vendor.nif}</Typography>
                                        </Box>
                                        <Box sx={{flex: "1 1 45%"}}>
                                            <Typography fontWeight="bold">Data de Nascimento:</Typography>
                                            <Typography>{vendor.date_of_birth || "Não disponível"}</Typography>
                                        </Box>
                                    </Box>

                                    {/* Linha 3 - Morada & Código Postal */}
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen ? "column" : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3
                                    }}>
                                        <Box sx={{flex: "1 1 45%"}}>
                                            <Typography fontWeight="bold">Iban:</Typography>
                                            <Typography>{vendor?.iban || "Não disponível"}</Typography>
                                        </Box>
                                        <Box sx={{flex: "1 1 45%"}}>
                                            <Typography fontWeight="bold">Gênero:</Typography>
                                            <Typography>{vendor.gender.name || "Não disponível"}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Container>
                        )}

                        {isCompany && (
                            isEditing.companyInfo ? (
                                <VendorCompanyEditingForm
                                    vendor={vendor}
                                    handleCompanyInfoSubmit={handleCompanyInfoSubmit}
                                />
                            ) : (
                                <Container sx={{marginTop: "2%"}}>
                                    <Box sx={{display: "flex", width: "100%", gap: 10}}>
                                        <Box>
                                            <Typography
                                                sx={{
                                                    marginBottom: 1,
                                                    fontSize: "2rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Dados de Empresa
                                            </Typography>
                                        </Box>
                                        <Box sx={{m: "auto 0 auto 0"}}>
                                            {isSmallScreen ? (
                                                // Apenas o ícone aparece em telas pequenas
                                                <IconButton onClick={() => handleEditToggle("companyInfo")}>
                                                    <EditIcon sx={{
                                                        color: theme.palette.primary.main,
                                                    }}/>
                                                </IconButton>
                                            ) : (
                                                <Button
                                                    onClick={() => handleEditToggle("companyInfo")}
                                                    component="label"
                                                    variant="outlined"
                                                    sx={{
                                                        borderRadius: "5px",
                                                    }}
                                                >
                                                    <Typography sx={{display: "flex", alignItems: "center"}}>
                                                        <EditIcon sx={{marginRight: 1}}/>
                                                        Editar
                                                    </Typography>
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>

                                    <Box sx={{marginBottom: "3%", p: 2}}>
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
                                            <Box sx={{flex: "1 1 45%"}}>
                                                <Typography fontWeight="bold">
                                                    Nome da Empresa:
                                                </Typography>
                                                <Typography>
                                                    {vendor?.company.name}
                                                </Typography>
                                            </Box>
                                            <Box sx={{flex: "1 1 45%"}}>
                                                <Typography fontWeight="bold">
                                                    Site:
                                                </Typography>
                                                <Typography>
                                                    {vendor?.company.contacts.website}
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
                                            <Box sx={{flex: "1 1 45%"}}>
                                                <Typography fontWeight="bold">
                                                    Email:
                                                </Typography>
                                                <Typography>
                                                    {
                                                        vendor.company.contacts
                                                            .email
                                                    }
                                                </Typography>
                                            </Box>
                                            <Box sx={{flex: "1 1 45%"}}>
                                                <Typography fontWeight="bold">
                                                    Telefone:
                                                </Typography>
                                                <Typography>
                                                    {
                                                        vendor.company.contacts
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
                                            <Box sx={{flex: "1 1 45%"}}>
                                                <Typography fontWeight="bold">
                                                    NIF:
                                                </Typography>
                                                <Typography>
                                                    {vendor.company.nif}
                                                </Typography>
                                            </Box>
                                            <Box sx={{flex: "1 1 45%"}}>
                                                <Typography fontWeight="bold">
                                                    Sector
                                                </Typography>
                                                <Typography>
                                                    {vendor.company.sector}
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
                                            <Box sx={{flex: "1 1 45%"}}>
                                                <Typography fontWeight="bold">
                                                    Morada:
                                                </Typography>
                                                <Typography>
                                                    {vendor.company.addresses
                                                            .street +
                                                        " " +
                                                        vendor.company
                                                            .addresses.number}
                                                </Typography>
                                            </Box>
                                            <Box sx={{flex: "1 1 45%"}}>
                                                <Typography fontWeight="bold">
                                                    Cod. Postal & Cidade:
                                                </Typography>
                                                <Typography>
                                                    {vendor.company.addresses
                                                            .postal_code +
                                                        " " +
                                                        vendor.company
                                                            .addresses.district}
                                                </Typography>
                                            </Box>
                                            <Box sx={{flex: "1 1 45%"}}>
                                                <Typography fontWeight="bold">
                                                    Data de Fundação da Empresa:
                                                </Typography>
                                                <Typography>
                                                    {vendor.company.founded_at}
                                                </Typography>
                                            </Box>
                                            <Box sx={{flex: "1 1 45%"}}>
                                                <Typography fontWeight="bold">
                                                    Discrição da Enpresa:
                                                </Typography>
                                                <Typography>
                                                    {vendor.company.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Container>
                            )
                        )}
                    </Box>
                </Box>
            </Box>

        </Paper>
    );
});

export default VendorInformation;
