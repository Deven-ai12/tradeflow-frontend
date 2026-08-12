import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function MainLayout() {

    return (

        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <main className="p-6">

                <Outlet />

            </main>

        </div>

    );
}

export default MainLayout;