import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Bike,
    Car,
    CheckCircle2,
    Fuel,
    Loader2,
    ShieldCheck,
    Tag,
    CalendarDays,
    Hash,
} from "lucide-react";

import api from "../../services/api";

function AddVehicle() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        vehicleType: "",
        fuelType: "",
        company: "",
        model: "",
        year: "",
        registrationNumber: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // ERROR MESSAGE
    // =====================================================

    const getErrorMessage = (error) => {
        const responseData = error?.response?.data;

        return (
            responseData?.message ||
            responseData?.error ||
            responseData?.data?.message ||
            responseData?.data?.error ||
            error?.message ||
            "Something went wrong. Please try again."
        );
    };

    // =====================================================
    // CHANGE HANDLER
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    // =====================================================
    // REGISTRATION NUMBER
    // =====================================================

    const handleRegistrationChange = (event) => {
        const value = event.target.value
            .toUpperCase()
            .replace(/\s+/g, " ");

        setFormData((previous) => ({
            ...previous,
            registrationNumber: value,
        }));

        setError("");
        setSuccess("");
    };

    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {
        if (!formData.vehicleType) {
            return "Please select vehicle type.";
        }

        if (!formData.fuelType) {
            return "Please select fuel type.";
        }

        if (!formData.company.trim()) {
            return "Please enter vehicle company.";
        }

        if (!formData.model.trim()) {
            return "Please enter vehicle model.";
        }


        if (!formData.year) {
            return "Please select vehicle year.";
        }

        const year = Number(formData.year);
        const currentYear = new Date().getFullYear();

        if (year < 1900 || year > currentYear) {
            return `Please enter a valid year between 1900 and ${currentYear}.`;
        }

        if (!formData.registrationNumber.trim()) {
            return "Please enter registration number.";
        }

        if (formData.registrationNumber.trim().length < 5) {
            return "Please enter a valid registration number.";
        }

        return "";
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            const payload = {
                vehicleType: formData.vehicleType,
                fuelType: formData.fuelType,
                company: formData.company.trim(),
                model: formData.model.trim(),
                year: Number(formData.year),
                registrationNumber:
                    formData.registrationNumber
                        .trim()
                        .toUpperCase(),
            };
            console.log("ADDING VEHICLE:", payload);
            const response = await api.post("/vehicle/add", payload);

            console.log(
                "ADD VEHICLE RESPONSE:",
                response.data
            );

            setSuccess(
                response?.data?.message ||
                "Vehicle added successfully."
            );

            setFormData({
                vehicleType: "",
                fuelType: "",
                company: "",
                model: "",
                year: "",
                registrationNumber: "",
            });

            setTimeout(() => {
                navigate("/vehicles", {
                    replace: true,
                });
            }, 1000);
        } catch (error) {
            console.error(
                "ADD VEHICLE ERROR:",
                error
            );

            console.error(
                "ADD VEHICLE RESPONSE:",
                error?.response?.data
            );

            // Token expired / unauthorized
            if (error?.response?.status === 401) {
                sessionStorage.removeItem("accessToken");
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("role");

                setError(
                    "Your session has expired. Please login again."
                );

                setTimeout(() => {
                    navigate("/login", {
                        replace: true,
                    });
                }, 1200);

                return;
            }

            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {
        if (loading) return;

        navigate(-1);
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-4xl">

                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    type="button"
                    onClick={handleCancel}
                    className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
                >
                    <ArrowLeft size={18} />

                    Back to Vehicles
                </button>

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-7">

                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                        <Car size={28} />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Add Your Vehicle
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Add your vehicle details so you can quickly
                        book a mechanic service whenever you need one.
                    </p>

                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        {error}
                    </div>
                )}

                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600">

                        <CheckCircle2 size={19} />

                        {success}

                    </div>
                )}

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >

                    {/* =================================================
                        FORM HEADER
                    ================================================= */}

                    <div className="border-b border-slate-100 px-5 py-5 sm:px-7">

                        <h2 className="text-lg font-bold text-slate-900">
                            Vehicle Information
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Enter your vehicle's basic information.
                        </p>

                    </div>

                    {/* =================================================
                        FORM BODY
                    ================================================= */}

                    <div className="p-5 sm:p-7">

                        {/* =================================================
                            VEHICLE TYPE + FUEL TYPE
                        ================================================= */}

                        <div className="grid gap-6 md:grid-cols-2">

                            {/* VEHICLE TYPE */}

                            <div>

                                <label
                                    htmlFor="vehicleType"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Vehicle Type
                                </label>

                                <div className="relative">

                                    <Car
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <select
                                        id="vehicleType"
                                        name="vehicleType"
                                        value={formData.vehicleType}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    >

                                        <option value="">
                                            Select vehicle type
                                        </option>

                                        <option value="car">
                                            Car
                                        </option>

                                        <option value="bike">
                                            Bike
                                        </option>

                                        <option value="scooter">
                                            Scooter
                                        </option>

                                        <option value="auto">
                                            Auto
                                        </option>

                                        <option value="other">
                                            Other
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* FUEL TYPE */}

                            <div>

                                <label
                                    htmlFor="fuelType"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Fuel Type
                                </label>

                                <div className="relative">

                                    <Fuel
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <select
                                        id="fuelType"
                                        name="fuelType"
                                        value={formData.fuelType}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    >

                                        <option value="">
                                            Select fuel type
                                        </option>

                                        <option value="petrol">
                                            Petrol
                                        </option>

                                        <option value="diesel">
                                            Diesel
                                        </option>

                                        <option value="electric">
                                            Electric
                                        </option>

                                        <option value="cng">
                                            CNG
                                        </option>

                                        <option value="hybrid">
                                            Hybrid
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            COMPANY + MODEL
                        ================================================= */}

                        <div className="mt-6 grid gap-6 md:grid-cols-2">

                            {/* COMPANY */}

                            <div>

                                <label
                                    htmlFor="company"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Company / Brand
                                </label>

                                <div className="relative">

                                    <Tag
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="company"
                                        name="company"
                                        type="text"
                                        value={formData.company}
                                        onChange={handleChange}
                                        disabled={loading}
                                        placeholder="e.g. Honda"
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />

                                </div>

                            </div>

                            {/* MODEL */}

                            <div>

                                <label
                                    htmlFor="model"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Model
                                </label>

                                <div className="relative">

                                    <Car
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="model"
                                        name="model"
                                        type="text"
                                        value={formData.model}
                                        onChange={handleChange}
                                        disabled={loading}
                                        placeholder="e.g. Activa 6G"
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            VARIANT + YEAR
                        ================================================= */}

                        <div className="mt-6 grid gap-6 md:grid-cols-2">

                            <div>

                                <label
                                    htmlFor="year"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Manufacturing Year
                                </label>

                                <div className="relative">

                                    <CalendarDays
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="year"
                                        name="year"
                                        type="number"
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        value={formData.year}
                                        onChange={handleChange}
                                        disabled={loading}
                                        placeholder={String(
                                            new Date().getFullYear()
                                        )}
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            REGISTRATION NUMBER
                        ================================================= */}

                        <div className="mt-6">

                            <label
                                htmlFor="registrationNumber"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Registration Number
                            </label>

                            <div className="relative">

                                <Hash
                                    size={18}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="registrationNumber"
                                    name="registrationNumber"
                                    type="text"
                                    value={formData.registrationNumber}
                                    onChange={
                                        handleRegistrationChange
                                    }
                                    disabled={loading}
                                    placeholder="e.g. DL01AB1234"
                                    maxLength={20}
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium uppercase tracking-wide text-slate-800 outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                />

                            </div>

                            <p className="mt-2 text-xs text-slate-400">
                                Example: DL01AB1234
                            </p>

                        </div>

                        {/* =================================================
                            SECURITY INFO
                        ================================================= */}

                        <div className="mt-7 rounded-xl border border-blue-100 bg-blue-50 p-4">

                            <div className="flex gap-3">

                                <ShieldCheck
                                    size={20}
                                    className="mt-0.5 shrink-0 text-blue-600"
                                />

                                <div>

                                    <p className="text-sm font-semibold text-blue-800">
                                        Your vehicle information is secure
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-blue-600">
                                        We use your vehicle details to
                                        match you with the right mechanic
                                        and manage your service bookings.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            BUTTONS
                        ================================================= */}

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="h-12 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {loading ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Adding Vehicle...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} />

                                        Add Vehicle
                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddVehicle;