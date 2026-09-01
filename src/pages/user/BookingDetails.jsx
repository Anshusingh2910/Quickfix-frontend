import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Bike,
    Car,
    CheckCircle2,
    Clock3,
    Loader2,
    LocateFixed,
    MapPin,
    Navigation,
    RefreshCw,
    ShieldCheck,
    UserRound,
    Wrench,
    XCircle,
} from "lucide-react";

import api from "../../services/api";

function BookingDetails() {
    const navigate = useNavigate();
    const { bookingId } = useParams();

    const [booking, setBooking] = useState(null);

    const [mechanics, setMechanics] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [findingMechanic, setFindingMechanic] =
        useState(false);

    const [assigningMechanic, setAssigningMechanic] =
        useState(false);

    const [selectedMechanic, setSelectedMechanic] =
        useState(null);

    const [cancelling, setCancelling] =
        useState(false);

    const [otp, setOtp] = useState("");
    const [verifyingOtp, setVerifyingOtp] =
        useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const getErrorMessage = (error) => {
        return (
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.response?.data?.data?.message ||
            error?.message ||
            "Something went wrong."
        );
    };

    const loadBooking = useCallback(
        async (isRefresh = false) => {
            try {
                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const response = await api.get(
                    `/booking/${bookingId}`
                );

                console.log(
                    "BOOKING DETAILS:",
                    response?.data
                );

                const data =
                    response?.data?.data ||
                    response?.data?.booking ||
                    response?.data;

                if (!data?._id) {
                    throw new Error(
                        "Booking details not found."
                    );
                }

                setBooking(data);

                // If mechanic already assigned,
                // clear nearby mechanics list.
                if (data.mechanic) {
                    setMechanics([]);
                    setSelectedMechanic(null);
                }
            } catch (error) {
                console.error(
                    "BOOKING DETAILS ERROR:",
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
        [bookingId]
    );

    useEffect(() => {
        if (bookingId) {
            loadBooking();
        }
    }, [bookingId, loadBooking]);

    const findMechanic = async () => {
        try {
            setFindingMechanic(true);
            setError("");
            setSuccess("");

            setMechanics([]);
            setSelectedMechanic(null);

            if (!navigator.geolocation) {
                throw new Error(
                    "Geolocation is not supported by this browser."
                );
            }

            const position = await new Promise(
                (resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        resolve,
                        reject,
                        {
                            enableHighAccuracy: true,
                            timeout: 15000,
                            maximumAge: 0,
                        }
                    );
                }
            );

            const latitude =
                Number(
                    position.coords.latitude
                );

            const longitude =
                Number(
                    position.coords.longitude
                );

            if (
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude)
            ) {
                throw new Error(
                    "Invalid live location."
                );
            }

            console.log(
                "LIVE LOCATION:",
                {
                    latitude,
                    longitude,
                }
            );

            const response = await api.put(
                `/booking/find-mechanic/${bookingId}`,
                {
                    latitude,
                    longitude,
                }
            );

            console.log(
                "FIND MECHANIC RESPONSE:",
                response?.data
            );

            const foundMechanics =
                response?.data?.data?.mechanics ||
                [];

            setMechanics(
                Array.isArray(foundMechanics)
                    ? foundMechanics
                    : []
            );

            await loadBooking(true);

            if (
                response?.data?.found &&
                foundMechanics.length
            ) {
                setSuccess(
                    "Nearby mechanics found. Please select a mechanic."
                );
            } else {
                setSuccess(
                    "No mechanic is currently available near your location."
                );
            }
        } catch (error) {
            console.error(
                "FIND MECHANIC ERROR:",
                error
            );

            let message =
                "Unable to get your current location.";

            if (error?.code === 1) {
                message =
                    "Location permission denied. Please allow location access.";
            } else if (error?.code === 2) {
                message =
                    "Unable to determine your current location.";
            } else if (error?.code === 3) {
                message =
                    "Location request timed out. Please try again.";
            } else {
                message =
                    getErrorMessage(error);
            }

            setError(message);
        } finally {
            setFindingMechanic(false);
        }
    };

    const assignMechanic = async () => {
        if (!selectedMechanic) {
            setError(
                "Please select a mechanic first."
            );
            return;
        }

        try {
            setAssigningMechanic(true);
            setError("");
            setSuccess("");

            const response = await api.post(
                `/booking/assignMechanic/${bookingId}`,
                {
                    mechanicId:
                        selectedMechanic._id,
                }
            );

            console.log(
                "ASSIGN MECHANIC RESPONSE:",
                response?.data
            );

            setMechanics([]);
            setSelectedMechanic(null);

            await loadBooking(true);

            setSuccess(
                "Mechanic assigned successfully. Waiting for mechanic acceptance."
            );
        } catch (error) {
            console.error(
                "ASSIGN MECHANIC ERROR:",
                error
            );

            setError(
                getErrorMessage(error)
            );
        } finally {
            setAssigningMechanic(false);
        }
    };

    const cancelBooking = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setCancelling(true);
            setError("");
            setSuccess("");

            const response = await api.put(
                `/booking/cancel/${bookingId}`
            );

            console.log(
                "CANCEL RESPONSE:",
                response?.data
            );

            await loadBooking(true);

            setSuccess(
                "Booking cancelled successfully."
            );
        } catch (error) {
            console.error(
                "CANCEL BOOKING ERROR:",
                error
            );

            setError(
                getErrorMessage(error)
            );
        } finally {
            setCancelling(false);
        }
    };

    const verifyOtp = async (event) => {
        event.preventDefault();

        if (!otp.trim()) {
            setError("Please enter the OTP.");
            return;
        }

        if (otp.trim().length < 4) {
            setError("Please enter a valid OTP.");
            return;
        }

        try {
            setVerifyingOtp(true);
            setError("");
            setSuccess("");

            const response = await api.put(
                `/booking/verifyOtp/${bookingId}`,
                {
                    otp: otp.trim(),
                }
            );

            console.log(
                "VERIFY OTP RESPONSE:",
                response?.data
            );

            setOtp("");

            await loadBooking(true);

            setSuccess(
                "OTP verified successfully."
            );
        } catch (error) {
            console.error(
                "VERIFY OTP ERROR:",
                error
            );

            setError(
                getErrorMessage(error)
            );
        } finally {
            setVerifyingOtp(false);
        }
    };

    const getVehicleName = (vehicle) => {
        if (!vehicle) {
            return "Vehicle";
        }

        return (
            `${vehicle.company || vehicle.brand || ""} ${
                vehicle.model || ""
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
            return <Bike size={28} />;
        }

        return <Car size={28} />;
    };

    const getStatus = (status) => {
        switch (
            String(status || "").toLowerCase()
        ) {
            case "accepted":
                return {
                    label: "Mechanic Accepted",
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
                    label: "Finding Mechanic",
                    className:
                        "bg-orange-50 text-orange-700 border-orange-100",
                    icon: Clock3,
                };
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2
                        size={36}
                        className="mx-auto animate-spin text-blue-600"
                    />

                    <p className="mt-4 font-bold text-slate-800">
                        Loading booking...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !booking) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-10">
                <div className="mx-auto max-w-2xl">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/bookings")
                        }
                        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600"
                    >
                        <ArrowLeft size={18} />
                        My Bookings
                    </button>

                    <div className="rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
                        <XCircle
                            size={40}
                            className="mx-auto text-red-500"
                        />

                        <h1 className="mt-5 text-xl font-black text-slate-900">
                            Booking not found
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/bookings")
                            }
                            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
                        >
                            Go to My Bookings
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!booking) {
        return null;
    }

    const status = getStatus(
        booking.status
    );

    const StatusIcon = status.icon;

    const vehicle = booking.vehicle;
    const mechanic = booking.mechanic;

    const coordinates =
        booking?.location?.coordinates;

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">

                {/* HEADER */}

                <div className="mb-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/bookings")
                        }
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600"
                    >
                        <ArrowLeft size={18} />
                        My Bookings
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            loadBooking(true)
                        }
                        disabled={refreshing}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>
                </div>

                {/* TITLE */}

                <div className="mb-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                                QuickFix
                            </p>

                            <h1 className="mt-1 text-3xl font-black text-slate-900">
                                Booking Details
                            </h1>

                            <p className="mt-2 break-all text-xs text-slate-500">
                                ID: {booking._id}
                            </p>
                        </div>

                        <span
                            className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-black ${status.className}`}
                        >
                            <StatusIcon size={16} />
                            {status.label}
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="mb-5 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
                        <XCircle
                            size={19}
                            className="shrink-0 text-red-500"
                        />

                        <p className="text-sm font-semibold text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                {success && (
                    <div className="mb-5 flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                        <CheckCircle2
                            size={19}
                            className="shrink-0 text-emerald-600"
                        />

                        <p className="text-sm font-semibold text-emerald-700">
                            {success}
                        </p>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[1fr_350px]">

                    {/* LEFT */}

                    <div className="space-y-6">

                        {/* VEHICLE */}

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                                Vehicle
                            </p>

                            <div className="mt-5 flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <VehicleIcon
                                        type={
                                            vehicle?.vehicleType
                                        }
                                    />
                                </div>

                                <div>
                                    <h2 className="text-lg font-black text-slate-900">
                                        {getVehicleName(
                                            vehicle
                                        )}
                                    </h2>

                                    <p className="mt-1 text-sm font-semibold text-slate-500">
                                        {vehicle?.registrationNumber ||
                                            "Registration unavailable"}
                                    </p>

                                    <div className="mt-2 flex gap-3 text-xs text-slate-400">
                                        {vehicle?.year && (
                                            <span>
                                                {vehicle.year}
                                            </span>
                                        )}

                                        {vehicle?.fuelType && (
                                            <span className="capitalize">
                                                {
                                                    vehicle.fuelType
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SERVICE */}

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                                Service
                            </p>

                            <div className="mt-5 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <Wrench size={22} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-black capitalize text-slate-900">
                                        {String(
                                            booking.serviceType ||
                                            "Vehicle Service"
                                        ).replace(
                                            /_/g,
                                            " "
                                        )}
                                    </h2>

                                    {booking.notes && (
                                        <p className="mt-2 text-sm leading-6 text-slate-500">
                                            {booking.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* LOCATION */}

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                                        Service Location
                                    </p>

                                    <h2 className="mt-1 font-black text-slate-900">
                                        Your Live Location
                                    </h2>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <LocateFixed size={21} />
                                </div>
                            </div>

                            <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                                <div className="flex gap-3">
                                    <MapPin
                                        size={22}
                                        className="mt-0.5 shrink-0 text-blue-600"
                                    />

                                    <div>
                                        <p className="text-sm font-black text-slate-800">
                                            Location captured
                                        </p>

                                        {coordinates?.length >=
                                            2 ? (
                                            <p className="mt-1 text-xs text-slate-500">
                                                Longitude:{" "}
                                                {
                                                    coordinates[0]
                                                }
                                                <br />
                                                Latitude:{" "}
                                                {
                                                    coordinates[1]
                                                }
                                            </p>
                                        ) : (
                                            <p className="mt-1 text-xs text-slate-500">
                                                Location coordinates
                                                unavailable.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {coordinates?.length >=
                                    2 && (
                                    <a
                                        href={`https://www.google.com/maps?q=${coordinates[1]},${coordinates[0]}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-black text-blue-600 shadow-sm ring-1 ring-slate-200 hover:bg-blue-50"
                                    >
                                        <Navigation size={16} />
                                        Open Location in Maps
                                    </a>
                                )}
                            </div>
                        </section>

                    </div>

                    {/* RIGHT */}

                    <aside className="space-y-6">

                        {/* MECHANIC */}

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                                Mechanic
                            </p>

                            {mechanic ? (

                                /* ASSIGNED MECHANIC */

                                <div className="mt-5">

                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                            <Wrench size={25} />
                                        </div>

                                        <div className="min-w-0">
                                            <h2 className="truncate font-black text-slate-900">
                                                {mechanic.shopName ||
                                                    "Mechanic Assigned"}
                                            </h2>

                                            {mechanic.experience !==
                                                undefined && (
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {
                                                        mechanic.experience
                                                    }{" "}
                                                    years experience
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {mechanic.rating !==
                                        undefined && (
                                        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                                            <p className="text-xs font-bold text-slate-400">
                                                RATING
                                            </p>

                                            <p className="mt-1 font-black text-slate-900">
                                                ⭐{" "}
                                                {mechanic.rating ||
                                                    0}{" "}
                                                / 5
                                            </p>
                                        </div>
                                    )}

                                    {mechanic.specialization && (
                                        <div className="mt-3 rounded-2xl bg-slate-50 p-4">
                                            <p className="text-xs font-bold text-slate-400">
                                                SPECIALIZATION
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                                {Array.isArray(
                                                    mechanic.specialization
                                                )
                                                    ? mechanic.specialization.join(
                                                          ", "
                                                      )
                                                    : mechanic.specialization}
                                            </p>
                                        </div>
                                    )}
                                </div>

                            ) : (

                                /* NO ASSIGNED MECHANIC */

                                <div className="mt-5">

                                    <div className="rounded-2xl bg-orange-50 p-5">

                                        <Clock3
                                            size={25}
                                            className="text-orange-500"
                                        />

                                        <p className="mt-3 font-black text-orange-800">
                                            No mechanic assigned
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-orange-600">
                                            Find a nearby approved and
                                            available mechanic for this
                                            booking.
                                        </p>

                                        {booking.status ===
                                            "pending" && (
                                            <button
                                                type="button"
                                                onClick={
                                                    findMechanic
                                                }
                                                disabled={
                                                    findingMechanic
                                                }
                                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white hover:bg-orange-600 disabled:opacity-60"
                                            >
                                                {findingMechanic ? (
                                                    <>
                                                        <Loader2
                                                            size={17}
                                                            className="animate-spin"
                                                        />
                                                        Finding Mechanic...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Navigation
                                                            size={17}
                                                        />
                                                        Find Nearby Mechanic
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* MECHANIC LIST */}

                                    {mechanics.length > 0 && (
                                        <div className="mt-4 space-y-3">

                                            <p className="text-sm font-black text-slate-900">
                                                Nearby Mechanics
                                            </p>

                                            {mechanics.map(
                                                (item) => {
                                                    const selected =
                                                        selectedMechanic?._id ===
                                                        item._id;

                                                    return (
                                                        <button
                                                            key={
                                                                item._id
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedMechanic(
                                                                    item
                                                                )
                                                            }
                                                            className={`w-full rounded-2xl border p-4 text-left transition ${
                                                                selected
                                                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                                                    : "border-slate-200 bg-white hover:border-blue-300"
                                                            }`}
                                                        >

                                                            <div className="flex items-center gap-3">

                                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                                    {item.profileImage ? (
                                                                        <img
                                                                            src={
                                                                                item.profileImage
                                                                            }
                                                                            alt={
                                                                                item.shopName ||
                                                                                "Mechanic"
                                                                            }
                                                                            className="h-full w-full rounded-xl object-cover"
                                                                        />
                                                                    ) : (
                                                                        <Wrench
                                                                            size={
                                                                                22
                                                                            }
                                                                        />
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0 flex-1">

                                                                    <p className="truncate font-black text-slate-900">
                                                                        {item.shopName ||
                                                                            "Mechanic"}
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-slate-500">
                                                                        ⭐{" "}
                                                                        {item.rating ||
                                                                            0}{" "}
                                                                        ·{" "}
                                                                        {item.experience ||
                                                                            0}{" "}
                                                                        years experience
                                                                    </p>

                                                                    {item.specialization && (
                                                                        <p className="mt-1 truncate text-xs text-slate-400">
                                                                            {Array.isArray(
                                                                                item.specialization
                                                                            )
                                                                                ? item.specialization.join(
                                                                                      ", "
                                                                                  )
                                                                                : item.specialization}
                                                                        </p>
                                                                    )}

                                                                </div>

                                                                {selected && (
                                                                    <CheckCircle2
                                                                        size={
                                                                            21
                                                                        }
                                                                        className="shrink-0 text-blue-600"
                                                                    />
                                                                )}

                                                            </div>

                                                        </button>
                                                    );
                                                }
                                            )}

                                            {selectedMechanic && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        assignMechanic
                                                    }
                                                    disabled={
                                                        assigningMechanic
                                                    }
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-60"
                                                >
                                                    {assigningMechanic ? (
                                                        <>
                                                            <Loader2
                                                                size={
                                                                    17
                                                                }
                                                                className="animate-spin"
                                                            />
                                                            Assigning Mechanic...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle2
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                            Assign Selected Mechanic
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    )}

                                </div>
                            )}
                        </section>

                        {/* OTP */}

                        {booking.status ===
                            "accepted" &&
                            !booking.otpVerified && (
                                <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

                                    <div className="flex gap-3">
                                        <ShieldCheck
                                            size={23}
                                            className="shrink-0 text-blue-600"
                                        />

                                        <div>
                                            <p className="font-black text-blue-800">
                                                Service OTP
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-blue-600">
                                                Give the OTP to the
                                                mechanic when the
                                                service is being
                                                completed.
                                            </p>
                                        </div>
                                    </div>

                                    <form
                                        onSubmit={
                                            verifyOtp
                                        }
                                        className="mt-5"
                                    >
                                        <input
                                            value={otp}
                                            onChange={(
                                                event
                                            ) =>
                                                setOtp(
                                                    event.target.value
                                                        .replace(
                                                            /\D/g,
                                                            ""
                                                        )
                                                        .slice(
                                                            0,
                                                            6
                                                        )
                                                )
                                            }
                                            inputMode="numeric"
                                            placeholder="Enter OTP"
                                            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-center text-lg font-black tracking-[0.4em] outline-none focus:border-blue-500"
                                        />

                                        <button
                                            type="submit"
                                            disabled={
                                                verifyingOtp
                                            }
                                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            {verifyingOtp ? (
                                                <>
                                                    <Loader2
                                                        size={
                                                            17
                                                        }
                                                        className="animate-spin"
                                                    />
                                                    Verifying...
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldCheck
                                                        size={
                                                            17
                                                        }
                                                    />
                                                    Verify OTP
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </section>
                            )}

                        {booking.otpVerified && (
                            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2
                                        size={22}
                                        className="text-emerald-600"
                                    />

                                    <div>
                                        <p className="font-black text-emerald-800">
                                            OTP Verified
                                        </p>

                                        <p className="text-xs text-emerald-600">
                                            Service verification completed.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ACTIONS */}

                        <div className="space-y-3">

                            {booking.status ===
                                "pending" &&
                                !mechanic &&
                                mechanics.length ===
                                    0 && (
                                    <button
                                        type="button"
                                        onClick={
                                            findMechanic
                                        }
                                        disabled={
                                            findingMechanic
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-60"
                                    >
                                        {findingMechanic ? (
                                            <>
                                                <Loader2
                                                    size={
                                                        19
                                                    }
                                                    className="animate-spin"
                                                />
                                                Finding Mechanic...
                                            </>
                                        ) : (
                                            <>
                                                <Navigation
                                                    size={
                                                        19
                                                    }
                                                />
                                                Find Mechanic
                                            </>
                                        )}
                                    </button>
                                )}

                            {booking.status ===
                                "pending" && (
                                <button
                                    type="button"
                                    onClick={
                                        cancelBooking
                                    }
                                    disabled={
                                        cancelling
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-4 text-sm font-black text-red-600 hover:bg-red-50 disabled:opacity-60"
                                >
                                    {cancelling ? (
                                        <>
                                            <Loader2
                                                size={
                                                    18
                                                }
                                                className="animate-spin"
                                            />
                                            Cancelling...
                                        </>
                                    ) : (
                                        <>
                                            <XCircle
                                                size={
                                                    18
                                                }
                                            />
                                            Cancel Booking
                                        </>
                                    )}
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/booking/create"
                                    )
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                            >
                                <Wrench size={18} />
                                Create Another Booking
                            </button>

                        </div>

                        {/* SECURITY */}

                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex gap-3">
                                <ShieldCheck
                                    size={21}
                                    className="shrink-0 text-blue-600"
                                />

                                <div>
                                    <p className="text-sm font-black text-slate-800">
                                        QuickFix Protection
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Your booking is linked to your
                                        account. OTP verification helps
                                        secure service completion.
                                    </p>
                                </div>
                            </div>
                        </section>

                    </aside>
                </div>
            </div>
        </div>
    );
}

export default BookingDetails;