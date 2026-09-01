import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Bike,
    Car,
    CheckCircle2,
    Crosshair,
    Loader2,
    LocateFixed,
    MapPin,
    Navigation,
    RefreshCw,
    ShieldCheck,
    Wrench,
    XCircle,
} from "lucide-react";

import api from "../../services/api";

function CreateBooking() {
    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState([]);

    const [vehicleId, setVehicleId] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [notes, setNotes] = useState("");

    const [location, setLocation] = useState(null);

    const [loading, setLoading] = useState(true);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [locationError, setLocationError] = useState("");

    const getErrorMessage = (error) => {
        return (
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.response?.data?.data?.message ||
            error?.message ||
            "Something went wrong."
        );
    };
    const loadVehicles = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/vehicle/my");

            const data = response?.data;
            let vehicleList = [];

            if (Array.isArray(data)) {
                vehicleList = data;
            } else if (Array.isArray(data?.data)) {
                vehicleList = data.data;
            } else if (Array.isArray(data?.vehicles)) {
                vehicleList = data.vehicles;
            } else if (Array.isArray(data?.data?.vehicles)) {
                vehicleList = data.data.vehicles;
            }
            setVehicles(vehicleList);
            if (vehicleList.length > 0) {
                setVehicleId(vehicleList[0]._id);
            }
        } catch (error) {
            console.error("VEHICLES ERROR:", error);
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadVehicles();
    }, []);
    const getLiveLocation = () => {
        setLocationError("");

        if (!navigator.geolocation) {
            setLocationError(
                "Your browser does not support live location."
            );
            return;
        }

        setGettingLocation(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(
                    "GPS POSITION:",
                    position.coords
                );

                const latitude =
                    Number(position.coords.latitude);

                const longitude =
                    Number(position.coords.longitude);

                const accuracy =
                    Number(position.coords.accuracy);

                console.log("GPS LAT:", latitude);
                console.log("GPS LNG:", longitude);

                if (
                    !Number.isFinite(latitude) ||
                    !Number.isFinite(longitude)
                ) {
                    setLocationError(
                        "GPS returned invalid coordinates."
                    );

                    setGettingLocation(false);
                    return;
                }

                setLocation({
                    latitude,
                    longitude,
                    accuracy,
                });

                setGettingLocation(false);
            },

            (error) => {
                console.error(
                    "LOCATION ERROR:",
                    error
                );

                let message =
                    "Unable to get your live location.";

                if (error.code === 1) {
                    message =
                        "Location permission denied. Please allow location access.";
                } else if (error.code === 2) {
                    message =
                        "Location is currently unavailable.";
                } else if (error.code === 3) {
                    message =
                        "Location request timed out. Please try again.";
                }

                setLocationError(message);
                setGettingLocation(false);
            },

            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0,
            }
        );
    };
    const handleCreateBooking = async (event) => {
        event.preventDefault();
        setError("");

        console.log("========== CREATE BOOKING ==========");
        console.log("LOCATION STATE:", location);
        console.log("LATITUDE:", location?.latitude);
        console.log("LONGITUDE:", location?.longitude);

        if (!vehicleId) {
            setError("Please select a vehicle.");
            return;
        }

        if (!serviceType) {
            setError("Please select a service.");
            return;
        }

        if (!location) {
            setError(
                "Please get your live location before creating the booking."
            );
            return;
        }

        const latitude = Number(location.latitude);
        const longitude = Number(location.longitude);

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            setError(
                "Invalid live location. Please update your location."
            );
            return;
        }

        const payload = {
            vehicle: vehicleId,
            serviceType,
            notes: notes.trim(),
            latitude,
            longitude,
        };

        console.log(
            "FINAL CREATE BOOKING PAYLOAD:",
            payload
        );

        try {
            setSubmitting(true);

            // 1. CREATE BOOKING
            const response = await api.post(
                "/booking/create",
                payload
            );

            console.log(
                "CREATE BOOKING RESPONSE:",
                response?.data
            );

            const booking =
                response?.data?.data?.booking ||
                response?.data?.data ||
                response?.data?.booking;

            const bookingId =
                booking?._id ||
                response?.data?.bookingId ||
                response?.data?.data?._id;

            if (!bookingId) {
                throw new Error(
                    "Booking created but booking ID was not returned."
                );
            }

            console.log(
                "BOOKING CREATED:",
                bookingId
            );

            // 2. FIND NEARBY MECHANIC
            const mechanicResponse = await api.put(
                `/booking/find-mechanic/${bookingId}`,
                {
                    latitude,
                    longitude,
                }
            );

            console.log(
                "FIND MECHANIC RESPONSE:",
                mechanicResponse?.data
            );

            // 3. OPEN BOOKING DETAILS
            navigate(`/bookings/${bookingId}`);

        } catch (error) {
            console.error(
                "CREATE BOOKING ERROR:",
                error
            );

            console.error(
                "BACKEND ERROR:",
                error?.response?.data
            );

            setError(
                getErrorMessage(error)
            );
        } finally {
            setSubmitting(false);
        }

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
            return <Bike size={22} />;
        }

        return <Car size={22} />;
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
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2
                        size={36}
                        className="mx-auto animate-spin text-blue-600"
                    />
                    <p className="mt-4 font-bold text-slate-800">
                        Loading your vehicles...
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">

                <div className="mb-8 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate("/bookings")}
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"
                    >
                        <ArrowLeft size={18} />
                        My Bookings
                    </button>

                    <button
                        type="button"
                        onClick={loadVehicles}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                {/* TITLE */}

                <div className="mb-7">
                    <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                        QuickFix
                    </p>

                    <h1 className="mt-2 text-3xl font-black text-slate-900">
                        Create Booking
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Select your vehicle, choose the service and
                        share your live location so a nearby mechanic
                        can reach you.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
                        <XCircle
                            size={20}
                            className="shrink-0 text-red-500"
                        />

                        <p className="text-sm font-semibold text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                {!vehicles.length ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <Car size={30} />
                        </div>

                        <h2 className="mt-5 text-xl font-black text-slate-900">
                            No vehicle found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Add your vehicle first before creating a
                            service booking.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/vehicles/add")
                            }
                            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
                        >
                            Add Vehicle
                        </button>
                    </div>
                ) : (
                    <form
                        onSubmit={handleCreateBooking}
                        className="space-y-6"
                    >

                        {/* VEHICLE */}

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Car size={22} />
                                </div>

                                <div>
                                    <h2 className="font-black text-slate-900">
                                        Select Vehicle
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Which vehicle needs help?
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {vehicles.map((vehicle) => {
                                    const selected =
                                        vehicleId === vehicle._id;

                                    return (
                                        <button
                                            key={vehicle._id}
                                            type="button"
                                            onClick={() =>
                                                setVehicleId(
                                                    vehicle._id
                                                )
                                            }
                                            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${selected
                                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                                : "border-slate-200 bg-white hover:border-blue-200"
                                                }`}
                                        >
                                            <div
                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${selected
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-slate-100 text-slate-500"
                                                    }`}
                                            >
                                                <VehicleIcon
                                                    type={
                                                        vehicle.vehicleType
                                                    }
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate font-bold text-slate-900">
                                                    {getVehicleName(
                                                        vehicle
                                                    )}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {vehicle.registrationNumber ||
                                                        "Registration unavailable"}
                                                </p>
                                            </div>

                                            {selected && (
                                                <CheckCircle2
                                                    size={20}
                                                    className="ml-auto shrink-0 text-blue-600"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Wrench size={22} />
                                </div>

                                <div>
                                    <h2 className="font-black text-slate-900">
                                        Select Service
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        What help do you need?
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {[
                                    ["battery", "Battery"],
                                    ["puncture", "Puncture"],
                                    ["repair", "Repair"],
                                    ["towing", "Towing"],
                                    ["fuel", "Fuel"],
                                    ["charging", "Charging"],
                                ].map(
                                    ([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() =>
                                                setServiceType(
                                                    value
                                                )
                                            }
                                            className={`rounded-2xl border px-4 py-4 text-sm font-bold transition ${serviceType ===
                                                value
                                                ? "border-blue-500 bg-blue-600 text-white"
                                                : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    )
                                )}
                            </div>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <LocateFixed size={22} />
                                </div>

                                <div>
                                    <h2 className="font-black text-slate-900">
                                        Live Location
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Required so the mechanic can
                                        find you.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                {location ? (
                                    <div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                                <CheckCircle2
                                                    size={20}
                                                />
                                            </div>

                                            <div>
                                                <p className="font-bold text-emerald-700">
                                                    Location captured
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    Accuracy:{" "}
                                                    {Math.round(
                                                        location.accuracy
                                                    )}
                                                    m
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-xl bg-white p-3">
                                                <p className="text-[10px] font-bold uppercase text-slate-400">
                                                    Latitude
                                                </p>

                                                <p className="mt-1 text-sm font-bold text-slate-800">
                                                    {location.latitude.toFixed(
                                                        6
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-white p-3">
                                                <p className="text-[10px] font-bold uppercase text-slate-400">
                                                    Longitude
                                                </p>

                                                <p className="mt-1 text-sm font-bold text-slate-800">
                                                    {location.longitude.toFixed(
                                                        6
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <MapPin
                                            size={32}
                                            className="mx-auto text-slate-400"
                                        />

                                        <p className="mt-3 text-sm font-bold text-slate-700">
                                            Live location required
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Tap the button below and allow
                                            browser location permission.
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={getLiveLocation}
                                    disabled={gettingLocation}
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {gettingLocation ? (
                                        <>
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />
                                            Getting Live Location...
                                        </>
                                    ) : (
                                        <>
                                            <Navigation size={18} />
                                            {location
                                                ? "Update Live Location"
                                                : "Get Live Location"}
                                        </>
                                    )}
                                </button>

                                {locationError && (
                                    <p className="mt-3 text-center text-xs font-semibold text-red-600">
                                        {locationError}
                                    </p>
                                )}
                            </div>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <label className="text-sm font-black text-slate-900">
                                Additional Notes
                            </label>

                            <textarea
                                value={notes}
                                onChange={(event) =>
                                    setNotes(
                                        event.target.value
                                    )
                                }
                                rows={4}
                                placeholder="Example: Car stopped suddenly, tyre is flat, battery issue..."
                                className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                            />
                        </section>

                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                            <div className="flex gap-3">
                                <ShieldCheck
                                    size={21}
                                    className="shrink-0 text-blue-600"
                                />

                                <div>
                                    <p className="text-sm font-bold text-blue-800">
                                        Secure Booking
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-blue-600">
                                        Your location is shared to help
                                        the assigned mechanic reach you.
                                        OTP verification is required for
                                        service completion.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? (
                                <>
                                    <Loader2
                                        size={20}
                                        className="animate-spin"
                                    />
                                    Creating Booking...
                                </>
                            ) : (
                                <>
                                    <Crosshair size={20} />
                                    Find Mechanic & Create Booking
                                </>
                            )}
                        </button>

                    </form>
                )}
            </div>
        </div>
    );
}

export default CreateBooking;