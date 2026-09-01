import { Link } from "react-router-dom";
import {
    ArrowRight,
    BatteryCharging,
    CarFront,
    CheckCircle2,
    CircleAlert,
    ShieldCheck,
    Truck,
    Wrench,
} from "lucide-react";

function ServiceSection() {
    const services = [
        {
            title: "Vehicle Service",
            description:
                "Regular servicing and maintenance to keep your vehicle performing at its best.",
            category: "Maintenance",
            icon: Wrench,
            iconClass: "bg-blue-50 text-blue-600",
            badgeClass: "bg-blue-50 text-blue-600",
            buttonClass: "bg-blue-600 hover:bg-blue-700",
            features: [
                "Full vehicle inspection",
                "Engine & oil service",
                "Brake & suspension check",
                "AC & electrical system check",
            ],
            buttonText: "Book Now",
            link: "bookings",
            active: true,
        },

        {
            title: "Emergency Repair",
            description:
                "Get quick roadside assistance when your vehicle breaks down unexpectedly.",
            category: "Emergency",
            icon: CircleAlert,
            iconClass: "bg-red-50 text-red-500",
            badgeClass: "bg-red-50 text-red-500",
            buttonClass: "bg-red-500 hover:bg-red-600",
            features: [
                "24/7 roadside assistance",
                "On-spot repair support",
                "Battery jump-start",
                "Flat tyre assistance",
            ],
            buttonText: "Request Now",
            link: "/services/emergency-repair",
            active: true,
        },

        {
            title: "Tyre & Wheel",
            description:
                "Tyre inspection, puncture assistance and professional wheel services.",
            category: "Quick Service",
            icon: CarFront,
            iconClass: "bg-amber-50 text-amber-500",
            badgeClass: "bg-amber-50 text-amber-600",
            buttonClass: "bg-amber-500 hover:bg-amber-600",
            features: [
                "Puncture repair",
                "Tyre replacement",
                "Wheel balancing",
                "Wheel alignment",
            ],
            buttonText: "Book Now",
            link: "/services/tyre-wheel",
            active: true,
        },

        {
            title: "Battery Assistance",
            description:
                "Battery jump-start and battery-related assistance from trusted professionals.",
            category: "Coming Soon",
            icon: BatteryCharging,
            iconClass: "bg-emerald-50 text-emerald-500",
            badgeClass: "bg-emerald-50 text-emerald-600",
            active: false,
        },

        {
            title: "Towing Assistance",
            description:
                "Reliable vehicle towing when your car or bike cannot continue the journey.",
            category: "Coming Soon",
            icon: Truck,
            iconClass: "bg-indigo-50 text-indigo-600",
            badgeClass: "bg-indigo-50 text-indigo-600",
            active: false,
        },

        {
            title: "Vehicle Inspection",
            description:
                "Professional inspection to understand your vehicle's condition before service.",
            category: "Coming Soon",
            icon: ShieldCheck,
            iconClass: "bg-violet-50 text-violet-600",
            badgeClass: "bg-violet-50 text-violet-600",
            active: false,
        },
    ];

    return (
        <section className="relative overflow-hidden bg-white py-20 sm:py-24">

            <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-blue-50 blur-3xl" />

            <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-indigo-50 blur-3xl" />

            <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10 xl:px-12">

                <div className="mx-auto max-w-4xl text-center">

                    <div className="mb-4 inline-flex items-center justify-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                        <Wrench size={15} />
                        Our Services
                    </div>

                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Everything your vehicle

                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            needs in one place.
                        </span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
                        From regular maintenance to emergency roadside assistance,
                        QuickFix connects you with reliable vehicle care professionals.
                    </p>

                </div>
                <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {services.map((service) => {

                        const Icon = service.icon;

                        return (
                            <div
                                key={service.title}
                                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm
                  transition-all
                  duration-300
                  ${service.active
                                        ? "hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
                                        : "opacity-75"
                                    }
                `}
                            >

                                <div className="flex items-start justify-between gap-4">

                                    <div
                                        className={`
                      flex
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      ${service.iconClass}
                    `}
                                    >
                                        <Icon size={27} strokeWidth={1.8} />
                                    </div>


                                    <span
                                        className={`
                      rounded-full
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      ${service.badgeClass}
                    `}
                                    >
                                        {service.category}
                                    </span>

                                </div>


                                <div className="mt-5">

                                    <h3 className="text-xl font-bold text-slate-900">
                                        {service.title}
                                    </h3>

                                    <p className="mt-2 min-h-[52px] text-sm leading-6 text-slate-500">
                                        {service.description}
                                    </p>

                                </div>


                                {service.active ? (
                                    <>

                                        <div className="mt-5 space-y-2.5">

                                            {service.features.map((feature) => (
                                                <div
                                                    key={feature}
                                                    className="flex items-center gap-2.5 text-sm text-slate-600"
                                                >
                                                    <CheckCircle2
                                                        size={16}
                                                        className="shrink-0 text-blue-600"
                                                    />

                                                    <span>{feature}</span>
                                                </div>
                                            ))}

                                        </div>


                                        <Link
                                            to={service.link}
                                            className={`
                        mt-6
                        inline-flex
                        h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        px-5
                        text-sm
                        font-semibold
                        text-white
                        shadow-md
                        transition-all
                        duration-300
                        ${service.buttonClass}
                      `}
                                        >
                                            {service.buttonText}

                                            <ArrowRight
                                                size={17}
                                                className="transition-transform duration-300 group-hover:translate-x-1"
                                            />
                                        </Link>

                                    </>
                                ) : (

                                    <div className="mt-6">

                                        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">

                                            <span className="text-sm font-semibold text-slate-400">
                                                Coming Soon
                                            </span>

                                            <span className="text-xs font-medium text-slate-400">
                                                We're working on it
                                            </span>

                                        </div>

                                    </div>

                                )}

                            </div>
                        );
                    })}

                </div>

                <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                            <ShieldCheck size={22} />
                        </div>

                        <div>

                            <p className="text-sm font-bold text-slate-800">
                                Trusted vehicle care
                            </p>

                            <p className="text-xs text-slate-500">
                                Verified professionals and secure bookings
                            </p>

                        </div>

                    </div>


                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">

                        <span>✓ Verified Mechanics</span>

                        <span>✓ Secure Booking</span>

                        <span>✓ Quick Assistance</span>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default ServiceSection;