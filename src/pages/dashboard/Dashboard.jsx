import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import dashboardService from "../../services/dashboardService";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");


    // =========================
    // LOAD DASHBOARD
    // =========================

    const fetchDashboard = async () => {

        try {

            setError("");

            const data =
                await dashboardService.getDashboard();

            console.log(
                "Dashboard Response:",
                data
            );

            setDashboard(data);

        } catch (error) {

            console.error(
                "Dashboard Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load dashboard."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchDashboard();

    }, []);


    // =========================
    // REFRESH
    // =========================

    const handleRefresh = async () => {

        try {

            setRefreshing(true);

            await fetchDashboard();

        } finally {

            setRefreshing(false);

        }

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

                <h2 className="text-xl sm:text-2xl font-bold">
                    Loading Dashboard...
                </h2>

            </div>

        );

    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (

            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

                <div className="bg-red-100 text-red-700 p-4 rounded-lg">

                    {error}

                </div>

                <button
                    onClick={handleRefresh}
                    className="mt-4 w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
                >
                    Try Again
                </button>

            </div>

        );

    }


    // =========================
    // NO DATA
    // =========================

    if (!dashboard) {

        return (

            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

                <h2 className="text-xl sm:text-2xl font-bold">
                    No dashboard data available.
                </h2>

            </div>

        );

    }


    // =========================
    // DASHBOARD UI
    // =========================

    return (

        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">


            {/* =========================
                HEADER
            ========================= */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                        Dashboard
                    </h1>

                    <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
                        Welcome to TradeFlow
                    </p>

                </div>


                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="w-full sm:w-auto border px-5 py-2.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
                >

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}

                </button>

            </div>


            {/* =========================
                MAIN FINANCIAL CARDS
            ========================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-6 sm:mt-8">


                {/* WALLET */}

                <Link
                    to="/wallet"
                    className="bg-white shadow-sm rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition min-w-0"
                >

                    <p className="text-gray-500">
                        Wallet Balance
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold mt-2 break-words">
                        ₹
                        {Number(
                            dashboard.walletBalance || 0
                        ).toFixed(2)}
                    </h2>

                    <p className="text-sm text-blue-600 mt-3">
                        View Wallet →
                    </p>

                </Link>


                {/* INVESTED */}

                <Link
                    to="/portfolio"
                    className="bg-white shadow-sm rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition min-w-0"
                >

                    <p className="text-gray-500">
                        Invested Amount
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold mt-2 break-words">
                        ₹
                        {Number(
                            dashboard.investedAmount || 0
                        ).toFixed(2)}
                    </h2>

                    <p className="text-sm text-blue-600 mt-3">
                        View Portfolio →
                    </p>

                </Link>


                {/* PORTFOLIO */}

                <Link
                    to="/portfolio"
                    className="bg-white shadow-sm rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition min-w-0"
                >

                    <p className="text-gray-500">
                        Portfolio Value
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold mt-2 break-words">
                        ₹
                        {Number(
                            dashboard.portfolioValue || 0
                        ).toFixed(2)}
                    </h2>

                    <p className="text-sm text-blue-600 mt-3">
                        View Holdings →
                    </p>

                </Link>


                {/* PROFIT / LOSS */}

                <Link
                    to="/portfolio"
                    className="bg-white shadow-sm rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition min-w-0"
                >

                    <p className="text-gray-500">
                        Profit / Loss
                    </p>

                    <h2
                        className={`text-3xl font-bold mt-2 ${
                            Number(
                                dashboard.profitLoss || 0
                            ) >= 0
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >

                        ₹
                        {Number(
                            dashboard.profitLoss || 0
                        ).toFixed(2)}

                    </h2>

                    <p className="text-sm text-blue-600 mt-3">
                        View Performance →
                    </p>

                </Link>

            </div>


            {/* =========================
                STATISTICS
            ========================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mt-5 sm:mt-6">


                {/* HOLDINGS */}

                <Link
                    to="/portfolio"
                    className="bg-white shadow-sm rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition min-w-0"
                >

                    <p className="text-gray-500">
                        Total Holdings
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold mt-2 break-words">
                        {dashboard.totalHoldings || 0}
                    </h2>

                    <p className="text-sm text-blue-600 mt-3">
                        View Portfolio →
                    </p>

                </Link>


                {/* TRANSACTIONS */}

                <Link
                    to="/transactions"
                    className="bg-white shadow-sm rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition min-w-0"
                >

                    <p className="text-gray-500">
                        Total Transactions
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold mt-2 break-words">
                        {dashboard.totalTransactions || 0}
                    </h2>

                    <p className="text-sm text-blue-600 mt-3">
                        View Transactions →
                    </p>

                </Link>


                {/* WATCHLIST */}

                <Link
                    to="/watchlist"
                    className="bg-white shadow-sm rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition min-w-0"
                >

                    <p className="text-gray-500">
                        Watchlist
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold mt-2 break-words">
                        {dashboard.watchlistCount || 0}
                    </h2>

                    <p className="text-sm text-blue-600 mt-3">
                        View Watchlist →
                    </p>

                </Link>

            </div>


            {/* =========================
                QUICK ACTIONS
            ========================= */}

            <div className="mt-6 sm:mt-8">

                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
                    Quick Actions
                </h2>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">


                    {/* STOCKS */}

                    <Link
                        to="/stocks"
                        className="bg-blue-600 text-white rounded-xl p-5 sm:p-6 hover:bg-blue-700 transition min-h-[160px]"
                    >

                        <h3 className="text-lg sm:text-xl font-bold">
                            Browse Stocks
                        </h3>

                        <p className="mt-2 text-blue-100">
                            Search stocks and view market prices.
                        </p>

                        <p className="mt-4 font-semibold">
                            Explore Stocks →
                        </p>

                    </Link>


                    {/* TRADING */}

                    <Link
                        to="/trading"
                        className="bg-green-600 text-white rounded-xl p-5 sm:p-6 hover:bg-green-700 transition min-h-[160px]"
                    >

                        <h3 className="text-lg sm:text-xl font-bold">
                            Start Trading
                        </h3>

                        <p className="mt-2 text-green-100">
                            Buy or sell stocks from your account.
                        </p>

                        <p className="mt-4 font-semibold">
                            Trade Now →
                        </p>

                    </Link>


                    {/* WATCHLIST */}

                    <Link
                        to="/watchlist"
                        className="bg-purple-600 text-white rounded-xl p-5 sm:p-6 hover:bg-purple-700 transition min-h-[160px]"
                    >

                        <h3 className="text-lg sm:text-xl font-bold">
                            My Watchlist
                        </h3>

                        <p className="mt-2 text-purple-100">
                            Track stocks you are interested in.
                        </p>

                        <p className="mt-4 font-semibold">
                            Open Watchlist →
                        </p>

                    </Link>

                </div>

            </div>


            {/* =========================
                ACCOUNT OVERVIEW
            ========================= */}

            <div className="mt-6 sm:mt-8 bg-white shadow-sm rounded-xl p-4 sm:p-5 lg:p-6 overflow-hidden">

                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5">
                    Account Overview
                </h2>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">


                    <div>

                        <p className="text-gray-500">
                            Available Cash
                        </p>

                        <p className="text-lg sm:text-xl font-bold mt-1 break-words">
                            ₹
                            {Number(
                                dashboard.walletBalance || 0
                            ).toFixed(2)}
                        </p>

                    </div>


                    <div>

                        <p className="text-gray-500">
                            Invested
                        </p>

                        <p className="text-lg sm:text-xl font-bold mt-1 break-words">
                            ₹
                            {Number(
                                dashboard.investedAmount || 0
                            ).toFixed(2)}
                        </p>

                    </div>


                    <div>

                        <p className="text-gray-500">
                            Portfolio Value
                        </p>

                        <p className="text-lg sm:text-xl font-bold mt-1 break-words">
                            ₹
                            {Number(
                                dashboard.portfolioValue || 0
                            ).toFixed(2)}
                        </p>

                    </div>

                </div>

            </div>


        </div>

    );

}

export default Dashboard;