import axios from "axios";
import jwt from "jsonwebtoken";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
});

apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwt.decode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                } else {
                    config.headers["Authorization"] = `Bearer ${token}`;
                }
            } catch (error) {
                localStorage.removeItem("token");
                window.location.href = "/";
            }
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default apiClient;