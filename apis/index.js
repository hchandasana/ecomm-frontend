import apiClient from "@utils/axios";

export function getTodos() {
    return apiClient.get("/todos");
}