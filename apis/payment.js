import apiClient from "@utils/axios";

export function createPayment(data) {
    return apiClient.post("/payment", data);
}