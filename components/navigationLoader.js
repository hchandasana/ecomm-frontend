import React from "react";
import { Box, LinearProgress } from "@mui/material";

const NavigationLoader = () => {
    return (
        <Box
            position="fixed"
            width="100%"
            height="100vh"
            zIndex={9999}
            sx={{ backgroundColor: "rgba(255,255,255,0.0)" }}
        >
            <LinearProgress color="info" />
        </Box>
    );
};

export default NavigationLoader;