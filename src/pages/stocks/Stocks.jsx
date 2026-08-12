import { useState } from "react";

import stockService from "../../services/stockService";
import watchlistService from "../../services/watchlistService";
import { useNavigate } from "react-router-dom";

const Stocks = () => {

    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [stock, setStock] = useState(null);

    const [loading, setLoading] = useState(false);
    const [watchlistLoading, setWatchlistLoading] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // =========================
    // SEARCH STOCK
    // =========================

    const searchStock = async () => {

        if (!search.trim()) {
            setError("Please enter a stock symbol.");
            return;
        }

        try {

            setLoading(true);
            setError("");
            setMessage("");
            setStock(null);

            const data = await stockService.getStock(
                search.trim().toUpperCase()
            );

            console.log("Stock Response:", data);

            setStock(data);

        } catch (error) {

            console.error("STOCK SEARCH ERROR:", error);

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Stock not found."
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // ADD TO WATCHLIST
    // =========================

    const handleAddToWatchlist = async () => {

        if (!stock?.symbol) {
            setError("Please search for a stock first.");
            return;
        }

        try {

            setWatchlistLoading(true);
            setError("");
            setMessage("");

            const response =
                await watchlistService.addToWatchlist(
                    stock.symbol
                );

            console.log(
                "Watchlist Response:",
                response
            );

            setMessage(
                response ||
                `${stock.symbol} added to watchlist.`
            );

        } catch (error) {

            console.error(
                "WATCHLIST ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to add stock to watchlist."
            );

        } finally {

            setWatchlistLoading(false);

        }
    };


    // =========================
    // UI
    // =========================

    return (

        <div className="max-w-6xl mx-auto p-6">

            {/* HEADER */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-blue-600">
                    Stocks
                </h1>

                <p className="text-gray-500 mt-1">
                    Search stocks and explore market information
                </p>

            </div>


            {/* SEARCH */}

            <div className="mb-6">

                <label className="block font-semibold mb-2">
                    Search Stock
                </label>

                <div className="flex gap-3">

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {
                                searchStock();
                            }

                        }}
                        placeholder="TCS / INFY / RELIANCE"
                        className="flex-1 border rounded-lg px-4 py-3"
                    />

                    <button
                        onClick={searchStock}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-semibold disabled:opacity-50"
                    >
                        {loading
                            ? "SEARCHING..."
                            : "SEARCH"}
                    </button>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>

            )}


            {/* SUCCESS */}

            {message && (

                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                    {message}
                </div>

            )}


            {/* STOCK INFORMATION */}

            {stock && (

                <div className="bg-white border rounded-xl shadow-sm p-6">

                    {/* Stock Header */}

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-sm text-gray-500">
                                Stock
                            </p>

                            <h2 className="text-3xl font-bold">
                                {stock.symbol}
                            </h2>

                            <p className="text-gray-600 mt-1">
                                {stock.companyName ||
                                    "Company name unavailable"}
                            </p>

                        </div>


                        {/* Current Price */}

                        <div className="text-right">

                            <p className="text-sm text-gray-500">
                                Current Price
                            </p>

                            <p className="text-3xl font-bold text-blue-600">
                                ₹
                                {Number(
                                    stock.currentPrice || 0
                                ).toFixed(2)}
                            </p>

                        </div>

                    </div>


                    {/* MARKET INFORMATION */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

                        {/* Previous Close */}

                        <div className="bg-gray-50 rounded-lg p-5">

                            <p className="text-gray-500">
                                Previous Close
                            </p>

                            <p className="text-xl font-bold mt-2">
                                ₹
                                {Number(
                                    stock.previousClose || 0
                                ).toFixed(2)}
                            </p>

                        </div>


                        {/* Day High */}

                        <div className="bg-gray-50 rounded-lg p-5">

                            <p className="text-gray-500">
                                Day High
                            </p>

                            <p className="text-xl font-bold text-green-600 mt-2">
                                ₹
                                {Number(
                                    stock.dayHigh || 0
                                ).toFixed(2)}
                            </p>

                        </div>


                        {/* Day Low */}

                        <div className="bg-gray-50 rounded-lg p-5">

                            <p className="text-gray-500">
                                Day Low
                            </p>

                            <p className="text-xl font-bold text-red-600 mt-2">
                                ₹
                                {Number(
                                    stock.dayLow || 0
                                ).toFixed(2)}
                            </p>

                        </div>

                    </div>


                    {/* LAST UPDATED */}

                    {stock.lastUpdated && (

                        <p className="text-sm text-gray-500 mt-6">
                            Last Updated:{" "}
                            {new Date(
                                stock.lastUpdated
                            ).toLocaleString()}
                        </p>

                    )}


                    {/* ACTIONS */}

                    <div className="flex gap-4 mt-8">

                        {/* WATCHLIST */}

                        <button
                            onClick={handleAddToWatchlist}
                            disabled={watchlistLoading}
                            className="flex-1 border border-yellow-500 text-yellow-600 hover:bg-yellow-50 py-3 rounded-lg font-semibold disabled:opacity-50"
                        >
                            {watchlistLoading
                                ? "ADDING..."
                                : "⭐ Add to Watchlist"}
                        </button>


                        {/* TRADE */}

                        <button
                            onClick={() =>
                                navigate(
                                    `/trading?symbol=${stock.symbol}`
                                )
                            }
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                        >
                            Trade
                        </button>

                    </div>

                </div>

            )}

        </div>

    );
};

export default Stocks;