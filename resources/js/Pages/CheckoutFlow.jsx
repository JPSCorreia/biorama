import { useState, useEffect } from "react";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { cartStore } from "../Stores";
import { router } from "@inertiajs/react";
import { AddressStep, AlertBox, PaymentStep, ReviewStep } from "../Components";

const CheckoutFlow = observer(() => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const steps = [
        "Escolher Morada de Envio",
        "Escolher Pagamento",
        "Revisão e Confirmação",
    ];
    const progress = (currentStep / (steps.length - 1)) * 100;

    useEffect(() => {
        if (currentStep === 3) {
            // Simula a finalização da compra
            console.log("Pedido finalizado com sucesso!");
            // router.get("/dashboard");
            cartStore.clearCart();
        }
    }, [currentStep]);

    const handleNext = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <AddressStep
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}
                    />
                );
            case 1:
                return (
                    <PaymentStep
                        selectedPayment={selectedPayment}
                        setSelectedPayment={setSelectedPayment}
                    />
                );
            case 2:
                return (
                    <ReviewStep
                        selectedAddress={selectedAddress}
                        selectedPayment={selectedPayment}
                    />
                );
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
                border: "1px solid red",
            }}
        >
            <AlertBox />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                {steps[currentStep]}
            </Typography>

            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifySelf: "center",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: "70vh",
                    border: "1px solid yellow",
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
                        border: "1px solid green"
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
                        border: "1px solid blue",
                    }}
                >
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            mt: 2,
                            width: "100%",
                            maxWidth: 1200,
                        }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            maxWidth: 1200,
                            mt: 2,
                            border: "1px solid red",
                        }}
                    >
                        {currentStep > 0 ? (
                            <Button variant="outlined" onClick={handleBack}>
                                Voltar
                            </Button>
                        ) : (
                            <Box></Box>
                        )}
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={
                                currentStep === 2 &&
                                (!selectedAddress || !selectedPayment)
                            }
                        >
                            {currentStep === 2 ? "Finalizar Compra" : "Avançar"}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
});

export default CheckoutFlow;
