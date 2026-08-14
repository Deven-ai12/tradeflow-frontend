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

    const [searchParams] = useSearchParams();

    const [search, setSearch] = useState("");
    const [stock, setStock] = useState(null);
    const [quantity, setQuantity] = useState(10);

    const [tradeResult, setTradeResult] = useState(null);

    const [loading, setLoading] = useState(false);
    const [watchlistLoading, setWatchlistLoading] =
        useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    const searchStock = async (symbol = search) => {

        const stockSymbol =
            symbol.trim().toUpperCase();

        if (!stockSymbol) {
            setError("Please enter a stock symbol.");
            return;
        }

        try {

            setLoading(true);
            setError("");
            setMessage("");

            const data =
                await stockService.getStock(
                    stockSymbol
                );

            setStock(data);
            setSearch(stockSymbol);

        } catch (error) {

            console.error(error);

            setStock(null);

            setError(
                error.response?.data?.message ||
                "Stock not found."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        const symbol =
            searchParams.get("symbol");

        if (symbol) {

            setSearch(symbol.toUpperCase());

            searchStock(symbol);

        }

    }, [searchParams]);


    const increaseQuantity = () => {

        setQuantity(
            (previous) => previous + 1
        );

    };


    const decreaseQuantity = () => {

        setQuantity((previous) => {

            if (previous > 1) {
                return previous - 1;
            }

            return 1;

        });

    };


    const handleAddToWatchlist =
        async () => {

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

                await watchlistService.addToWatchlist(
                    stock.symbol
                );

                setMessage(
                    `${stock.symbol} added to watchlist successfully.`
                );

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to add stock to watchlist."
                );

            } finally {

                setWatchlistLoading(false);

            }

        };


    const handleBuy = async () => {

        if (!stock?.symbol) {

            setError(
                "Please search for a stock first."
            );

            return;
        }

        if (
            !quantity ||
            Number(quantity) < 1
        ) {

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

            setTradeResult(response);

            setMessage(
                response?.message ||
                "Stock bought successfully."
            );

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

            await refreshAfterTrade();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to buy stock."
            );

        } finally {

            setLoading(false);

        }

    };


    const handleSell = async () => {

        if (!stock?.symbol) {

            setError(
                "Please search for a stock first."
            );

            return;
        }

        if (
            !quantity ||
            Number(quantity) < 1
        ) {

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

            setTradeResult(response);

            setMessage(
                response?.message ||
                "Stock sold successfully."
            );

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

            await refreshAfterTrade();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to sell stock."
            );

        } finally {

            setLoading(false);

        }

    };


    const refreshAfterTrade =
        async () => {

            try {

                const [
                    portfolio,
                    wallet
                ] = await Promise.all([
                    portfolioService.getPortfolio(),
                    walletService.getWallet(),
                ]);

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
                    "Refresh error:",
                    error
                );

            }

        };


    const total =
        stock
            ? Number(
                stock.currentPrice || 0
            ) * Number(quantity || 0)
            : 0;


    return (

        <div className="
            w-full
            max-w-5xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-6
            sm:py-8
        ">

            <div className="mb-6">

                <h1 className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-blue-600
                ">
                    Trading
                </h1>

                <p className="
                    text-sm
                    sm:text-base
                    text-gray-500
                    mt-1
                ">
                    Search stocks and place buy or sell orders
                </p>

            </div>


            {/* SEARCH */}

            <div className="mb-6">

                <label className="
                    block
                    font-semibold
                    mb-2
                ">
                    Search Stock
                </label>

                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    gap-3
                ">

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        onKeyDown={(event) => {

                            if (
                                event.key === "Enter"
                            ) {
                                searchStock();
                            }

                        }}
                        placeholder="AAPL / NVDA"
                        className="
                            w-full
                            flex-1
                            border
                            border-gray-300
                            rounded-lg
                            px-4
                            py-3
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    />

                    <button
                        onClick={() =>
                            searchStock()
                        }
                        disabled={loading}
                        className="
                            w-full
                            sm:w-auto
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-6
                            py-3
                            rounded-lg
                            font-semibold
                            disabled:opacity-50
                        "
                    >
                        {loading
                            ? "Searching..."
                            : "Search"}
                    </button>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="
                    mb-5
                    p-4
                    rounded-lg
                    bg-red-100
                    text-red-700
                ">
                    {error}
                </div>

            )}


            {/* MESSAGE */}

            {message && (

                <div className="
                    mb-5
                    p-4
                    rounded-lg
                    bg-green-100
                    text-green-700
                ">
                    {message}
                </div>

            )}


            {/* STOCK */}

            {stock && (

                <div className="
                    border
                    rounded-xl
                    p-4
                    sm:p-6
                    bg-gray-50
                    mb-6
                ">

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:justify-between
                        gap-4
                    ">

                        <div>

                            <p className="
                                text-sm
                                text-gray-500
                            ">
                                Stock
                            </p>

                            <h2 className="
                                text-2xl
                                font-bold
                            ">
                                {stock.symbol}
                            </h2>

                            <p className="text-gray-600">
                                {stock.companyName ||
                                    "Company name unavailable"}
                            </p>

                        </div>


                        <div className="
                            sm:text-right
                        ">

                            <p className="
                                text-sm
                                text-gray-500
                            ">
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


                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-3
                        gap-4
                        mt-6
                    ">

                        <div className="
                            bg-white
                            border
                            rounded-lg
                            p-4
                        ">
                            <p className="text-sm text-gray-500">
                                Previous Close
                            </p>

                            <p className="font-bold text-lg">
                                ₹
                                {Number(
                                    stock.previousClose || 0
                                ).toFixed(2)}
                            </p>
                        </div>


                        <div className="
                            bg-white
                            border
                            rounded-lg
                            p-4
                        ">
                            <p className="text-sm text-gray-500">
                                Day High
                            </p>

                            <p className="
                                font-bold
                                text-lg
                                text-green-600
                            ">
                                ₹
                                {Number(
                                    stock.dayHigh || 0
                                ).toFixed(2)}
                            </p>
                        </div>


                        <div className="
                            bg-white
                            border
                            rounded-lg
                            p-4
                        ">
                            <p className="text-sm text-gray-500">
                                Day Low
                            </p>

                            <p className="
                                font-bold
                                text-lg
                                text-red-600
                            ">
                                ₹
                                {Number(
                                    stock.dayLow || 0
                                ).toFixed(2)}
                            </p>
                        </div>

                    </div>


                    <button
                        onClick={
                            handleAddToWatchlist
                        }
                        disabled={
                            watchlistLoading
                        }
                        className="
                            w-full
                            mt-5
                            border
                            border-yellow-500
                            text-yellow-600
                            hover:bg-yellow-50
                            py-3
                            rounded-lg
                            font-semibold
                            disabled:opacity-50
                        "
                    >
                        {watchlistLoading
                            ? "Adding..."
                            : "☆ Add to Watchlist"}
                    </button>

                </div>

            )}


            {/* TRADING */}

            {stock && (

                <>

                    <div className="mb-6">

                        <p className="
                            font-semibold
                            mb-3
                        ">
                            Quantity
                        </p>

                        <div className="
                            flex
                            items-center
                            gap-4
                        ">

                            <button
                                onClick={
                                    decreaseQuantity
                                }
                                className="
                                    w-11
                                    h-11
                                    border
                                    rounded-lg
                                    text-xl
                                "
                            >
                                −
                            </button>

                            <span className="
                                min-w-[40px]
                                text-center
                                font-semibold
                            ">
                                {quantity}
                            </span>

                            <button
                                onClick={
                                    increaseQuantity
                                }
                                className="
                                    w-11
                                    h-11
                                    border
                                    rounded-lg
                                    text-xl
                                "
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        gap-3
                        mb-6
                    ">

                        <button
                            onClick={handleBuy}
                            disabled={loading}
                            className="
                                w-full
                                sm:flex-1
                                bg-green-600
                                hover:bg-green-700
                                text-white
                                py-3
                                rounded-lg
                                font-semibold
                                disabled:opacity-50
                            "
                        >
                            BUY
                        </button>

                        <button
                            onClick={handleSell}
                            disabled={loading}
                            className="
                                w-full
                                sm:flex-1
                                bg-red-600
                                hover:bg-red-700
                                text-white
                                py-3
                                rounded-lg
                                font-semibold
                                disabled:opacity-50
                            "
                        >
                            SELL
                        </button>

                    </div>


                    <div className="
                        border
                        rounded-xl
                        p-4
                        sm:p-6
                        bg-white
                    ">

                        <h2 className="
                            text-xl
                            font-semibold
                            mb-4
                        ">
                            Order Summary
                        </h2>

                        <div className="space-y-3">

                            <div className="
                                flex
                                justify-between
                            ">
                                <span>
                                    Stock
                                </span>

                                <strong>
                                    {stock.symbol}
                                </strong>
                            </div>

                            <div className="
                                flex
                                justify-between
                            ">
                                <span>
                                    Quantity
                                </span>

                                <strong>
                                    {quantity}
                                </strong>
                            </div>

                            <div className="
                                flex
                                justify-between
                            ">
                                <span>
                                    Price
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        stock.currentPrice || 0
                                    ).toFixed(2)}
                                </strong>
                            </div>

                            <div className="
                                border-t
                                pt-4
                                flex
                                justify-between
                                font-bold
                            ">
                                <span>
                                    Total
                                </span>

                                <span className="
                                    text-blue-600
                                ">
                                    ₹{total.toFixed(2)}
                                </span>
                            </div>

                        </div>

                    </div>


                    {tradeResult && (

                        <div className="
                            mt-6
                            border
                            rounded-xl
                            p-4
                            sm:p-6
                            bg-green-50
                        ">

                            <h2 className="
                                text-xl
                                font-semibold
                                text-green-700
                                mb-4
                            ">
                                Trade Successful
                            </h2>

                            <div className="space-y-3">

                                <div className="
                                    flex
                                    justify-between
                                ">
                                    <span>
                                        Stock
                                    </span>

                                    <strong>
                                        {tradeResult.symbol}
                                    </strong>
                                </div>

                                <div className="
                                    flex
                                    justify-between
                                ">
                                    <span>
                                        Quantity
                                    </span>

                                    <strong>
                                        {tradeResult.quantity}
                                    </strong>
                                </div>

                                <div className="
                                    flex
                                    justify-between
                                ">
                                    <span>
                                        Total Amount
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            tradeResult.totalAmount || 0
                                        ).toFixed(2)}
                                    </strong>
                                </div>

                                <div className="
                                    border-t
                                    pt-3
                                    flex
                                    justify-between
                                ">
                                    <span>
                                        Wallet Balance
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            tradeResult.walletBalance || 0
                                        ).toFixed(2)}
                                    </strong>
                                </div>

                            </div>

                        </div>

                    )}

                </>

            )}

        </div>

    );

};

export default Trading;