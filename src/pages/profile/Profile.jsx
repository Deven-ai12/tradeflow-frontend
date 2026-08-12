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

                const data =
                    await userService.getProfile();

                console.log("Profile:", data);

                setProfile(data);

            } catch (error) {

                console.error(
                    "Profile Error:",
                    error
                );

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
            <div className="p-8">

                <h2 className="text-2xl font-bold">
                    Loading Profile...
                </h2>

            </div>
        );

    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <div className="p-8">

                <h2 className="text-2xl font-bold text-red-600">
                    {error}
                </h2>

            </div>
        );

    }


    // =========================
    // NO DATA
    // =========================

    if (!profile) {

        return (
            <div className="p-8">

                <h2 className="text-2xl font-bold">
                    No profile data available.
                </h2>

            </div>
        );

    }


    // =========================
    // PROFILE UI
    // =========================

    return (

        <div className="p-8 max-w-4xl mx-auto">

            {/* Header */}

            <div className="mb-8">

                <h1 className="text-4xl font-bold text-blue-600">
                    My Profile
                </h1>

                <p className="text-gray-500 mt-2">
                    View your TradeFlow account information
                </p>

            </div>


            {/* Profile Card */}

            <div className="bg-white shadow rounded-xl p-8">

                {/* Avatar */}

                <div className="flex items-center gap-5 mb-8">

                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">

                        <span className="text-3xl font-bold text-blue-600">

                            {profile.firstName
                                ?.charAt(0)
                                .toUpperCase()}

                        </span>

                    </div>


                    <div>

                        <h2 className="text-2xl font-bold">

                            {profile.firstName}{" "}
                            {profile.lastName}

                        </h2>

                        <p className="text-gray-500">

                            {profile.email}

                        </p>

                    </div>

                </div>


                {/* Information */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                    {/* First Name */}

                    <div>

                        <p className="text-sm text-gray-500">
                            First Name
                        </p>

                        <p className="text-lg font-semibold mt-1">
                            {profile.firstName}
                        </p>

                    </div>


                    {/* Last Name */}

                    <div>

                        <p className="text-sm text-gray-500">
                            Last Name
                        </p>

                        <p className="text-lg font-semibold mt-1">
                            {profile.lastName}
                        </p>

                    </div>


                    {/* Email */}

                    <div>

                        <p className="text-sm text-gray-500">
                            Email
                        </p>

                        <p className="text-lg font-semibold mt-1">
                            {profile.email}
                        </p>

                    </div>


                    {/* Role */}

                    <div>

                        <p className="text-sm text-gray-500">
                            Role
                        </p>

                        <p className="text-lg font-semibold mt-1">
                            {profile.role}
                        </p>

                    </div>


                    {/* Account Status */}

                    <div>

                        <p className="text-sm text-gray-500">
                            Account Status
                        </p>

                        <p
                            className={`text-lg font-semibold mt-1 ${
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

                    <div>

                        <p className="text-sm text-gray-500">
                            Account Created
                        </p>

                        <p className="text-lg font-semibold mt-1">

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

    );

}

export default Profile;