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
            <div className="
                w-full
                max-w-6xl
                mx-auto
                px-4
                sm:px-6
                lg:px-8
                py-6
                sm:py-8
            ">
                <p className="
                    text-sm
                    sm:text-base
                    text-gray-600
                ">
                    Loading watchlist...
                </p>
            </div>
        );

    }


    // =========================
    // UI
    // =========================

    return (

        <div className="
            w-full
            max-w-6xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-6
            sm:py-8
        ">

            {/* HEADER */}

            <div className="
                flex
                flex-col
                sm:flex-row
                sm:justify-between
                sm:items-center
                gap-4
                mb-6
                sm:mb-8
            ">

                <div className="min-w-0">

                    <h1 className="
                        text-2xl
                        sm:text-3xl
                        font-bold
                        text-blue-600
                    ">
                        My Watchlist
                    </h1>

                    <p className="
                        text-sm
                        sm:text-base
                        text-gray-500
                        mt-1
                    ">
                        Track your favourite stocks
                    </p>

                </div>


                <button
                    onClick={loadWatchlist}
                    className="
                        w-full
                        sm:w-auto
                        border
                        px-4
                        py-2.5
                        rounded-lg
                        hover:bg-gray-100
                        text-sm
                        sm:text-base
                        font-medium
                        transition
                    "
                >
                    Refresh
                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="
                    mb-5
                    sm:mb-6
                    p-3
                    sm:p-4
                    bg-red-100
                    text-red-700
                    rounded-lg
                    text-sm
                    sm:text-base
                    break-words
                ">

                    {error}

                </div>

            )}


            {/* SUCCESS */}

            {message && (

                <div className="
                    mb-5
                    sm:mb-6
                    p-3
                    sm:p-4
                    bg-green-100
                    text-green-700
                    rounded-lg
                    text-sm
                    sm:text-base
                    break-words
                ">

                    {message}

                </div>

            )}


            {/* EMPTY */}

            {watchlist.length === 0 ? (

                <div className="
                    border
                    rounded-xl
                    p-6
                    sm:p-10
                    text-center
                ">

                    <h2 className="
                        text-lg
                        sm:text-xl
                        font-semibold
                        mb-2
                    ">
                        Your watchlist is empty
                    </h2>

                    <p className="
                        text-sm
                        sm:text-base
                        text-gray-500
                    ">
                        Add stocks from the trading or stocks page.
                    </p>

                </div>

            ) : (

                /* STOCK LIST */

                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-4
                    sm:gap-5
                ">

                    {watchlist.map((stock) => (

                        <div
                            key={stock.id}
                            className="
                                border
                                rounded-xl
                                p-4
                                sm:p-6
                                bg-white
                                shadow-sm
                                min-w-0
                            "
                        >

                            {/* STOCK */}

                            <div className="
                                flex
                                flex-col
                                xs:flex-row
                                sm:flex-row
                                justify-between
                                items-start
                                gap-3
                            ">

                                <div className="
                                    min-w-0
                                    flex-1
                                ">

                                    <h2 className="
                                        text-xl
                                        font-bold
                                        break-words
                                    ">

                                        {stock.symbol}

                                    </h2>

                                    <p className="
                                        text-sm
                                        text-gray-500
                                        break-words
                                    ">

                                        {stock.companyName}

                                    </p>

                                </div>


                                <button
                                    onClick={() =>
                                        handleRemove(
                                            stock.symbol
                                        )
                                    }
                                    className="
                                        shrink-0
                                        text-red-600
                                        hover:text-red-800
                                        font-semibold
                                        text-sm
                                        sm:text-base
                                        py-1
                                    "
                                >
                                    Remove
                                </button>

                            </div>


                            {/* PRICE */}

                            <div className="mt-5 sm:mt-6">

                                <p className="
                                    text-gray-500
                                    text-xs
                                    sm:text-sm
                                ">
                                    Current Price
                                </p>

                                <p className="
                                    text-2xl
                                    sm:text-2xl
                                    font-bold
                                    text-blue-600
                                ">

                                    ₹
                                    {Number(
                                        stock.currentPrice || 0
                                    ).toFixed(2)}

                                </p>

                            </div>


                            {/* HIGH / LOW */}

                            <div className="
                                grid
                                grid-cols-2
                                gap-3
                                sm:gap-4
                                mt-5
                            ">

                                <div className="min-w-0">

                                    <p className="
                                        text-gray-500
                                        text-xs
                                        sm:text-sm
                                    ">
                                        Day High
                                    </p>

                                    <p className="
                                        font-semibold
                                        text-green-600
                                        text-sm
                                        sm:text-base
                                    ">

                                        ₹
                                        {Number(
                                            stock.dayHigh || 0
                                        ).toFixed(2)}

                                    </p>

                                </div>


                                <div className="min-w-0">

                                    <p className="
                                        text-gray-500
                                        text-xs
                                        sm:text-sm
                                    ">
                                        Day Low
                                    </p>

                                    <p className="
                                        font-semibold
                                        text-red-600
                                        text-sm
                                        sm:text-base
                                    ">

                                        ₹
                                        {Number(
                                            stock.dayLow || 0
                                        ).toFixed(2)}

                                    </p>

                                </div>

                            </div>


                            {/* PREVIOUS CLOSE */}

                            <div className="mt-5">

                                <p className="
                                    text-gray-500
                                    text-xs
                                    sm:text-sm
                                ">
                                    Previous Close
                                </p>

                                <p className="
                                    font-semibold
                                    text-sm
                                    sm:text-base
                                ">

                                    ₹
                                    {Number(
                                        stock.previousClose || 0
                                    ).toFixed(2)}

                                </p>

                            </div>


                            {/* LAST UPDATED */}

                            {stock.lastUpdated && (

                                <p className="
                                    text-xs
                                    text-gray-400
                                    mt-5
                                    break-words
                                ">

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