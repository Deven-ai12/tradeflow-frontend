import { useEffect, useState } from "react";
import watchlistService from "../../services/watchlistService";

const Watchlist = () => {

    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // =========================
    // LOAD WATCHLIST
    // =========================

    const loadWatchlist = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await watchlistService.getWatchlist();

            console.log("WATCHLIST:", data);

            setWatchlist(data);

        } catch (error) {

            console.error(
                "WATCHLIST ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to load watchlist."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // REMOVE FROM WATCHLIST
    // =========================

    const handleRemove = async (symbol) => {

        try {

            setError("");
            setMessage("");

            await watchlistService.removeFromWatchlist(
                symbol
            );

            setMessage(
                `${symbol} removed from watchlist.`
            );

            // Remove immediately from UI
            setWatchlist((prev) =>
                prev.filter(
                    (stock) =>
                        stock.symbol !== symbol
                )
            );

        } catch (error) {

            console.error(
                "REMOVE WATCHLIST ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to remove stock."
            );

        }

    };


    // =========================
    // LOAD ON PAGE OPEN
    // =========================

    useEffect(() => {

        loadWatchlist();

    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="max-w-6xl mx-auto p-6">
                <p className="text-gray-600">
                    Loading watchlist...
                </p>
            </div>
        );

    }


    // =========================
    // UI
    // =========================

    return (

        <div className="max-w-6xl mx-auto p-6">

            {/* HEADER */}

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-3xl font-bold text-blue-600">
                        My Watchlist
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Track your favourite stocks
                    </p>

                </div>


                <button
                    onClick={loadWatchlist}
                    className="border px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                    Refresh
                </button>

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


            {/* EMPTY */}

            {watchlist.length === 0 ? (

                <div className="border rounded-xl p-10 text-center">

                    <h2 className="text-xl font-semibold mb-2">
                        Your watchlist is empty
                    </h2>

                    <p className="text-gray-500">
                        Add stocks from the trading or stocks page.
                    </p>

                </div>

            ) : (

                /* STOCK LIST */

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    {watchlist.map((stock) => (

                        <div
                            key={stock.id}
                            className="border rounded-xl p-6 bg-white shadow-sm"
                        >

                            {/* STOCK */}

                            <div className="flex justify-between items-start">

                                <div>

                                    <h2 className="text-xl font-bold">

                                        {stock.symbol}

                                    </h2>

                                    <p className="text-gray-500">

                                        {stock.companyName}

                                    </p>

                                </div>


                                <button
                                    onClick={() =>
                                        handleRemove(
                                            stock.symbol
                                        )
                                    }
                                    className="text-red-600 hover:text-red-800 font-semibold"
                                >
                                    Remove
                                </button>

                            </div>


                            {/* PRICE */}

                            <div className="mt-6">

                                <p className="text-gray-500 text-sm">
                                    Current Price
                                </p>

                                <p className="text-2xl font-bold text-blue-600">

                                    ₹
                                    {Number(
                                        stock.currentPrice || 0
                                    ).toFixed(2)}

                                </p>

                            </div>


                            {/* HIGH / LOW */}

                            <div className="grid grid-cols-2 gap-4 mt-5">

                                <div>

                                    <p className="text-gray-500 text-sm">
                                        Day High
                                    </p>

                                    <p className="font-semibold text-green-600">

                                        ₹
                                        {Number(
                                            stock.dayHigh || 0
                                        ).toFixed(2)}

                                    </p>

                                </div>


                                <div>

                                    <p className="text-gray-500 text-sm">
                                        Day Low
                                    </p>

                                    <p className="font-semibold text-red-600">

                                        ₹
                                        {Number(
                                            stock.dayLow || 0
                                        ).toFixed(2)}

                                    </p>

                                </div>

                            </div>


                            {/* PREVIOUS CLOSE */}

                            <div className="mt-5">

                                <p className="text-gray-500 text-sm">
                                    Previous Close
                                </p>

                                <p className="font-semibold">

                                    ₹
                                    {Number(
                                        stock.previousClose || 0
                                    ).toFixed(2)}

                                </p>

                            </div>


                            {/* LAST UPDATED */}

                            {stock.lastUpdated && (

                                <p className="text-xs text-gray-400 mt-5">

                                    Updated:{" "}
                                    {new Date(
                                        stock.lastUpdated
                                    ).toLocaleString()}

                                </p>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

};

export default Watchlist;