import api from "../api/axios";

const watchlistService = {

    getWatchlist: async () => {
        const response = await api.get("/api/watchlist");
        return response.data;
    },

    addToWatchlist: async (symbol) => {
        const response = await api.post("/api/watchlist", {
            symbol: symbol,
        });

        return response.data;
    },

    removeFromWatchlist: async (symbol) => {
        const response = await api.delete(
            `/api/watchlist/${symbol}`
        );

        return response.data;
    },

};

export default watchlistService;