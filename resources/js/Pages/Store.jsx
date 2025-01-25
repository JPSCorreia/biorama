import { observer } from "mobx-react";
import { usePage } from "@inertiajs/react";
import Banner from "../Components/Banner";
import { Container } from "@mui/material";
import { AlertBox } from "../Components";

const Store = observer(() => {

    const { store } = usePage().props;

    return (
        <Container
        sx={{
            display: "flex",
            flexDirection: "column",
            minWidth: "100%",
            height: "100%",
            marginTop: "15px !important",
        }}
    >
        <AlertBox />
            <Banner imageLink={store.image_link} title={store.name} />
        </Container>
    );
});

export default Store;
