import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackbar = ({ open, message, severity, onClose }) => {
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        if (open) {
            startTimer();
        }

        return () => {
            clearTimer();
        };
    }, [open]);

    const startTimer = () => {
        clearTimer();
        const timeout = setTimeout(() => {
            onClose();
            clearTimer();
        }, 4000);
        setTimer(timeout);
    };

    const clearTimer = () => {
        if (timer) {
            clearTimeout(timer);
            setTimer(null);
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                clearTimer();
            } else if (open) {
                startTimer();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [open, timer]);

    return (
        <Snackbar
            open={open}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar;