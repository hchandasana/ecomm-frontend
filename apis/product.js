import apiClient from "@utils/axios";

export function getProducts() {
    return apiClient.get("/products");
}

export function searchProducts({ query }) {
    return apiClient.get(`/products/search?query=${query}`);
}