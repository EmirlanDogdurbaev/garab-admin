import axios from "axios";

const api = axios.create({
    baseURL: "http://64.176.71.25/api",

});

export const API_URI = api.defaults.baseURL;