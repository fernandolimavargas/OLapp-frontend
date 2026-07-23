import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7151",
  //baseURL: import.meta.env.VITE_API_URL

});