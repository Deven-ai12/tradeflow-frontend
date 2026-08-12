import { useEffect, useState } from "react";
import transactionService from "../../services/transactionService";

const Transactions = () => {

    // =========================
    // TRANSACTION DATA
    // =========================

    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================
    // FILTER STATE
    // =========================

    const [type, setType] = useState("");

    const [symbol, setSymbol] = useState("");

    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");


    // =========================
    // PAGINATION STATE
    // =========================

    const [page, setPage] = useState(0);

    const [pageSize] = useState(5);

    const [totalPages, setTotalPages] = useState(0);

    const [totalElements, setTotalElements] = useState(0);


    // =========================
    // LOAD TRANSACTIONS
    // =========================

    const loadTransactions = async (pageNumber = page) => {

        try {

            setLoading(true);

            setError("");

            const data =
                await transactionService.getTransactions({

                    type,

                    symbol,

                    fromDate: fromDate
                        ? `${fromDate}T00:00:00`
                        : "",

                    toDate: toDate
                        ? `${toDate}T23:59:59`
                        : "",

                    page: pageNumber,

                    size: pageSize

                });


            console.log(
                "Transactions API:",
                data
            );


            // =========================
            // PAGE RESPONSE
            // =========================

            setTransactions(
                data.content || []
            );

            setTotalPages(
                data.totalPages || 0
            );

            setTotalElements(
                data.totalElements || 0
            );

            setPage(
                data.number ?? pageNumber
            );

        } catch (error) {

            console.error(
                "TRANSACTIONS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to load transactions."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        loadTransactions(0);

    }, []);


    // =========================
    // APPLY FILTERS
    // =========================

    const handleApplyFilters = () => {

        setPage(0);

        loadTransactions(0);

    };


    // =========================
    // CLEAR FILTERS
    // =========================

    const handleClearFilters = () => {

        setType("");

        setSymbol("");

        setFromDate("");

        setToDate("");

        setPage(0);

        // Load without filters immediately
        loadTransactionsWithoutFilters();

    };


    // =========================
    // LOAD WITHOUT FILTERS
    // =========================

    const loadTransactionsWithoutFilters = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await transactionService.getTransactions({

                    type: "",

                    symbol: "",

                    fromDate: "",

                    toDate: "",

                    page: 0,

                    size: pageSize

                });


            setTransactions(
                data.content || []
            );

            setTotalPages(
                data.totalPages || 0
            );

            setTotalElements(
                data.totalElements || 0
            );

            setPage(
                data.number ?? 0
            );

        } catch (error) {

            console.error(
                "TRANSACTIONS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to load transactions."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // NEXT PAGE
    // =========================

    const handleNextPage = () => {

        if (page < totalPages - 1) {

            loadTransactions(page + 1);

        }

    };


    // =========================
    // PREVIOUS PAGE
    // =========================

    const handlePreviousPage = () => {

        if (page > 0) {

            loadTransactions(page - 1);

        }

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="max-w-6xl mx-auto p-6">

                <p className="text-gray-600">
                    Loading transactions...
                </p>

            </div>

        );

    }


    // =========================
    // UI
    // =========================

    return (

        <div className="max-w-6xl mx-auto p-6">


            {/* =========================
                HEADER
            ========================= */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-blue-600">

                        Transaction History

                    </h1>

                    <p className="text-gray-500 mt-1">

                        View your recent BUY and SELL transactions

                    </p>

                </div>


                <button
                    onClick={() => loadTransactions(page)}
                    disabled={loading}
                    className="border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >

                    Refresh

                </button>

            </div>


            {/* =========================
                FILTER SECTION
            ========================= */}

            <div className="bg-white border rounded-xl p-5 mb-6">

                <h2 className="font-semibold text-lg mb-4">

                    Filter Transactions

                </h2>


                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


                    {/* TYPE */}

                    <div>

                        <label className="block text-sm font-medium text-gray-600 mb-1">

                            Transaction Type

                        </label>

                        <select
                            value={type}
                            onChange={(e) =>
                                setType(e.target.value)
                            }
                            className="w-full border rounded-lg px-3 py-2"
                        >

                            <option value="">
                                All
                            </option>

                            <option value="BUY">
                                BUY
                            </option>

                            <option value="SELL">
                                SELL
                            </option>

                        </select>

                    </div>


                    {/* SYMBOL */}

                    <div>

                        <label className="block text-sm font-medium text-gray-600 mb-1">

                            Stock Symbol

                        </label>

                        <input
                            type="text"
                            value={symbol}
                            onChange={(e) =>
                                setSymbol(
                                    e.target.value.toUpperCase()
                                )
                            }
                            placeholder="e.g. AAPL"
                            className="w-full border rounded-lg px-3 py-2"
                        />

                    </div>


                    {/* FROM DATE */}

                    <div>

                        <label className="block text-sm font-medium text-gray-600 mb-1">

                            From Date

                        </label>

                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) =>
                                setFromDate(e.target.value)
                            }
                            className="w-full border rounded-lg px-3 py-2"
                        />

                    </div>


                    {/* TO DATE */}

                    <div>

                        <label className="block text-sm font-medium text-gray-600 mb-1">

                            To Date

                        </label>

                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) =>
                                setToDate(e.target.value)
                            }
                            className="w-full border rounded-lg px-3 py-2"
                        />

                    </div>

                </div>


                {/* FILTER BUTTONS */}

                <div className="flex gap-3 mt-5">

                    <button
                        onClick={handleApplyFilters}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >

                        Apply Filters

                    </button>


                    <button
                        onClick={handleClearFilters}
                        className="border border-gray-400 px-5 py-2 rounded-lg hover:bg-gray-100"
                    >

                        Clear

                    </button>

                </div>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-lg">

                    {error}

                </div>

            )}


            {/* =========================
                TRANSACTION COUNT
            ========================= */}

            {!error && (

                <div className="mb-4 text-sm text-gray-500">

                    Total transactions:{" "}

                    <span className="font-semibold text-gray-700">

                        {totalElements}

                    </span>

                </div>

            )}


            {/* =========================
                EMPTY
            ========================= */}

            {!error &&
                transactions.length === 0 && (

                    <div className="bg-white border rounded-xl p-10 text-center">

                        <h2 className="text-xl font-semibold mb-2">

                            No transactions found

                        </h2>

                        <p className="text-gray-500">

                            Try changing your filters.

                        </p>

                    </div>

                )}


            {/* =========================
                TRANSACTION TABLE
            ========================= */}

            {transactions.length > 0 && (

                <div className="bg-white border rounded-xl overflow-hidden">

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-100">

                                <tr>

                                    <th className="text-left p-4">
                                        Type
                                    </th>

                                    <th className="text-left p-4">
                                        Stock
                                    </th>

                                    <th className="text-right p-4">
                                        Quantity
                                    </th>

                                    <th className="text-right p-4">
                                        Price
                                    </th>

                                    <th className="text-right p-4">
                                        Total
                                    </th>

                                    <th className="text-right p-4">
                                        Date
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {transactions.map(
                                    (transaction) => {

                                        const isBuy =
                                            transaction.type === "BUY";


                                        return (

                                            <tr
                                                key={transaction.id}
                                                className="border-t hover:bg-gray-50"
                                            >


                                                {/* TYPE */}

                                                <td className="p-4">

                                                    <span
                                                        className={
                                                            `px-3 py-1 rounded-full text-sm font-semibold ${
                                                                isBuy
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-red-100 text-red-700"
                                                            }`
                                                        }
                                                    >

                                                        {transaction.type}

                                                    </span>

                                                </td>


                                                {/* STOCK */}

                                                <td className="p-4">

                                                    <div className="font-semibold">

                                                        {
                                                            transaction.symbol
                                                        }

                                                    </div>

                                                    <div className="text-sm text-gray-500">

                                                        {
                                                            transaction.companyName ||
                                                            "Company name unavailable"
                                                        }

                                                    </div>

                                                </td>


                                                {/* QUANTITY */}

                                                <td className="text-right p-4">

                                                    {
                                                        transaction.quantity
                                                    }

                                                </td>


                                                {/* PRICE */}

                                                <td className="text-right p-4">

                                                    ₹
                                                    {Number(
                                                        transaction.pricePerShare
                                                    ).toFixed(2)}

                                                </td>


                                                {/* TOTAL */}

                                                <td className="text-right p-4 font-semibold">

                                                    ₹
                                                    {Number(
                                                        transaction.totalAmount
                                                    ).toFixed(2)}

                                                </td>


                                                {/* DATE */}

                                                <td className="text-right p-4 text-sm text-gray-500">

                                                    {transaction.transactionTime
                                                        ? new Date(
                                                            transaction.transactionTime
                                                        ).toLocaleString()
                                                        : "-"
                                                    }

                                                </td>

                                            </tr>

                                        );

                                    }

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* =========================
                        PAGINATION
                    ========================= */}

                    <div className="flex justify-between items-center p-4 border-t">


                        {/* PREVIOUS */}

                        <button
                            onClick={handlePreviousPage}
                            disabled={page === 0 || loading}
                            className="border px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >

                            Previous

                        </button>


                        {/* PAGE INFO */}

                        <div className="text-sm text-gray-600">

                            Page{" "}

                            <span className="font-semibold">

                                {page + 1}

                            </span>

                            {" "}of{" "}

                            <span className="font-semibold">

                                {totalPages}

                            </span>

                        </div>


                        {/* NEXT */}

                        <button
                            onClick={handleNextPage}
                            disabled={
                                page >= totalPages - 1 ||
                                loading
                            }
                            className="border px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >

                            Next

                        </button>

                    </div>

                </div>

            )}

        </div>

    );

};

export default Transactions;