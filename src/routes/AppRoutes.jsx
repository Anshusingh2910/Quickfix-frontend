import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import Layout from "../layouts/layout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

// Public/User Pages
import Home from "../pages/home/Home";
import Services from "../pages/user/Services";
import AIassistant from "../pages/user/AIassistant";
import About from "../pages/user/About";
import Mechanics from "../pages/user/Mechanic";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOTP from "../pages/auth/VerifyOTP";
import ForgotPassword from "../pages/auth/ForgotPassword";

// User Pages
import UserDashboard from "../pages/user/Dashboard";
import Profile from "../pages/user/Profile";

import CreateBooking from "../pages/user/Bookings";
import MyBookings from "../pages/user/MyBooking";
import BookingDetails from "../pages/user/BookingDetails";

import AddVehicle from "../pages/user/AddVehicle";
import Vehicles from "../pages/user/Vehicles";

// Mechanic Pages
import MechanicDashboard from "../pages/mechanic/MechanicDashboard";
import MechanicProfile from "../pages/mechanic/MechanicProfile";
import MechanicBookings from "../pages/mechanic/MechanicBookings";
import MechanicKYC from "../pages/mechanic/Mechanickyc";
import MechanicSetting from "../pages/mechanic/settings";
import Earnings from "../pages/mechanic/Earning";
import Customers from "../pages/mechanic/Customer";

// =====================================================
// 404
// =====================================================

function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="text-center">
                <h1 className="text-5xl font-black text-slate-900">
                    404
                </h1>

                <p className="mt-3 text-slate-500">
                    Page not found
                </p>
            </div>
        </div>
    );
}

// =====================================================
// ROUTES
// =====================================================

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* =================================================
                    MAIN WEBSITE
                ================================================= */}

                <Route element={<Layout />}>

                    {/* HOME */}
                    <Route
                        path="/"
                        element={<Home />}
                    />

                    {/* =================================================
                        PUBLIC USER-SIDE INFORMATION PAGES
                        Login required nahi hona chahiye
                    ================================================= */}

                    <Route
                        path="/services"
                        element={<Services />}
                    />

                    <Route
                        path="/mechanics"
                        element={<Mechanics />}
                    />

                    <Route
                        path="/AIassistant"
                        element={<AIassistant />}
                    />

                    <Route
                        path="/about"
                        element={<About />}
                    />

                    {/* =================================================
                        PROTECTED USER / MECHANIC PAGES
                    ================================================= */}

                    <Route element={<ProtectedRoute />}>

                        {/* -------------------------------------------------
                            USER
                        ------------------------------------------------- */}

                        <Route
                            path="/profile"
                            element={<Profile />}
                        />

                        <Route
                            path="/dashboard"
                            element={<UserDashboard />}
                        />

                        {/* -------------------------------------------------
                            BOOKINGS
                        ------------------------------------------------- */}

                        <Route
                            path="/booking/create"
                            element={<CreateBooking />}
                        />

                        <Route
                            path="/bookings/create"
                            element={<CreateBooking />}
                        />

                        <Route
                            path="/bookings"
                            element={<MyBookings />}
                        />

                        <Route
                            path="/bookings/:bookingId"
                            element={<BookingDetails />}
                        />

                        {/* -------------------------------------------------
                            VEHICLES
                        ------------------------------------------------- */}

                        <Route
                            path="/vehicles"
                            element={<Vehicles />}
                        />

                        <Route
                            path="/vehicles/add"
                            element={<AddVehicle />}
                        />

                        {/* =================================================
                            MECHANIC
                        ================================================= */}

                        <Route
                            path="/mechanic/dashboard"
                            element={<MechanicDashboard />}
                        />

                        <Route
                            path="/mechanic/kyc"
                            element={<MechanicKYC />}
                        />

                        <Route
                            path="/mechanic/bookings"
                            element={<MechanicBookings />}
                        />

                        <Route
                            path="/mechanic/profile"
                            element={<MechanicProfile />}
                        />

                        <Route
                            path="/mechanic/settings"
                            element={<MechanicSetting />}
                        />

                        <Route
                            path="/mechanic/earnings"
                            element={<Earnings />}
                        />

                        <Route
                            path="/mechanic/customers"
                            element={<Customers />}
                        />

                    </Route>
                </Route>

                {/* =================================================
                    AUTH ROUTES
                ================================================= */}

                <Route element={<AuthLayout />}>

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/verify-otp"
                        element={<VerifyOTP />}
                    />

                    <Route
                        path="/mechanic/verify-otp"
                        element={<VerifyOTP />}
                    />

                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />

                </Route>

                {/* =================================================
                    404
                ================================================= */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;