import { Box, Button, Grid, Typography } from "@mui/material";
import { convertToRupees } from "@utils/index";
import React from "react";

const ProductCards = ({
    products,
    handleAddToCart = () => { },
    buttonText = "Add to cart"
}) => {

    if (products.length === 0) {
        return (
            <Box display="flex" alignItems="center" mx={10}>
                <Typography variant="h1">
                    No products found
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {products.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Box
                        sx={{
                            height: "100%",
                            width: "100%",
                            minWidth: "250px",
                            borderRadius: "6px",
                            boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: "1rem",
                        }}
                    >
                        <Box>
                            <Box
                                component="img"
                                src="/images/product.png"
                                alt="product"
                                width="100%"
                                height="auto"
                                maxHeight="200px"
                            />
                            <Box component="h3" variant="h6">
                                {product.name}
                            </Box>
                            <Box component="p" variant="body1">
                                {convertToRupees(product.price)}
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAddToCart(product)}
                            >
                                {buttonText}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

export default ProductCards;