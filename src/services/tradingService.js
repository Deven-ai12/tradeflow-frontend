import api from "../api/axios";

export const buyStock = async (symbol, quantity) => {

    const response = await api.post(
        "/trading/buy",
        {
            symbol: symbol.toUpperCase(),
            quantity: Number(quantity),
        }
    );

    return response.data;
};

export const sellStock = async (symbol, quantity) => {

    const response = await api.post(
        "/trading/sell",
        {
            symbol: symbol.toUpperCase(),
            quantity: Number(quantity),
        }
    );

    return response.data;
};


// import axios from "axios";

// const API_URL = "http://localhost:8080/api/trading";

// const getConfig = () => {
//   const token = localStorage.getItem("token");

//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   };
// };

// export const buyStock = async (symbol, quantity) => {
//   const response = await axios.post(
//     `${API_URL}/buy`,
//     {
//       symbol: symbol.toUpperCase(),
//       quantity: Number(quantity),
//     },
//     getConfig()
//   );

//   return response.data;
// };

// export const sellStock = async (symbol, quantity) => {
//   const response = await axios.post(
//     `${API_URL}/sell`,
//     {
//       symbol: symbol.toUpperCase(),
//       quantity: Number(quantity),
//     },
//     getConfig()
//   );

//   return response.data;
// };