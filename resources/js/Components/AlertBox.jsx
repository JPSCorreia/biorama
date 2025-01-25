import { observer } from "mobx-react";
import { Box, Alert, Fade } from "@mui/material";
import { alertStore } from "../Stores";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";


const AlertBox = observer(() => {

    const { flash } = usePage().props;

    useEffect(() => {
        // Set alert based on flash message

        console.log(flash)
        if (flash?.message && flash.message !== alertStore.lastMessage) {
            // Clear timers
            alertStore.clearTimers();

            // Set alert timeout
            setTimeout(() => {
                alertStore.setAlert(flash.message, flash.type || "success");

                // Set timer to hide alert after 3 seconds
                const hideTimer = setTimeout(() => {
                    alertStore.hideAlert();
                }, 3000);
                alertStore.addTimer(hideTimer);

                // Set timer to clear alert after 3.5 seconds
                const clearTimer = setTimeout(() => {
                    alertStore.clearAlert();
                }, 3500);
                alertStore.addTimer(clearTimer);
            }, 150);
        }

        return () => {
            // Clear timers on unmount
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
