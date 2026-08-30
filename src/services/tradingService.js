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




