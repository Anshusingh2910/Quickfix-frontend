import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    ArrowRight,
    CalendarCheck,
    Car,
    CheckCircle2,
    Clock3,
    LogOut,
    MessageCircle,
    Settings,
    ShieldCheck,
    UserCircle,
    Wrench,
    XCircle,
} from "lucide-react";

import {
    getProfile,
    logoutUser,
} from "../../services/authApi";


function UserDashboard() {
    const navigate = useNavigate();

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [loggingOut, setLoggingOut] =
        useState(false);

    const [error, setError] =
        useState("");

    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            // =================================================
            // ROLE
            // =================================================

            const role =
                sessionStorage.getItem(
                    "authRole"
                );

            console.log(
                "DASHBOARD ROLE:",
                role
            );

            // No role
            if (!role) {
                navigate("/login", {
                    replace: true,
                });

                return;
            }

            // Mechanic
            if (role === "mechanic") {
                navigate(
                    "/mechanic/dashboard",
                    {
                        replace: true,
                    }
                );

                return;
            }

            // Only user allowed
            if (role !== "user") {
                clearAuth();

                navigate("/login", {
                    replace: true,
                });

                return;
            }

            // =================================================
            // PROFILE
            // =================================================

            const response =
                await getProfile();

            console.log(
                "USER PROFILE:",
                response
            );

            const responseData =
                response?.data || {};

            const profile =
                response?.user ||
                responseData?.user ||
                responseData?.data?.user ||
                responseData?.data ||
                responseData;

            if (!profile) {
                throw new Error(
                    "Unable to load your profile."
                );
            }

            const finalUser = {
                ...profile,
                role: "user",
            };

            setUser(finalUser);

            sessionStorage.setItem(
                "authUser",
                JSON.stringify(
                    finalUser
                )
            );

            sessionStorage.setItem(
                "user",
                JSON.stringify(
                    finalUser
                )
            );

        } catch (err) {
            console.error(
                "DASHBOARD ERROR:",
                err
            );

            console.error(
                "DASHBOARD RESPONSE:",
                err?.response?.data
            );

            if (
                err?.response?.status ===
                401
            ) {
                clearAuth();

                navigate("/login", {
                    replace: true,
                });

                return;
            }

            // Agar API profile fail ho
            // to stored user dikhao
            try {
                const stored =
                    sessionStorage.getItem(
                        "authUser"
                    );

                if (stored) {
                    setUser(
                        JSON.parse(stored)
                    );
                    return;
                }
            } catch (storageError) {
                console.error(
                    storageError
                );
            }

            setError(
                err?.response?.data
                    ?.message ||
                err?.message ||
                "Unable to load dashboard."
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL
    // =====================================================

    useEffect(() => {
        loadProfile();
    }, []);

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = async () => {
        try {
            setLoggingOut(true);

            try {
                await logoutUser();
            } catch (error) {
                console.warn(
                    "BACKEND LOGOUT ERROR:",
                    error?.response?.data ||
                    error?.message
                );
            }

        } finally {
            clearAuth();

            navigate("/login", {
                replace: true,
            });

            setLoggingOut(false);
        }
    };

    // =====================================================
    // PROFILE DATA
    // =====================================================

    const isProfileComplete =
        Boolean(
            user?.profileCompleted ??
            user?.isProfileCompleted ??
            user?.profileComplete
        );

    const userName =
        user?.name ||
        user?.fullName ||
        "Customer";

    const userEmail =
        user?.email ||
        "No email available";

    const userPhone =
        user?.phone ||
        user?.mobile ||
        "Not added";

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

                        <p className="text-sm font-medium text-slate-500">
                            Loading your dashboard...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error && !user) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto flex min-h-screen max-w-[600px] items-center justify-center px-4">
                    <div className="w-full rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <XCircle size={28} />
                        </div>

                        <h2 className="text-xl font-bold text-slate-900">
                            Unable to load dashboard
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={loadProfile}
                            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Try Again
                        </button>

                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // DASHBOARD
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

                {/* HEADER */}

                <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <div className="mb-2 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />

                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                                Customer Dashboard
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Welcome back,{" "}
                            {userName}
                        </h1>

                        <p className="mt-1.5 text-sm text-slate-500">
                            Manage your vehicles,
                            bookings and vehicle
                            services from one place.
                        </p>

                    </div>


                </div>

                {/* PROFILE STATUS */}

                {!isProfileComplete && (
                    <div className="mb-6 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">

                        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                    <Settings size={20} />
                                </div>

                                <div>

                                    <h3 className="text-sm font-bold text-amber-900">
                                        Complete your profile
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-amber-700">
                                        Add your address and
                                        other details to get
                                        the best experience.
                                    </p>

                                </div>

                            </div>

                            <Link
                                to="/profile"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 text-sm font-semibold text-white hover:bg-amber-600"
                            >
                                Complete Profile
                                <ArrowRight size={16} />
                            </Link>

                        </div>

                    </div>
                )}

                {/* COMPLETED */}

                {isProfileComplete && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <CheckCircle2 size={19} />
                        </div>

                        <div>

                            <p className="text-sm font-bold text-emerald-800">
                                Profile completed
                            </p>

                            <p className="text-xs text-emerald-600">
                                Your account is ready to use.
                            </p>

                        </div>

                    </div>
                )}

                {/* QUICK ACTIONS */}

                <div className="mb-6">

                    <div className="mb-4">

                        <h2 className="text-lg font-bold text-slate-900">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Frequently used services
                        </p>

                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <Link
                            to="/book-service"
                            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="mb-5 flex items-center justify-between">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                                    <Wrench size={21} />
                                </div>

                                <ArrowRight
                                    size={18}
                                    className="text-slate-300 group-hover:text-blue-600"
                                />

                            </div>

                            <h3 className="font-bold text-slate-900">
                                Book Service
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Find a mechanic and book
                                a vehicle service.
                            </p>

                        </Link>

                        <Link
                            to="/vehicles"
                            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="mb-5 flex items-center justify-between">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white">
                                    <Car size={21} />
                                </div>

                                <ArrowRight
                                    size={18}
                                    className="text-slate-300 group-hover:text-indigo-600"
                                />

                            </div>

                            <h3 className="font-bold text-slate-900">
                                My Vehicles
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Add and manage your vehicles.
                            </p>

                        </Link>

                        <Link
                            to="/bookings"
                            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="mb-5 flex items-center justify-between">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white">
                                    <CalendarCheck size={21} />
                                </div>

                                <ArrowRight
                                    size={18}
                                    className="text-slate-300 group-hover:text-emerald-600"
                                />

                            </div>

                            <h3 className="font-bold text-slate-900">
                                My Bookings
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Track your upcoming and
                                past bookings.
                            </p>

                        </Link>

                        <Link
                            to="/ai-chat"
                            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="mb-5 flex items-center justify-between">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white">
                                    <MessageCircle size={21} />
                                </div>

                                <ArrowRight
                                    size={18}
                                    className="text-slate-300 group-hover:text-violet-600"
                                />

                            </div>

                            <h3 className="font-bold text-slate-900">
                                AI Assistant
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Get help with your vehicle
                                problems.
                            </p>

                        </Link>

                    </div>

                </div>

                {/* ACCOUNT */}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    Account Information
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Your registered account details
                                </p>

                            </div>

                            <Link
                                to="/profile"
                                className="text-xs font-semibold text-blue-600"
                            >
                                Edit Profile
                            </Link>

                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <InfoCard
                                icon={<UserCircle size={17} />}
                                title="Full Name"
                                value={userName}
                            />

                            <InfoCard
                                icon={<ShieldCheck size={17} />}
                                title="Email"
                                value={userEmail}
                            />

                            <InfoCard
                                icon={<Clock3 size={17} />}
                                title="Phone"
                                value={userPhone}
                            />

                            <InfoCard
                                icon={<UserCircle size={17} />}
                                title="Account Type"
                                value="Customer"
                            />

                        </div>

                    </div>

                    {/* SECURITY */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <ShieldCheck size={21} />
                        </div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Account Security
                        </h2>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            Your account is protected with
                            secure authentication.
                        </p>

                        <div className="mt-6 space-y-3">

                            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">

                                <span className="text-xs font-medium text-slate-500">
                                    Email
                                </span>

                                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                    <CheckCircle2 size={14} />
                                    Verified
                                </span>

                            </div>

                            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">

                                <span className="text-xs font-medium text-slate-500">
                                    Role
                                </span>

                                <span className="text-xs font-bold text-slate-700">
                                    Customer
                                </span>

                            </div>

                        </div>

                        <Link
                            to="/profile"
                            className="mt-5 flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                            Manage Account
                            <ArrowRight size={15} />
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

// =====================================================
// INFO CARD
// =====================================================

function InfoCard({
    icon,
    title,
    value,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-4">

            <div className="mb-2 flex items-center gap-2 text-slate-400">

                {icon}

                <span className="text-xs font-medium">
                    {title}
                </span>

            </div>

            <p className="break-all text-sm font-semibold text-slate-900">
                {value}
            </p>

        </div>
    );
}

export default UserDashboard;