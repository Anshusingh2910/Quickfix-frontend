import {
  CarFront,
  Clock3,
  ShieldCheck,
  Users,
  ArrowUpRight,
} from "lucide-react";

function StatsSection() {
  const stats = [
    {
      value: "10K+",
      label: "Vehicles Serviced",
      description: "and counting",
      icon: CarFront,
    },
    {
      value: "500+",
      label: "Verified Mechanics",
      description: "across locations",
      icon: Users,
    },
    {
      value: "24/7",
      label: "Roadside Assistance",
      description: "whenever you need",
      icon: Clock3,
    },
    {
      value: "100%",
      label: "Secure & Reliable",
      description: "trusted service",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">

        {/* Blue glow */}
        <div className="absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[100px]" />

        {/* Indigo glow */}
        <div className="absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-indigo-600/20 blur-[100px]" />

        {/* Cyan glow */}
        <div className="absolute bottom-[-150px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 xl:px-12">

        <div className="grid grid-cols-2 lg:grid-cols-4">

          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`
                  group
                  relative
                  flex
                  items-center
                  justify-center
                  gap-3
                  px-4
                  py-5
                  transition-all
                  duration-300
                  sm:gap-4
                  sm:px-6
                  lg:py-4

                  ${
                    index < 3
                      ? "lg:border-r lg:border-white/10"
                      : ""
                  }

                  ${
                    index < 2
                      ? "border-b border-white/10 lg:border-b-0"
                      : ""
                  }

                  ${
                    index === 1
                      ? "border-l border-white/10 lg:border-l-0"
                      : ""
                  }

                  ${
                    index === 3
                      ? "border-l border-white/10 lg:border-l-0"
                      : ""
                  }
                `}
              >

                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-4 rounded-2xl bg-blue-500/0 blur-xl transition-all duration-500 group-hover:bg-blue-500/10" />


                {/* =================================================
                    ICON
                ================================================= */}

                <div
                  className="
                    relative
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/10
                    bg-white/10
                    text-blue-400
                    backdrop-blur-md
                    transition-all
                    duration-300
                    group-hover:-translate-y-1
                    group-hover:border-blue-400/30
                    group-hover:bg-blue-500
                    group-hover:text-white
                    group-hover:shadow-lg
                    group-hover:shadow-blue-500/25
                    sm:h-12
                    sm:w-12
                  "
                >
                  <Icon
                    size={21}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="relative min-w-0">

                  <div className="flex items-center gap-1">

                    <p className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                      {stat.value}
                    </p>

                    <ArrowUpRight
                      size={14}
                      className="
                        text-blue-400
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:-translate-y-0.5
                        group-hover:translate-x-0.5
                        group-hover:opacity-100
                      "
                    />

                  </div>

                  <p className="mt-0.5 truncate text-xs font-semibold text-slate-300 sm:text-sm">
                    {stat.label}
                  </p>

                  <p className="mt-0.5 hidden text-[11px] font-medium text-slate-500 sm:block">
                    {stat.description}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default StatsSection;