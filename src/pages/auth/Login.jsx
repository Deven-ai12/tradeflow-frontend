import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {

            setLoading(true);

            const response = await authService.login({

                email,
                password

            });

            console.log(response);

            /*
             Expected backend response:

             {
                 "token":"eyJhbGciOiJIUzI1NiJ9..."
             }
            */

            login(response);

            navigate("/dashboard");

        } catch (err) {

            console.error(err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Invalid email or password.");
            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">

                <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
                    TradeFlow
                </h1>

                <form onSubmit={handleLogin}>

                    <div className="mb-5">

                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div className="mb-5">

                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? (
                                <MdVisibilityOff size={22} />
                            ) : (
                                <MdVisibility size={22} />
                            )}
                        </button>
                    </div>

                    </div>

                    {error && (

                        <div className="mb-4 text-red-600 text-sm">

                            {error}

                        </div>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                    >

                        {loading ? "Logging in..." : "Login"}

                    </button>

                </form>

                <p className="text-center mt-6">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="text-blue-600 hover:underline"
                    >

                        Register

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;