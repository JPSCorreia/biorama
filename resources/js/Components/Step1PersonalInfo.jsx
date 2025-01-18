import {
    Box,
    Typography,
    Link,
    Paper,
    useTheme,
    useMediaQuery,
    Button,
} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {observer} from "mobx-react-lite";
import FormCompanyRegistration from "./FormCompanyRegistration.jsx";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {vendorRegistrationStore} from "../Stores/vendorRegistrationStore.js";
import FormVendorRegistration from "@/Components/FormVendorRegistration.jsx";

const Step1PersonalInfo = observer(({genders, setUserFormik, setCompanyFormik, showWarning, onCloseCompanyForm}) => {

    const theme = useTheme();
    console.log('É UMA EMPRESA?', vendorRegistrationStore.isCompany);

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
                showWarning={showWarning}
                passFormik={setUserFormik} // Passa para o formulário de dados pessoais
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
