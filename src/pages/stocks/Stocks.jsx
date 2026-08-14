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

            console.log("Watchlist Response:", response);

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
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

            {/* =========================
                HEADER
            ========================= */}

            <div className="mb-6 sm:mb-8">

                <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
                    Stocks
                </h1>

                <p className="text-sm sm:text-base text-gray-500 mt-1">
                    Search stocks and explore market information
                </p>

            </div>


            {/* =========================
                SEARCH
            ========================= */}

            <div className="mb-5 sm:mb-6">

                <label className="block font-semibold text-sm sm:text-base mb-2">
                    Search Stock
                </label>

                <div className="flex flex-col sm:flex-row gap-3">

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
                        placeholder="AAPL / NVDA"
                        className="
                            w-full
                            flex-1
                            border border-gray-300
                            rounded-lg
                            px-4
                            py-3
                            text-sm sm:text-base
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            focus:border-blue-500
                        "
                    />

                    <button
                        onClick={searchStock}
                        disabled={loading}
                        className="
                            w-full
                            sm:w-auto
                            min-w-[120px]
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-6
                            py-3
                            rounded-lg
                            font-semibold
                            text-sm sm:text-base
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            transition
                        "
                    >
                        {loading
                            ? "SEARCHING..."
                            : "SEARCH"}
                    </button>

                </div>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (
                <div className="
                    mb-5 sm:mb-6
                    p-4
                    bg-red-100
                    text-red-700
                    rounded-lg
                    text-sm sm:text-base
                    break-words
                ">
                    {error}
                </div>
            )}


            {/* =========================
                SUCCESS
            ========================= */}

            {message && (
                <div className="
                    mb-5 sm:mb-6
                    p-4
                    bg-green-100
                    text-green-700
                    rounded-lg
                    text-sm sm:text-base
                    break-words
                ">
                    {message}
                </div>
            )}


            {/* =========================
                STOCK INFORMATION
            ========================= */}

            {stock && (
                <div className="
                    bg-white
                    border
                    rounded-xl
                    shadow-sm
                    p-4 sm:p-6
                ">

                    {/* =========================
                        STOCK HEADER
                    ========================= */}

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:justify-between
                        sm:items-start
                        gap-4
                    ">

                        {/* Stock Details */}

                        <div className="min-w-0">

                            <p className="text-xs sm:text-sm text-gray-500">
                                Stock
                            </p>

                            <h2 className="
                                text-2xl
                                sm:text-3xl
                                font-bold
                                break-words
                            ">
                                {stock.symbol}
                            </h2>

                            <p className="
                                text-sm
                                sm:text-base
                                text-gray-600
                                mt-1
                                break-words
                            ">
                                {stock.companyName ||
                                    "Company name unavailable"}
                            </p>

                        </div>


                        {/* Current Price */}

                        <div className="
                            text-left
                            sm:text-right
                            shrink-0
                        ">

                            <p className="text-xs sm:text-sm text-gray-500">
                                Current Price
                            </p>

                            <p className="
                                text-2xl
                                sm:text-3xl
                                font-bold
                                text-blue-600
                            ">
                                ₹
                                {Number(
                                    stock.currentPrice || 0
                                ).toFixed(2)}
                            </p>

                        </div>

                    </div>


                    {/* =========================
                        MARKET INFORMATION
                    ========================= */}

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        gap-3
                        sm:gap-4
                        mt-6
                        sm:mt-8
                    ">

                        {/* Previous Close */}

                        <div className="
                            bg-gray-50
                            rounded-lg
                            p-4
                            sm:p-5
                        ">

                            <p className="text-sm text-gray-500">
                                Previous Close
                            </p>

                            <p className="text-lg sm:text-xl font-bold mt-2">
                                ₹
                                {Number(
                                    stock.previousClose || 0
                                ).toFixed(2)}
                            </p>

                        </div>


                        {/* Day High */}

                        <div className="
                            bg-gray-50
                            rounded-lg
                            p-4
                            sm:p-5
                        ">

                            <p className="text-sm text-gray-500">
                                Day High
                            </p>

                            <p className="
                                text-lg
                                sm:text-xl
                                font-bold
                                text-green-600
                                mt-2
                            ">
                                ₹
                                {Number(
                                    stock.dayHigh || 0
                                ).toFixed(2)}
                            </p>

                        </div>


                        {/* Day Low */}

                        <div className="
                            bg-gray-50
                            rounded-lg
                            p-4
                            sm:p-5
                        ">

                            <p className="text-sm text-gray-500">
                                Day Low
                            </p>

                            <p className="
                                text-lg
                                sm:text-xl
                                font-bold
                                text-red-600
                                mt-2
                            ">
                                ₹
                                {Number(
                                    stock.dayLow || 0
                                ).toFixed(2)}
                            </p>

                        </div>

                    </div>


                    {/* =========================
                        LAST UPDATED
                    ========================= */}

                    {stock.lastUpdated && (
                        <p className="
                            text-xs
                            sm:text-sm
                            text-gray-500
                            mt-5
                            sm:mt-6
                            break-words
                        ">
                            Last Updated:{" "}
                            {new Date(
                                stock.lastUpdated
                            ).toLocaleString()}
                        </p>
                    )}


                    {/* =========================
                        ACTIONS
                    ========================= */}

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        gap-3
                        sm:gap-4
                        mt-6
                        sm:mt-8
                    ">

                        {/* WATCHLIST */}

                        <button
                            onClick={handleAddToWatchlist}
                            disabled={watchlistLoading}
                            className="
                                w-full
                                sm:flex-1
                                border
                                border-yellow-500
                                text-yellow-600
                                hover:bg-yellow-50
                                py-3
                                rounded-lg
                                font-semibold
                                text-sm sm:text-base
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                transition
                            "
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
                            className="
                                w-full
                                sm:flex-1
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                py-3
                                rounded-lg
                                font-semibold
                                text-sm sm:text-base
                                transition
                            "
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