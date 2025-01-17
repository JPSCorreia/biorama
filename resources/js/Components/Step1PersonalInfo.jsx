import {
    Box,
    Typography,
    Link,
    Paper,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {observer} from "mobx-react-lite";
import Step1CompanyInfo from "./Step1CompanyInfo"; // Componente para os dados da empresa
import dayjs from "dayjs";
import {useState} from "react";
import {vendorRegistrationStore} from "../Stores/vendorRegistrationStore.js";
import FormVendorRegistration from "@/Components/FormVendorRegistration.jsx";

const Step1PersonalInfo = observer(({genders, setFormikInstance, showWarning, setShowWarning}) => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [companyRegister, setCompanyRegister] = useState(true);

    return (
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={dayjs.locale(navigator.language) || dayjs.locale("pt")}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: 'column',
                    width: "100%",
                    "& > :first-of-type": {
                        mb: 4
                    }
                }}
            >
                <Paper sx={{mt: 4, width: "85%", m: "auto", p: 5}}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: "2.5rem",
                                    fontWeight: "bold",
                                    mb: 0,
                                }}
                            >
                                Dados Pessoais
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: showWarning ? 'none' : "flex",
                                justifyContent: "center",
                                ml: 2,
                            }}
                        >
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => setShowWarning(!showWarning)}
                                sx={{mt: 0, display: "block"}}
                            >
                                {"Editar os meus dados"}
                            </Link>
                        </Box>
                    </Box>
                    {showWarning && (
                        <Box sx={{mb: 2 }}>
                            <Typography
                                sx={{
                                    color: "#757575", // Cinza subtil
                                    fontSize: "0.875rem",
                                    fontStyle: "italic",
                                }}
                            >
                                *Certifique-se de que todos os campos obrigatórios estão preenchidos para avançar para a próxima etapa.
                            </Typography>
                        </Box>
                    )}

                    <FormVendorRegistration genders={genders} passFormik={setFormikInstance} showWarning={showWarning} />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                        }}
                    >
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => vendorRegistrationStore.setIsCompany(!vendorRegistrationStore.isCompany)}// Alterna entre empresa e pessoal
                            sx={{mt: 2, display: vendorRegistrationStore.isCompany ? "none" : "block"}}
                        >
                            {"Quero registar a minha empresa"}
                        </Link>
                    </Box>
                </Paper>
                {vendorRegistrationStore.isCompany && (
                    <Step1CompanyInfo companyData={vendorRegistrationStore.company}
                                      setCompanyData={vendorRegistrationStore.updateCompany}/>
                )}
            </Box>
        </LocalizationProvider>
    );
});

export default Step1PersonalInfo;
