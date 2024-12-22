import axios from "axios";

// const api = axios.create({
//   baseURL: "https://url-shortener-dot-argon-magnet-442917-k1.el.r.appspot.com",
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

export const shortenURL = (longUrl, expirationDate) => {
  return axios.post("https://url-shortener-dot-argon-magnet-442917-k1.el.r.appspot.com/shorten", { long_url: longUrl, expiry_date: "" }, { headers: { "Content-Type": "application/json" } });
};
