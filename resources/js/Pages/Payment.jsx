const Payment = () => {
    const handlePayment = () => {
        paypal
            .Buttons({
                createOrder: function (data, actions) {
                    // Cria uma ordem no PayPal
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: "10.00", // Montante do pagamento
                                },
                            },
                        ],
                    });
                },
                onApprove: function (data, actions) {
                    // Captura a ordem após a aprovação do utilizador
                    return actions.order.capture().then(function (details) {
                        alert(
                            "Pagamento concluído com sucesso, " +
                                details.payer.name.given_name +
                                "!",
                        );
                        console.log(details); // Detalhes do pagamento
                    });
                },
                onError: function (err) {
                    console.error(err);
                    alert("Ocorreu um erro ao processar o pagamento.");
                },
            })
            .render("#paypal-button-container"); // Renderiza o botão
    };

    return (
        <div class="container">
            <h1>Pagamento com PayPal</h1>
            <div id="paypal-button-container"></div>
        </div>
    );
};

export default Payment;
