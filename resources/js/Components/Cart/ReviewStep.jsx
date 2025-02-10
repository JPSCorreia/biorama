import { Box, Typography, Divider } from "@mui/material";
import { cartStore, homeAddressStore } from "../../Stores";
import { observer } from "mobx-react";
import { AddressCard, ReviewConfirmationList } from "../../Components/";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { useMediaQuery } from "@mui/material";
import { router } from "@inertiajs/react";
import axios from "axios";

const ReviewStep = observer(() => {
    const theme = useTheme();
    const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));
    const smallerThanLarge = useMediaQuery(theme.breakpoints.down("lg"));
    const address = homeAddressStore.primaryAddress;
    const auth = usePage().props.auth;

    useEffect(() => {
        if (window.paypal) {
            setTimeout(() => {
                window.paypal
                    .Buttons({
                        createOrder: (data, actions) => {
                            return actions.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            currency_code: "EUR",
                                            value: Number(
                                                cartStore.grandTotal || 0,
                                            ).toFixed(2),
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
                            alert(
                                "Erro no pagamento do PayPal. Tenta novamente.",
                            );
                        },
                    })
                    .render("#paypal-button-container");
            }, 500);
        }
    }, []);


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
            (address) => address.is_primary,
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
                cartStore.clearCart();

                const orderIds = response.props.flash.orders;

                orders.forEach((order, index) => {
                    order.id = orderIds[index];
                    console.log("dentro do for each", order);
                    sendInvoice(order);
                });
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
                flexDirection: smallerThanLarge? "column" : "row",
                justifyContent: "center",
                width: "100%",
                mx: 0,
                // minWidth: 500,
                minHeight: smallerThanLarge? "100%" : "500px",
                // height: "50vh",

            }}
        >
            <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%", mx: 2, }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Morada de Envio
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 3}}>
                <AddressCard
                    address={address}
                    theme={theme}
                    checkout={true}
                    review={true}
                />
                </Box>
            </Box>
            <Divider sx={{ mt: smallerThanLarge? 6 : 0}}/>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    maxHeight: smallerThanLarge? "100%": "400px", // Define uma altura máxima para ativar o scroll
                    overflowY: "auto", // Habilita o scroll vertical
                    padding: "8px",
                    mx: 2,
                    mt: smallerThanLarge? 4 : 0,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Pagamento
                </Typography>
                <Box
                    id="paypal-button-container"
                    sx={{ mt: 2, width: "250px" }}
                ></Box>
            </Box>
            <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%", mx: 2, mt: smallerThanLarge? 4 : 0}}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Encomenda
                </Typography>
                <ReviewConfirmationList />
            </Box>
        </Box>
    );
});

export default ReviewStep;
