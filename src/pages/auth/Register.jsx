import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import authService from "../../services/authService";

function Register() {

    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!firstName.trim()) {
            toast.error("First Name is required");
            return;
        }

        if (!lastName.trim()) {
            toast.error("Last Name is required");
            return;
        }

        if (!email.trim()) {
            toast.error("Email is required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            toast.error("Invalid Email");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {

            setLoading(true);

            await authService.register({
                firstName,
                lastName,
                email,
                password
            });

            toast.success("Registration Successful");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            console.log(error);

            if (error.response?.data?.fieldErrors) {

                const fieldErrors = error.response.data.fieldErrors;

                toast.error(Object.values(fieldErrors)[0]);

            } else if (error.response?.data?.message) {

                toast.error(error.response.data.message);

            } else {

                toast.error("Unable to connect to server");

            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white shadow-lg rounded-xl p-8 w-[430px]">

                <h1 className="text-4xl text-blue-600 font-bold text-center mb-8">
                    TradeFlow
                </h1>

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">

                        <label>First Name</label>

                        <input
                            type="text"
                            className="w-full border rounded-md p-3 mt-2"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />

                    </div>

                    <div className="mb-4">

                        <label>Last Name</label>

                        <input
                            type="text"
                            className="w-full border rounded-md p-3 mt-2"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />

                    </div>

                    <div className="mb-4">

                        <label>Email</label>

                        <input
                            type="email"
                            className="w-full border rounded-md p-3 mt-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>

                    <div className="mb-4 relative">

                        <label>Password</label>

                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full border rounded-md p-3 mt-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            className="absolute right-3 top-12"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {
                                showPassword
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />
                            }
                        </button>

                    </div>

                    <div className="mb-6 relative">

                        <label>Confirm Password</label>

                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full border rounded-md p-3 mt-2"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            className="absolute right-3 top-12"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        >
                            {
                                showConfirmPassword
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />
                            }
                        </button>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md p-3"
                    >
                        {
                            loading
                                ? "Registering..."
                                : "Register"
                        }
                    </button>

                </form>

                <p className="text-center mt-6">

                    Already have an account?

                    <Link
                        to="/login"
                        className="text-blue-600 ml-2"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;