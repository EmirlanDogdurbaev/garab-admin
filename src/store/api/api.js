import axios from "axios";

const api = axios.create({
    baseURL: "https:/garant-asia.com/api",

});

export const API_URI = api.defaults.baseURL;