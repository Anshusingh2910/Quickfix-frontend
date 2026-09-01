import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    ArrowDownToLine,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock3,
    IndianRupee,
    TrendingUp,
    Wallet,
    Wrench,
    XCircle,
} from "lucide-react";

function Earnings() {
    const navigate = useNavigate();

    const [filter, setFilter] = useState("all");

    /*
    |--------------------------------------------------------------------------
    | TEMPORARY EARNING DATA
    | Replace this later with:
    | GET /mechanic/earnings
    |--------------------------------------------------------------------------
    */

    const earnings = [
        {
            id: "QF-10081",
            customer: "Rahul Kumar",
            service: "Battery Jump Start",
            amount: 450,
            date: "2026-08-23",
            time: "10:35 AM",
            status: "completed",
        },
        {
            id: "QF-10079",
            customer: "Aman Singh",
            service: "Flat Tyre Repair",
            amount: 350,
            date: "2026-08-22",
            time: "05:20 PM",
            status: "completed",
        },
        {
            id: "QF-10074",
            customer: "Priya Sharma",
            service: "Car Breakdown Assistance",
            amount: 800,
            date: "2026-08-21",
            time: "02:15 PM",
            status: "completed",
        },
        {
            id: "QF-10068",
            customer: "Vikas Kumar",
            service: "Engine Check",
            amount: 650,
            date: "2026-08-20",
            time: "11:40 AM",
            status: "completed",
        },
        {
            id: "QF-10061",
            customer: "Neha Singh",
            service: "Oil Change",
            amount: 550,
            date: "2026-08-18",
            time: "04:05 PM",
            status: "completed",
        },
        {
            id: "QF-10055",
            customer: "Arjun Verma",
            service: "Battery Replacement",
            amount: 1200,
            date: "2026-08-17",
            time: "01:25 PM",
            status: "pending",
        },
        {
            id: "QF-10041",
            customer: "Rohit Singh",
            service: "Tyre Puncture",
            amount: 300,
            date: "2026-08-15",
            time: "09:45 AM",
            status: "completed",
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | FILTER
    |--------------------------------------------------------------------------
    */

    const filteredEarnings = useMemo(() => {
        if (filter === "completed") {
            return earnings.filter(
                (item) => item.status === "completed"
            );
        }

        if (filter === "pending") {
            return earnings.filter(
                (item) => item.status === "pending"
            );
        }

        return earnings;
    }, [filter]);

    /*
    |--------------------------------------------------------------------------
    | CALCULATIONS
    |--------------------------------------------------------------------------
    */

    const completedEarnings = earnings
        .filter(
            (item) => item.status === "completed"
        )
        .reduce(
            (total, item) => total + item.amount,
            0
        );

    const pendingEarnings = earnings
        .filter(
            (item) => item.status === "pending"
        )
        .reduce(
            (total, item) => total + item.amount,
            0
        );

    const completedJobs = earnings.filter(
        (item) => item.status === "completed"
    ).length;

    const averageEarning =
        completedJobs > 0
            ? Math.round(
                completedEarnings /
                completedJobs
            )
            : 0;

    /*
    |--------------------------------------------------------------------------
    | CURRENCY
    |--------------------------------------------------------------------------
    */

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(amount);
    };

    /*
    |--------------------------------------------------------------------------
    | DATE
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
    | STATUS BADGE
    |--------------------------------------------------------------------------
    */

    const StatusBadge = ({ status }) => {
        if (status === "completed") {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase text-emerald-700">
                    <CheckCircle2 size={13} />
                    Completed
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-black uppercase text-orange-700">
                <Clock3 size={13} />
                Pending
            </span>
        );
    };

    /*
    |--------------------------------------------------------------------------
    | UI
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
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                    >
                        <ArrowLeft size={19} />
                    </button>

                    <div className="flex-1">

                        <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                            QuickFix
                        </p>

                        <h1 className="mt-1 text-3xl font-black text-slate-900">
                            Earnings
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Track your service income and
                            payment history.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            alert(
                                "Payout feature will be connected with the backend soon."
                            );
                        }}
                        className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700 sm:flex"
                    >
                        <ArrowDownToLine
                            size={17}
                        />
                        Withdraw
                    </button>

                </div>

                {/* =========================================================
                    MAIN EARNING CARD
                ========================================================== */}

                <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-lg sm:p-8">

                    <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

                        <div>

                            <div className="flex items-center gap-2">

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                                    <Wallet size={18} />
                                </div>

                                <span className="text-xs font-bold uppercase tracking-widest text-blue-100">
                                    Total Earnings
                                </span>

                            </div>

                            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                                {formatCurrency(
                                    completedEarnings
                                )}
                            </h2>

                            <div className="mt-3 flex items-center gap-2 text-sm text-blue-100">
                                <TrendingUp
                                    size={16}
                                />
                                Earnings from completed
                                services
                            </div>

                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">

                            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">

                                <p className="text-xs text-blue-100">
                                    Completed Jobs
                                </p>

                                <p className="mt-1 text-2xl font-black">
                                    {completedJobs}
                                </p>

                            </div>

                            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">

                                <p className="text-xs text-blue-100">
                                    Avg. / Job
                                </p>

                                <p className="mt-1 text-2xl font-black">
                                    {formatCurrency(
                                        averageEarning
                                    )}
                                </p>

                            </div>

                            <div className="col-span-2 rounded-2xl bg-white/10 p-4 backdrop-blur">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-xs text-blue-100">
                                            Pending Earnings
                                        </p>

                                        <p className="mt-1 text-xl font-black">
                                            {formatCurrency(
                                                pendingEarnings
                                            )}
                                        </p>

                                    </div>

                                    <Clock3
                                        size={22}
                                        className="text-blue-100"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>
                </section>

                {/* MOBILE WITHDRAW */}

                <button
                    type="button"
                    onClick={() =>
                        alert(
                            "Payout feature will be connected with the backend soon."
                        )
                    }
                    className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-sm sm:hidden"
                >
                    <ArrowDownToLine size={17} />
                    Withdraw Earnings
                </button>

                {/* =========================================================
                    STATS
                ========================================================== */}

                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <StatCard
                        icon={IndianRupee}
                        title="Total Earned"
                        value={formatCurrency(
                            completedEarnings
                        )}
                        description="All completed services"
                        iconBg="bg-blue-50"
                        iconColor="text-blue-600"
                    />

                    <StatCard
                        icon={CalendarDays}
                        title="This Month"
                        value={formatCurrency(
                            completedEarnings
                        )}
                        description="Current month income"
                        iconBg="bg-violet-50"
                        iconColor="text-violet-600"
                    />

                    <StatCard
                        icon={TrendingUp}
                        title="Average Job"
                        value={formatCurrency(
                            averageEarning
                        )}
                        description="Average completed service"
                        iconBg="bg-emerald-50"
                        iconColor="text-emerald-600"
                    />

                    <StatCard
                        icon={Clock3}
                        title="Pending"
                        value={formatCurrency(
                            pendingEarnings
                        )}
                        description="Awaiting completion"
                        iconBg="bg-orange-50"
                        iconColor="text-orange-600"
                    />

                </div>

                {/* =========================================================
                    EARNING HISTORY
                ========================================================== */}

                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                    {/* HEADER */}

                    <div className="border-b border-slate-100 p-5 sm:p-6">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <h2 className="font-black text-slate-900">
                                    Earning History
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    View your recent service
                                    earnings.
                                </p>

                            </div>

                            {/* FILTER */}

                            <div className="relative">

                                <select
                                    value={filter}
                                    onChange={(event) =>
                                        setFilter(
                                            event.target
                                                .value
                                        )
                                    }
                                    className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="all">
                                        All Earnings
                                    </option>

                                    <option value="completed">
                                        Completed
                                    </option>

                                    <option value="pending">
                                        Pending
                                    </option>
                                </select>

                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                            </div>

                        </div>

                    </div>

                    {/* DESKTOP TABLE */}

                    <div className="hidden overflow-x-auto md:block">

                        <table className="w-full">

                            <thead className="bg-slate-50">

                                <tr>

                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        Service
                                    </th>

                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        Amount
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {filteredEarnings.map(
                                    (earning) => (
                                        <tr
                                            key={
                                                earning.id
                                            }
                                            className="transition hover:bg-slate-50"
                                        >

                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                        <Wrench
                                                            size={18}
                                                        />
                                                    </div>

                                                    <div>

                                                        <p className="font-bold text-slate-900">
                                                            {
                                                                earning.service
                                                            }
                                                        </p>

                                                        <p className="text-[11px] text-slate-400">
                                                            {
                                                                earning.id
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            <td className="px-6 py-4">

                                                <p className="text-sm font-semibold text-slate-700">
                                                    {
                                                        earning.customer
                                                    }
                                                </p>

                                            </td>

                                            <td className="px-6 py-4">

                                                <p className="text-sm font-semibold text-slate-700">
                                                    {formatDate(
                                                        earning.date
                                                    )}
                                                </p>

                                                <p className="text-[11px] text-slate-400">
                                                    {
                                                        earning.time
                                                    }
                                                </p>

                                            </td>

                                            <td className="px-6 py-4">
                                                <StatusBadge
                                                    status={
                                                        earning.status
                                                    }
                                                />
                                            </td>

                                            <td className="px-6 py-4 text-right">

                                                <p className="font-black text-slate-900">
                                                    {formatCurrency(
                                                        earning.amount
                                                    )}
                                                </p>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* MOBILE LIST */}

                    <div className="divide-y divide-slate-100 md:hidden">

                        {filteredEarnings.map(
                            (earning) => (
                                <div
                                    key={
                                        earning.id
                                    }
                                    className="p-5"
                                >

                                    <div className="flex items-start gap-3">

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <Wrench
                                                size={19}
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">

                                            <div className="flex items-start justify-between gap-3">

                                                <div>

                                                    <p className="font-bold text-slate-900">
                                                        {
                                                            earning.service
                                                        }
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {
                                                            earning.customer
                                                        }
                                                    </p>

                                                </div>

                                                <p className="shrink-0 font-black text-slate-900">
                                                    {formatCurrency(
                                                        earning.amount
                                                    )}
                                                </p>

                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-2">

                                                <span className="text-[11px] font-semibold text-slate-400">
                                                    {formatDate(
                                                        earning.date
                                                    )}
                                                </span>

                                                <span className="text-slate-300">
                                                    •
                                                </span>

                                                <span className="text-[11px] font-semibold text-slate-400">
                                                    {
                                                        earning.time
                                                    }
                                                </span>

                                                <StatusBadge
                                                    status={
                                                        earning.status
                                                    }
                                                />

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            )
                        )}

                    </div>

                    {/* EMPTY */}

                    {filteredEarnings.length ===
                        0 && (
                            <div className="p-12 text-center">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                    <IndianRupee
                                        size={25}
                                    />
                                </div>

                                <h3 className="mt-4 font-black text-slate-900">
                                    No earnings found
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    There are no earnings
                                    matching this filter.
                                </p>

                            </div>
                        )}

                </section>

                {/* =========================================================
                    PAYMENT INFORMATION
                ========================================================== */}

                <section className="mt-6 grid gap-6 lg:grid-cols-2">

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <Wallet size={21} />
                            </div>

                            <div>

                                <h2 className="font-black text-slate-900">
                                    Payment Summary
                                </h2>

                                <p className="text-xs text-slate-500">
                                    Your current earning status.
                                </p>

                            </div>

                        </div>

                        <div className="mt-5 space-y-3">

                            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                                <span className="text-sm font-semibold text-slate-600">
                                    Completed
                                </span>

                                <span className="font-black text-emerald-600">
                                    {formatCurrency(
                                        completedEarnings
                                    )}
                                </span>

                            </div>

                            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                                <span className="text-sm font-semibold text-slate-600">
                                    Pending
                                </span>

                                <span className="font-black text-orange-600">
                                    {formatCurrency(
                                        pendingEarnings
                                    )}
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <IndianRupee
                                    size={21}
                                />
                            </div>

                            <div>

                                <h2 className="font-black text-slate-900">
                                    Payout Account
                                </h2>

                                <p className="text-xs text-slate-500">
                                    Manage where you receive
                                    your earnings.
                                </p>

                            </div>

                        </div>

                        <div className="mt-5 rounded-2xl bg-blue-50 p-4">

                            <div className="flex items-center gap-3">

                                <CheckCircle2
                                    size={20}
                                    className="text-blue-600"
                                />

                                <div>

                                    <p className="font-bold text-blue-900">
                                        Payout setup
                                    </p>

                                    <p className="mt-1 text-xs text-blue-600">
                                        Bank payout integration
                                        can be connected here.
                                    </p>

                                </div>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/mechanic/security"
                                )
                            }
                            className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                        >
                            Manage Account
                        </button>

                    </div>

                </section>

                {/* FOOTER */}

                <div className="mt-8 pb-4 text-center">

                    <p className="text-xs font-semibold text-slate-400">
                        QuickFix Mechanic Panel
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                        Earnings are calculated from completed
                        service bookings.
                    </p>

                </div>

            </div>
        </div>
    );
}

export default Earnings;
