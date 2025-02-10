import { usePage } from "@inertiajs/react";

const ProfileOrderDetails = ({ order }) => {
    const {auth} = usePage().props;


    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container>
            {order ? (
                <>
                    <Typography variant="h4">Detalhes da Encomenda #{order.id}</Typography>
                    <Typography>Status: {order.status}</Typography>
                    <Typography>Data: {new Date(order.created_at).toLocaleDateString()}</Typography>
                    <Typography>Morada de Envio: {order.shipping_address}</Typography>
                    <Typography>Vendedor: {order.store.seller_name}</Typography>
                    <Typography>Loja: {order.store.name}</Typography>
                    <Typography variant="h5" gutterBottom>Produtos</Typography>
                    {order.products.map(product => (
                        <Card key={product.id} sx={{ marginBottom: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{product.name}</Typography>
                                <Typography>Quantidade: {product.quantity}</Typography>
                                <Typography>Preço: €{product.price}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </>
            ) : (
                <Typography>Encomenda não encontrada.</Typography>
            )}
        </Container>
    );
}

export default ProfileOrderDetails;
