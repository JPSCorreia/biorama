import {
    Avatar,
    Button,
    Paper,
    Typography,
    Box,
    Divider,
    useTheme,
    useMediaQuery,
    Container, TextField, IconButton,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {observer} from "mobx-react";
import {router, usePage} from "@inertiajs/react";
import * as React from "react";
import {useEffect, useState} from "react";
import SaveIcon from '@mui/icons-material/Save';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {vendorStore} from "@/Stores/index.js";
import VendorNameEdtitingForm from "@/Components/VendorNameEdtitingForm.jsx";
import {VendorInfoEditingForm} from "@/Components/index.js";



const VendorInformation = observer(() => {
    const{genders} = usePage().props;
    console.log("Gender", genders);
    const {user} = usePage().props; // Recebe o user como props
    useEffect(() => {
        if (user?.vendor) {
            vendorStore.setVendorData(user.vendor)
        }
    }, [user]);
    const vendor = vendorStore.currentVendor;
    console.log("VENDOR", vendor);

    const isCompany = user.vendor.is_company; // Verifica se o user authenticado tem Empresa ou não.

    const [isEditing, setIsEditing] = useState({
        //informacoes do vendor
        vendorName: false,
        vendorPersonalInfo:false,
        copanyInfo:false,
    });

    const handleEditToggle = (field) => {
        setIsEditing((prevState) => ({
            ...prevState,
            [field]: !prevState[field], // Alterna o estado para editar, apenas nos campos selecionados
        }));
    };


    // Ação para submeter o formns do nome
    const handleNameSubmit = async (values, { setSubmitting }) => {
        try {
            // Atualiza os nomes do vendor
            await vendorStore.updateVendorName(values);

            // Alterna o estado de edição
            handleEditToggle("vendorName");
            console.log("Passou o Front end:");
        } catch (error) {
            console.error("Erro ao atualizar os nomes no Vendor info:", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Ação para submeter o formns das restantes informalçoes
    const handleInfoSubmit = async (values, { setSubmitting }) => {
        console.log("Submissão iniciada com valores:", values);
        try {
            // Atualiza os nomes do vendor
            await vendorStore.updateVendorInfo(values);

            // Alterna o estado de edição
            handleEditToggle("vendorPersonalInfo");
            console.log("Passou o Front end:");
        } catch (error) {
            console.error("Erro ao atualizar informações do vendor no Vendor info:", error);
        } finally {
            setSubmitting(false);
        }
    };



    const companyvalidationSchema = Yup.object({

        //Dados do vendor
        name: Yup.string()
            .max(100,"O Primeiro nome não pode ter mais de 100 caracteres.")
            .required("Primeiro nome é obrigatorio."),
        email: Yup.string()
            .email("Insira um email valido")
            .required("O email é obrigatorio"),
        website: Yup.string()
            .required("O website é obrigatorio"),
        nif: Yup.string()
            .max(20, "Nif Pode ser mais que 20 caracteres.")
            .required("Nif é Obrigatorio"),
        phone: Yup.string()
            .min(9, "o numero não pode ser inferior a 9 caracteres.")
            .required("Numero é obrigatorio"),
        founded_at: Yup.date().nullable()
            .required("A data de criação da Empresa é obrigatoria"),
        sector:Yup.string()
            .max(100,"O setornão pode ter mais de 100 caracteres.")
            .required("O sector nome é obrigatorio."),
        street:Yup.string()
            .max(100,"O nome da ruanão pode ter mais de 100 caracteres.")
            .required("O nome da rua é obrigatorio."),
        number:Yup.string()
            .max(100,"O numero e o andar  não podem ter mais de 100 caracteres.")
            .required("O numero e o andar obrigatorio."),
        postal_code:Yup.string()
            .max(100,"O codigo Postal não pode ter mais de 100 caracteres.")
            .required("O codigo Postal é obrigatorio."),
        district:Yup.string()
            .max(100,"O distrito não pode ter mais de 100 caracteres.")
            .required("O distrito Postal é obrigatorio."),
        country:Yup.string()
            .max(100,"O Pais não pode ter mais de 100 caracteres.")
            .required("O Pais Postal é obrigatorio."),
    });



    const theme = useTheme();//Carrega o thema da pagina

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));// Faz a query para mobile

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
            <Box sx={{
                margin: "2%"
            }}
            >

                <Box
                    sx={{
                        display: "flex", // Alinha os itens horizontalmente
                        alignItems: "center", // Centraliza verticalmente o Avatar e o Nome
                        gap: 2, // Espaço entre o Avatar e o Nome
                        marginBottom: "2%"
                    }}
                >
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

                    {isEditing.vendorName ? (
                        <VendorNameEdtitingForm
                            handleNameSubmit= {handleNameSubmit}
                            vendor = {vendor}
                        />
                    ) : (
                        <Box sx={{
                            ml: 2,
                            display: "flex",
                            flexDirection: "row"

                        }}>
                            <Box>
                                <Typography sx={{fontWeight: "bold", fontSize: "2.3rem"}}>
                                    {vendor.first_name} {vendor.last_name}
                                </Typography>
                            </Box>
                            <Box>
                                <IconButton onClick={() => handleEditToggle("vendorName")} sx={{ml: 1,}}>
                                    <EditIcon sx={{
                                        color: theme.palette.primary.main
                                    }}/>
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                </Box>

                <Divider/>

                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between"
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
                            genders = {genders}
                        />

                        ) : (
                            <Container sx={{marginTop: "2%", marginLeft: "0%"}}>
                                <Typography sx={{
                                    marginBottom: 1,
                                    fontSize: "2rem",
                                    fontWeight: "bold"

                                }}> Dados Pessoais</Typography>
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
                                {/* Botão Editar */}
                                <Box sx={{display: "flex", justifyContent: "flex-end"}}>
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
                                </Box>
                            </Container>
                        )}

                        {isCompany && (
                            <Container sx={{marginTop: "2%"}}>
                                <Typography sx={{
                                    marginBottom: 1,
                                    fontSize: "2rem",
                                    fontWeight: "bold"

                                }}> Dados de Empresa</Typography>
                                <Box sx={{marginBottom: "3%", p: 2}}>

                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen ? "column" : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3
                                    }}>
                                        <Box sx={{flex: "1 1 45%"}}>
                                            <Typography fontWeight="bold">Nome da Empresa:</Typography>
                                            <Typography>{user.vendor?.company.name}</Typography>
                                        </Box>

                                    </Box>

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
                                            <Typography>{user.vendor.company.contacts.email}</Typography>
                                        </Box>
                                        <Box sx={{flex: "1 1 45%"}}>
                                            <Typography fontWeight="bold">Telefone:</Typography>
                                            <Typography>{user.vendor.company.contacts.phone}</Typography>
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
                                            <Typography>{user.vendor.company.nif}</Typography>
                                        </Box>
                                        <Box sx={{flex: "1 1 45%"}}>
                                            <Typography fontWeight="bold">Sector</Typography>
                                            <Typography>{user.vendor.company.sector}</Typography>
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
                                            <Typography fontWeight="bold">Morada:</Typography>
                                            <Typography>{user.vendor.company.addresses.street + " " + user.vendor.company.addresses.number}</Typography>
                                        </Box>
                                        <Box sx={{flex: "1 1 45%"}}>
                                            <Typography fontWeight="bold">Cod. Postal & Cidade:</Typography>
                                            <Typography>{user.vendor.company.addresses.postal_code + " " + user.vendor.company.addresses.district
                                            }</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Container>
                        )}
                    </Box>
                </Box>
            </Box>

        </Paper>
    )
})

export default VendorInformation;
