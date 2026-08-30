import api from "./api";

const getTransactions = async ({
    page = 0,
    size = 10,
    type = "",
    symbol = "",
    fromDate = "",
    toDate = ""
} = {}) => {

    const response = await api.get("/api/transactions", {
        params: {
            page,
            size,
            type: type || undefined,
            symbol: symbol || undefined,
            fromDate: fromDate || undefined,
            toDate: toDate || undefined
        }
    });

    return response.data;
};

const transactionService = {
    getTransactions
};

export default transactionService;