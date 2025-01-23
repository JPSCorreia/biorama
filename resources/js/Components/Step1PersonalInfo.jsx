import {
    Box,
    Button,
} from "@mui/material";
import {observer} from "mobx-react-lite";
import FormCompanyRegistration from "./FormCompanyRegistration.jsx";
import {vendorRegistrationStore} from '../Stores/vendorRegistrationStore.js';
import FormVendorRegistration from './FormVendorRegistration.jsx';

const Step1PersonalInfo = observer(({genders, setVendorFormik, setCompanyFormik, onCloseCompanyForm}) => {

    return (

        <Box
            sx={{
                display: "flex",
                flexDirection: 'column',
                width: "85%",
                "& > :first-of-type": {
                    mb: 4
                }
            }}
        >
            <FormVendorRegistration
                genders={genders}
                passFormik={setVendorFormik} // Passa para o formulário de dados pessoais
            />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                }}
            >
                <Button
                    component="button"
                    variant="outlined"
                    onClick={() => vendorRegistrationStore.setIsCompany(true)}// Alterna entre empresa e pessoal
                    sx={{
                        display: vendorRegistrationStore.isCompany ? "none" : "block",
                        color: "#000",
                        borderColor: "#000",
                    }}
                >
                    {"Quero registar a minha empresa"}
                </Button>
            </Box>
            {vendorRegistrationStore.isCompany && (
                <FormCompanyRegistration
                    passFormik={setCompanyFormik} // Passa para o formulário de empresa
                    onCloseCompanyForm={onCloseCompanyForm} // Corrigir o nome da prop
                />
            )}
        </Box>
    );
});

export default Step1PersonalInfo;
