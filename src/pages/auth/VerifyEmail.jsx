import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";

const VerifyEmail = () => {

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    const verificationStarted = useRef(false);

    useEffect(() => {

        if (verificationStarted.current) {
            return;
        }

        verificationStarted.current = true;

        const verifyEmail = async () => {

            if (!token) {
                setStatus("error");
                setMessage("Verification token is missing.");
                return;
            }

            try {

                console.log("VERIFYING TOKEN:", token);

                const response = await api.get(
                    `/auth/verify?token=${encodeURIComponent(token)}`
                );

                console.log("VERIFICATION SUCCESS:", response.data);

                setStatus("success");

                setMessage(
                    response.data ||
                    "Your email has been verified successfully."
                );

            } catch (error) {

                console.error(
                    "EMAIL VERIFICATION ERROR:",
                    error
                );

                setStatus("error");

                setMessage(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Email verification failed."
                );
            }
        };

        verifyEmail();

    }, [token]);

    return (

        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-8 text-center">

                {status === "loading" && (
                    <>
                        <div className="text-4xl mb-4">
                            ⏳
                        </div>

                        <h1 className="text-2xl font-bold text-gray-800 mb-3">
                            Verifying your email
                        </h1>

                        <p className="text-gray-500">
                            Please wait while we verify your email address...
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="text-5xl mb-4">
                            ✅
                        </div>

                        <h1 className="text-2xl font-bold text-green-600 mb-3">
                            Email Verified!
                        </h1>

                        <p className="text-gray-600 mb-6">
                            {message}
                        </p>

                        <Link
                            to="/login"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Go to Login
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="text-5xl mb-4">
                            ❌
                        </div>

                        <h1 className="text-2xl font-bold text-red-600 mb-3">
                            Verification Failed
                        </h1>

                        <p className="text-gray-600 mb-6">
                            {message}
                        </p>

                        <Link
                            to="/login"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Go to Login
                        </Link>
                    </>
                )}

            </div>

        </div>
    );
};

export default VerifyEmail;