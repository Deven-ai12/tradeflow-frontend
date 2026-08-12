import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import stockService from "../../services/stockService";
import portfolioService from "../../services/portfolioService";
import walletService from "../../services/walletService";
import watchlistService from "../../services/watchlistService";

import {
    buyStock,
    sellStock,
} from "../../services/tradingService";


const Trading = () => {

    // =========================
    // URL PARAMETERS
    // =========================

    const [searchParams] = useSearchParams();


    // =========================
    // STATE
    // =========================

    const [search, setSearch] = useState("");

    const [stock, setStock] = useState(null);

    const [quantity, setQuantity] = useState(10);

    const [tradeResult, setTradeResult] = useState(null);

    const [loading, setLoading] = useState(false);

    const [watchlistLoading, setWatchlistLoading] =
        useState(false);

    const [error, setError] = useState("");

    const [message, setMessage] = useState("");


    // =========================
    // SEARCH STOCK
    // =========================

    const searchStock = async (symbol = search) => {

        const stockSymbol = symbol.trim().toUpperCase();

        if (!stockSymbol) {

            setError("Please enter a stock symbol.");

            return;

        }

        try {

            setLoading(true);

            setError("");

            setMessage("");

            setTradeResult(null);


            const data =
                await stockService.getStock(stockSymbol);


            console.log(
                "Stock Response:",
                data
            );


            setStock(data);

            setSearch(stockSymbol);


        } catch (error) {

            console.error(
                "SEARCH ERROR:",
                error
            );


            setStock(null);


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
    // LOAD STOCK FROM URL
    // =========================

    useEffect(() => {

        const symbol =
            searchParams.get("symbol");


        if (symbol) {

            setSearch(symbol.toUpperCase());

            searchStock(symbol);

        }

    }, [searchParams]);


    // =========================
    // INCREASE QUANTITY
    // =========================

    const increaseQuantity = () => {

        setQuantity(
            (prev) => prev + 1
        );

    };


    // =========================
    // DECREASE QUANTITY
    // =========================

    const decreaseQuantity = () => {

        setQuantity((prev) => {

            if (prev > 1) {

                return prev - 1;

            }

            return prev;

        });

    };


    // =========================
    // ADD TO WATCHLIST
    // =========================

    const handleAddToWatchlist = async () => {

        if (!stock?.symbol) {

            setError(
                "Please search for a stock first."
            );

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
                "WATCHLIST RESPONSE:",
                response
            );


            setMessage(
                `${stock.symbol} added to watchlist successfully.`
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
    // BUY STOCK
    // =========================

    const handleBuy = async () => {

        if (!stock?.symbol) {

            setError(
                "Please search for a stock first."
            );

            return;

        }


        if (!quantity || Number(quantity) < 1) {

            setError(
                "Quantity must be at least 1."
            );

            return;

        }


        try {

            setLoading(true);

            setError("");

            setMessage("");

            setTradeResult(null);


            const response =
                await buyStock(
                    stock.symbol,
                    quantity
                );


            console.log(
                "BUY RESPONSE:",
                response
            );


            setTradeResult(response);


            setMessage(
                response.message ||
                "Stock bought successfully."
            );


            // =========================
            // UPDATE NAVBAR WALLET
            // =========================

            window.dispatchEvent(
                new CustomEvent(
                    "walletUpdated",
                    {
                        detail: {
                            balance:
                                response.walletBalance,
                        },
                    }
                )
            );


            // =========================
            // REFRESH PORTFOLIO
            // =========================

            await refreshAfterTrade();


        } catch (error) {

            console.error(
                "BUY ERROR:",
                error
            );


            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to buy stock."
            );


        } finally {

            setLoading(false);

        }

    };


    // =========================
    // SELL STOCK
    // =========================

    const handleSell = async () => {

        if (!stock?.symbol) {

            setError(
                "Please search for a stock first."
            );

            return;

        }


        if (!quantity || Number(quantity) < 1) {

            setError(
                "Quantity must be at least 1."
            );

            return;

        }


        try {

            setLoading(true);

            setError("");

            setMessage("");

            setTradeResult(null);


            const response =
                await sellStock(
                    stock.symbol,
                    quantity
                );


            console.log(
                "SELL RESPONSE:",
                response
            );


            setTradeResult(response);


            setMessage(
                response.message ||
                "Stock sold successfully."
            );


            // =========================
            // UPDATE NAVBAR WALLET
            // =========================

            window.dispatchEvent(
                new CustomEvent(
                    "walletUpdated",
                    {
                        detail: {
                            balance:
                                response.walletBalance,
                        },
                    }
                )
            );


            // =========================
            // REFRESH PORTFOLIO
            // =========================

            await refreshAfterTrade();


        } catch (error) {

            console.error(
                "SELL ERROR:",
                error
            );


            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to sell stock."
            );


        } finally {

            setLoading(false);

        }

    };


    // =========================
    // REFRESH AFTER TRADE
    // =========================

    const refreshAfterTrade = async () => {

        try {

            const [
                portfolio,
                wallet
            ] = await Promise.all([

                portfolioService.getPortfolio(),

                walletService.getWallet(),

            ]);


            console.log(
                "Updated Portfolio:",
                portfolio
            );


            console.log(
                "Updated Wallet:",
                wallet
            );


            // Notify Portfolio page

            window.dispatchEvent(
                new CustomEvent(
                    "portfolioUpdated",
                    {
                        detail: {
                            portfolio,
                            wallet,
                        },
                    }
                )
            );


        } catch (error) {

            console.error(
                "Failed to refresh portfolio/wallet:",
                error
            );

        }

    };


    // =========================
    // ORDER TOTAL
    // =========================

    const total = stock
        ? Number(stock.currentPrice) *
          Number(quantity)
        : 0;


    // =========================
    // UI
    // =========================

    return (

        <div className="max-w-4xl mx-auto p-6">


            {/* PAGE TITLE */}

            <h1 className="text-3xl font-bold text-blue-600 mb-8">

                Trading

            </h1>


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
                        placeholder="Search TCS / INFY / RELIANCE"
                        className="flex-1 border rounded-lg px-4 py-3"
                    />


                    <button
                        onClick={() =>
                            searchStock()
                        }
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 rounded-lg disabled:opacity-50"
                    >

                        {loading
                            ? "Processing..."
                            : "Search"}

                    </button>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">

                    {error}

                </div>

            )}


            {/* SUCCESS */}

            {message && (

                <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 font-semibold">

                    {message}

                </div>

            )}


            {/* STOCK INFORMATION */}

            {stock && (

                <div className="border rounded-lg p-6 bg-gray-50 mb-6">


                    <p className="text-sm text-gray-500">

                        Stock

                    </p>


                    <h2 className="text-xl font-bold">

                        {stock.symbol}

                    </h2>


                    <p className="text-gray-700">

                        {stock.companyName ||
                            "Company name unavailable"}

                    </p>


                    <p className="mt-4 text-sm text-gray-500">

                        Current Price

                    </p>


                    <p className="text-2xl font-bold text-blue-600">

                        ₹
                        {Number(
                            stock.currentPrice
                        ).toFixed(2)}

                    </p>


                    {/* PREVIOUS CLOSE */}

                    {stock.previousClose !== undefined && (

                        <p className="mt-3 text-gray-600">

                            <strong>
                                Previous Close:
                            </strong>{" "}

                            ₹
                            {Number(
                                stock.previousClose
                            ).toFixed(2)}

                        </p>

                    )}


                    {/* DAY HIGH */}

                    {stock.dayHigh !== undefined && (

                        <p className="text-gray-600">

                            <strong>
                                Day High:
                            </strong>{" "}

                            ₹
                            {Number(
                                stock.dayHigh
                            ).toFixed(2)}

                        </p>

                    )}


                    {/* DAY LOW */}

                    {stock.dayLow !== undefined && (

                        <p className="text-gray-600">

                            <strong>
                                Day Low:
                            </strong>{" "}

                            ₹
                            {Number(
                                stock.dayLow
                            ).toFixed(2)}

                        </p>

                    )}


                    {/* WATCHLIST */}

                    <button
                        onClick={
                            handleAddToWatchlist
                        }
                        disabled={
                            watchlistLoading
                        }
                        className="mt-5 w-full border border-yellow-500 text-yellow-600 hover:bg-yellow-50 py-3 rounded-lg font-semibold disabled:opacity-50"
                    >

                        {watchlistLoading
                            ? "ADDING..."
                            : "☆ ADD TO WATCHLIST"}

                    </button>

                </div>

            )}


            {/* TRADING SECTION */}

            {stock && (

                <>


                    {/* QUANTITY */}

                    <div className="mb-6">

                        <p className="font-semibold mb-3">

                            Quantity

                        </p>


                        <div className="flex items-center gap-5">


                            <button
                                onClick={
                                    decreaseQuantity
                                }
                                disabled={loading}
                                className="border px-4 py-2 rounded-lg disabled:opacity-50"
                            >

                                -

                            </button>


                            <span className="text-lg font-semibold">

                                {quantity}

                            </span>


                            <button
                                onClick={
                                    increaseQuantity
                                }
                                disabled={loading}
                                className="border px-4 py-2 rounded-lg disabled:opacity-50"
                            >

                                +

                            </button>

                        </div>

                    </div>


                    {/* BUY / SELL */}

                    <div className="flex gap-5 mb-8">


                        <button
                            onClick={handleBuy}
                            disabled={loading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                        >

                            {loading
                                ? "PROCESSING..."
                                : "BUY"}

                        </button>


                        <button
                            onClick={handleSell}
                            disabled={loading}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                        >

                            {loading
                                ? "PROCESSING..."
                                : "SELL"}

                        </button>

                    </div>


                    {/* ORDER SUMMARY */}

                    <div className="border rounded-lg p-6 mb-6">

                        <h2 className="text-xl font-semibold mb-4">

                            Order Summary

                        </h2>


                        <p>

                            <strong>
                                Stock:
                            </strong>{" "}

                            {stock.symbol}

                        </p>


                        <p>

                            <strong>
                                Quantity:
                            </strong>{" "}

                            {quantity}

                        </p>


                        <p>

                            <strong>
                                Price:
                            </strong>{" "}

                            ₹
                            {Number(
                                stock.currentPrice
                            ).toFixed(2)}

                        </p>


                        <p className="text-xl font-bold text-blue-600 mt-3">

                            Total: ₹
                            {total.toFixed(2)}

                        </p>

                    </div>


                    {/* TRADE RESULT */}

                    {tradeResult && (

                        <div className="border rounded-lg p-6 bg-green-50">


                            <h2 className="text-xl font-semibold mb-4 text-green-700">

                                Trade Successful

                            </h2>


                            <p>

                                <strong>
                                    Stock:
                                </strong>{" "}

                                {tradeResult.symbol}

                            </p>


                            <p>

                                <strong>
                                    Quantity:
                                </strong>{" "}

                                {tradeResult.quantity}

                            </p>


                            <p>

                                <strong>
                                    Price Per Share:
                                </strong>{" "}

                                ₹
                                {Number(
                                    tradeResult.pricePerShare
                                ).toFixed(2)}

                            </p>


                            <p>

                                <strong>
                                    Total Amount:
                                </strong>{" "}

                                ₹
                                {Number(
                                    tradeResult.totalAmount
                                ).toFixed(2)}

                            </p>


                            <p className="mt-3 text-lg font-bold">

                                <strong>
                                    Wallet Balance:
                                </strong>{" "}

                                ₹
                                {Number(
                                    tradeResult.walletBalance
                                ).toFixed(2)}

                            </p>


                            {tradeResult.transactionTime && (

                                <p className="text-sm text-gray-600 mt-2">

                                    Transaction Time:{" "}

                                    {new Date(
                                        tradeResult.transactionTime
                                    ).toLocaleString()}

                                </p>

                            )}

                        </div>

                    )}

                </>

            )}

        </div>

    );

};


export default Trading;