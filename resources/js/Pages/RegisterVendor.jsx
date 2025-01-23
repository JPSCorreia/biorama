import { useEffect, useState } from "react";
import { Box, LinearProgress, Button, Typography } from "@mui/material";
import {
    IntroStep1VendorRegister,
    IntroStep2VendorRegister,
    IntroStep3VendorRegister,
    Step1PersonalInfo,
    Step2StoreDetails,
    Step3CreateProduct,
} from "../Components";
import { vendorRegistrationStore } from "../Stores";
import { usePage } from "@inertiajs/react";
import { observer } from "mobx-react";

const RegisterVendor = observer(({ genders }) => {
    // Tracks the current step in the registration process
    const [currentStep, setCurrentStep] = useState(0);

    // Calculates progress percentage
    const progress = (currentStep / 6) * 100;

    // Get page props for authentication
    const { auth } = usePage().props;

    // Controls warning visibility
    const [showWarning, setShowWarning] = useState(true);

    // States to hold formik instances for different forms
    const [vendorFormik, setVendorFormik] = useState(null); // Personal data
    const [companyFormik, setCompanyFormik] = useState(null); // Company data
    const [storeFormik, setStoreFormik] = useState(null); // Store data
    const [images, setImages] = useState([]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                newImages.push(reader.result);
                if (newImages.length === files.length) {
                    setImages((prevImages) => [...prevImages, ...newImages]); // Atualiza o array de imagens
                }
            };
            reader.readAsDataURL(file);
        });
    };

    // Function to close the company form and validate the personal info form
    const handleCloseCompanyForm = async () => {
        // Close the company form
        vendorRegistrationStore.setIsCompany(false);
        runInAction(() => {
            vendorRegistrationStore.setIsCompany(false);
        });

        // Validate the personal info form
        if (vendorFormik) {
            const errors = await vendorFormik.validateForm();
            const isValid = Object.keys(errors).length === 0;

            // Update the store with the validation result
            runInAction(() => {
                vendorRegistrationStore.setVendorFormValid(isValid);
            });
        }
    };

    // Function to check if the "Next" button should be active
    const enableButton = () => {
        switch (currentStep) {
            case 1:
                return vendorRegistrationStore.isCompany
                    ? !(
                          vendorRegistrationStore.vendorFormValid &&
                          vendorRegistrationStore.companyFormValid
                      )
                    : !vendorRegistrationStore.vendorFormValid;
            case 3:
                return !vendorRegistrationStore.storeFormValid;
            case 5:
                return !vendorRegistrationStore.productsFormValid;
            default:
                return false;
        }
    };

    const handleNext = async () => {
        let errors = {};
        let isValid = true;

        switch (currentStep) {
            case 1:
                // Validate the personal info form
                if (currentStep === 1 && vendorFormik) {
                    const userErrors = await vendorFormik.validateForm();
                    const isUserValid = Object.keys(userErrors).length === 0;

                    // Submit the personal info form if valid
                    if (isUserValid) {
                        vendorFormik.handleSubmit();
                    }
                    errors = { ...errors, ...userErrors };

                    // Update global validity
                    isValid = isUserValid && isValid;
                }

                // Validate company form (if applicable)
                if (vendorRegistrationStore.isCompany && companyFormik) {
                    const companyErrors = await companyFormik.validateForm();
                    const isCompanyValid =
                        Object.keys(companyErrors).length === 0;

                    // Submit the company form if valid
                    if (isCompanyValid) {
                        companyFormik.handleSubmit();
                    }
                    errors = { ...errors, ...companyErrors };

                    // Update global validity
                    isValid = isCompanyValid && isValid;
                }

                return setCurrentStep((prev) => prev + 1);

            case 3:

                // Validate the store form
                if (storeFormik) {
                    const storeErrors = await storeFormik.validateForm();
                    const isStoreValid = Object.keys(storeErrors).length === 0;

                    // Submit the store form if valid
                    if (isStoreValid) {
                        storeFormik.handleSubmit();
                    }
                    errors = { ...errors, ...storeErrors };

                    // Update global validity
                    isValid = isStoreValid && isValid;
                }
                if (!isValid) {
                    console.log("Erros nos formulários:", errors);
                    return;
                }
                return setCurrentStep((prev) => prev + 1);
            default:
                return setCurrentStep((prev) => prev + 1);
        }
    };

    // Function to handle the "Back" button click event
    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    // Function to render the appropriate component based on the current step
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <IntroStep1VendorRegister />;
            case 1:
                return (
                    <Step1PersonalInfo
                        genders={genders}
                        setVendorFormik={setVendorFormik}
                        setCompanyFormik={setCompanyFormik}
                        onCloseCompanyForm={handleCloseCompanyForm}
                    />
                );
            case 2:
                return <IntroStep2VendorRegister />;
            case 3:
                return <Step2StoreDetails setStoreFormik={setStoreFormik} handleImageUpload={handleImageUpload} images={images} />;
            case 4:
                return <IntroStep3VendorRegister />;
            case 5:
                return <Step3CreateProduct />;
            default:
                return (
                    <Typography variant="h6">
                        Final do registo! Obrigado por completar as etapas.
                    </Typography>
                );
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                mt: 9,
                minHeight: "70vh",
                alignContent: "center",
                justifyContent: "center",
                overflow: "hidden", // prevent page from scrolling
            }}
        >
            {/* Render content based on current step */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& > :last-child": {
                        mb: 4,
                    },
                }}
            >
                {renderStepContent()}
            </Box>

            {/* Progress bar */}
            <Box>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 8, borderRadius: 4, mb: 2 }}
                />
            </Box>

            {/* Navigation buttons */}
            <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
                <Button disabled={currentStep === 0} onClick={handleBack}>
                    Recuar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={enableButton()}
                >
                    Avançar
                </Button>
            </Box>
        </Box>
    );
});

export default RegisterVendor;
