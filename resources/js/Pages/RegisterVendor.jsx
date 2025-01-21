import {useEffect, useState} from 'react';
import { Box, LinearProgress, Button, Typography } from '@mui/material';
import IntroStep1VendorRegister from '../Components/IntroStep1VendorRegister';
import IntroStep2VendorRegister from '../Components/IntroStep2VendorRegister';
import IntroStep3VendorRegister from '../Components/IntroStep3VendorRegister';
import Step1PersonalInfo from '../Components/Step1PersonalInfo';
import Step2StoreDetails from '../Components/Step2StoreDetails';
import Step3CreateProduct from '../Components/Step3CreateProduct';
import {vendorRegistrationStore} from "../Stores/vendorRegistrationStore.js";
import {usePage} from "@inertiajs/react";
import {observer} from "mobx-react";




const RegistorVendorPage = observer(({ genders }) => {

    const [currentStep, setCurrentStep] = useState(0);
    const progress = (currentStep / 6) * 100;
    const {auth} = usePage().props;
    const [showWarning, setShowWarning] = useState(true);
    const [userFormik, setUserFormik] = useState(null); // Formik de dados pessoais
    const [companyFormik, setCompanyFormik] = useState(null); // Formik de empresa

    console.log('Auth', auth);

    const handleCloseCompanyForm = async () => {
        vendorRegistrationStore.setIsCompany(false); // Fecha o formulário de empresa

        if (userFormik) {
            // Valida explicitamente o formulário de dados pessoais
            const errors = await userFormik.validateForm();
            const isValid = Object.keys(errors).length === 0;

            // Atualiza o estado global de validade
            vendorRegistrationStore.setUserFormValid(isValid);
        }
    };


    const enableButton = () => {
        switch (currentStep) {
            case 1:
                return vendorRegistrationStore.isCompany ?
                    !(vendorRegistrationStore.userFormValid && vendorRegistrationStore.companyFormValid) :
                    !vendorRegistrationStore.userFormValid;
            case 3:
                return !vendorRegistrationStore.companyFormValid;
            case 5:
                return !vendorRegistrationStore.productsFormValid;
            default:
                return false;
        }
    };

    useEffect(() => {
        if (auth?.user) {
            vendorRegistrationStore.initializeUser(auth.user);
        }
    }, [auth]);

    const handleNext = async () => {
        let errors = {};
        let isValid = true;

        switch (currentStep) {
            case 1:
                // Valida o formulário de dados pessoais
                if (userFormik) {
                    const userErrors = await userFormik.validateForm();
                    const isUserValid = Object.keys(userErrors).length === 0;
                    if (isUserValid) {
                        userFormik.handleSubmit(); // Submete o formulário de dados pessoais
                    }
                    errors = { ...errors, ...userErrors };
                    isValid = isUserValid && isValid; // Atualiza a validade global
                }

                // Valida o formulário de empresa (se for o caso)
                if (vendorRegistrationStore.isCompany && companyFormik) {
                    const companyErrors = await companyFormik.validateForm();
                    const isCompanyValid = Object.keys(companyErrors).length === 0;
                    if (isCompanyValid) {
                        companyFormik.handleSubmit(); // Submete o formulário de empresa
                    }
                    errors = { ...errors, ...companyErrors };
                    isValid = isCompanyValid && isValid; // Atualiza a validade global
                }

                if (!isValid) {
                    setShowWarning(true);
                    console.log("Erros nos formulários:", errors);
                    return;
                }

                setShowWarning(false); // Esconde o aviso se tudo estiver válido
                return setCurrentStep((prev) => prev + 1);

            default:
                return setCurrentStep((prev) => prev + 1);
        }
    };


    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    // Lógica para renderizar o componente correto baseado no passo atual
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <IntroStep1VendorRegister />;
            case 1:
                return <Step1PersonalInfo
                    genders={genders}
                    setUserFormik={setUserFormik} // Passa para o formulário de dados pessoais
                    setCompanyFormik={setCompanyFormik} // Passa para o formulário de empresa
                    onCloseCompanyForm={handleCloseCompanyForm}
                    showWarning={showWarning}
                />;
            case 2:
                return <IntroStep2VendorRegister />;
            case 3:
                return <Step2StoreDetails />;
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
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                mt: '10vh',
                minHeight: '70vh',
                alignContent: 'center',
                justifyContent: 'center',
                overflow: 'hidden', // Impede o scroll na página

            }}
        >
            {/* Renderiza o conteúdo baseado no passo atual */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    "& > :last-child": {
                        mb: 4,
                    }
                    }}>
                {renderStepContent()}
            </Box>

            {/* Barra de progresso */}
            <Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, mb: 2 }} />
            </Box>

            {/* Botões para navegar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button disabled={currentStep === 0} onClick={handleBack}>
                    Recuar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={enableButton()}>
                    Avançar
                </Button>
            </Box>
        </Box>
    );
});

export default RegistorVendorPage;
