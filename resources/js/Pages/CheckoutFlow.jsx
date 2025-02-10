import { useState, useEffect } from "react";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { cartStore, homeAddressStore } from "../Stores";
import { router } from "@inertiajs/react";
import { AddressStep, AlertBox, ReviewStep } from "../Components";
import axios from "axios";
import { usePage } from "@inertiajs/react";

const CheckoutFlow = observer(() => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const auth = usePage().props.auth;

    const steps = [
        "Escolher Morada de Envio",
        "Revisão e Confirmação",
    ];
    const progress = (currentStep / (steps.length - 1)) * 100;

    // useEffect(() => {
    //     if (currentStep === 2) {
    //         cartStore.clearCart();
    //     }
    // }, [currentStep]);

    useEffect(() => {
        if (currentStep === 1 && window.paypal) {
            setTimeout(() => {
                window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        currency_code: "EUR",
                                        value: Number(cartStore.grandTotal || 0).toFixed(2), // ✅ Corrigido
                                    },
                                },
                            ],
                        });
                    },
                    onApprove: async (data, actions) => {
                        const order = await actions.order.capture();
                        console.log("Pagamento aprovado!", order);
                        processOrder();
                    },
                    onError: (err) => {
                        console.error("Erro no pagamento do PayPal:", err);
                        alert("Erro no pagamento do PayPal. Tenta novamente.");
                        setIsProcessing(false);
                    },
                }).render("#paypal-button-container");
            }, 500);
        }
    }, [currentStep]);


    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep === 0) {
            router.get("/carrinho");
        } else {
            setCurrentStep((prev) => prev - 1);
        }
    };

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

    const sendInvoice = async (order) => {
        try {
            await axios.post("/send-invoice", {
                order,
                user: { email: auth.user.email },
            });
        } catch (error) {
            console.error("Erro ao enviar a fatura:", error);
            alert("Erro ao enviar a fatura. Verifica a tua conexão.");
        }
    };

    const processOrder = () => {
        const primaryAddress = homeAddressStore.addresses.find(
            (address) => address.is_primary
        );

        if (!primaryAddress) {
            alert("Erro: Nenhuma morada principal encontrada.");
            return;
        }

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

            const subtotal = cartStore.storeTotals[storeId] || 0;
            const shippingCosts = cartStore.shippingCosts[storeId] || 0;
            const total = subtotal + shippingCosts;

            return {
                user_id: auth.user.id,
                name: auth.user.first_name + " " + auth.user.last_name,
                statuses_id: 1, // Pendente
                street_name: primaryAddress.street_address,
                phone_number: primaryAddress.phone_number,
                city: primaryAddress.city,
                postal_code: primaryAddress.postal_code,
                comment: "",
                subtotal: subtotal.toFixed(2),
                shipping_costs: shippingCosts.toFixed(2),
                total: total.toFixed(2),
                products: products,
            };
        });

        router.post("/encomendar", { orders }, {
            onSuccess: (response) => {
                console.log("Encomenda criada com sucesso!", response);
                cartStore.clearCart();

                const orderIds = response.props.flash.orders;

                orders.forEach((order, index) => {
                    order.id = orderIds[index];
                    sendInvoice(order);
                });

                setIsProcessing(false);
            },
            onError: (errors) => {
                console.error("Erro ao processar encomenda:", errors);
                setIsProcessing(false);
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

                {currentStep === 1 && (
                    <Box id="paypal-button-container" sx={{ mt: 2 }}></Box>
                )}

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <LinearProgress variant="determinate" value={progress} />

                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <Button variant="outlined" onClick={handleBack}>
                            {currentStep === 0 ? "Voltar ao Carrinho" : "Voltar"}
                        </Button>

                        {currentStep < 1 ? (
                            <Button variant="contained" onClick={handleNext} disabled={isNextDisabled}>
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
