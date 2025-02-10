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
    const isMediumScreen = useMediaQuery(useTheme().breakpoints.between("sm", "md"));

    useEffect(() => {
        console.log("Step1PersonalInfo -> Recebeu refs:", { ref, companyRef });
        console.log("Step1PersonalInfo -> isCompany:", isCompany);
    }, [ref, companyRef, isCompany]);
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: isSmallScreen
                    ? "100%"
                    : isMediumScreen
                        ? "90%"
                        : "80%",
                "& > :first-of-type": {
                    mb: 4,
                },
                minHeight: "67.6vh",
            }}
        >
            {/* Form Vendor personal Info */}
            <FormVendorRegistration
                genders={genders}
                ref={ref}
                formErrors={formErrors?.personal}
                isCompany={isCompany}
            />

            <Button
                variant="outlined"
                onClick={() => {
                    if (ref.current) {
                        ref.current.setFieldValue("is_company", true);
                    }

                    vendorRegistrationStore.setIsCompany(true);
                }}
                sx={{
                    display: vendorRegistrationStore.isCompany ? "none" : "block",
                    color: "#000",
                    borderColor: "#000",
                    borderRadius: 2,
                    width: isSmallScreen
                        ? "75%"
                        : isMediumScreen
                            ? "47%"
                            : "20%",
                    fontSize: "0.85rem",
                    textAlign: "center",
                    textTransform: "none",
                }}
            >
                Quero registar a minha empresa
            </Button>

            {/* Company form show only if user want be company */}
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
