import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL_FOR_URL_SHORTENER}`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const shortenURL = (longUrl, expirationDate) => {
  return api.post("/shorten", { long_url: longUrl, expiry_date: expirationDate });
};

export const shortenURLHistory = () => {
  return api.post("/history", "");
};