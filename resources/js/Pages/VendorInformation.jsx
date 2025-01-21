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
import {useState} from "react";
import SaveIcon from '@mui/icons-material/Save';


const VendorInformation = observer(() => {
    const {user} = usePage().props; // Recebe o user como props

    console.log("VENDOR", user);

    const isCompany = user.vendor.is_company; // Verifica se o user authenticado tem Empresa ou não.

    const [isEditing, setIsEditing] = useState({
        //informacoes do vendor
        vendorName: false,
        vendorEmail: false,
        vendorPhone: false,
        vendorNif: false,
        vendorDateBirth: false,
        vendorAddress: false,
        vendorPostalCodenCity: false,
        //informacoes da empresa
        companyName:false,
        companyEmail:false,
        companyPhone:false,
        companyNif:false,
        companySector:false,
        companyAddress:false,
        companyPostalCodenCity:false
    }); // Estado para alternar entre modo de editar e vista normal
    const handleEditToggle = (field) => {
        setIsEditing((prevState) => ({
            ...prevState,
            [field]: !prevState[field], // Alterna o estado para editar, apenas nos campos selecionados
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Formulário enviado!");
    };


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
                        {user.first_name[0]}{user.last_name[0]}
                    </Avatar>

                    {isEditing.vendorName ? (
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{
                                ml: 2,
                                display: "flex",
                                flexDirection: "row"
                            }}
                        >
                            <Box>
                                <TextField
                                    label="Primeiro Nome"
                                    defaultValue={user.first_name}
                                />

                            </Box>
                            <Box>
                                <TextField
                                    label="Primeiro Nome"
                                    defaultValue={user.last_name}
                                />
                            </Box>
                            <Box>
                                <IconButton onClick={() => handleEditToggle("vendorName")}
                                            sx={{
                                                display: "flex",
                                                ml: 1,
                                            }}>
                                    <SaveIcon/>
                                </IconButton>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{
                            ml: 2,
                            display: "flex",
                            flexDirection: "row"

                        }}>
                            <Box>
                                <Typography sx={{fontWeight: "bold", fontSize: "2.3rem"}}>
                                    {user.first_name} {user.last_name}
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
                                        <Typography>{user.email}</Typography>
                                    </Box>
                                    <Box sx={{flex: "1 1 45%"}}>
                                        <Typography fontWeight="bold">Telefone:</Typography>
                                        <Typography>{user.phone || "Não disponível"}</Typography>
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
                                        <Typography>{user.nif}</Typography>
                                    </Box>
                                    <Box sx={{flex: "1 1 45%"}}>
                                        <Typography fontWeight="bold">Data de Nascimento:</Typography>
                                        <Typography>{user.date_of_birth || "Não disponível"}</Typography>
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
                                        <Typography>Exemplo</Typography>
                                    </Box>
                                    <Box sx={{flex: "1 1 45%"}}>
                                        <Typography fontWeight="bold">Cod. Postal & Cidade:</Typography>
                                        <Typography>2845-210 Seixal</Typography>
                                    </Box>
                                </Box>

                                {/* Linha 4 - Gênero */}
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: isSmallScreen ? "column" : "row",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    mb: 3
                                }}>
                                    <Box sx={{flex: "1 1 45%"}}>
                                        <Typography fontWeight="bold">Gênero:</Typography>
                                        <Typography>{user.gender?.name || "Não disponível"}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Container>
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
            {/* Botão Editar */}
            <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                <Button
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
        </Paper>
    )
})

export default VendorInformation;
