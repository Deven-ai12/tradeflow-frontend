import { useEffect, useState } from "react";
import walletService from "../../services/walletService";

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================
  // LOAD WALLET
  // =========================
  const loadWallet = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await walletService.getWallet();

      console.log("Wallet:", data);

      setWallet(data);
    } catch (error) {
      console.error("WALLET ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load wallet."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DEPOSIT
  // =========================
  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    try {
      setTransactionLoading(true);
      setError("");
      setMessage("");

      const response =
        await walletService.deposit(amount);

      console.log("DEPOSIT RESPONSE:", response);

      setWallet(response);

      setMessage(
        "Money deposited successfully."
      );

      setAmount("");

      // Notify other components
      window.dispatchEvent(
        new CustomEvent("walletUpdated", {
          detail: response,
        })
      );
    } catch (error) {
      console.error("DEPOSIT ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to deposit money."
      );
    } finally {
      setTransactionLoading(false);
    }
  };

  // =========================
  // WITHDRAW
  // =========================
  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    try {
      setTransactionLoading(true);
      setError("");
      setMessage("");

      const response =
        await walletService.withdraw(amount);

      console.log(
        "WITHDRAW RESPONSE:",
        response
      );

      setWallet(response);

      setMessage(
        "Money withdrawn successfully."
      );

      setAmount("");

      // Notify other components
      window.dispatchEvent(
        new CustomEvent("walletUpdated", {
          detail: response,
        })
      );
    } catch (error) {
      console.error(
        "WITHDRAW ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to withdraw money."
      );
    } finally {
      setTransactionLoading(false);
    }
  };

  // =========================
  // LOAD WALLET ON PAGE LOAD
  // =========================
  useEffect(() => {
    loadWallet();

    const handleWalletUpdated = () => {
      loadWallet();
    };

    window.addEventListener(
      "walletUpdated",
      handleWalletUpdated
    );

    return () => {
      window.removeEventListener(
        "walletUpdated",
        handleWalletUpdated
      );
    };
  }, []);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="p-8">
        Loading wallet...
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold text-blue-600">
            My Wallet
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your trading balance
          </p>
        </div>

        <button
          onClick={loadWallet}
          disabled={loading}
          className="border px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          Refresh
        </button>

      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {/* BALANCE */}
      <div className="border rounded-xl p-8 bg-gray-50 mb-8">

        <p className="text-gray-500">
          Available Balance
        </p>

        <h2 className="text-4xl font-bold text-blue-600 mt-2">
          ₹
          {Number(
            wallet?.balance || 0
          ).toFixed(2)}
        </h2>

        {wallet?.firstName && (
          <p className="text-gray-500 mt-2">
            Account: {wallet.firstName}{" "}
            {wallet.lastName}
          </p>
        )}

      </div>

      {/* TRANSACTION */}
      <div className="border rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-5">
          Wallet Transaction
        </h2>

        <label className="block font-semibold mb-2">
          Amount
        </label>

        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          placeholder="Enter amount"
          disabled={transactionLoading}
          className="w-full border rounded-lg px-4 py-3 mb-5"
        />

        <div className="flex gap-4">

          <button
            onClick={handleDeposit}
            disabled={transactionLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {transactionLoading
              ? "PROCESSING..."
              : "DEPOSIT"}
          </button>

          <button
            onClick={handleWithdraw}
            disabled={transactionLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {transactionLoading
              ? "PROCESSING..."
              : "WITHDRAW"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default Wallet;