import api from "../api/axios";

const getWallet = async () => {

    const response = await api.get("/wallet");

    return response.data;
};

const deposit = async (amount) => {

    const response = await api.post(
        "/wallet/deposit",
        {
            amount: Number(amount),
        }
    );

    return response.data;
};

const withdraw = async (amount) => {

    const response = await api.post(
        "/wallet/withdraw",
        {
            amount: Number(amount),
        }
    );

    return response.data;
};

export default {
    getWallet,
    deposit,
    withdraw,
};

