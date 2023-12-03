import { AxiosInstance } from "axios";

export const axiosUpdate = (axios: AxiosInstance, value: string) => {
    const baseURL = process.env.AUTH_SERVICE
    if (!baseURL) {
        throw new Error("No AUTH_SERVICE variable found, please check")
    }
    axios.defaults.headers["common"]["Authorization"] = `${value}`
    axios.defaults.baseURL = baseURL
}