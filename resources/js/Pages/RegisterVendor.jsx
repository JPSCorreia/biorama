import {useEffect, useState} from 'react';
import { Box, LinearProgress, Button, Typography } from '@mui/material';
import IntroStep1VendorRegister from '../Components/IntroStep1VendorRegister';
import IntroStep2VendorRegister from '../Components/IntroStep2VendorRegister';
import IntroStep3VendorRegister from '../Components/IntroStep3VendorRegister';
import Step1PersonalInfo from '../Components/Step1PersonalInfo';
import Step2StoreDetails from '../Components/Step2StoreDetails';
import Step3CreateProduct from '../Components/Step3CreateProduct';
import {vendorRegistrationStore} from "../Stores/vendorRegistrationStore";
import {usePage} from "@inertiajs/react";




const RegistorVendorPage = ({ genders }) => {

    const [currentStep, setCurrentStep] = useState(0);
    const progress = (currentStep / 6) * 100;
    const {auth} = usePage().props;
    const [showWarning, setShowWarning] = useState(true);

    console.log('Auth', auth);

    useEffect(() => {
        if (auth?.user) {
            vendorRegistrationStore.initializeUser(auth.user);
            console.log('User da store do registo', vendorRegistrationStore.user);
            console.log('currentFormValid', vendorRegistrationStore.currentFormValid);
        }
    }, [auth]);

    const [formikInstance, setFormikInstance] = useState(null);

    const handleNext = async () => {
        if (formikInstance) {
            const errors = await formikInstance.validateForm();
            const isValid = Object.keys(errors).length === 0;

            if (!isValid) {
                setShowWarning(true);
                return;
            }

            setShowWarning(false);
            formikInstance.handleSubmit();
        }

        setCurrentStep((prev) => prev + 1);
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
                    setFormikInstance={setFormikInstance}
                    showWarning={showWarning}
                    setShowWarning={setShowWarning}
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
                    disabled={!vendorRegistrationStore.currentFormValid}>
                    Avançar
                </Button>
            </Box>
        </Box>
    );
};

export default RegistorVendorPage;
