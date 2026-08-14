import { useEffect, useState } from "react";

import userService from "../../services/userService";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await userService.getProfile();

                console.log("Profile:", data);

                setProfile(data);
            } catch (error) {
                console.error("Profile Error:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center px-4 sm:px-6">
                <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-700">
                        Loading Profile...
                    </h2>
                </div>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                    <h2 className="text-lg sm:text-2xl font-bold text-red-600 break-words">
                        {error}
                    </h2>
                </div>
            </div>
        );
    }

    // =========================
    // NO DATA
    // =========================

    if (!profile) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="bg-white border rounded-xl p-6 sm:p-8 text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-700">
                        No profile data available.
                    </h2>
                </div>
            </div>
        );
    }

    // =========================
    // PROFILE UI
    // =========================

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

            {/* Header */}
            <div className="mb-6 sm:mb-8">

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
                    My Profile
                </h1>

                <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
                    View your TradeFlow account information
                </p>

            </div>

            {/* Profile Card */}
            <div className="bg-white shadow-sm border rounded-xl overflow-hidden">

                {/* Profile Header */}
                <div className="p-5 sm:p-6 lg:p-8 border-b">

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">

                        {/* Avatar */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 flex items-center justify-center shrink-0">

                            <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                                {profile.firstName
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </span>

                        </div>

                        {/* User Info */}
                        <div className="min-w-0">

                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                                {profile.firstName}{" "}
                                {profile.lastName}
                            </h2>

                            <p className="text-sm sm:text-base text-gray-500 mt-1 break-all">
                                {profile.email}
                            </p>

                        </div>

                    </div>

                </div>

                {/* Information */}
                <div className="p-5 sm:p-6 lg:p-8">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 sm:gap-y-6">

                        {/* First Name */}
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-500">
                                First Name
                            </p>

                            <p className="text-base sm:text-lg font-semibold mt-1 break-words">
                                {profile.firstName || "-"}
                            </p>
                        </div>

                        {/* Last Name */}
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-500">
                                Last Name
                            </p>

                            <p className="text-base sm:text-lg font-semibold mt-1 break-words">
                                {profile.lastName || "-"}
                            </p>
                        </div>

                        {/* Email */}
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-500">
                                Email
                            </p>

                            <p className="text-base sm:text-lg font-semibold mt-1 break-all">
                                {profile.email || "-"}
                            </p>
                        </div>

                        {/* Role */}
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-500">
                                Role
                            </p>

                            <p className="text-base sm:text-lg font-semibold mt-1 break-words">
                                {profile.role || "-"}
                            </p>
                        </div>

                        {/* Account Status */}
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-500">
                                Account Status
                            </p>

                            <p
                                className={`text-base sm:text-lg font-semibold mt-1 ${
                                    profile.enabled
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {profile.enabled
                                    ? "Active"
                                    : "Disabled"}
                            </p>
                        </div>

                        {/* Created At */}
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-500">
                                Account Created
                            </p>

                            <p className="text-base sm:text-lg font-semibold mt-1">
                                {profile.createdAt
                                    ? new Date(
                                          profile.createdAt
                                      ).toLocaleDateString()
                                    : "-"}
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;