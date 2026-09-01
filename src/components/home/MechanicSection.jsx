import { Link } from "react-router-dom";
import {
    ArrowRight,
    MapPin,
    ShieldCheck,
    Star,
    Wrench,
} from "lucide-react";

function MechanicSection() {
    const mechanics = [
        {
            id: 1,
            name: "QuickFix Auto Care",
            specialty: "Car Service & Repair",
            location: "Delhi",
            rating: "4.9",
            reviews: "120+",
            experience: "8+ Years",
            available: true,
        },
        {
            id: 2,
            name: "Pro Motor Works",
            specialty: "Engine & Maintenance",
            location: "Delhi",
            rating: "4.8",
            reviews: "95+",
            experience: "6+ Years",
            available: true,
        },
        {
            id: 3,
            name: "AutoCare Experts",
            specialty: "Tyre & Wheel Service",
            location: "Delhi",
            rating: "4.9",
            reviews: "80+",
            experience: "7+ Years",
            available: true,
        },
    ];

    return (
        <section className="relative overflow-hidden bg-white py-20 sm:py-24">
            <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />

            <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-indigo-50 blur-3xl" />

            <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10 xl:px-12">

                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

                    <div className="max-w-2xl">

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600">
                            <Wrench size={15} />

                            Trusted Mechanics
                        </div>

                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">

                            Find the right mechanic

                            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                for your vehicle.
                            </span>

                        </h2>

                        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                            Connect with verified mechanics near you and get reliable
                            vehicle service from professionals you can trust.
                        </p>

                    </div>


                    <Link
                        to="/mechanics"
                        className="
              group
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              py-3
              text-sm
              font-semibold
              text-slate-700
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-blue-200
              hover:bg-blue-50
              hover:text-blue-600
            "
                    >
                        View all mechanics

                        <ArrowRight
                            size={17}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>

                </div>


                <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {mechanics.map((mechanic) => (

                        <div
                            key={mechanic.id}
                            className="
                group
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-200
                hover:shadow-xl
                hover:shadow-blue-100/40
              "
                        >

                            <div className="flex items-start justify-between">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                                        <Wrench size={25} />
                                    </div>

                                    <div>

                                        <h3 className="text-base font-bold text-slate-900">
                                            {mechanic.name}
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {mechanic.specialty}
                                        </p>

                                    </div>

                                </div>


                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                    <ShieldCheck size={17} />
                                </div>

                            </div>


                            <div className="mt-6 flex items-center justify-between">

                                <div className="flex items-center gap-2">

                                    <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5">

                                        <Star
                                            size={14}
                                            fill="currentColor"
                                            className="text-amber-500"
                                        />

                                        <span className="text-xs font-bold text-amber-700">
                                            {mechanic.rating}
                                        </span>

                                    </div>

                                    <span className="text-xs text-slate-400">
                                        ({mechanic.reviews} reviews)
                                    </span>

                                </div>


                                {mechanic.available && (
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">

                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />

                                        Available

                                    </div>
                                )}

                            </div>


                            <div className="mt-5 grid grid-cols-2 gap-3">

                                <div className="rounded-xl bg-slate-50 px-4 py-3">

                                    <p className="text-[11px] font-medium text-slate-400">
                                        Experience
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-slate-700">
                                        {mechanic.experience}
                                    </p>

                                </div>


                                <div className="rounded-xl bg-slate-50 px-4 py-3">

                                    <p className="text-[11px] font-medium text-slate-400">
                                        Location
                                    </p>

                                    <div className="mt-1 flex items-center gap-1">

                                        <MapPin
                                            size={13}
                                            className="text-blue-600"
                                        />

                                        <p className="text-sm font-bold text-slate-700">
                                            {mechanic.location}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <Link
                                to={`/mechanics/${mechanic.id}`}
                                className="
                  mt-5
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-blue-100
                  bg-blue-50
                  text-sm
                  font-semibold
                  text-blue-600
                  transition-all
                  duration-300
                  hover:bg-blue-600
                  hover:text-white
                "
                            >
                                View mechanic

                                <ArrowRight
                                    size={16}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>

                        </div>

                    ))}

                </div>


                <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <ShieldCheck size={20} />
                        </div>

                        <div>

                            <p className="text-sm font-bold text-slate-800">
                                Every mechanic is verified
                            </p>

                            <p className="text-xs text-slate-500">
                                Quality service from trusted professionals.
                            </p>

                        </div>

                    </div>


                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                        <span className="h-2 w-2 rounded-full bg-emerald-500" />

                        Safe & trusted vehicle care

                    </div>

                </div>

            </div>

        </section>
    );
}

export default MechanicSection;