import { Button, Paper, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const NotFoundPage = () => {
    const router = useRouter();

    return (<Paper
        sx={{
            boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.09)",
            borderRadius: "6px",
            padding: 2,
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
        }}
    >
        <Image
            src="/images/404.svg"
            alt="404-image"
            width={598}
            height={300}
            priority={true}
        />
        <Typography variant="h1" mt={2}>
            Oops..!! Looks like you are lost in Space
        </Typography>
        <Button
            sx={{ mt: 2 }}
            variant="contained"
            size="large"
            onClick={() => router.push("/")}
        >
            Go Back Home
        </Button>
    </Paper>);
};

export default NotFoundPage;