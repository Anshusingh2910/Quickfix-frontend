import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    CalendarDays,
    ChevronRight,
    Car,
    CheckCircle2,
    Clock3,
    Mail,
    MapPin,
    Phone,
    Search,
    Star,
    UserRound,
    Users,
    Wrench,
} from "lucide-react";

function Customers() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    /*
    |--------------------------------------------------------------------------
    | TEMPORARY CUSTOMER DATA
    |--------------------------------------------------------------------------
    | Later replace this with:
    | GET /mechanic/customers
    |--------------------------------------------------------------------------
    */

    const customers = [
        {
            id: "CUS-1001",
            name: "Rahul Kumar",
            phone: "+91 98765 43210",
            email: "rahul@example.com",
            location: "Delhi",
            vehicle: "Maruti Swift",
            vehicleNumber: "DL 01 AB 1234",
            bookings: 8,
            completed: 7,
            cancelled: 1,
            lastService: "Battery Jump Start",
            lastServiceDate: "2026-08-23",
            rating: 5,
            status: "active",
        },
        {
            id: "CUS-1002",
            name: "Aman Singh",
            phone: "+91 91234 56789",
            email: "aman@example.com",
            location: "Rohini, Delhi",
            vehicle: "Hyundai i20",
            vehicleNumber: "DL 08 CD 4521",
            bookings: 5,
            completed: 5,
            cancelled: 0,
            lastService: "Flat Tyre Repair",
            lastServiceDate: "2026-08-22",
            rating: 4.8,
            status: "active",
        },
        {
            id: "CUS-1003",
            name: "Priya Sharma",
            phone: "+91 99887 66554",
            email: "priya@example.com",
            location: "Dwarka, Delhi",
            vehicle: "Honda City",
            vehicleNumber: "DL 09 EF 7821",
            bookings: 11,
            completed: 10,
            cancelled: 1,
            lastService: "Car Breakdown Assistance",
            lastServiceDate: "2026-08-21",
            rating: 4.9,
            status: "active",
        },
        {
            id: "CUS-1004",
            name: "Vikas Kumar",
            phone: "+91 98712 34567",
            email: "vikas@example.com",
            location: "Janakpuri, Delhi",
            vehicle: "Tata Nexon",
            vehicleNumber: "DL 10 GH 2398",
            bookings: 4,
            completed: 3,
            cancelled: 1,
            lastService: "Engine Check",
            lastServiceDate: "2026-08-20",
            rating: 4.5,
            status: "active",
        },
        {
            id: "CUS-1005",
            name: "Neha Singh",
            phone: "+91 90123 45678",
            email: "neha@example.com",
            location: "Pitampura, Delhi",
            vehicle: "Kia Seltos",
            vehicleNumber: "DL 11 JK 4567",
            bookings: 6,
            completed: 6,
            cancelled: 0,
            lastService: "Oil Change",
            lastServiceDate: "2026-08-18",
            rating: 5,
            status: "active",
        },
        {
            id: "CUS-1006",
            name: "Arjun Verma",
            phone: "+91 87654 32109",
            email: "arjun@example.com",
            location: "Model Town, Delhi",
            vehicle: "Mahindra XUV700",
            vehicleNumber: "DL 12 KL 9087",
            bookings: 3,
            completed: 2,
            cancelled: 1,
            lastService: "Battery Replacement",
            lastServiceDate: "2026-08-17",
            rating: 4.2,
            status: "inactive",
        },
        {
            id: "CUS-1007",
            name: "Rohit Singh",
            phone: "+91 93456 78901",
            email: "rohit@example.com",
            location: "Karol Bagh, Delhi",
            vehicle: "Toyota Fortuner",
            vehicleNumber: "DL 03 MN 6712",
            bookings: 9,
            completed: 9,
            cancelled: 0,
            lastService: "Tyre Puncture",
            lastServiceDate: "2026-08-15",
            rating: 4.7,
            status: "active",
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | SEARCH + FILTER
    |--------------------------------------------------------------------------
    */

    const filteredCustomers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return customers.filter((customer) => {
            const matchesSearch =
                !query ||
                customer.name
                    .toLowerCase()
                    .includes(query) ||
                customer.phone
                    .toLowerCase()
                    .includes(query) ||
                customer.vehicle
                    .toLowerCase()
                    .includes(query) ||
                customer.vehicleNumber
                    .toLowerCase()
                    .includes(query) ||
                customer.location
                    .toLowerCase()
                    .includes(query);

            const matchesFilter =
                filter === "all" ||
                customer.status === filter;

            return matchesSearch && matchesFilter;
        });
    }, [search, filter]);

    /*
    |--------------------------------------------------------------------------
    | STATS
    |--------------------------------------------------------------------------
    */

    const totalCustomers = customers.length;

    const activeCustomers = customers.filter(
        (customer) => customer.status === "active"
    ).length;

    const totalBookings = customers.reduce(
        (total, customer) =>
            total + customer.bookings,
        0
    );

    const totalCompleted = customers.reduce(
        (total, customer) =>
            total + customer.completed,
        0
    );

    const averageRating =
        customers.length > 0
            ? (
                customers.reduce(
                    (total, customer) =>
                        total + customer.rating,
                    0
                ) / customers.length
            ).toFixed(1)
            : "0.0";

    /*
    |--------------------------------------------------------------------------
    | DATE FORMAT
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | CUSTOMER INITIALS
    |--------------------------------------------------------------------------
    */

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    /*
    |--------------------------------------------------------------------------
    | STAT CARD
    |--------------------------------------------------------------------------
    */

    const StatCard = ({
        icon: Icon,
        title,
        value,
        description,
        iconBg,
        iconColor,
    }) => {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                <div className="flex items-start justify-between gap-4">

                    <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {title}
                        </p>

                        <h3 className="mt-2 text-2xl font-black text-slate-900">
                            {value}
                        </h3>

                        <p className="mt-1 text-xs font-medium text-slate-500">
                            {description}
                        </p>

                    </div>

                    <div
                        className={`flex h - 11 w - 11 shrink - 0 items - center justify - center rounded - xl ${iconBg} ${iconColor} `}
                    >
                        <Icon size={21} />
                    </div>

                </div>
            </div>
        );
    };

    /*
    |--------------------------------------------------------------------------
    | CUSTOMER STATUS
    |--------------------------------------------------------------------------
    */

    const CustomerStatus = ({ status }) => {
        if (status === "active") {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase text-emerald-700">
                    <CheckCircle2 size={12} />
                    Active
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase text-slate-500">
                <Clock3 size={12} />
                Inactive
            </span>
        );
    };

    /*
    |--------------------------------------------------------------------------
    | CUSTOMER CARD
    |--------------------------------------------------------------------------
    */

    const CustomerCard = ({ customer }) => {
        return (
            <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">

                {/* TOP */}

                <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 font-black text-blue-600">
                        {getInitials(customer.name)}
                    </div>

                    <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                            <div>

                                <h3 className="font-black text-slate-900">
                                    {customer.name}
                                </h3>

                                <p className="mt-0.5 text-xs text-slate-400">
                                    {customer.id}
                                </p>

                            </div>

                            <CustomerStatus
                                status={customer.status}
                            />

                        </div>

                    </div>

                </div>

                {/* CONTACT */}

                <div className="mt-5 space-y-2.5">

                    <div className="flex items-center gap-2.5 text-xs text-slate-500">

                        <Phone
                            size={15}
                            className="text-slate-400"
                        />

                        <span>
                            {customer.phone}
                        </span>

                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-slate-500">

                        <MapPin
                            size={15}
                            className="text-slate-400"
                        />

                        <span>
                            {customer.location}
                        </span>

                    </div>

                </div>

                {/* VEHICLE */}

                <div className="mt-4 rounded-2xl bg-slate-50 p-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                            <Car size={18} />
                        </div>

                        <div className="min-w-0">

                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                Vehicle
                            </p>

                            <p className="mt-0.5 truncate text-sm font-bold text-slate-800">
                                {customer.vehicle}
                            </p>

                            <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                                {customer.vehicleNumber}
                            </p>

                        </div>

                    </div>

                </div>

                {/* STATS */}

                <div className="mt-4 grid grid-cols-3 gap-2">

                    <div className="rounded-xl bg-blue-50 p-3 text-center">

                        <p className="text-lg font-black text-blue-700">
                            {customer.bookings}
                        </p>

                        <p className="text-[9px] font-black uppercase text-blue-500">
                            Bookings
                        </p>

                    </div>

                    <div className="rounded-xl bg-emerald-50 p-3 text-center">

                        <p className="text-lg font-black text-emerald-700">
                            {customer.completed}
                        </p>

                        <p className="text-[9px] font-black uppercase text-emerald-500">
                            Completed
                        </p>

                    </div>

                    <div className="rounded-xl bg-orange-50 p-3 text-center">

                        <div className="flex items-center justify-center gap-1">

                            <Star
                                size={13}
                                className="fill-orange-400 text-orange-400"
                            />

                            <p className="text-lg font-black text-orange-700">
                                {customer.rating}
                            </p>

                        </div>

                        <p className="text-[9px] font-black uppercase text-orange-500">
                            Rating
                        </p>

                    </div>

                </div>

                {/* LAST SERVICE */}

                <div className="mt-4 border-t border-slate-100 pt-4">

                    <div className="flex items-center justify-between gap-3">

                        <div className="min-w-0">

                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                Last Service
                            </p>

                            <p className="mt-1 truncate text-sm font-bold text-slate-700">
                                {customer.lastService}
                            </p>

                        </div>

                        <p className="shrink-0 text-[10px] font-semibold text-slate-400">
                            {formatDate(
                                customer.lastServiceDate
                            )}
                        </p>

                    </div>

                </div>

                {/* ACTION */}

                <button
                    type="button"
                    onClick={() => {
                        /*
                        |--------------------------------------------------------------------------
                        | Later:
                        | navigate(`/ mechanic / customers / ${ customer.id } `)
                        |--------------------------------------------------------------------------
                        */

                        alert(
                            `Customer profile: ${customer.name} `
                        );
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                    View Customer
                    <ChevronRight size={15} />
                </button>

            </div>
        );
    };

    /*
    |--------------------------------------------------------------------------
    | PAGE
    |--------------------------------------------------------------------------
    */

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-6xl">

                {/* =========================================================
                    HEADER
                ========================================================== */}

                <div className="mb-7 flex items-center gap-4">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/mechanic/dashboard"
                            )
                        }
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                    >
                        <ArrowLeft size={19} />
                    </button>

                    <div className="flex-1">

                        <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                            QuickFix
                        </p>

                        <h1 className="mt-1 text-3xl font-black text-slate-900">
                            Customers
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage customers you have
                            serviced through QuickFix.
                        </p>

                    </div>

                </div>

                {/* =========================================================
                    STATS
                ========================================================== */}

                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <StatCard
                        icon={Users}
                        title="Total Customers"
                        value={totalCustomers}
                        description="Customers you have served"
                        iconBg="bg-blue-50"
                        iconColor="text-blue-600"
                    />

                    <StatCard
                        icon={CheckCircle2}
                        title="Active Customers"
                        value={activeCustomers}
                        description="Recently active customers"
                        iconBg="bg-emerald-50"
                        iconColor="text-emerald-600"
                    />

                    <StatCard
                        icon={Wrench}
                        title="Total Services"
                        value={totalBookings}
                        description="All customer bookings"
                        iconBg="bg-violet-50"
                        iconColor="text-violet-600"
                    />

                    <StatCard
                        icon={Star}
                        title="Average Rating"
                        value={averageRating}
                        description="Customer service rating"
                        iconBg="bg-orange-50"
                        iconColor="text-orange-500"
                    />

                </div>

                {/* =========================================================
                    SEARCH / FILTER
                ========================================================== */}

                <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                        {/* SEARCH */}

                        <div className="relative flex-1">

                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search by name, phone, vehicle or location..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />

                        </div>

                        {/* FILTER */}

                        <div className="flex rounded-xl bg-slate-100 p-1">

                            <button
                                type="button"
                                onClick={() =>
                                    setFilter("all")
                                }
                                className={`rounded - lg px - 4 py - 2.5 text - xs font - black transition ${filter === "all"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                    } `}
                            >
                                All
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFilter("active")
                                }
                                className={`rounded - lg px - 4 py - 2.5 text - xs font - black transition ${filter === "active"
                                        ? "bg-white text-emerald-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                    } `}
                            >
                                Active
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFilter("inactive")
                                }
                                className={`rounded - lg px - 4 py - 2.5 text - xs font - black transition ${filter === "inactive"
                                        ? "bg-white text-slate-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                    } `}
                            >
                                Inactive
                            </button>

                        </div>

                    </div>

                </section>

                {/* =========================================================
                    RESULT INFO
                ========================================================== */}

                <div className="mb-4 flex items-center justify-between">

                    <div>

                        <h2 className="font-black text-slate-900">
                            Your Customers
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Showing{" "}
                            <span className="font-bold text-slate-700">
                                {filteredCustomers.length}
                            </span>{" "}
                            customers
                        </p>

                    </div>

                    {search && (
                        <button
                            type="button"
                            onClick={() =>
                                setSearch("")
                            }
                            className="text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                            Clear search
                        </button>
                    )}

                </div>

                {/* =========================================================
                    CUSTOMER GRID
                ========================================================== */}

                {filteredCustomers.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                        {filteredCustomers.map(
                            (customer) => (
                                <CustomerCard
                                    key={
                                        customer.id
                                    }
                                    customer={
                                        customer
                                    }
                                />
                            )
                        )}

                    </div>
                ) : (
                    <section className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                            <Users size={28} />

                        </div>

                        <h3 className="mt-5 font-black text-slate-900">
                            No customers found
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                            Try searching with a different
                            customer name, phone number,
                            vehicle or location.
                        </p>

                        {search && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                                className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-xs font-black text-white transition hover:bg-blue-700"
                            >
                                Clear Search
                            </button>
                        )}

                    </section>
                )}

                {/* =========================================================
                    CUSTOMER INSIGHT
                ========================================================== */}

                <section className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-5 sm:p-6">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                            <Wrench size={22} />
                        </div>

                        <div className="flex-1">

                            <h3 className="font-black text-blue-900">
                                Customer Service Insight
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-blue-700">
                                You have completed{" "}
                                <strong>
                                    {totalCompleted}
                                </strong>{" "}
                                services across{" "}
                                <strong>
                                    {totalCustomers}
                                </strong>{" "}
                                customers. Keep providing
                                quality service to build
                                stronger customer ratings.
                            </p>

                        </div>

                        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm">

                            <Star
                                size={17}
                                className="fill-orange-400 text-orange-400"
                            />

                            <span className="font-black text-slate-900">
                                {averageRating}
                            </span>

                            <span className="text-xs font-semibold text-slate-400">
                                Rating
                            </span>

                        </div>

                    </div>

                </section>

                {/* =========================================================
                    FOOTER
                ========================================================== */}

                <div className="mt-8 pb-4 text-center">

                    <p className="text-xs font-semibold text-slate-400">
                        QuickFix Mechanic Panel
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                        Manage your customer relationships
                        with QuickFix.
                    </p>

                </div>

            </div>
        </div>
    );
}

export default Customers;
