import { useEffect, useState } from "react";
import {
    Car,
    Plus,
    Trash2,
    Edit3,
    Loader2,
    X,
    CheckCircle2,
    AlertCircle,
    Fuel,
    CalendarDays,
    Hash,
    Bike,
} from "lucide-react";

import api from "../../services/api";

function Vehicles() {
    // =====================================================
    // STATE
    // =====================================================

    const [vehicles, setVehicles] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        vehicleType: "",
        fuelType: "",
        company: "",
        model: "",
        year: "",
        registrationNumber: "",
    });

    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {
        setFormData({
            vehicleType: "",
            fuelType: "",
            company: "",
            model: "",
            year: "",
            registrationNumber: "",
        });
    };

    // =====================================================
    // ERROR MESSAGE
    // =====================================================

    const getErrorMessage = (error) => {
        const backend = error?.response?.data;

        return (
            backend?.message ||
            backend?.error ||
            backend?.data?.message ||
            backend?.data?.error ||
            error?.message ||
            "Something went wrong. Please try again."
        );
    };

    // =====================================================
    // NORMALIZE VEHICLE RESPONSE
    // =====================================================

    const normalizeVehicles = (response) => {
        const responseData = response?.data;

        console.log("MY VEHICLES RAW RESPONSE:", responseData);

        // Case 1:
        // { data: [...] }
        if (Array.isArray(responseData?.data)) {
            return responseData.data;
        }

        // Case 2:
        // { vehicles: [...] }
        if (Array.isArray(responseData?.vehicles)) {
            return responseData.vehicles;
        }

        // Case 3:
        // { data: { vehicles: [...] } }
        if (Array.isArray(responseData?.data?.vehicles)) {
            return responseData.data.vehicles;
        }

        // Case 4:
        // { data: { data: [...] } }
        if (Array.isArray(responseData?.data?.data)) {
            return responseData.data.data;
        }

        // Case 5:
        // { data: { vehicle: {...} } }
        if (responseData?.data?.vehicle) {
            return [responseData.data.vehicle];
        }

        // Case 6:
        // { vehicle: {...} }
        if (responseData?.vehicle) {
            return [responseData.vehicle];
        }

        // Case 7:
        // Direct array
        if (Array.isArray(responseData)) {
            return responseData;
        }

        return [];
    };

    // =====================================================
    // LOAD VEHICLES
    // =====================================================

    const loadVehicles = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/vehicle/my");

            const vehicleList = normalizeVehicles(response);

            console.log("NORMALIZED VEHICLES:", vehicleList);

            setVehicles(vehicleList);
        } catch (error) {
            console.error("GET VEHICLES ERROR:", error);
            console.error("GET VEHICLES RESPONSE:", error?.response?.data);

            if (error?.response?.status === 404) {
                setVehicles([]);
            } else {
                setError(getErrorMessage(error));
            }
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadVehicles();
    }, []);

    // =====================================================
    // HANDLE INPUT
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
    // OPEN ADD MODAL
    // =====================================================

    const openAddModal = () => {
        setEditingVehicle(null);
        resetForm();

        setError("");
        setSuccess("");

        setShowModal(true);
    };

    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = (vehicle) => {
        setEditingVehicle(vehicle);

        setFormData({
            vehicleType: vehicle?.vehicleType || "",
            fuelType: vehicle?.fuelType || "",
            company:
                vehicle?.company ||
                vehicle?.brand ||
                "",
            model: vehicle?.model || "",
            year: vehicle?.year || "",
            registrationNumber:
                vehicle?.registrationNumber || "",
        });

        setError("");
        setSuccess("");

        setShowModal(true);
    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {
        if (submitting) return;

        setShowModal(false);
        setEditingVehicle(null);

        resetForm();

        setError("");
        setSuccess("");
    };

    // =====================================================
    // VALIDATE
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
            return "Please enter vehicle year.";
        }

        const year = Number(formData.year);
        const currentYear = new Date().getFullYear();

        if (
            !Number.isInteger(year) ||
            year < 1900 ||
            year > currentYear
        ) {
            return "Please enter a valid vehicle year.";
        }

        if (!formData.registrationNumber.trim()) {
            return "Please enter registration number.";
        }

        return "";
    };

    // =====================================================
    // SUBMIT VEHICLE
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
            setSubmitting(true);

            const vehicleData = {
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

            console.log("SENDING VEHICLE:", vehicleData);

            // =================================================
            // UPDATE
            // =================================================

            if (editingVehicle?._id) {
                const response = await api.put(
                    `/vehicles/update/${editingVehicle._id}`,
                    vehicleData
                );

                console.log(
                    "UPDATE VEHICLE RESPONSE:",
                    response?.data
                );

                setSuccess(
                    response?.data?.message ||
                    "Vehicle updated successfully."
                );

                // Reload from backend
                await loadVehicles();
            }

            // =================================================
            // ADD
            // =================================================

            else {
                const response = await api.post(
                    "/vehicle/add",
                    vehicleData
                );

                console.log(
                    "ADD VEHICLE RESPONSE:",
                    response?.data
                );

                /*
                 * First try to get newly created vehicle
                 * directly from POST response.
                 */
                let newVehicle = null;

                const responseData = response?.data;

                if (responseData?.data?.vehicle) {
                    newVehicle = responseData.data.vehicle;
                } else if (responseData?.vehicle) {
                    newVehicle = responseData.vehicle;
                } else if (
                    responseData?.data &&
                    !Array.isArray(responseData.data) &&
                    responseData.data._id
                ) {
                    newVehicle = responseData.data;
                }

                /*
                 * Immediately show newly added vehicle
                 * if backend returned it.
                 */
                if (newVehicle?._id) {
                    setVehicles((previous) => {
                        const alreadyExists = previous.some(
                            (vehicle) =>
                                vehicle._id === newVehicle._id
                        );

                        if (alreadyExists) {
                            return previous;
                        }

                        return [
                            newVehicle,
                            ...previous,
                        ];
                    });
                }

                /*
                 * Always reload from backend too.
                 * This makes My Vehicles stay synced with DB.
                 */
                await loadVehicles();

                setSuccess(
                    responseData?.message ||
                    "Vehicle added successfully."
                );
            }

            // =================================================
            // CLOSE AFTER SUCCESS
            // =================================================

            setTimeout(() => {
                setShowModal(false);
                setEditingVehicle(null);
                resetForm();
                setSuccess("");
            }, 700);

        } catch (error) {
            console.error(
                "VEHICLE SUBMIT ERROR:",
                error
            );

            console.error(
                "VEHICLE RESPONSE:",
                error?.response?.data
            );

            setError(getErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (vehicleId) => {
        if (!vehicleId) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this vehicle?"
        );

        if (!confirmed) return;

        try {
            setDeletingId(vehicleId);
            setError("");
            setSuccess("");

            const response = await api.delete(
                `/vehicles/delete/${vehicleId}`
            );

            console.log(
                "DELETE VEHICLE RESPONSE:",
                response?.data
            );

            // Immediately remove from UI
            setVehicles((previous) =>
                previous.filter(
                    (vehicle) =>
                        vehicle?._id !== vehicleId
                )
            );

            setSuccess(
                response?.data?.message ||
                "Vehicle deleted successfully."
            );
        } catch (error) {
            console.error(
                "DELETE VEHICLE ERROR:",
                error
            );

            console.error(
                "DELETE VEHICLE RESPONSE:",
                error?.response?.data
            );

            setError(getErrorMessage(error));
        } finally {
            setDeletingId(null);
        }
    };
    const VehicleIcon = ({ type }) => {
        const vehicleType = type?.toLowerCase();

        if (
            vehicleType === "bike" ||
            vehicleType === "motorcycle" ||
            vehicleType === "scooter"
        ) {
            return <Bike size={24} />;
        }

        return <Car size={24} />;
    };
    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2
                        size={32}
                        className="animate-spin text-blue-600"
                    />

                    <p className="text-sm font-medium text-slate-500">
                        Loading your vehicles...
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-6xl">

                {/* HEADER */}

                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                            <Car size={25} />
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            My Vehicles
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Add and manage your vehicles for quick service booking.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                    >
                        <Plus size={19} />
                        Add Vehicle
                    </button>
                </div>

                {/* ERROR */}

                {error && (
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        <AlertCircle
                            size={19}
                            className="mt-0.5 shrink-0"
                        />

                        <span>{error}</span>
                    </div>
                )}

                {/* SUCCESS */}

                {success && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600">
                        <CheckCircle2 size={19} />
                        {success}
                    </div>
                )}

                {/* EMPTY */}

                {vehicles.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <Car size={38} />
                        </div>

                        <h2 className="text-xl font-bold text-slate-900">
                            No vehicles added yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Add your car, bike or other vehicle so you can book a mechanic faster.
                        </p>

                        <button
                            type="button"
                            onClick={openAddModal}
                            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            <Plus size={18} />
                            Add Your First Vehicle
                        </button>
                    </div>
                ) : (

                    /* VEHICLES */

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {vehicles.map((vehicle, index) => {

                            const vehicleId =
                                vehicle?._id ||
                                vehicle?.id ||
                                `vehicle-${index}`;

                            const company =
                                vehicle?.company ||
                                vehicle?.brand ||
                                "Vehicle";

                            return (
                                <div
                                    key={vehicleId}
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >

                                    {/* TOP */}

                                    <div className="flex items-start justify-between border-b border-slate-100 p-5">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                <VehicleIcon
                                                    type={
                                                        vehicle?.vehicleType
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-slate-900">
                                                    {company}{" "}
                                                    {vehicle?.model || ""}
                                                </h3>

                                                <p className="mt-0.5 text-xs capitalize text-slate-400">
                                                    {vehicle?.vehicleType ||
                                                        "Vehicle"}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase text-slate-600">
                                            {vehicle?.fuelType ||
                                                "N/A"}
                                        </span>
                                    </div>

                                    {/* DETAILS */}

                                    <div className="space-y-3 p-5">

                                        <div className="flex items-center justify-between gap-3 text-sm">

                                            <span className="flex items-center gap-2 text-slate-400">
                                                <Hash size={15} />
                                                Registration
                                            </span>

                                            <span className="font-bold text-slate-800">
                                                {vehicle?.registrationNumber ||
                                                    "N/A"}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">

                                            <span className="flex items-center gap-2 text-slate-400">
                                                <CalendarDays size={15} />
                                                Year
                                            </span>

                                            <span className="font-semibold text-slate-700">
                                                {vehicle?.year ||
                                                    "N/A"}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">

                                            <span className="flex items-center gap-2 text-slate-400">
                                                <Fuel size={15} />
                                                Fuel
                                            </span>

                                            <span className="font-semibold capitalize text-slate-700">
                                                {vehicle?.fuelType ||
                                                    "N/A"}
                                            </span>
                                        </div>

                                    </div>

                                    {/* ACTIONS */}

                                    <div className="flex gap-3 border-t border-slate-100 p-4">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditModal(
                                                    vehicle
                                                )
                                            }
                                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            <Edit3 size={16} />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            disabled={
                                                deletingId ===
                                                vehicleId
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    vehicleId
                                                )
                                            }
                                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-red-100 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        >

                                            {deletingId ===
                                                vehicleId ? (
                                                <Loader2
                                                    size={16}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Trash2
                                                    size={16}
                                                />
                                            )}

                                            Delete
                                        </button>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6 backdrop-blur-sm">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">

                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingVehicle
                                        ? "Update Vehicle"
                                        : "Add Vehicle"}
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    {editingVehicle
                                        ? "Update your vehicle information."
                                        : "Enter your vehicle details below."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={submitting}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="p-5 sm:p-6"
                        >

                            {error && (
                                <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600">
                                    <CheckCircle2 size={17} />
                                    {success}
                                </div>
                            )}

                            {/* VEHICLE TYPE */}

                            <div className="mb-5">

                                <label
                                    htmlFor="vehicleType"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Vehicle Type
                                </label>

                                <select
                                    id="vehicleType"
                                    name="vehicleType"
                                    value={
                                        formData.vehicleType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={submitting}
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
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

                                    <option value="truck">
                                        Truck
                                    </option>

                                    <option value="other">
                                        Other
                                    </option>
                                </select>
                            </div>

                            {/* FUEL */}

                            <div className="mb-5">

                                <label
                                    htmlFor="fuelType"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Fuel Type
                                </label>

                                <select
                                    id="fuelType"
                                    name="fuelType"
                                    value={
                                        formData.fuelType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={submitting}
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
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

                                    <option value="cng">
                                        CNG
                                    </option>

                                    <option value="electric">
                                        Electric
                                    </option>

                                    <option value="hybrid">
                                        Hybrid
                                    </option>
                                </select>
                            </div>

                            {/* COMPANY + MODEL */}

                            <div className="grid gap-5 sm:grid-cols-2">

                                <div>
                                    <label
                                        htmlFor="company"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Company / Brand
                                    </label>

                                    <input
                                        id="company"
                                        name="company"
                                        type="text"
                                        value={
                                            formData.company
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Maruti Suzuki"
                                        disabled={
                                            submitting
                                        }
                                        className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="model"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Model
                                    </label>

                                    <input
                                        id="model"
                                        name="model"
                                        type="text"
                                        value={
                                            formData.model
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Swift"
                                        disabled={
                                            submitting
                                        }
                                        className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
                                    />
                                </div>

                            </div>

                            {/* YEAR */}

                            <div className="mt-5">

                                <label
                                    htmlFor="year"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Manufacturing Year
                                </label>

                                <input
                                    id="year"
                                    name="year"
                                    type="number"
                                    min="1900"
                                    max={
                                        new Date().getFullYear()
                                    }
                                    value={
                                        formData.year
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. 2022"
                                    disabled={
                                        submitting
                                    }
                                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
                                />

                            </div>

                            {/* REGISTRATION */}

                            <div className="mt-5">

                                <label
                                    htmlFor="registrationNumber"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Registration Number
                                </label>

                                <input
                                    id="registrationNumber"
                                    name="registrationNumber"
                                    type="text"
                                    value={
                                        formData.registrationNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. DL01AB1234"
                                    disabled={submitting}
                                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm uppercase outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
                                />

                                <p className="mt-1.5 text-xs text-slate-400">
                                    Enter your vehicle registration number.
                                </p>

                            </div>

                            {/* BUTTONS */}

                            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                    className="h-12 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {submitting ? (
                                        <>
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />

                                            {editingVehicle
                                                ? "Updating..."
                                                : "Adding..."}
                                        </>
                                    ) : (
                                        <>
                                            {editingVehicle ? (
                                                <Edit3 size={18} />
                                            ) : (
                                                <Plus size={18} />
                                            )}

                                            {editingVehicle
                                                ? "Update Vehicle"
                                                : "Add Vehicle"}
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Vehicles;