import React, { useEffect, useState } from "react";
import { Box, Button, Divider, IconButton, TextField, Typography } from "@mui/material";
import CustomSnackbar from "components/snackbar";
import { useMutation, useQuery } from "react-query";
import { getProducts, searchProducts } from "apis/product";
import { addOrUpdateCart, getCart, updateCartStatus } from "apis/cart";
import { CancelOutlined, ControlPoint, RemoveCircleOutlineOutlined } from "@mui/icons-material";
import { convertToRupees } from "@utils/index";
import { createPayment, updatePaymentStatus } from "apis/payment";
import ProductCards from "components/productCards";
import { addToShipment, updateShipmentStatus } from "apis/shipment";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [shipmentAddress, setShipmentAddress] = useState("");
    const [billingAddress, setBillingAddress] = useState("");
    const [qrCodeURL, setQrCodeURL] = useState("");
    const [paymentId, setPaymentId] = useState("");
    const [shipmentId, setShipmentId] = useState("");

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "error",
    });

    useEffect(() => {
        const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        setCartTotal(total);
    }, [cart]);

    const { refetch: refetchProducts } = useQuery("getProducts", getProducts, {
        retry: false,
        onSuccess: ({ data }) => setProducts(data),
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
        onSuccess: ({ data }) => setCart(data),
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
        onSuccess: async () => {
            await refetchCart();
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

    const {
        mutateAsync: createPaymentMutate
    } = useMutation("createPayment", createPayment, {
        onSuccess: ({ data }) => {
            setQrCodeURL(data?.qrCodeURL);
            setPaymentId(data?.paymentId);
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
        mutateAsync: addToShipmentMutate
    } = useMutation("addToShipment", addToShipment, {
        onSuccess: async ({ data }) => {
            setShipmentId(data?.shipmentId);
            setShipmentAddress("");
            setBillingAddress("");
            await createPaymentMutate({
                cartId: cart.find((item) => item.cartId),
                amount: cartTotal,
                paymentMethod: "UPI",
            });
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
        mutateAsync: updateShipmentStatusMutate
    } = useMutation("updateShipmentStatus", updateShipmentStatus, {
        onSuccess: () => setShipmentId("")
    });

    const {
        mutateAsync: updateCartStatusMutate
    } = useMutation("updateCartStatus", updateCartStatus, {
        onSuccess: async () => await refetchCart()
    });

    const {
        mutateAsync: updatePaymentStatusMutate
    } = useMutation("updatePaymentStatus", updatePaymentStatus, {
        onSuccess: async () => {
            await updateShipmentStatusMutate({
                shipmentId,
                status: "shipped"
            });
            await updateCartStatusMutate();
            setQrCodeURL("");
            setPaymentId("");
            setSnackbar({
                open: true,
                message: "Your order has been placed successfully",
                severity: "success",
            });
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

    const handleClearSearch = async () => {
        setSearchQuery("");
        await refetchProducts();
    };

    const handleCheckout = async () => {
        try {
            await addToShipmentMutate({
                cartId: cart.find((item) => item.cartId),
                address: shipmentAddress,
                billingAddress,
                products: cart
            });
        } catch (error) {
            return error;
        }
    };

    const handlePayment = async () => {
        try {
            await updatePaymentStatusMutate({
                paymentId, status: "paid"
            });
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
                            onClick={handleClearSearch}>
                            <CancelOutlined />
                        </IconButton>
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
                    <ProductCards
                        products={products}
                        handleAddToCart={handleAddToCart}
                        buttonText="Add to cart"
                    /> :
                    <Box display="flex" alignItems="center" mx={10}>
                        <Typography variant="h1">
                            No products found
                        </Typography>
                    </Box>}
            </Box>
            {cart.length > 0 &&
                (!!qrCodeURL ?
                    <Box
                        width="450px" mx={3}
                        flexDirection="column"
                    >
                        <Box component="h1">
                            Payment Details
                        </Box>
                        <Divider sx={{ mt: 1, mb: 2 }} />
                        <Box
                            component="img"
                            src={qrCodeURL}
                            alt="qrCode"
                            width="100%"
                            height="auto"
                            maxHeight="300px"
                        />
                        <Box display="flex" justifyContent="space-around">
                            <Button
                                variant="outlined"
                                onClick={() => setQrCodeURL("")}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handlePayment}
                            >
                                Done
                            </Button>
                        </Box>
                    </Box> :
                    <Box
                        display="flex" width="450px"
                        mx={3} flexDirection="column"
                    >
                        <Box>
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
                                            {convertToRupees(item.productId?.price)}
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
                        <Box mt={5}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h3">
                                    Cart Total
                                </Typography>
                                <Typography variant="h3">
                                    {convertToRupees(cartTotal)}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h3">
                                    Tax
                                </Typography>
                                <Typography variant="h3">
                                    {convertToRupees(0)}
                                </Typography>
                            </Box>
                            <Divider />
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h3">
                                    Sub Total
                                </Typography>
                                <Typography variant="h3">
                                    {convertToRupees(cartTotal)}
                                </Typography>
                            </Box>
                        </Box>
                        <Box mt={5}>
                            <Typography variant="h2">
                                Shipment
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h3">
                                Shipment Address
                            </Typography>
                            <TextField
                                placeholder="Enter shipment address"
                                fullWidth
                                multiline
                                size="small"
                                sx={{ my: 1 }}
                                value={shipmentAddress}
                                onChange={(e) => setShipmentAddress(e.target.value)}
                            />
                            <Typography variant="h3">
                                Billing Address
                            </Typography>
                            <TextField
                                placeholder="Enter billing address"
                                fullWidth
                                multiline
                                size="small"
                                sx={{ my: 1 }}
                                value={billingAddress}
                                onChange={(e) => setBillingAddress(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ my: 2 }}
                                onClick={handleCheckout}
                                disabled={!shipmentAddress || !billingAddress}
                            >
                                Proceed to checkout
                            </Button>
                        </Box>
                    </Box>)}
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