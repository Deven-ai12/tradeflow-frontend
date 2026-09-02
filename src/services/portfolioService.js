import api from "../api/axios";

const portfolioService = {

    getPortfolio: async () => {

        const response = await api.get("/portfolio");

        return response.data;
    }

};

export default portfolioService;


