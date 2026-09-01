import { Link } from "react-router-dom";
import {
  ArrowRight,
  CarFront,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Wrench,
  Sparkles,
  Zap,
  Navigation,
} from "lucide-react";

function HeroSection() {
  const trustPoints = [
    "Verified mechanics",
    "Secure booking",
    "Quick assistance",
  ];

  return (
    <section className="relative min-h-[calc(100vh-76px)] overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-[100px]" />

        <div className="absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-indigo-200/30 blur-[110px]" />

        <div className="absolute -bottom-40 left-1/3 h-[450px] w-[450px] rounded-full bg-cyan-200/20 blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-76px)] w-full max-w-[1440px] items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10 xl:px-12">

        <div className="animate-[fadeInLeft_0.8s_ease-out]">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur-xl">

            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600" />
            </span>

            <Sparkles size={15} />

            Smart vehicle care, made simple
          </div>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[54px] xl:text-[62px]">

            Your vehicle deserves

            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text pb-2 text-transparent">
              better care.
            </span>

          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
            Find trusted mechanics, book vehicle services, manage your
            vehicles and get roadside assistance — all from one simple
            platform.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <Link
              to="/bookings"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/30"
            >
              Book a Service

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/bookings"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
            >
              <MapPin
                size={18}
                className="transition-transform duration-300 group-hover:scale-110"
              />

              Find a Mechanic
            </Link>

          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">

            {trustPoints.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-slate-500"
              >
                <CheckCircle2
                  size={17}
                  className="text-emerald-500"
                />

                {item}
              </div>
            ))}

          </div>

        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">

          <div className="relative min-h-[430px] overflow-hidden rounded-[36px] border border-white/20 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950 p-6 shadow-[0_30px_90px_rgba(30,64,175,0.25)] sm:min-h-[500px] sm:p-8">

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-blue-400/30 blur-[90px]" />

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10 bg-white/5" />

            <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-white/10 bg-white/5" />

            <div className="absolute right-5 top-6 hidden items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white/90 backdrop-blur-md sm:flex">
              <Navigation size={14} />

              <span className="text-[11px] font-semibold">
                Live Assistance
              </span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">

              <div className="relative flex h-64 w-64 animate-[float_4s_ease-in-out_infinite] items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-inner backdrop-blur-xl sm:h-72 sm:w-72">

                {/* Rotating ring */}
                <div className="absolute inset-5 animate-[spin_20s_linear_infinite] rounded-full border border-dashed border-white/20" />

                {/* Inner circle */}
                <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-white to-blue-50 shadow-2xl sm:h-52 sm:w-52">

                  <CarFront
                    size={100}
                    strokeWidth={1.35}
                    className="text-blue-600"
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                VERIFIED CARD
            ================================================= */}

            <div className="absolute left-5 top-6 flex animate-[float_3.5s_ease-in-out_infinite] items-center gap-3 rounded-2xl border border-white/40 bg-white/95 p-3 shadow-2xl backdrop-blur-xl sm:left-8 sm:top-8">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={21} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Trusted
                </p>

                <p className="text-sm font-bold text-slate-800">
                  Verified Service
                </p>
              </div>

            </div>


            {/* =================================================
                MECHANIC CARD
            ================================================= */}

            <div className="absolute bottom-6 left-5 flex animate-[float_4s_ease-in-out_infinite] items-center gap-3 rounded-2xl border border-white/40 bg-white/95 p-3 shadow-2xl backdrop-blur-xl sm:bottom-8 sm:left-8">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Wrench size={21} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Available nearby
                </p>

                <p className="text-sm font-bold text-slate-800">
                  Expert Mechanics
                </p>
              </div>

            </div>


            {/* =================================================
                ASSISTANCE STATUS
            ================================================= */}

            <div className="absolute bottom-6 right-5 rounded-2xl border border-white/40 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-xl sm:bottom-8 sm:right-8">

              <div className="flex items-center gap-2">

                <span className="relative flex h-2.5 w-2.5">

                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />

                </span>

                <span className="text-xs font-bold text-slate-700">
                  Assistance Available
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              BOTTOM FLOATING CARD
          ================================================= */}

          <div className="absolute -bottom-5 right-6 animate-[float_3s_ease-in-out_infinite] rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-[0_20px_45px_rgba(15,23,42,0.12)] sm:right-10">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Zap size={17} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Built for
                </p>

                <p className="text-lg font-extrabold text-slate-900">
                  Every Journey
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;