import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";

import walletService from "../../services/walletService";

const Navbar = () => {

    const navigate = useNavigate();

    const [walletBalance, setWalletBalance] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // =========================
    // LOAD WALLET BALANCE
    // =========================

    const loadWalletBalance = async () => {

        try {

            const data = await walletService.getWallet();

            console.log("Navbar Wallet:", data);

            setWalletBalance(
                Number(data.balance || 0)
            );

        } catch (error) {

            console.error(
                "Failed to load wallet:",
                error
            );

        }

    };

    // =========================
    // WALLET UPDATE LISTENER
    // =========================

    useEffect(() => {

        // Initial wallet load
        loadWalletBalance();

        // Listen for wallet updates
        const handleWalletUpdated = (event) => {

            console.log(
                "Wallet update received:",
                event.detail
            );

            if (
                event.detail?.balance !== undefined
            ) {

                setWalletBalance(
                    Number(event.detail.balance)
                );

            } else {

                loadWalletBalance();

            }

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
    // CLOSE MOBILE MENU
    // =========================

    const closeMobileMenu = () => {

        setMobileMenuOpen(false);

    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setMobileMenuOpen(false);

        navigate("/login");

    };

    // =========================
    // NAVIGATION LINKS
    // =========================

    const navItems = [
        {
            name: "Dashboard",
            path: "/dashboard"
        },
        {
            name: "Stocks",
            path: "/stocks"
        },
        {
            name: "Trading",
            path: "/trading"
        },
        {
            name: "Portfolio",
            path: "/portfolio"
        },
        {
            name: "Transactions",
            path: "/transactions"
        },
        {
            name: "Wallet",
            path: "/wallet"
        },
        {
            name: "Watchlist",
            path: "/watchlist"
        },
        {
            name: "Profile",
            path: "/profile"
        }
    ];

    // =========================
    // NAV LINK STYLE
    // =========================

    const getNavLinkClass = ({ isActive }) => {

        return `
            relative
            px-3
            py-2
            rounded-lg
            text-sm
            font-medium
            transition-all
            duration-200

            ${
                isActive
                    ? `
                        text-blue-600
                        bg-blue-50
                        font-semibold

                        after:absolute
                        after:left-2
                        after:right-2
                        after:-bottom-1
                        after:h-0.5
                        after:bg-blue-600
                        after:rounded-full
                    `
                    : `
                        text-gray-700
                        hover:text-blue-600
                        hover:bg-gray-50
                    `
            }
        `;

    };

    return (

        <nav className="bg-white border-b shadow-sm sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* ========================= */}
                {/* DESKTOP / TOP BAR */}
                {/* ========================= */}

                <div className="flex items-center justify-between h-16">

                    {/* LOGO */}

                    <Link
                        to="/dashboard"
                        onClick={closeMobileMenu}
                        className="text-2xl font-bold text-blue-600 shrink-0"
                    >
                        TradeFlow
                    </Link>


                    {/* ========================= */}
                    {/* DESKTOP NAVIGATION */}
                    {/* ========================= */}

                    <div className="hidden lg:flex items-center gap-1">

                        {navItems.map((item) => (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={getNavLinkClass}
                            >
                                {item.name}
                            </NavLink>

                        ))}

                    </div>


                    {/* ========================= */}
                    {/* DESKTOP RIGHT SIDE */}
                    {/* ========================= */}

                    <div className="hidden lg:flex items-center gap-3">

                        {/* Wallet */}

                        <Link
                            to="/wallet"
                            className="
                                px-4
                                py-2
                                rounded-lg
                                bg-green-50
                                text-green-700
                                font-semibold
                                hover:bg-green-100
                                transition
                                whitespace-nowrap
                            "
                        >
                            ₹{walletBalance.toFixed(2)}
                        </Link>


                        {/* Logout */}

                        <button
                            onClick={handleLogout}
                            className="
                                px-4
                                py-2
                                rounded-lg
                                bg-red-500
                                text-white
                                hover:bg-red-600
                                transition
                                whitespace-nowrap
                            "
                        >
                            Logout
                        </button>

                    </div>


                    {/* ========================= */}
                    {/* MOBILE RIGHT SIDE */}
                    {/* ========================= */}

                    <div className="flex lg:hidden items-center gap-2">

                        {/* Mobile wallet */}

                        <Link
                            to="/wallet"
                            onClick={closeMobileMenu}
                            className="
                                hidden
                                sm:block
                                px-3
                                py-2
                                rounded-lg
                                bg-green-50
                                text-green-700
                                text-sm
                                font-semibold
                            "
                        >
                            ₹{walletBalance.toFixed(2)}
                        </Link>


                        {/* Hamburger */}

                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen(
                                    !mobileMenuOpen
                                )
                            }
                            className="
                                p-2
                                rounded-lg
                                text-gray-700
                                hover:bg-gray-100
                                transition
                            "
                            aria-label="Toggle navigation menu"
                        >

                            {mobileMenuOpen ? (
                                <MdClose size={28} />
                            ) : (
                                <MdMenu size={28} />
                            )}

                        </button>

                    </div>

                </div>


                {/* ========================= */}
                {/* MOBILE NAVIGATION */}
                {/* ========================= */}

                {mobileMenuOpen && (

                    <div className="lg:hidden border-t py-4">

                        <div className="flex flex-col gap-1">

                            {navItems.map((item) => (

                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) => `
                                        px-4
                                        py-3
                                        rounded-lg
                                        text-sm
                                        font-medium
                                        transition-all

                                        ${
                                            isActive
                                                ? `
                                                    text-blue-600
                                                    bg-blue-50
                                                    font-semibold
                                                    border-l-4
                                                    border-blue-600
                                                `
                                                : `
                                                    text-gray-700
                                                    hover:text-blue-600
                                                    hover:bg-gray-50
                                                `
                                        }
                                    `}
                                >
                                    {item.name}
                                </NavLink>

                            ))}


                            {/* Mobile Wallet */}

                            <Link
                                to="/wallet"
                                onClick={closeMobileMenu}
                                className="
                                    sm:hidden
                                    mt-2
                                    px-4
                                    py-3
                                    rounded-lg
                                    bg-green-50
                                    text-green-700
                                    font-semibold
                                    text-center
                                "
                            >
                                Wallet Balance:
                                ₹{walletBalance.toFixed(2)}
                            </Link>


                            {/* Mobile Logout */}

                            <button
                                onClick={handleLogout}
                                className="
                                    mt-2
                                    w-full
                                    px-4
                                    py-3
                                    rounded-lg
                                    bg-red-500
                                    text-white
                                    hover:bg-red-600
                                    transition
                                "
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </nav>

    );

};

export default Navbar;