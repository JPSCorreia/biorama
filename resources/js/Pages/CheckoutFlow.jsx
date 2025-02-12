import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { router } from "@inertiajs/react";
import { AddressStep, AlertBox, ReviewStep } from "../Components";

const CheckoutFlow = observer(() => {
    // State to manage the current step
    const [currentStep, setCurrentStep] = useState(0);
    // State to manage if the "Next" button is disabled
    const [isNextDisabled, setIsNextDisabled] = useState(true);

    // Checkout step titles
    const steps = ["Escolher Morada de Envio", "Revisão e Confirmação"];

    // Function to handle the "Next" button
    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    // Function to handle the "Back" button
    const handleBack = () => {
        if (currentStep === 0) {
            router.get("/carrinho");
        } else {
            setCurrentStep((prev) => prev - 1);
        }
    };

    // Function to render the appropriate component based on the current step
    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <AddressStep setButtonDisabled={setIsNextDisabled} />;
            case 1:
                return <ReviewStep />;
            default:
                return null;
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                marginTop: "15px !important",
                marginBottom: "5%",
            }}
        >
            {/* Alerts */}
            <AlertBox />

            {/* Title for the checkout step */}
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                {steps[currentStep]}
            </Typography>

            {/* Checkout step content */}
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifySelf: "center",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: "50vh",
                    mt: 2,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifySelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100%",
                        mt: 2,
                    }}
                >
                    {renderStep()}
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    {/* Buttons */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        <Button variant="outlined" onClick={handleBack}>
                            {currentStep === 0
                                ? "Voltar ao Carrinho"
                                : "Voltar"}
                        </Button>

                        {currentStep < 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={isNextDisabled}
                            >
                                Avançar
                            </Button>
                        ) : null}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
});

export default CheckoutFlow;
