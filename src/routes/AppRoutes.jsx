import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/dashboard/Dashboard";
import Stocks from "../pages/stocks/Stocks";
import Trading from "../pages/trading/Trading";
import Portfolio from "../pages/portfolio/Portfolio";
import Transactions from "../pages/transactions/Transactions";
import Wallet from "../pages/wallet/Wallet";
import Watchlist from "../pages/watchlist/Watchlist";
import Profile from "../pages/profile/Profile";

const AppRoutes = () => {

    return (

        <Routes>

            {/* Root */}
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* Public */}
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* Protected */}
            <Route element={<ProtectedRoute />}>

                {/* IMPORTANT: Everything inside here gets Navbar */}
                <Route element={<MainLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/stocks"
                        element={<Stocks />}
                    />

                    <Route
                        path="/trading"
                        element={<Trading />}
                    />

                    <Route
                        path="/portfolio"
                        element={<Portfolio />}
                    />

                    <Route
                        path="/transactions"
                        element={<Transactions />}
                    />

                    <Route
                        path="/wallet"
                        element={<Wallet />}
                    />

                    <Route
                        path="/watchlist"
                        element={<Watchlist />}
                    />

                    {/* PROFILE MUST BE HERE */}
                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                </Route>

            </Route>


            {/* Unknown URL */}
            <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
            />

        </Routes>

    );
};

export default AppRoutes;