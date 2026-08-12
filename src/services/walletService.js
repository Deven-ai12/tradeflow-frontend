import axios from "axios";

const API_URL = "http://localhost:8080/api/wallet";

const getConfig = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

const getWallet = async () => {
    const response = await axios.get(
        API_URL,
        getConfig()
    );

    return response.data;
};

const deposit = async (amount) => {
    const response = await axios.post(
        `${API_URL}/deposit`,
        {
            amount: Number(amount),
        },
        getConfig()
    );

    return response.data;
};

const withdraw = async (amount) => {
    const response = await axios.post(
        `${API_URL}/withdraw`,
        {
            amount: Number(amount),
        },
        getConfig()
    );

    return response.data;
};

export default {
    getWallet,
    deposit,
    withdraw,
};