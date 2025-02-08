import { useState, useEffect } from "react";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { cartStore, homeAddressStore } from "../Stores";
import { router } from "@inertiajs/react";
import {
    AddressStep,
    AlertBox,
    ReviewConfirmationList,
    PaymentStep,
    ReviewStep,
} from "../Components";

const CheckoutFlow = observer(() => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const steps = [
        "Escolher Morada de Envio",
        "Escolher Pagamento",
        "Revisão e Confirmação",
    ];
    const progress = (currentStep / (steps.length - 1)) * 100;

    useEffect(() => {
        if (currentStep === 3) {
            // talvez nao seja preciso
            cartStore.clearCart();
        }
    }, [currentStep]);

    const handleNext = () => {
        if (currentStep === 2) {
            console.log("finalizar compra");
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <AddressStep
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
                        selectedPayment={selectedPayment}
                    />
                );
            default:
                return null;
        }
    };

    const handleCheckout = () => {

        if (!selectedPayment) {
            alert("Por favor, selecione um método de pagamento.");
            return;
        }

        // Obter a morada principal (is_primary)
        const primaryAddress = homeAddressStore.addresses.find(address => address.is_primary);

        if (!primaryAddress) {
            alert("Erro: Nenhuma morada principal encontrada. Selecione uma morada antes de finalizar.");
            return;
        }

        // Criar encomendas por cada loja no carrinho
        const orders = Object.keys(cartStore.cart).map((storeId) => {
            const products = cartStore.cart[storeId].map((item) => ({
                product_id: item.id,
                store_id: storeId,
                price: item.price,
                discount: item.discount ?? 0,
                quantity: item.quantity ?? 1,
                final_price: (
                    item.price *
                    (1 - (item.discount ?? 0) / 100) *
                    item.quantity
                ).toFixed(2),
            }));

            return {
                user_id: 32, // Aqui deves usar o ID do utilizador autenticado dinamicamente
                statuses_id: 1, // Pendente
                street_name: primaryAddress.street_address,
                city: primaryAddress.city,
                postal_code: primaryAddress.postal_code,
                phone_number: primaryAddress.phone_number,
                comment: "", // Podes adicionar um campo de observação
                total:
                    cartStore.storeTotals[storeId] +
                    (cartStore.shippingCosts[storeId] || 0),
                products: products,
            };
        });

        console.log("Encomendas:", orders);

        // Enviar as encomendas para o backend
        router.post("/encomendar", { orders }, {
            onSuccess: () => {
                cartStore.clearCart();
            },
            onError: (errors) => {
                console.error("Erro ao processar encomenda:", errors);
            },
        });
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
                        }}
                    >
                        {currentStep > 0 ? (
                            <Button variant="outlined" onClick={handleBack}>
                                Voltar
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                onClick={() => router.get("/carrinho")}
                            >
                                Voltar
                            </Button>
                        )}
                        {currentStep === 2 ? (
                            <Button
                                variant="contained"
                                onClick={handleCheckout}
                                disabled={false}
                            >
                                Finalizar Compra
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={false}
                            >
                                Avançar
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
});

export default CheckoutFlow;
