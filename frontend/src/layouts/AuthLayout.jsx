import { Outlet } from "react-router-dom";
import { CarFront, ShieldCheck } from "lucide-react";

function AuthLayout() {
  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 lg:grid lg:grid-cols-2">

      {/* =====================================================
          LEFT BRAND PANEL - DESKTOP
      ===================================================== */}

      <section className="relative hidden min-h-[100dvh] overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 lg:flex">

        {/* Background Decorations */}

        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10" />

        <div className="pointer-events-none absolute -bottom-40 -right-32 h-[420px] w-[420px] rounded-full bg-white/10" />

        <div className="pointer-events-none absolute right-1/3 top-1/3 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

        {/* Content */}

        <div className="relative z-10 flex min-h-[100dvh] w-full flex-col justify-between p-10 xl:p-14 2xl:p-16">

          {/* =================================================
              LOGO
          ================================================= */}

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xl">
              <CarFront
                size={25}
                strokeWidth={2}
                className="text-blue-600"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                QuickFix
              </h1>

              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-100">
                Vehicle Care
              </p>
            </div>

          </div>


          {/* =================================================
              MAIN BRAND MESSAGE
          ================================================= */}

          <div className="max-w-xl">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm">
              <ShieldCheck
                size={28}
                strokeWidth={1.8}
                className="text-white"
              />
            </div>

            <h2 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white xl:text-5xl 2xl:text-[54px]">
              Your vehicle deserves

              <span className="mt-1 block text-blue-100">
                the best care.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-blue-100/90 xl:text-[17px]">
              Find trusted mechanics, manage your vehicles,
              book services and get roadside assistance
              whenever you need it.
            </p>


            {/* Small Trust Items */}

            <div className="mt-8 flex flex-wrap gap-3">

              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm">
                ✓ Trusted Mechanics
              </div>

              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm">
                ✓ Easy Booking
              </div>

              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm">
                ✓ Roadside Support
              </div>

            </div>

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="pt-8">

            <p className="text-sm text-blue-200">
              © {new Date().getFullYear()} QuickFix. All rights reserved.
            </p>

          </div>

        </div>
      </section>


      {/* =====================================================
          RIGHT AUTH AREA
      ===================================================== */}

      <section className="relative min-h-[100dvh] overflow-hidden">

        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />

          <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-3xl" />

        </div>


        {/* =================================================
            SCROLL CONTAINER
        ================================================= */}

        <div className="relative z-10 flex min-h-[100dvh] w-full items-center justify-center overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-12">

          <div className="w-full max-w-[560px]">

            {/* =================================================
                MOBILE LOGO
            ================================================= */}

            <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <CarFront
                  size={22}
                  strokeWidth={2}
                />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Quick<span className="text-blue-600">Fix</span>
                </h1>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Vehicle Care
                </p>
              </div>

            </div>


            {/* =================================================
                AUTH CARD
            ================================================= */}

            <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:rounded-[26px]">

              <div className="w-full px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">

                <Outlet />

              </div>

            </div>


            {/* =================================================
                SECURITY FOOTER
            ================================================= */}

            <div className="mt-5 flex items-center justify-center gap-2 px-3 pb-2 text-center text-xs text-slate-400">

              <ShieldCheck
                size={15}
                strokeWidth={2}
                className="shrink-0 text-blue-500"
              />

              <span>
                Secure & trusted vehicle care platform
              </span>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default AuthLayout;