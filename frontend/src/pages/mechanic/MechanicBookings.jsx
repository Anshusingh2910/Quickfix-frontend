import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    CalendarDays,
    Car,
    CheckCircle2,
    Clock3,
    Eye,
    IndianRupee,
    Loader2,
    MapPin,
    Navigation,
    Phone,
    RefreshCw,
    Search,
    UserRound,
    Wrench,
    X,
    XCircle,
} from "lucide-react";

import api from "../../services/api";

function MechanicBookings() {
    const navigate = useNavigate();

    // =========================================================
    // STATE
    // =========================================================

    const [bookings, setBookings] = useState([]);

    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [actionLoading, setActionLoading] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // View modal
    const [selectedBooking, setSelectedBooking] =
        useState(null);

    // OTP modal
    const [otpModal, setOtpModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpBooking, setOtpBooking] = useState(null);

    // =========================================================
    // ERROR MESSAGE
    // =========================================================

    const getErrorMessage = (error) => {
        return (
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.response?.data?.data?.message ||
            error?.message ||
            "Something went wrong."
        );
    };

    // =========================================================
    // LOAD BOOKINGS
    // GET /mechanic/bookings
    // =========================================================

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
                    "/mechanic/bookings"
                );

                const data = response?.data;

                let bookingList = [];

                if (Array.isArray(data)) {
                    bookingList = data;
                } else if (
                    Array.isArray(data?.data)
                ) {
                    bookingList = data.data;
                } else if (
                    Array.isArray(data?.data?.bookings)
                ) {
                    bookingList =
                        data.data.bookings;
                } else if (
                    Array.isArray(data?.bookings)
                ) {
                    bookingList = data.bookings;
                }

                setBookings(bookingList);
            } catch (error) {
                console.error(
                    "MECHANIC BOOKINGS ERROR:",
                    error
                );

                setError(
                    getErrorMessage(error)
                );
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

    // =========================================================
    // FORMAT HELPERS
    // =========================================================

    const getCustomerName = (booking) => {
        return (
            booking?.user?.name ||
            booking?.customer?.name ||
            booking?.customerName ||
            "Customer"
        );
    };

    const getCustomerPhone = (booking) => {
        return (
            booking?.user?.phone ||
            booking?.customer?.phone ||
            booking?.phone ||
            ""
        );
    };

    const getVehicleName = (booking) => {
        const vehicle = booking?.vehicle;

        if (!vehicle) {
            return "Vehicle";
        }

        const name = [
            vehicle.company ||
            vehicle.brand ||
            "",
            vehicle.model || "",
        ]
            .filter(Boolean)
            .join(" ")
            .trim();

        return name || "Vehicle";
    };

    const getRegistrationNumber = (
        booking
    ) => {
        return (
            booking?.vehicle
                ?.registrationNumber ||
            booking?.vehicle?.registration ||
            "Registration unavailable"
        );
    };

    const getServiceName = (booking) => {
        const value =
            booking?.serviceType ||
            booking?.service ||
            "Service";

        return String(value)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    const getAmount = (booking) => {
        return Number(
            booking?.amount ||
            booking?.price ||
            booking?.estimatedAmount ||
            0
        );
    };

    const getCoordinates = (booking) => {
        const coordinates =
            booking?.location
                ?.coordinates;

        if (
            Array.isArray(coordinates) &&
            coordinates.length >= 2
        ) {
            return {
                longitude: Number(
                    coordinates[0]
                ),
                latitude: Number(
                    coordinates[1]
                ),
            };
        }

        return null;
    };

    const getLocationText = (booking) => {
        const coordinates =
            getCoordinates(booking);

        if (!coordinates) {
            return "Location unavailable";
        }

        if (
            !Number.isFinite(
                coordinates.latitude
            ) ||
            !Number.isFinite(
                coordinates.longitude
            )
        ) {
            return "Location unavailable";
        }

        return `${coordinates.latitude.toFixed(
            6
        )}, ${coordinates.longitude.toFixed(
            6
        )}`;
    };

    const getBookingDate = (booking) => {
        const date =
            booking?.scheduledAt ||
            booking?.date ||
            booking?.createdAt;

        if (!date) {
            return "Date unavailable";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const getBookingTime = (booking) => {
        const date =
            booking?.scheduledAt ||
            booking?.date ||
            booking?.createdAt;

        if (!date) {
            return "";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "";
        }

        return parsedDate.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    // =========================================================
    // STATUS
    // =========================================================

    const getStatus = (status) => {
        switch (status) {
            case "pending":
                return {
                    label: "New Request",
                    className:
                        "bg-orange-50 text-orange-600",
                };

            case "accepted":
                return {
                    label: "Accepted",
                    className:
                        "bg-blue-50 text-blue-600",
                };

            case "in_progress":
                return {
                    label: "In Progress",
                    className:
                        "bg-violet-50 text-violet-600",
                };

            case "ongoing":
                return {
                    label: "In Progress",
                    className:
                        "bg-violet-50 text-violet-600",
                };

            case "started":
                return {
                    label: "In Progress",
                    className:
                        "bg-violet-50 text-violet-600",
                };

            case "completed":
                return {
                    label: "Completed",
                    className:
                        "bg-emerald-50 text-emerald-600",
                };

            case "cancelled":
                return {
                    label: "Cancelled",
                    className:
                        "bg-slate-100 text-slate-500",
                };

            case "rejected":
                return {
                    label: "Rejected",
                    className:
                        "bg-red-50 text-red-600",
                };

            default:
                return {
                    label:
                        status || "Unknown",
                    className:
                        "bg-slate-100 text-slate-500",
                };
        }
    };

    // =========================================================
    // TABS
    // =========================================================

    const tabs = [
        {
            key: "all",
            label: "All",
        },
        {
            key: "pending",
            label: "New Requests",
        },
        {
            key: "accepted",
            label: "Accepted",
        },
        {
            key: "in_progress",
            label: "In Progress",
        },
        {
            key: "completed",
            label: "Completed",
        },
    ];

    // =========================================================
    // COUNTS
    // =========================================================

    const counts = useMemo(() => {
        return {
            all: bookings.length,

            pending: bookings.filter(
                (booking) =>
                    booking.status ===
                    "pending"
            ).length,

            accepted: bookings.filter(
                (booking) =>
                    booking.status ===
                    "accepted"
            ).length,

            in_progress:
                bookings.filter(
                    (booking) =>
                        booking.status ===
                        "in_progress" ||
                        booking.status ===
                        "ongoing" ||
                        booking.status ===
                        "started"
                ).length,

            completed:
                bookings.filter(
                    (booking) =>
                        booking.status ===
                        "completed"
                ).length,
        };
    }, [bookings]);

    // =========================================================
    // FILTER
    // =========================================================

    const filteredBookings = useMemo(() => {
        const searchText = search
            .trim()
            .toLowerCase();

        return bookings.filter(
            (booking) => {
                const status =
                    booking?.status;

                let matchesTab = true;

                if (
                    activeTab !== "all"
                ) {
                    if (
                        activeTab ===
                        "in_progress"
                    ) {
                        matchesTab =
                            status ===
                            "in_progress" ||
                            status ===
                            "ongoing" ||
                            status ===
                            "started";
                    } else {
                        matchesTab =
                            status ===
                            activeTab;
                    }
                }

                if (!matchesTab) {
                    return false;
                }

                if (!searchText) {
                    return true;
                }

                const customer =
                    getCustomerName(
                        booking
                    ).toLowerCase();

                const vehicle =
                    getVehicleName(
                        booking
                    ).toLowerCase();

                const service =
                    getServiceName(
                        booking
                    ).toLowerCase();

                const registration =
                    getRegistrationNumber(
                        booking
                    ).toLowerCase();

                return (
                    customer.includes(
                        searchText
                    ) ||
                    vehicle.includes(
                        searchText
                    ) ||
                    service.includes(
                        searchText
                    ) ||
                    registration.includes(
                        searchText
                    )
                );
            }
        );
    }, [
        bookings,
        activeTab,
        search,
    ]);

    // =========================================================
    // ACTION HELPER
    // =========================================================

    const runAction = async (
        actionKey,
        callback,
        successMessage
    ) => {
        try {
            setActionLoading(
                actionKey
            );

            setError("");
            setSuccess("");

            await callback();

            setSuccess(
                successMessage
            );

            await loadBookings(true);
        } catch (error) {
            console.error(
                "BOOKING ACTION ERROR:",
                error
            );

            setError(
                getErrorMessage(error)
            );
        } finally {
            setActionLoading("");
        }
    };

    // =========================================================
    // ACCEPT
    // PUT /booking/accept/:bookingId
    // =========================================================

    const handleAccept = async (
        booking
    ) => {
        const bookingId =
            booking?._id;

        if (!bookingId) {
            return;
        }

        await runAction(
            `accept-${bookingId}`,
            () =>
                api.put(
                    `/booking/accept/${bookingId}`
                ),
            "Booking accepted successfully."
        );
    };

    // =========================================================
    // REJECT
    // PUT /booking/reject/:bookingId
    // =========================================================

    const handleReject = async (
        booking
    ) => {
        const bookingId =
            booking?._id;

        if (!bookingId) {
            return;
        }

        await runAction(
            `reject-${bookingId}`,
            () =>
                api.put(
                    `/booking/reject/${bookingId}`
                ),
            "Booking rejected successfully."
        );
    };

    // =========================================================
    // START
    // PUT /mechanic/bookings/:bookingId/start
    // =========================================================

    const handleStart = async (
        booking
    ) => {
        const bookingId =
            booking?._id;

        if (!bookingId) {
            return;
        }

        await runAction(
            `start-${bookingId}`,
            () =>
                api.put(
                    `/mechanic/bookings/${bookingId}/start`
                ),
            "Booking started successfully."
        );
    };

    // =========================================================
    // OPEN OTP
    // =========================================================

    const openOtpModal = (
        booking
    ) => {
        setOtpBooking(booking);
        setOtp("");
        setError("");
        setSuccess("");
        setOtpModal(true);
    };

    // =========================================================
    // VERIFY OTP
    // PUT /booking/verifyOtp/:bookingId
    // =========================================================

    const handleVerifyOTP = async (
        event
    ) => {
        event.preventDefault();

        if (!otpBooking?._id) {
            return;
        }

        if (
            !/^\d{4,6}$/.test(
                otp.trim()
            )
        ) {
            setError(
                "Please enter a valid OTP."
            );
            return;
        }

        try {
            setActionLoading(
                `otp-${otpBooking._id}`
            );

            setError("");
            setSuccess("");

            await api.put(
                `/booking/verifyOtp/${otpBooking._id}`,
                {
                    otp: otp.trim(),
                }
            );

            setSuccess(
                "OTP verified successfully."
            );

            setOtpModal(false);
            setOtp("");
            setOtpBooking(null);

            await loadBookings(true);
        } catch (error) {
            console.error(
                "VERIFY OTP ERROR:",
                error
            );

            setError(
                getErrorMessage(error)
            );
        } finally {
            setActionLoading("");
        }
    };

    // =========================================================
    // COMPLETE
    // PUT /booking/complete/:bookingId
    // =========================================================

    const handleComplete = async (
        booking
    ) => {
        const bookingId =
            booking?._id;

        if (!bookingId) {
            return;
        }

        await runAction(
            `complete-${bookingId}`,
            () =>
                api.put(
                    `/booking/complete/${bookingId}`
                ),
            "Booking completed successfully."
        );
    };

    // =========================================================
    // VIEW
    // GET /booking/:bookingId
    // =========================================================

    const handleView = async (
        booking
    ) => {
        if (!booking?._id) {
            return;
        }

        try {
            setActionLoading(
                `view-${booking._id}`
            );

            setError("");

            const response =
                await api.get(
                    `/booking/${booking._id}`
                );

            const data =
                response?.data;

            const detail =
                data?.data?.booking ||
                data?.data ||
                data?.booking ||
                booking;

            setSelectedBooking(
                detail
            );
        } catch (error) {
            console.error(
                "BOOKING DETAIL ERROR:",
                error
            );

            setError(
                getErrorMessage(error)
            );
        } finally {
            setActionLoading("");
        }
    };

    // =========================================================
    // GOOGLE MAPS
    // =========================================================

    const openMap = (
        booking
    ) => {
        const coordinates =
            getCoordinates(
                booking
            );

        if (!coordinates) {
            setError(
                "Booking location is not available."
            );
            return;
        }

        const url =
            `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    };

    // =========================================================
    // CALL CUSTOMER
    // =========================================================

    const callCustomer = (
        booking
    ) => {
        const phone =
            getCustomerPhone(
                booking
            );

        if (!phone) {
            setError(
                "Customer phone number is not available."
            );
            return;
        }

        window.location.href =
            `tel:${phone}`;
    };

    // =========================================================
    // LOADING SCREEN
    // =========================================================

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
                <div className="text-center">
                    <Loader2
                        size={38}
                        className="mx-auto animate-spin text-blue-600"
                    />

                    <p className="mt-4 text-sm font-bold text-slate-700">
                        Loading bookings...
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        Fetching your customer requests
                    </p>
                </div>
            </div>
        );
    }

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="min-h-screen bg-[#f5f7fb] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1500px]">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[12px] font-bold text-blue-600">
                            <Wrench size={14} />
                            Mechanic Bookings
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                            Your bookings
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Manage new customer requests,
                            accepted jobs, active services
                            and completed bookings.
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

                        {/* SEARCH */}

                        <div className="relative w-full sm:w-[320px]">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search bookings..."
                                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>

                        {/* REFRESH */}

                        <button
                            type="button"
                            disabled={refreshing}
                            onClick={() =>
                                loadBookings(
                                    true
                                )
                            }
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw
                                size={17}
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (
                    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                        <CheckCircle2
                            size={20}
                            className="shrink-0 text-emerald-600"
                        />

                        <p className="text-sm font-bold text-emerald-700">
                            {success}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setSuccess("")
                            }
                            className="ml-auto"
                        >
                            <X
                                size={17}
                                className="text-emerald-500"
                            />
                        </button>
                    </div>
                )}

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
                        <XCircle
                            size={20}
                            className="shrink-0 text-red-500"
                        />

                        <p className="text-sm font-bold text-red-700">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                            className="ml-auto"
                        >
                            <X
                                size={17}
                                className="text-red-500"
                            />
                        </button>
                    </div>
                )}

                {/* =================================================
                    STATS
                ================================================= */}

                <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">

                    {[
                        {
                            key: "all",
                            label: "Total",
                            value:
                                counts.all,
                            icon: CalendarDays,
                            className:
                                "bg-slate-50 text-slate-600",
                        },
                        {
                            key: "pending",
                            label: "New Requests",
                            value:
                                counts.pending,
                            icon: Clock3,
                            className:
                                "bg-orange-50 text-orange-600",
                        },
                        {
                            key: "accepted",
                            label: "Accepted",
                            value:
                                counts.accepted,
                            icon: CheckCircle2,
                            className:
                                "bg-blue-50 text-blue-600",
                        },
                        {
                            key: "in_progress",
                            label: "In Progress",
                            value:
                                counts.in_progress,
                            icon: Wrench,
                            className:
                                "bg-violet-50 text-violet-600",
                        },
                        {
                            key: "completed",
                            label: "Completed",
                            value:
                                counts.completed,
                            icon: CheckCircle2,
                            className:
                                "bg-emerald-50 text-emerald-600",
                        },
                    ].map(
                        (item) => {
                            const Icon =
                                item.icon;

                            return (
                                <button
                                    key={
                                        item.key
                                    }
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(
                                            item.key
                                        )
                                    }
                                    className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${activeTab ===
                                        item.key
                                        ? "border-blue-200 ring-2 ring-blue-50"
                                        : "border-slate-200"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.className}`}
                                        >
                                            <Icon
                                                size={
                                                    18
                                                }
                                            />
                                        </div>

                                        <span className="text-2xl font-black text-slate-950">
                                            {
                                                item.value
                                            }
                                        </span>
                                    </div>

                                    <p className="mt-3 text-xs font-bold text-slate-500">
                                        {
                                            item.label
                                        }
                                    </p>
                                </button>
                            );
                        }
                    )}
                </div>

                {/* =================================================
                    FILTER TABS
                ================================================= */}

                <div className="mb-6 overflow-x-auto">
                    <div className="flex min-w-max gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

                        {tabs.map(
                            (tab) => (
                                <button
                                    key={
                                        tab.key
                                    }
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(
                                            tab.key
                                        )
                                    }
                                    className={`rounded-xl px-5 py-2.5 text-[13px] font-bold transition ${activeTab ===
                                        tab.key
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    {
                                        tab.label
                                    }

                                    <span
                                        className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${activeTab ===
                                            tab.key
                                            ? "bg-white/20 text-white"
                                            : "bg-slate-100 text-slate-500"
                                            }`}
                                    >
                                        {
                                            counts[
                                            tab.key
                                            ]
                                        }
                                    </span>
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* =================================================
                    EMPTY
                ================================================= */}

                {filteredBookings.length ===
                    0 ? (
                    <div className="rounded-[26px] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-300">
                            <CalendarDays
                                size={34}
                            />
                        </div>

                        <h2 className="mt-6 text-xl font-extrabold text-slate-950">
                            No bookings found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                            {search
                                ? "Try a different customer, vehicle or service search."
                                : activeTab ===
                                    "pending"
                                    ? "There are no new customer requests right now."
                                    : "Bookings for this status will appear here."}
                        </p>

                        {search && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearch(
                                        ""
                                    )
                                }
                                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    /* =================================================
                       BOOKING LIST
                    ================================================= */

                    <div className="space-y-4">

                        {filteredBookings.map(
                            (booking) => {
                                const status =
                                    getStatus(
                                        booking.status
                                    );

                                const bookingId =
                                    booking._id;

                                const isAccepting =
                                    actionLoading ===
                                    `accept-${bookingId}`;

                                const isRejecting =
                                    actionLoading ===
                                    `reject-${bookingId}`;

                                const isStarting =
                                    actionLoading ===
                                    `start-${bookingId}`;

                                const isCompleting =
                                    actionLoading ===
                                    `complete-${bookingId}`;

                                const isViewing =
                                    actionLoading ===
                                    `view-${bookingId}`;

                                const isOtpVerifying =
                                    actionLoading ===
                                    `otp-${bookingId}`;

                                const inProgress =
                                    booking.status ===
                                    "in_progress" ||
                                    booking.status ===
                                    "ongoing" ||
                                    booking.status ===
                                    "started";

                                return (
                                    <div
                                        key={
                                            bookingId
                                        }
                                        className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                                    >

                                        <div className="flex flex-col gap-6">

                                            {/* TOP */}

                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                                {/* CUSTOMER */}

                                                <div className="flex items-center gap-4">

                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                                        <UserRound
                                                            size={
                                                                23
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="text-[15px] font-extrabold text-slate-950">
                                                            {getCustomerName(
                                                                booking
                                                            )}
                                                        </p>

                                                        <p className="mt-1 text-[12px] text-slate-400">
                                                            Booking #
                                                            {String(
                                                                bookingId ||
                                                                ""
                                                            ).slice(
                                                                -8
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* STATUS */}

                                                <span
                                                    className={`self-start rounded-full px-3 py-1.5 text-[11px] font-bold lg:self-center ${status.className}`}
                                                >
                                                    {
                                                        status.label
                                                    }
                                                </span>
                                            </div>

                                            {/* DETAILS */}

                                            <div className="grid gap-4 border-y border-slate-100 py-5 md:grid-cols-2 xl:grid-cols-5">

                                                {/* VEHICLE */}

                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                                                        <Car
                                                            size={
                                                                19
                                                            }
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-[11px] font-semibold text-slate-400">
                                                            Vehicle
                                                        </p>

                                                        <p className="mt-1 truncate text-[14px] font-bold text-slate-800">
                                                            {getVehicleName(
                                                                booking
                                                            )}
                                                        </p>

                                                        <p className="text-[11px] text-slate-400">
                                                            {getRegistrationNumber(
                                                                booking
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* SERVICE */}

                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                        <Wrench
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="text-[11px] font-semibold text-slate-400">
                                                            Service
                                                        </p>

                                                        <p className="mt-1 text-[14px] font-bold text-slate-800">
                                                            {getServiceName(
                                                                booking
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* SCHEDULE */}

                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                                                        <Clock3
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="text-[11px] font-semibold text-slate-400">
                                                            Schedule
                                                        </p>

                                                        <p className="mt-1 text-[14px] font-bold text-slate-800">
                                                            {getBookingDate(
                                                                booking
                                                            )}
                                                        </p>

                                                        <p className="text-[11px] text-slate-400">
                                                            {getBookingTime(
                                                                booking
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* AMOUNT */}

                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                                        <IndianRupee
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="text-[11px] font-semibold text-slate-400">
                                                            Amount
                                                        </p>

                                                        <p className="mt-1 text-[15px] font-extrabold text-slate-950">
                                                            ₹
                                                            {getAmount(
                                                                booking
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* LOCATION */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openMap(
                                                            booking
                                                        )
                                                    }
                                                    className="flex items-center gap-3 text-left"
                                                >
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                                        <MapPin
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-[11px] font-semibold text-slate-400">
                                                            Location
                                                        </p>

                                                        <p className="mt-1 truncate text-[13px] font-bold text-blue-600">
                                                            Open Map
                                                        </p>

                                                        <p className="truncate text-[10px] text-slate-400">
                                                            {getLocationText(
                                                                booking
                                                            )}
                                                        </p>
                                                    </div>
                                                </button>
                                            </div>

                                            {/* NOTES */}

                                            {booking.notes && (
                                                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                        Customer Notes
                                                    </p>

                                                    <p className="mt-1 text-sm font-medium text-slate-700">
                                                        {
                                                            booking.notes
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {/* ACTIONS */}

                                            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

                                                <div className="flex flex-wrap gap-2">

                                                    {/* VIEW */}

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isViewing
                                                        }
                                                        onClick={() =>
                                                            handleView(
                                                                booking
                                                            )
                                                        }
                                                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-[12px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                                    >
                                                        {isViewing ? (
                                                            <Loader2
                                                                size={
                                                                    16
                                                                }
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Eye
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        )}
                                                        View
                                                    </button>

                                                    {/* CALL */}

                                                    {getCustomerPhone(
                                                        booking
                                                    ) && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    callCustomer(
                                                                        booking
                                                                    )
                                                                }
                                                                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-[12px] font-bold text-slate-600 transition hover:bg-slate-50"
                                                            >
                                                                <Phone
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                                Call
                                                            </button>
                                                        )}

                                                    {/* MAP */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openMap(
                                                                booking
                                                            )
                                                        }
                                                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-[12px] font-bold text-slate-600 transition hover:bg-slate-50"
                                                    >
                                                        <Navigation
                                                            size={
                                                                16
                                                            }
                                                        />
                                                        Navigate
                                                    </button>
                                                </div>

                                                <div className="flex flex-wrap gap-2">

                                                    {/* PENDING */}

                                                    {booking.status ===
                                                        "pending" && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isAccepting ||
                                                                        isRejecting
                                                                    }
                                                                    onClick={() =>
                                                                        handleAccept(
                                                                            booking
                                                                        )
                                                                    }
                                                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-[12px] font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    {isAccepting ? (
                                                                        <Loader2
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="animate-spin"
                                                                        />
                                                                    ) : (
                                                                        <CheckCircle2
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    )}
                                                                    Accept
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isAccepting ||
                                                                        isRejecting
                                                                    }
                                                                    onClick={() =>
                                                                        handleReject(
                                                                            booking
                                                                        )
                                                                    }
                                                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-5 text-[12px] font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    {isRejecting ? (
                                                                        <Loader2
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="animate-spin"
                                                                        />
                                                                    ) : (
                                                                        <XCircle
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    )}
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}

                                                    {/* ACCEPTED */}

                                                    {booking.status ===
                                                        "accepted" && (
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    isStarting
                                                                }
                                                                onClick={() =>
                                                                    handleStart(
                                                                        booking
                                                                    )
                                                                }
                                                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-[12px] font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                {isStarting ? (
                                                                    <Loader2
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="animate-spin"
                                                                    />
                                                                ) : (
                                                                    <Wrench
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                )}
                                                                Start Job
                                                            </button>
                                                        )}

                                                    {/* IN PROGRESS */}

                                                    {inProgress && (
                                                        <>
                                                            {!booking.otpVerified && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        openOtpModal(
                                                                            booking
                                                                        )
                                                                    }
                                                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 text-[12px] font-bold text-white transition hover:bg-amber-600"
                                                                >
                                                                    <CheckCircle2
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                    Verify OTP
                                                                </button>
                                                            )}

                                                            {booking.otpVerified && (
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isCompleting
                                                                    }
                                                                    onClick={() =>
                                                                        handleComplete(
                                                                            booking
                                                                        )
                                                                    }
                                                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-[12px] font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    {isCompleting ? (
                                                                        <Loader2
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="animate-spin"
                                                                        />
                                                                    ) : (
                                                                        <CheckCircle2
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    )}
                                                                    Complete
                                                                </button>
                                                            )}
                                                        </>
                                                    )}

                                                    {/* COMPLETED */}

                                                    {booking.status ===
                                                        "completed" && (
                                                            <span className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-50 px-4 text-[12px] font-bold text-emerald-600">
                                                                <CheckCircle2
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                                Service Completed
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>

            {/* =====================================================
                OTP MODAL
            ===================================================== */}

            {otpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                    <CheckCircle2
                                        size={
                                            22
                                        }
                                    />
                                </div>

                                <h2 className="mt-4 text-xl font-black text-slate-950">
                                    Verify Customer OTP
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                    Ask the customer for
                                    the OTP before completing
                                    the service.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setOtpModal(
                                        false
                                    );
                                    setOtp("");
                                    setOtpBooking(
                                        null
                                    );
                                }}
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X
                                    size={
                                        20
                                    }
                                />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleVerifyOTP
                            }
                            className="mt-6"
                        >
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                                placeholder="Enter OTP"
                                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-center text-2xl font-black tracking-[0.5em] text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />

                            <button
                                type="submit"
                                disabled={
                                    isOtpVerifying
                                }
                                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isOtpVerifying ? (
                                    <>
                                        <Loader2
                                            size={
                                                18
                                            }
                                            className="animate-spin"
                                        />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2
                                            size={
                                                18
                                            }
                                        />
                                        Verify OTP
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* =====================================================
                VIEW BOOKING MODAL
            ===================================================== */}

            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 px-4 py-8 backdrop-blur-sm">

                    <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-slate-100 p-6">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                                    Booking Details
                                </p>

                                <h2 className="mt-1 text-2xl font-black text-slate-950">
                                    #{String(
                                        selectedBooking._id ||
                                        ""
                                    ).slice(
                                        -8
                                    )}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedBooking(
                                        null
                                    )
                                }
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X
                                    size={
                                        21
                                    }
                                />
                            </button>
                        </div>

                        <div className="space-y-5 p-6">

                            <div className="grid gap-4 sm:grid-cols-2">

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        Customer
                                    </p>

                                    <p className="mt-2 font-bold text-slate-900">
                                        {getCustomerName(
                                            selectedBooking
                                        )}
                                    </p>

                                    {getCustomerPhone(
                                        selectedBooking
                                    ) && (
                                            <p className="mt-1 text-xs text-slate-500">
                                                {getCustomerPhone(
                                                    selectedBooking
                                                )}
                                            </p>
                                        )}
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        Vehicle
                                    </p>

                                    <p className="mt-2 font-bold text-slate-900">
                                        {getVehicleName(
                                            selectedBooking
                                        )}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {getRegistrationNumber(
                                            selectedBooking
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        Service
                                    </p>

                                    <p className="mt-2 font-bold text-slate-900">
                                        {getServiceName(
                                            selectedBooking
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        Amount
                                    </p>

                                    <p className="mt-2 flex items-center gap-1 font-black text-slate-900">
                                        <IndianRupee
                                            size={
                                                16
                                            }
                                        />
                                        {getAmount(
                                            selectedBooking
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                                <div className="flex gap-3">
                                    <MapPin
                                        size={
                                            20
                                        }
                                        className="shrink-0 text-blue-600"
                                    />

                                    <div>
                                        <p className="text-sm font-bold text-blue-800">
                                            Customer Location
                                        </p>

                                        <p className="mt-1 text-xs text-blue-600">
                                            {getLocationText(
                                                selectedBooking
                                            )}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openMap(
                                                    selectedBooking
                                                )
                                            }
                                            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                                        >
                                            Open Navigation
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {selectedBooking.notes && (
                                <div>
                                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                                        Customer Notes
                                    </p>

                                    <p className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                                        {
                                            selectedBooking.notes
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MechanicBookings;