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

            const data =
                await portfolioService.getPortfolio();

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
            <div className="p-8">
                Loading portfolio...
            </div>
        );

    }

    return (

        <div className="max-w-6xl mx-auto p-6">

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-3xl font-bold text-blue-600">
                        My Portfolio
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Your current stock holdings
                    </p>

                </div>

                <button
                    onClick={loadPortfolio}
                    className="border px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                    Refresh
                </button>

            </div>

            {error && (

                <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-lg">

                    {error}

                </div>

            )}

            {!error && portfolio.length === 0 && (

                <div className="bg-white border rounded-xl p-10 text-center">

                    <h2 className="text-xl font-semibold mb-2">
                        No stocks in your portfolio
                    </h2>

                    <p className="text-gray-500">
                        Buy a stock to see it here.
                    </p>

                </div>

            )}

            {portfolio.length > 0 && (

                <div className="bg-white border rounded-xl overflow-hidden">

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-100">

                                <tr>

                                    <th className="text-left p-4">
                                        Stock
                                    </th>

                                    <th className="text-right p-4">
                                        Quantity
                                    </th>

                                    <th className="text-right p-4">
                                        Avg Buy Price
                                    </th>

                                    <th className="text-right p-4">
                                        Current Price
                                    </th>

                                    <th className="text-right p-4">
                                        Current Value
                                    </th>

                                    <th className="text-right p-4">
                                        Profit / Loss
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {portfolio.map((item) => {

                                    const currentValue =
                                        Number(item.currentPrice) *
                                        item.quantity;

                                    const investedValue =
                                        Number(item.averageBuyPrice) *
                                        item.quantity;

                                    const profitLoss =
                                        currentValue -
                                        investedValue;

                                    return (

                                        <tr
                                            key={item.stockSymbol}
                                            className="border-t hover:bg-gray-50"
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

                                                {item.quantity}

                                            </td>

                                            <td className="text-right p-4">

                                                ₹{Number(
                                                    item.averageBuyPrice
                                                ).toFixed(2)}

                                            </td>

                                            <td className="text-right p-4">

                                                ₹{Number(
                                                    item.currentPrice
                                                ).toFixed(2)}

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

                </div>

            )}

        </div>

    );

}

export default Portfolio;