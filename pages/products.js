import React, { useState } from "react";
import { Box, Button, Divider, Grid, IconButton, TextField, Typography } from "@mui/material";
import CustomSnackbar from "components/snackbar";
import { useMutation, useQuery } from "react-query";
import { getProducts, searchProducts } from "apis/product";
import { addOrUpdateCart, getCart } from "apis/cart";
import { CancelOutlined, ControlPoint, RemoveCircleOutlineOutlined } from "@mui/icons-material";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "error",
    });

    const { refetch: refetchProducts } = useQuery("getProducts", getProducts, {
        retry: false,
        onSuccess: ({ data }) => {
            setProducts(data);
        },
        onError: (error) => {
            setSnackbar({
                open: true,
                message: error.message,
                severity: "error",
            });
        },
    });

    const { refetch: refetchCart } = useQuery("getCart", getCart, {
        retry: false,
        onSuccess: ({ data }) => {
            setCart(data);
        },
        onError: (error) => {
            setSnackbar({
                open: true,
                message: error.message,
                severity: "error",
            });
        },
    });

    const {
        mutateAsync: addOrUpdateCartAsync
    } = useMutation("addOrUpdateCart", addOrUpdateCart, {
        onSuccess: ({ data }) => {
            setSnackbar({
                open: true,
                message: data.message || "Product added successfully",
                severity: "success",
            });
            refetchCart();
        },
        onError: (error) => {
            setSnackbar({
                open: true,
                message: error.message,
                severity: "error",
            });
        },
    });

    const {
        mutateAsync: searchProductsAsync,
    } = useMutation("searchProducts", searchProducts, {
        onSuccess: ({ data }) => {
            setProducts(data);
        },
        onError: (error) => {
            setSnackbar({
                open: true,
                message: error.message,
                severity: "error",
            });
        },
    });

    const handleAddToCart = async (product, decrement = false) => {
        try {
            const existingItem = cart.find((item) => item.productId?._id === product._id);
            const newQuantity = existingItem ? decrement ?
                existingItem.quantity - 1 : existingItem.quantity + 1 : 1;
            await addOrUpdateCartAsync({
                productId: product._id,
                quantity: newQuantity,
            });
        } catch (error) {
            return error;
        }
    };

    const handleSearch = async () => {
        try {
            const query = searchQuery.trim();
            await searchProductsAsync({ query });
        } catch (error) {
            return error;
        }
    };

    return (<Box p={2} display="flex" flexDirection="column">
        <Box alignSelf="center" display="flex">
            <TextField
                placeholder="Search product by name"
                size="small"
                fullWidth
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                sx={{ mr: 2 }}
                InputProps={{
                    endAdornment:
                        <IconButton
                            disabled={!searchQuery}
                            onClick={() => {
                                setSearchQuery("");
                                refetchProducts();
                            }}>
                            <CancelOutlined />
                        </IconButton>,
                }}
            />
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleSearch}
            >
                Search
            </Button>
        </Box>
        <Box display="flex" flexDirection="row">
            <Box>
                <Box component="h1">
                    Products
                </Box>
                <Divider sx={{ mt: 1, mb: 2 }} />
                {products?.length > 0 ?
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
                                            {product.price?.toLocaleString("en-IN", {
                                                maximumFractionDigits: 2,
                                                style: "currency",
                                                currency: "INR",
                                            })}
                                        </Box>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            Add to card
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid> :
                    <Box display="flex" alignItems="center" mx={10}>
                        <Typography variant="h1">
                            No products found
                        </Typography>
                    </Box>}
            </Box>
            {cart.length > 0 && <>
                <Box width="450px" mx={3}>
                    <Box component="h1">
                        Cart Details
                    </Box>
                    <Divider sx={{ mt: 1, mb: 2 }} />
                    {cart.map((item, index) => (
                        <Box key={index} display="flex">
                            <Box
                                component="img"
                                src="/images/product.png"
                                alt="product"
                                width="75px"
                                height="auto"
                                maxHeight="75px"
                                mr={2}
                            />
                            <Box>
                                <Typography variant="body1" fontWeight={600}>
                                    {item.productId?.name}
                                </Typography>
                                <Typography variant="body1">
                                    {item.price?.toLocaleString("en-IN", {
                                        maximumFractionDigits: 2,
                                        style: "currency",
                                        currency: "INR",
                                    })}
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <IconButton
                                        onClick={() => {
                                            if (item.quantity >= 1) {
                                                handleAddToCart(item.productId, true);
                                            }
                                        }}
                                        disabled={item.quantity < 1}
                                    >
                                        <RemoveCircleOutlineOutlined fontSize="small" />
                                    </IconButton>
                                    <Typography variant="body1">
                                        {item.quantity}
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleAddToCart(item.productId)}
                                    >
                                        <ControlPoint fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </>}
        </Box>

        <CustomSnackbar
            open={snackbar.open}
            message={snackbar.message}
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
    </Box>);
};

export default Products;