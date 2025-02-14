import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { forwardRef } from "react";
import { useEffect } from "react";
import { FormCompanyRegistration, FormVendorRegistration } from "..";
import { vendorRegistrationStore } from "@/Stores/index.js";

const Step1PersonalInfo = forwardRef(
    (
        { genders, formErrors, isCompany, companyRef, onCloseCompanyForm },
        ref,
    ) => {
        const isSmallScreen = useMediaQuery(useTheme().breakpoints.down("sm"));
        const isMediumScreen = useMediaQuery(
            useTheme().breakpoints.between("sm", "md"),
        );

        const theme = useTheme();

        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    width: "80%",
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
                        display: vendorRegistrationStore.isCompany
                            ? "none"
                            : "block",
                        // color: "#000",
                        color: theme.palette.text.main,
                        borderColor: theme.palette.button.register_vendor,
                        mt: 2,
                        maxWidth: "240px",
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
    },
);

export default Step1PersonalInfo;
