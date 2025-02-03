import {
    Box,
    Button, useMediaQuery, useTheme,
} from "@mui/material";
import {forwardRef} from "react";
import { useEffect } from "react";
import {FormCompanyRegistration, FormVendorRegistration} from "./";
import {vendorRegistrationStore} from "@/Stores/index.js";


const Step1PersonalInfo = forwardRef(({ genders, formErrors, isCompany, companyRef, onCloseCompanyForm }, ref) => {

    const isSmallScreen = useMediaQuery(useTheme().breakpoints.down("sm"));

    useEffect(() => {
        console.log("Step1PersonalInfo -> Recebeu refs:", { ref, companyRef });
        console.log("Step1PersonalInfo -> isCompany:", isCompany);
    }, [ref, companyRef, isCompany]);
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: isSmallScreen ? "100%":"65%",
                "& > :first-of-type": {
                    mb: 4,
                },
            }}
        >
            {/* Formulário de registo pessoal */}
            <FormVendorRegistration
                genders={genders}
                ref={ref}
                formErrors={formErrors?.personal}
                isCompany={isCompany}
            />

            <Button
                variant="outlined"
                onClick={() => {
                    if (ref.current) {  // Garante que `ref.current` existe antes de chamar `setFieldValue`
                        ref.current.setFieldValue("is_company", true); // Atualiza o estado do formulário
                    }

                    vendorRegistrationStore.setIsCompany(true); // Atualiza o estado na store
                }}
                sx={{
                    display: vendorRegistrationStore.isCompany ? "none" : "block", // Verifica `is_company` de forma segura
                    color: "#000",
                    borderColor: "#000",
                }}
            >
                Quero registar a minha empresa
            </Button>

            {/* Formulário de empresa (aparece apenas se for empresa) */}
            {isCompany && (
                <FormCompanyRegistration
                    ref={companyRef}
                    formErrors={formErrors?.company}
                    onCloseCompanyForm={onCloseCompanyForm}
                />
            )}

        </Box>
    );
});

export default Step1PersonalInfo;
