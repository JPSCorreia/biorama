import { useState, useRef, ref } from "react";
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
import { useEffect } from "react";

// Depuração para ver se a referência está a ser atribuída corretamente

const RegisterVendor = observer(({ genders }) => {
    // Tracks the current step in the registration process
    const [currentStep, setCurrentStep] = useState(0);
    const [isEnableNext, setIsEnableNext] = useState(true);
    // Calculates progress percentage
    const progress = (currentStep / 6) * 100;

    const [formErrors, setFormErrors] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    // Reference to the personal and company forms
    const personalFormRef = useRef(null);
    const companyFormRef = useRef(null);

    // Reference to the store form
    const storeFormRef = useRef(null);

    // Controls warning visibility
    const [showWarning, setShowWarning] = useState(true);

    const [images, setImages] = useState([]);
    console.log("RegisterVendor -> images:", images);

    const validateFormik = async (formik) => {
        const errors = await formik.validateForm();
        formik.setErrors(errors);
        await formik.setTouched(
            Object.keys(formik.values).reduce(
                (acc, key) => ({...acc, [key]: true}),
                {}
            )
        );
        return Object.keys(errors).length === 0; // Retorna true se não houver erros
    };

    const handleImageUpload = (event) => {
        if (!event.target.files) return;

        const files = Array.from(event.target.files);

        // Verifica se ultrapassa o limite de 3 imagens
        if (images.length + files.length > 3) {
            setShowAlert(true);
            return;
        }

        const newImages = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target.result) {
                    newImages.push(e.target.result);

                    // Apenas adiciona ao estado quando todas as imagens forem carregadas
                    if (newImages.length === files.length) {
                        setImages((prevImages) => {
                            const updatedImages = [...prevImages, ...newImages].slice(0, 3);
                            return updatedImages;
                        });
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };



    // Function to close the company form and validate the personal info form
    const handleCloseCompanyForm = () => {
        // Update the store to reflect the user's choice
        vendorRegistrationStore.setIsCompany(false);
        // Reset the company form
        if (companyFormRef?.current) {
            companyFormRef.current.resetForm();
            companyFormRef.current.setTouched(
                Object.keys(companyFormRef.current.values).reduce(
                    (acc, key) => ({ ...acc, [key]: false }),
                    {}
                )
            );
        }

        if (onCloseCompanyForm) {
            onCloseCompanyForm(); // call the parent component's function
        }

        console.log("O formulário de empresa foi fechado.");
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            const personalErrors = await personalFormRef.current.validateForm();
            personalFormRef.current.setTouched(
                Object.keys(personalFormRef.current.values).reduce(
                    (acc, key) => ({ ...acc, [key]: true }),
                    {}
                )
            );

            const isPersonalValid = Object.keys(personalErrors).length === 0;
            if (isPersonalValid) {
                vendorRegistrationStore.setPersonalFormik(personalFormRef.current);
            }

            let companyErrors = {}; // Inicia vazio

            // Se o utilizador escolheu registar-se como empresa, validar o segundo formulário
            if (vendorRegistrationStore.isCompany && companyFormRef?.current) {
                companyErrors = await companyFormRef.current.validateForm();
                companyFormRef.current.setTouched(
                    Object.keys(companyFormRef.current.values).reduce(
                        (acc, key) => ({ ...acc, [key]: true }),
                        {}
                    )
                );
                if (!companyErrors) {
                    vendorRegistrationStore.setCompanyFormik(companyFormRef.current);
                }
            }

            // Atualiza os erros nos estados correspondentes
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                personal: personalErrors,
                company: companyErrors,
            }));


            const isCompanyValid = Object.keys(companyErrors).length === 0;
            if (isCompanyValid) {
                vendorRegistrationStore.setCompanyFormik(companyFormRef.current);
            }

            if (isPersonalValid && (vendorRegistrationStore.isCompany ? isCompanyValid : true)) {
                await vendorRegistrationStore.submitStep1();
                setFormErrors(null);
                setCurrentStep((prev) => prev + 1); // Avança apenas se todos os formulários forem válidos
            } else {
                console.log("Erros encontrados:", { personalErrors, companyErrors });
            }
        }
        else if (currentStep === 3) {
            const storeErrors = await storeFormRef.current.validateForm();
            storeFormRef.current.setTouched(
                Object.keys(storeFormRef.current.values).reduce(
                    (acc, key) => ({ ...acc, [key]: true }),
                    {}
                )
            );

            setFormErrors((prevErrors) => ({
                ...prevErrors,
                store: storeErrors,
            }));

            const isStoreValid = Object.keys(storeErrors).length === 0;
            if (isStoreValid) {
                vendorRegistrationStore.setStoreFormik(storeFormRef.current);
                vendorRegistrationStore.setStoreImages(images);
                await vendorRegistrationStore.submitStep2();
                setCurrentStep((prev) => prev + 1);
            }
        }
        else if (currentStep === 5) {
            await vendorRegistrationStore.submitStep3();
            setCurrentStep((prev) => prev + 1);
        }
        else {
            setCurrentStep((prev) => prev + 1);
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
                        ref={personalFormRef}
                        companyRef={companyFormRef}
                        genders={genders}
                        formErrors={formErrors}
                        isCompany={vendorRegistrationStore.isCompany}
                        onCloseCompanyForm={handleCloseCompanyForm}
                    />
                );
            case 2:
                return <IntroStep2VendorRegister />;
            case 3:
                return (
                    <Step2StoreDetails ref={storeFormRef} formErrors={formErrors} setImages={setImages} images={images} showAlert={showAlert} handleImageUpload={handleImageUpload} />
                );
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
                    disabled={!isEnableNext}
                >
                    {currentStep === 5 ? "Concluir" : "Avançar"}
                </Button>
            </Box>
        </Box>
    );
});

export default RegisterVendor;
