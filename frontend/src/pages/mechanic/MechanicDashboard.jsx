import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Activity,
    ArrowRight,
    Bell,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock3,
    IndianRupee,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    ShieldCheck,
    Star,
    TrendingUp,
    User,
    Wrench,
    X,
    XCircle,
    Zap,
} from "lucide-react";

import api from "../../services/api";


// ============================================================
// MAIN COMPONENT
// ============================================================

function MechanicDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [availability, setAvailability] = useState(true);
    const [availabilityLoading, setAvailabilityLoading] = useState(false);

    const [logoutLoading, setLogoutLoading] = useState(false);


    // ============================================================
    // FETCH DASHBOARD
    // ============================================================

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/mechanic/dashboard");

            const data =
                response?.data?.data ||
                response?.data ||
                {};

            setDashboard(data);

            setAvailability(
                data?.mechanic?.availability ?? true
            );

        } catch (err) {
            console.error("MECHANIC DASHBOARD ERROR:", err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load mechanic dashboard."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchDashboard();
    }, []);


    // ============================================================
    // AVAILABILITY
    // ============================================================

    const handleAvailability = async () => {
        if (availabilityLoading) return;

        const nextValue = !availability;

        try {
            setAvailabilityLoading(true);

            await api.patch(
                "/mechanic/availability",
                {
                    availability: nextValue,
                }
            );

            setAvailability(nextValue);

        } catch (err) {
            console.error("AVAILABILITY ERROR:", err);

            alert(
                err?.response?.data?.message ||
                "Unable to update availability."
            );

        } finally {
            setAvailabilityLoading(false);
        }
    };


    // ============================================================
    // LOGOUT
    // ============================================================

    const handleLogout = async () => {
        if (logoutLoading) return;

        try {
            setLogoutLoading(true);

            await api.post("/mechanic/logout");

        } catch (err) {
            console.error("LOGOUT ERROR:", err);

        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("mechanicToken");
            localStorage.removeItem("user");

            navigate("/login", {
                replace: true,
            });

            setLogoutLoading(false);
        }
    };


    // ============================================================
    // NAVIGATION
    // ============================================================

    const goTo = (path) => {
        setSidebarOpen(false);
        navigate(path);
    };


    // ============================================================
    // FORMAT CURRENCY
    // ============================================================

    const formatCurrency = (amount = 0) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(Number(amount) || 0);
    };


    // ============================================================
    // BOOKING STATUS
    // ============================================================

    const getBookingStatus = (status) => {
        const normalized = String(status || "")
            .toLowerCase()
            .trim();

        switch (normalized) {
            case "completed":
                return {
                    label: "Completed",
                    className:
                        "bg-emerald-50 text-emerald-700 border-emerald-100",
                    icon: CheckCircle2,
                };

            case "accepted":
                return {
                    label: "Accepted",
                    className:
                        "bg-blue-50 text-blue-700 border-blue-100",
                    icon: CheckCircle2,
                };

            case "pending":
                return {
                    label: "Pending",
                    className:
                        "bg-amber-50 text-amber-700 border-amber-100",
                    icon: Clock3,
                };

            case "ongoing":
            case "in-progress":
            case "in_progress":
                return {
                    label: "Ongoing",
                    className:
                        "bg-violet-50 text-violet-700 border-violet-100",
                    icon: Activity,
                };

            case "cancelled":
                return {
                    label: "Cancelled",
                    className:
                        "bg-red-50 text-red-700 border-red-100",
                    icon: XCircle,
                };

            case "rejected":
                return {
                    label: "Rejected",
                    className:
                        "bg-red-50 text-red-700 border-red-100",
                    icon: XCircle,
                };

            default:
                return {
                    label: status || "Unknown",
                    className:
                        "bg-slate-50 text-slate-600 border-slate-100",
                    icon: Activity,
                };
        }
    };


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return <DashboardLoading />;
    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc] px-4">

                <div className="w-full max-w-md rounded-[28px] border border-red-100 bg-white p-8 text-center shadow-sm">

                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <XCircle size={30} />
                    </div>

                    <h2 className="text-xl font-extrabold text-slate-900">
                        Dashboard unavailable
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {error}
                    </p>

                    <div className="mt-6 flex justify-center gap-3">

                        <button
                            onClick={fetchDashboard}
                            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                            Try Again
                        </button>

                        <button
                            onClick={() => navigate("/")}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                            Home
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    // ============================================================
    // DATA
    // ============================================================

    const mechanic = dashboard?.mechanic || {};
    const user = dashboard?.user || {};
    const statistics = dashboard?.statistics || {};
    const profile = dashboard?.profile || {};

    const recentBookings =
        dashboard?.recentBookings || [];

    const profileCompletion = Math.min(
        Math.max(
            Number(profile?.completion || 0),
            0
        ),
        100
    );


    // ============================================================
    // PROFILE IMAGE
    // ============================================================

    const profileImage =
        mechanic?.documents?.profileImage?.url ||
        mechanic?.profileImage?.url ||
        user?.profileImage?.url ||
        user?.avatar ||
        null;


    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="min-h-screen bg-[#f6f8fc] text-slate-900">

            {/* ======================================================
                MOBILE OVERLAY
            ====================================================== */}

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}


            {/* ======================================================
                SIDEBAR
            ====================================================== */}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex w-[275px] flex-col
                    border-r border-slate-200
                    bg-white
                    transition-transform duration-300
                    lg:translate-x-0
                    ${sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >

                {/* LOGO */}

                <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                            <Wrench size={22} />
                        </div>

                        <div>
                            <p className="text-lg font-extrabold tracking-tight">
                                QuickFix
                            </p>

                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Mechanic Panel
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* NAVIGATION */}

                <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">

                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active
                        onClick={() =>
                            goTo("/mechanic/dashboard")
                        }
                    />

                    <SidebarItem
                        icon={CalendarDays}
                        label="Bookings"
                        onClick={() =>
                            goTo("/mechanic/bookings")
                        }
                    />

                    <SidebarItem
                        icon={User}
                        label="My Profile"
                        onClick={() =>
                            goTo("/mechanic/profile")
                        }
                    />

                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        onClick={() =>
                            goTo("/mechanic/settings")
                        }
                    />
                </nav>
                <div className="shrink-0 border-t border-slate-100 p-4">

                    <div className="rounded-2xl bg-slate-950 p-5 text-white">

                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                            <ShieldCheck size={20} />
                        </div>

                        <p className="text-sm font-bold">
                            Account protected
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                            Keep your documents and profile updated.
                        </p>

                        <button
                            onClick={() =>
                                goTo("/mechanic/profile")
                            }
                            className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-300 hover:text-blue-200"
                        >
                            Manage profile
                            <ArrowRight size={13} />
                        </button>

                    </div>

                </div>

            </aside>
            <main className="lg:pl-[275px]">
               
                <div className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">
                    <section className="relative overflow-hidden rounded-[30px] bg-slate-950 p-6 text-white shadow-xl sm:p-8">

                        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

                        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

                        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

                            <div>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-blue-200">
                                    <Zap size={13} />
                                    QuickFix Mechanic
                                </div>
                                <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
                                    Good to see you,{" "}
                                    <span className="text-blue-400">
                                        {user.name?.split(" ")[0] ||
                                            "Mechanic"}
                                    </span>
                                </h2>

                                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                                    Manage your bookings, availability
                                    and mechanic profile from one place.
                                </p>

                            </div>
                            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400">
                                            Current availability
                                        </p>

                                        <div className="mt-2 flex items-center gap-2">

                                            <span
                                                className={`
                                                    h-2.5 w-2.5 rounded-full
                                                    ${availability
                                                        ? "bg-emerald-400 shadow-lg shadow-emerald-400/50"
                                                        : "bg-slate-500"
                                                    }
                                                `}
                                            />

                                            <span className="text-sm font-bold">
                                                {availability
                                                    ? "Available for bookings"
                                                    : "Currently offline"}
                                            </span>

                                        </div>

                                    </div>


                                    <button
                                        onClick={handleAvailability}
                                        disabled={availabilityLoading}
                                        className={`
                                            relative h-7 w-12 shrink-0 rounded-full transition
                                            ${availability
                                                ? "bg-blue-600"
                                                : "bg-slate-700"
                                            }
                                            ${availabilityLoading
                                                ? "cursor-wait opacity-60"
                                                : ""
                                            }
                                        `}
                                    >

                                        <span
                                            className={`
                                                absolute top-1 h-5 w-5 rounded-full
                                                bg-white shadow transition
                                                ${availability
                                                    ? "left-6"
                                                    : "left-1"
                                                }
                                            `}
                                        />

                                    </button>

                                </div>

                            </div>

                        </div>

                    </section>

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <StatCard
                            icon={CalendarDays}
                            title="Total Bookings"
                            value={
                                statistics.totalBookings || 0
                            }
                            subtitle={`${statistics.todayBookings || 0} bookings today`}
                            iconClass="bg-blue-50 text-blue-600"
                        />

                        <StatCard
                            icon={Clock3}
                            title="Pending"
                            value={
                                statistics.pendingBookings || 0
                            }
                            subtitle="Need your attention"
                            iconClass="bg-amber-50 text-amber-600"
                        />

                        <StatCard
                            icon={CheckCircle2}
                            title="Completed"
                            value={
                                statistics.completedBookings || 0
                            }
                            subtitle="Successfully finished"
                            iconClass="bg-emerald-50 text-emerald-600"
                        />

                        <StatCard
                            icon={IndianRupee}
                            title="Total Earnings"
                            value={formatCurrency(
                                statistics.totalEarnings || 0
                            )}
                            subtitle="From completed jobs"
                            iconClass="bg-violet-50 text-violet-600"
                        />

                    </section>

                    <div className="grid gap-6 xl:grid-cols-3">

                        <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm xl:col-span-2">

                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">

                                <div>
                                    <h3 className="text-base font-extrabold">
                                        Recent bookings
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Your latest service requests
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        goTo("/mechanic/bookings")
                                    }
                                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                                >
                                    View all
                                    <ChevronRight size={15} />
                                </button>
                            </div>
                            {recentBookings.length === 0 ? (

                                <EmptyBookings
                                    onClick={() =>
                                        goTo("/mechanic/bookings")
                                    }
                                />

                            ) : (

                                <div className="divide-y divide-slate-100">

                                    {recentBookings
                                        .slice(0, 6)
                                        .map((booking, index) => {

                                            const status =
                                                getBookingStatus(
                                                    booking?.status
                                                );

                                            const StatusIcon =
                                                status.icon;

                                            const customer =
                                                booking?.user ||
                                                booking?.customer ||
                                                booking?.customerId ||
                                                {};

                                            const customerName =
                                                typeof customer === "string"
                                                    ? "Customer"
                                                    : customer?.name ||
                                                    "Customer";

                                            const serviceName =
                                                booking?.serviceName ||
                                                booking?.service?.name ||
                                                booking?.service ||
                                                "Vehicle service";

                                            const bookingId =
                                                booking?._id ||
                                                booking?.id;

                                            return (

                                                <button
                                                    key={
                                                        bookingId ||
                                                        index
                                                    }
                                                    onClick={() =>
                                                        bookingId &&
                                                        goTo(
                                                            `/mechanic/bookings/${bookingId}`
                                                        )
                                                    }
                                                    className="flex w-full flex-col gap-4 px-5 py-5 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                                                >

                                                    <div className="flex min-w-0 items-center gap-3">

                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-extrabold text-blue-600">
                                                            {customerName
                                                                ?.charAt(0)
                                                                ?.toUpperCase() ||
                                                                "C"}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-bold text-slate-800">
                                                                {customerName}
                                                            </p>
                                                            <p className="mt-1 truncate text-xs text-slate-400">
                                                                {serviceName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                                                        <span
                                                            className={`
                                                                inline-flex items-center gap-1.5
                                                                rounded-full border px-2.5 py-1
                                                                text-[11px] font-bold
                                                                ${status.className}
                                                            `}
                                                        >
                                                            <StatusIcon size={12} />
                                                            {status.label}
                                                        </span>
                                                        <ChevronRight
                                                            size={17}
                                                            className="text-slate-300"
                                                        />

                                                    </div>

                                                </button>

                                            );
                                        })}

                                </div>

                            )}

                        </section>
                        <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Profile status
                                    </p>
                                    <h3 className="mt-1 text-lg font-extrabold">
                                        Keep growing
                                    </h3>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <User size={18} />
                                </div>

                            </div>

                            <div className="mt-7">

                                <div className="mb-2 flex items-center justify-between">

                                    <span className="text-xs font-semibold text-slate-500">
                                        Profile completion
                                    </span>

                                    <span className="text-sm font-extrabold text-blue-600">
                                        {profileCompletion}%
                                    </span>

                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                                    <div
                                        className="h-full rounded-full bg-blue-600 transition-all duration-700"
                                        style={{
                                            width: `${profileCompletion}%`,
                                        }}
                                    />

                                </div>

                            </div>
                            <div className="mt-7 space-y-3">

                                <ProfileCheck
                                    done={Boolean(
                                        mechanic?.shopName
                                    )}
                                    text="Shop information"
                                />

                                <ProfileCheck
                                    done={Boolean(
                                        mechanic?.specialization?.length
                                    )}
                                    text="Specializations"
                                />

                                <ProfileCheck
                                    done={Boolean(
                                        mechanic?.documents
                                            ?.profileImage?.url
                                    )}
                                    text="Profile photo"
                                />

                                <ProfileCheck
                                    done={Boolean(
                                        mechanic?.documents
                                            ?.aadhaar?.url
                                    )}
                                    text="Identity document"
                                />

                                <ProfileCheck
                                    done={Boolean(
                                        user?.address?.city
                                    )}
                                    text="Profile address"
                                />
                            </div>
                            <button
                                onClick={() =>
                                    goTo("/mechanic/profile")
                                }
                                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
                            >
                                {profileCompletion >= 100
                                    ? "View profile"
                                    : "Complete profile"}
                                <ArrowRight size={16} />
                            </button>
                        </section>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Overview
                                    </p>

                                    <h3 className="mt-1 text-base font-extrabold">
                                        Booking activity
                                    </h3>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <TrendingUp size={18} />
                                </div>

                            </div>

                            <div className="mt-6 space-y-5">
                                <BookingProgress
                                    label="Pending"
                                    value={
                                        statistics.pendingBookings ||
                                        0
                                    }
                                    total={
                                        statistics.totalBookings ||
                                        0
                                    }
                                    className="bg-amber-500"
                                />

                                <BookingProgress
                                    label="Accepted"
                                    value={
                                        statistics.acceptedBookings ||
                                        0
                                    }
                                    total={
                                        statistics.totalBookings ||
                                        0
                                    }
                                    className="bg-blue-500"
                                />

                                <BookingProgress
                                    label="Ongoing"
                                    value={
                                        statistics.ongoingBookings ||
                                        0
                                    }
                                    total={
                                        statistics.totalBookings ||
                                        0
                                    }
                                    className="bg-violet-500"
                                />

                                <BookingProgress
                                    label="Completed"
                                    value={
                                        statistics.completedBookings ||
                                        0
                                    }
                                    total={
                                        statistics.totalBookings ||
                                        0
                                    }
                                    className="bg-emerald-500"
                                />

                            </div>

                        </section>
                        <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">

                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Quick actions
                            </p>

                            <h3 className="mt-1 text-base font-extrabold">
                                Manage your work
                            </h3>


                            <div className="mt-5 grid grid-cols-2 gap-3">

                                <QuickAction
                                    icon={CalendarDays}
                                    label="Bookings"
                                    onClick={() =>
                                        goTo("/mechanic/bookings")
                                    }
                                />

                                <QuickAction
                                    icon={User}
                                    label="Profile"
                                    onClick={() =>
                                        goTo("/mechanic/profile")
                                    }
                                />

                                <QuickAction
                                    icon={Settings}
                                    label="Settings"
                                    onClick={() =>
                                        goTo("/mechanic/settings")
                                    }
                                />

                                <QuickAction
                                    icon={ShieldCheck}
                                    label="Account"
                                    onClick={() =>
                                        goTo("/mechanic/profile")
                                    }
                                />

                            </div>

                        </section>

                    </div>
                    <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <ShieldCheck size={19} />
                            </div>

                            <div>

                                <p className="text-sm font-bold">
                                    Your account is secure
                                </p>

                                <p className="text-xs text-slate-400">
                                    Email verified · Mechanic account active
                                </p>

                            </div>

                        </div>


                        <div className="flex items-center gap-2 text-xs font-bold text-amber-500">

                            <Star
                                size={15}
                                fill="currentColor"
                            />

                            Build your rating with great service

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}
function SidebarItem({
    icon: Icon,
    label,
    active = false,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                group flex w-full items-center gap-3
                rounded-xl px-4 py-3
                text-sm font-semibold transition
                ${active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }
            `}
        >

            <Icon
                size={18}
                className={
                    active
                        ? "text-blue-600"
                        : "text-slate-400 group-hover:text-slate-700"
                }
            />

            <span>{label}</span>

            {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
            )}

        </button>
    );
}
function StatCard({
    icon: Icon,
    title,
    value,
    subtitle,
    iconClass,
}) {
    return (
        <div className="group rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-xs font-semibold text-slate-400">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-extrabold tracking-tight">
                        {value}
                    </p>

                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon size={20} />
                </div>

            </div>

            <p className="mt-4 text-[11px] font-medium text-slate-400">
                {subtitle}
            </p>

        </div>
    );
}
function ProfileCheck({
    done,
    text,
}) {
    return (
        <div className="flex items-center gap-3">

            <div
                className={`
                    flex h-7 w-7 items-center justify-center rounded-lg
                    ${done
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-50 text-slate-300"
                    }
                `}
            >
                <CheckCircle2 size={15} />
            </div>

            <span
                className={`
                    text-xs font-semibold
                    ${done
                        ? "text-slate-700"
                        : "text-slate-400"
                    }
                `}
            >
                {text}
            </span>

            {done && (
                <span className="ml-auto text-[10px] font-bold text-emerald-600">
                    Done
                </span>
            )}

        </div>
    );
}
function BookingProgress({
    label,
    value = 0,
    total = 0,
    className,
}) {
    const percentage =
        total > 0
            ? Math.min(
                Math.round(
                    (Number(value) / Number(total)) * 100
                ),
                100
            )
            : 0;

    return (
        <div>

            <div className="mb-2 flex items-center justify-between">

                <span className="text-xs font-semibold text-slate-500">
                    {label}
                </span>

                <span className="text-xs font-bold text-slate-700">
                    {value}
                </span>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                    className={`h-full rounded-full transition-all duration-700 ${className}`}
                    style={{
                        width: `${percentage}%`,
                    }}
                />

            </div>

        </div>
    );
}
function QuickAction({
    icon: Icon,
    label,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-blue-100 hover:bg-blue-50"
        >

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm transition group-hover:bg-blue-600 group-hover:text-white">
                <Icon size={17} />
            </div>

            <span className="mt-2 text-[11px] font-bold text-slate-600 group-hover:text-blue-600">
                {label}
            </span>

        </button>
    );
}

function EmptyBookings({
    onClick,
}) {
    return (
        <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <CalendarDays size={25} />
            </div>

            <h4 className="text-sm font-bold">
                No bookings yet
            </h4>

            <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                New service requests will appear
                here when customers book you.
            </p>

            <button
                onClick={onClick}
                className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-blue-600"
            >
                Open bookings
                <ArrowRight size={14} />
            </button>

        </div>
    );
}
function DashboardLoading() {
    return (
        <div className="min-h-screen bg-[#f6f8fc]">
            <div className="h-20 border-b border-slate-200 bg-white" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-[1500px] animate-pulse">

                    <div className="h-52 rounded-[30px] bg-slate-200" />

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="h-36 rounded-[22px] bg-white"
                                />
                            )
                        )}

                    </div>

                    <div className="mt-6 grid gap-6 xl:grid-cols-3">

                        <div className="h-[450px] rounded-[26px] bg-white xl:col-span-2" />

                        <div className="h-[450px] rounded-[26px] bg-white" />

                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">

                        <div className="h-80 rounded-[26px] bg-white" />

                        <div className="h-80 rounded-[26px] bg-white" />

                    </div>

                </div>

            </div>

        </div>
    );
}

export default MechanicDashboard;