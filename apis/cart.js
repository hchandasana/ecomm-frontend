import apiClient from "@utils/axios";

export function addOrUpdateCart(data) {
    return apiClient.post("/cart", data);
}

export function getCart() {
    return apiClient.get("/cart");
}

export function updateCartStatus() {
    return apiClient.put("/cart");
}