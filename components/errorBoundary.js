import React from "react";
import Image from "next/image";
import { Button, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";

function ErrorBoundary({ children }) {
    const [hasError, setHasError] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const handleError = (error, errorInfo) => {
            // eslint-disable-next-line no-console
            console.error("Uncaught error:", error, errorInfo);
            setHasError(true);
        };

        const errorHandler = (error) => handleError(error, error);

        window.addEventListener("error", errorHandler);
        window.addEventListener("unhandledrejection", errorHandler);

        return () => {
            window.removeEventListener("error", errorHandler);
            window.removeEventListener("unhandledrejection", errorHandler);
        };
    }, []);

    const handleGoHome = () => {
        setHasError(false);
        router.push("/");
    };

    if (hasError) {
        return (
            <Paper
                sx={{
                    boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.09)",
                    borderRadius: "6px",
                    padding: 2,
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                }}
            >
                <Image
                    src="/images/error.svg"
                    alt="error-image"
                    width={500}
                    height={420}
                    priority={true}
                />
                <Typography variant="h1">
                    Oops..!! Something went wrong
                </Typography>
                <Typography variant="h5" mt={2}>
                    An unexpected error occurred. Please try again later.
                </Typography>
                <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    size="large"
                    onClick={handleGoHome}
                >
                    Go Back Home
                </Button>
            </Paper>
        );
    }

    return children;
}

export default ErrorBoundary;