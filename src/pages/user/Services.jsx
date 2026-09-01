import { useState } from "react";
import {
  BatteryCharging,
  Car,
  CircleGauge,
  Droplets,
  Gauge,
  Search,
  Settings,
  Snowflake,
  Sparkles,
  Wrench,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    id: 1,
    title: "Oil Change",
    description: "Regular oil change for better engine performance.",
    price: 799,
    category: "Maintenance",
    icon: Droplets,
  },
  {
    id: 2,
    title: "Brake Inspection",
    description: "Complete brake check for your safety.",
    price: 599,
    category: "Maintenance",
    icon: CircleGauge,
  },
  {
    id: 3,
    title: "Battery Check",
    description: "Battery health check and replacement.",
    price: 499,
    category: "Diagnostics",
    icon: BatteryCharging,
  },
  {
    id: 4,
    title: "Engine Service",
    description: "Full engine checkup and tuning.",
    price: 1299,
    category: "Maintenance",
    icon: Settings,
  },
  {
    id: 5,
    title: "Wheel Alignment",
    description: "Improve stability and extend tyre life.",
    price: 899,
    category: "Repairs",
    icon: Gauge,
  },
  {
    id: 6,
    title: "AC Service",
    description: "AC performance check and gas refill.",
    price: 1199,
    category: "Maintenance",
    icon: Snowflake,
  },
  {
    id: 7,
    title: "Car Wash",
    description: "Exterior and interior cleaning.",
    price: 499,
    category: "Cleaning",
    icon: Sparkles,
  },
  {
    id: 8,
    title: "Diagnostics",
    description: "Advanced vehicle scanning and diagnostics.",
    price: 699,
    category: "Diagnostics",
    icon: Search,
  },
];

const categories = [
  "All Services",
  "Maintenance",
  "Repairs",
  "Cleaning",
  "Diagnostics",
  "Others",
];

function Services() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] =
    useState("All Services");

  const filteredServices =
    activeCategory === "All Services"
      ? services
      : services.filter(
          (service) =>
            service.category === activeCategory
        );

  return (
    <div className="min-h-screen bg-[#f8fbff]">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-indigo-50" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">

            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm">
                <Wrench size={16} />
                Professional Vehicle Care
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Our Services
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-slate-500">
                Professional care for your vehicle, at every
                step. Book trusted services from verified
                mechanics.
              </p>
            </div>

            <div className="hidden justify-end lg:flex">
              <div className="relative h-44 w-[430px] overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 via-white to-indigo-100">

                <div className="absolute right-10 top-8 flex h-28 w-52 items-center justify-center rounded-2xl bg-white shadow-xl">
                  <Car
                    size={80}
                    strokeWidth={1.3}
                    className="text-blue-600"
                  />
                </div>

                <div className="absolute bottom-5 left-10 h-16 w-28 rounded-lg bg-blue-200/70" />

                <div className="absolute bottom-5 right-5 h-8 w-40 rounded-full bg-slate-300/40 blur-md" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* FILTERS */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setActiveCategory(category)
              }
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activeCategory === category
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* SERVICES */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredServices.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={23} />
                  </div>

                  <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-400">
                    {service.category}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-2 min-h-[48px] text-sm leading-5 text-slate-500">
                  {service.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-extrabold text-slate-900">
                      ₹{service.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigate("/book-service", {
                        state: {
                          service,
                        },
                      })
                    }
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Book Now
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* QUALITY */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
          <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
              <CheckCircle2 size={23} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                100% Quality Service
              </h3>
              <p className="text-sm text-slate-500">
                Genuine parts • Expert technicians •
                Satisfaction guaranteed
              </p>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}

export default Services;