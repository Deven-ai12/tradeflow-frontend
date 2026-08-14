import { useEffect, useState } from "react";
import portfolioService from "../../services/portfolioService";

function Portfolio() {
    const [portfolio, setPortfolio] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPortfolio = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await portfolioService.getPortfolio();

            console.log("Portfolio:", data);

            setPortfolio(data);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load portfolio."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPortfolio();

        const handlePortfolioUpdated = () => {
            console.log("Trade completed. Refreshing portfolio...");
            loadPortfolio();
        };

        window.addEventListener(
            "portfolioUpdated",
            handlePortfolioUpdated
        );

        return () => {
            window.removeEventListener(
                "portfolioUpdated",
                handlePortfolioUpdated
            );
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center p-6">
                <div className="text-gray-600 text-sm sm:text-base">
                    Loading portfolio...
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
                        My Portfolio
                    </h1>

                    <p className="text-sm sm:text-base text-gray-500 mt-1">
                        Your current stock holdings
                    </p>
                </div>

                <button
                    onClick={loadPortfolio}
                    className="
                        w-full sm:w-auto
                        border border-gray-300
                        px-4 py-2
                        rounded-lg
                        hover:bg-gray-100
                        active:bg-gray-200
                        transition
                        text-sm sm:text-base
                    "
                >
                    Refresh
                </button>

            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-lg text-sm sm:text-base">
                    {error}
                </div>
            )}

            {/* Empty Portfolio */}
            {!error && portfolio.length === 0 && (
                <div className="bg-white border rounded-xl p-6 sm:p-10 text-center">
                    <h2 className="text-lg sm:text-xl font-semibold mb-2">
                        No stocks in your portfolio
                    </h2>

                    <p className="text-sm sm:text-base text-gray-500">
                        Buy a stock to see it here.
                    </p>
                </div>
            )}

            {/* Portfolio */}
            {portfolio.length > 0 && (
                <div className="bg-white border rounded-xl overflow-hidden">

                    {/* ================= DESKTOP TABLE ================= */}
                    <div className="hidden md:block overflow-x-auto">

                        <table className="w-full min-w-[800px]">

                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="text-left p-4 text-sm font-semibold">
                                        Stock
                                    </th>

                                    <th className="text-right p-4 text-sm font-semibold">
                                        Quantity
                                    </th>

                                    <th className="text-right p-4 text-sm font-semibold">
                                        Avg Buy Price
                                    </th>

                                    <th className="text-right p-4 text-sm font-semibold">
                                        Current Price
                                    </th>

                                    <th className="text-right p-4 text-sm font-semibold">
                                        Current Value
                                    </th>

                                    <th className="text-right p-4 text-sm font-semibold">
                                        Profit / Loss
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {portfolio.map((item) => {
                                    const quantity = Number(item.quantity) || 0;

                                    const currentPrice =
                                        Number(item.currentPrice) || 0;

                                    const averageBuyPrice =
                                        Number(item.averageBuyPrice) || 0;

                                    const currentValue =
                                        currentPrice * quantity;

                                    const investedValue =
                                        averageBuyPrice * quantity;

                                    const profitLoss =
                                        currentValue - investedValue;

                                    return (
                                        <tr
                                            key={item.stockSymbol}
                                            className="border-t hover:bg-gray-50 transition"
                                        >
                                            <td className="p-4">
                                                <div className="font-semibold">
                                                    {item.stockSymbol}
                                                </div>

                                                <div className="text-sm text-gray-500">
                                                    {item.companyName ||
                                                        "Company name unavailable"}
                                                </div>
                                            </td>

                                            <td className="text-right p-4">
                                                {quantity}
                                            </td>

                                            <td className="text-right p-4">
                                                ₹{averageBuyPrice.toFixed(2)}
                                            </td>

                                            <td className="text-right p-4">
                                                ₹{currentPrice.toFixed(2)}
                                            </td>

                                            <td className="text-right p-4 font-semibold">
                                                ₹{currentValue.toFixed(2)}
                                            </td>

                                            <td
                                                className={`text-right p-4 font-semibold ${
                                                    profitLoss >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {profitLoss >= 0 ? "+" : ""}
                                                ₹{profitLoss.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                        </table>
                    </div>

                    {/* ================= MOBILE CARDS ================= */}
                    <div className="md:hidden divide-y">

                        {portfolio.map((item) => {
                            const quantity = Number(item.quantity) || 0;

                            const currentPrice =
                                Number(item.currentPrice) || 0;

                            const averageBuyPrice =
                                Number(item.averageBuyPrice) || 0;

                            const currentValue =
                                currentPrice * quantity;

                            const investedValue =
                                averageBuyPrice * quantity;

                            const profitLoss =
                                currentValue - investedValue;

                            return (
                                <div
                                    key={item.stockSymbol}
                                    className="p-4 sm:p-5"
                                >

                                    {/* Stock Header */}
                                    <div className="flex items-start justify-between gap-4 mb-4">

                                        <div className="min-w-0">
                                            <div className="font-bold text-base sm:text-lg">
                                                {item.stockSymbol}
                                            </div>

                                            <div className="text-xs sm:text-sm text-gray-500 truncate">
                                                {item.companyName ||
                                                    "Company name unavailable"}
                                            </div>
                                        </div>

                                        <div
                                            className={`text-right font-bold whitespace-nowrap ${
                                                profitLoss >= 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            <div className="text-sm sm:text-base">
                                                {profitLoss >= 0 ? "+" : ""}
                                                ₹{profitLoss.toFixed(2)}
                                            </div>

                                            <div className="text-xs font-normal">
                                                P/L
                                            </div>
                                        </div>

                                    </div>

                                    {/* Details */}
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">

                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-xs text-gray-500 mb-1">
                                                Quantity
                                            </div>

                                            <div className="font-semibold text-sm sm:text-base">
                                                {quantity}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-xs text-gray-500 mb-1">
                                                Avg Buy Price
                                            </div>

                                            <div className="font-semibold text-sm sm:text-base">
                                                ₹{averageBuyPrice.toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-xs text-gray-500 mb-1">
                                                Current Price
                                            </div>

                                            <div className="font-semibold text-sm sm:text-base">
                                                ₹{currentPrice.toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-xs text-gray-500 mb-1">
                                                Current Value
                                            </div>

                                            <div className="font-semibold text-sm sm:text-base">
                                                ₹{currentValue.toFixed(2)}
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>
            )}

        </div>
    );
}

export default Portfolio;