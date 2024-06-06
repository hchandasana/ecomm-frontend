import apiClient from "@utils/axios";

export function addToShipment(data) {
    return apiClient.post("/shipment", data);
}

export function updateShipmentStatus(data) {
    return apiClient.put("/shipment", data);
}