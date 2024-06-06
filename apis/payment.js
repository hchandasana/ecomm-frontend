import apiClient from "@utils/axios";

export function createPayment(data) {
    return apiClient.post("/payment", data);
}

export function updatePaymentStatus(data) {
    return apiClient.put("/payment", data);
}