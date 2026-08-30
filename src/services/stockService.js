import api from "./api";

const stockService = {

    getStock: async (symbol) => {

        const response = await api.get(
            `/api/stocks/${symbol}`
        );

        return response.data;
    }

};

export default stockService;