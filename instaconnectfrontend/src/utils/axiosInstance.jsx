import axios from "axios";
import { BASE_URL } from "./constants";

const accessToken = localStorage.getItem('access_token')

const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers:{
        Accept:'application/json',
        Authorization:`Bearer ${accessToken}`
    }
})

export default axiosInstance