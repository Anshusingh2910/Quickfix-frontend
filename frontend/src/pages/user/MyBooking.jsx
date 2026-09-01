import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Bike,
    CalendarDays,
    Car,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Loader2,
    RefreshCw,
    Wrench,
    XCircle,
} from "lucide-react";

import api from "../../services/api";

function MyBookings() {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const getErrorMessage = (error) => {
        return (
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.response?.data?.data?.message ||
            error?.message ||
            "Unable to load bookings."
        );
    };
    const loadBookings = useCallback(
        async (isRefresh = false) => {
            try {
                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const response = await api.get(
                    "/booking/my-bookings"
                );

                console.log(
                    "MY BOOKINGS:",
                    response?.data
                );

                const responseData = response?.data;

                let data = [];

                if (Array.isArray(responseData)) {
                    data = responseData;
                } else if (
                    Array.isArray(responseData?.data)
                ) {
                    data = responseData.data;
                } else if (
                    Array.isArray(
                        responseData?.data?.bookings
                    )
                ) {
                    data =
                        responseData.data.bookings;
                } else if (
                    Array.isArray(
                        responseData?.bookings
                    )
                ) {
                    data = responseData.bookings;
                }

                setBookings(data);
            } catch (error) {
                console.error(
                    "MY BOOKINGS ERROR:",
                    error
                );

                if (
                    error?.response?.status ===
                    404
                ) {
                    setBookings([]);
                    setError("");
                } else {
                    setError(
                        getErrorMessage(error)
                    );
                }
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    useEffect(() => {
        loadBookings();
    }, [loadBookings]);

    const getStatusConfig = (status) => {
        switch (
        String(status || "").toLowerCase()
        ) {
            case "accepted":
                return {
                    label: "Accepted",
                    className:
                        "bg-blue-50 text-blue-700 border-blue-100",
                    icon: CheckCircle2,
                };

            case "completed":
                return {
                    label: "Completed",
                    className:
                        "bg-emerald-50 text-emerald-700 border-emerald-100",
                    icon: CheckCircle2,
                };

            case "cancelled":
                return {
                    label: "Cancelled",
                    className: "bg-red-50 text-red-700 border-red-100",
                    icon: XCircle,
                };

            case "rejected":
                return {
                    label: "Rejected",
                    className: "bg-red-50 text-red-700 border-red-100",
                    icon: XCircle,
                };

            default:
                return {
                    label: "Finding Mechanic",
                    className:
                        "bg-orange-50 text-orange-700 border-orange-100",
                    icon: Clock3,
                };
        }
    };

    const getVehicleName = (vehicle) => {
        if (!vehicle) {
            return "Vehicle";
        }

        return (
            `${vehicle.company || vehicle.brand || ""} ${vehicle.model || ""
                }`.trim() || "Vehicle"
        );
    };

    const VehicleIcon = ({ type }) => {
        const value = String(
            type || ""
        ).toLowerCase();
        if (
            value === "bike" ||
            value === "motorcycle" ||
            value === "scooter"
        ) {
            return <Bike size={25} />;
        }
        return <Car size={25} />;
    };

    const formatService = (service) => {
        if (!service) {
            return "Vehicle Service";
        }

        return String(service)
            .replace(/_/g, " ")
            .replace(
                /\b\w/g,
                (letter) =>
                    letter.toUpperCase()
            );
    };

    const createBooking = () => {
        navigate("/booking/create");
    };
    const openDetails = (id) => {
        if (!id) {
            return;
        }

        navigate(`/bookings/${id}`);
    };
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2
                        size={35}
                        className="mx-auto animate-spin text-blue-600"
                    />

                    <p className="mt-4 font-bold text-slate-800">
                        Loading your bookings...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">

                {/* HEADER */}

                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                                QuickFix
                            </p>

                            <h1 className="mt-1 text-3xl font-black text-slate-900">
                                My Bookings
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Track your service requests and
                                mechanic assignments.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    loadBookings(true)
                                }
                                disabled={refreshing}
                                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={17}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                <span className="hidden sm:block">
                                    Refresh
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={createBooking}
                                className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-black text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                            >
                                <Wrench size={17} />
                                Create Booking
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
                        {error}
                    </div>
                )}

                {!bookings.length ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
                            <Wrench size={34} />
                        </div>

                        <h2 className="mt-6 text-2xl font-black text-slate-900">
                            No bookings yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Create your first service booking and
                            share your live location with a nearby
                            mechanic.
                        </p>

                        <button
                            type="button"
                            onClick={createBooking}
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-black text-white hover:bg-blue-700"
                        >
                            <Wrench size={18} />
                            Create Booking
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">

                        {bookings.map((booking) => {
                            const status =
                                getStatusConfig(
                                    booking?.status
                                );

                            const StatusIcon =
                                status.icon;

                            const vehicle =
                                booking?.vehicle;

                            return (
                                <button
                                    key={booking?._id}
                                    type="button"
                                    onClick={() =>
                                        openDetails(
                                            booking?._id
                                        )
                                    }
                                    className="group w-full rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6"
                                >
                                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                                        <div className="flex min-w-0 flex-1 items-center gap-4">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                                <VehicleIcon
                                                    type={
                                                        vehicle?.vehicleType
                                                    }
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <h2 className="truncate font-black text-slate-900">
                                                    {getVehicleName(
                                                        vehicle
                                                    )}
                                                </h2>

                                                <p className="mt-1 text-xs font-semibold text-slate-500">
                                                    {vehicle?.registrationNumber ||
                                                        "Registration unavailable"}
                                                </p>

                                                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                                                    <span>
                                                        {formatService(
                                                            booking?.serviceType
                                                        )}
                                                    </span>

                                                    {booking?.createdAt && (
                                                        <>
                                                            <span>
                                                                •
                                                            </span>

                                                            <span>
                                                                {new Date(
                                                                    booking.createdAt
                                                                ).toLocaleDateString(
                                                                    "en-IN",
                                                                    {
                                                                        day: "2-digit",
                                                                        month: "short",
                                                                        year: "numeric",
                                                                    }
                                                                )}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* STATUS */}

                                        <div className="flex items-center justify-between gap-4">
                                            <span
                                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black ${status.className}`}
                                            >
                                                <StatusIcon size={14} />
                                                {status.label}
                                            </span>

                                            <ChevronRight
                                                size={21}
                                                className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="my-5 h-px bg-slate-100" />
                                    <div className="grid gap-4 sm:grid-cols-3">

                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${booking?.mechanic
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-orange-50 text-orange-600"
                                                    }`}
                                            >
                                                {booking?.mechanic ? (
                                                    <Wrench size={18} />
                                                ) : (
                                                    <Clock3 size={18} />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                    Mechanic
                                                </p>

                                                <p className="truncate text-xs font-bold text-slate-800">
                                                    {booking?.mechanic
                                                        ?.shopName ||
                                                        (booking?.mechanic
                                                            ? "Assigned"
                                                            : "Finding mechanic")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                                <CalendarDays size={18} />
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                    Created
                                                </p>

                                                <p className="text-xs font-bold text-slate-800">
                                                    {booking?.createdAt
                                                        ? new Date(
                                                            booking.createdAt
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                            }
                                                        )
                                                        : "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                <ChevronRight size={19} />
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                    Booking
                                                </p>

                                                <p className="text-xs font-bold text-blue-600">
                                                    View Details
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                </button>
                            );
                        })}

                        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-dashed border-blue-200 bg-blue-50/50 p-6 sm:flex-row">
                            <div>
                                <p className="font-black text-slate-900">
                                    Need another service?
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Create another booking anytime.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={createBooking}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700"
                            >
                                <Wrench size={17} />
                                Create Another Booking
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBookings;