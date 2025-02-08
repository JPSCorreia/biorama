import { observer } from "mobx-react";
import { Box, Alert, Fade } from "@mui/material";
import { alertStore } from "../Stores";
import { usePage, router } from "@inertiajs/react";
import { useEffect } from "react";

const AlertBox = observer(() => {

    const { flash } = usePage().props;

    useEffect(() => {
        return router.on('navigate', () => {
            alertStore.reset();
        });
    }, []);


    useEffect(() => {
        if (flash?.message && flash.message !== alertStore.lastMessage) {

            alertStore.clearTimers();

            setTimeout(() => {

                alertStore.setAlert(flash.message, flash.type || "success");

                const hideTimer = setTimeout(() => {
                    console.log('hide')
                    alertStore.hideAlert();
                }, 3000);
                alertStore.addTimer(hideTimer);

                const clearTimer = setTimeout(() => {
                    alertStore.clearAlert();

                }, 3500);
                alertStore.addTimer(clearTimer);
            }, 150);
        }

        return () => {
            alertStore.clearTimers();
        };
    }, [flash?.message]);



    return (
        <>
            {alertStore.message ? (
                <Fade
                    in={alertStore.show}
                    timeout={{
                        enter: 150,
                        exit: 500,
                    }}
                    unmountOnExit
                >
                    <Alert
                        severity={alertStore.severity}
                        variant="filled"
                        sx={{
                            mb: 2,
                            height: "48px",
                            width: "100%",
                            maxWidth: "470px",
                            alignSelf: "center",
                        }}
                    >
                        {alertStore.message}
                    </Alert>
                </Fade>
            ) : (
                <Box sx={{ mb: 2, height: "48px" }} />
            )}
        </>
    );
});

export default AlertBox;
