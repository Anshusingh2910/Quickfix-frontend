import {
  Award,
  CheckCircle2,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wrench,
} from "lucide-react";

const stats = [
  {
    value: "10K+",
    label: "Happy Customers",
  },
  {
    value: "500+",
    label: "Expert Mechanics",
  },
  {
    value: "50K+",
    label: "Services Completed",
  },
  {
    value: "4.8★",
    label: "Average Rating",
  },
];

const values = [
  {
    title: "Our Mission",
    description:
      "To deliver reliable, affordable and high-quality vehicle care with complete transparency.",
    icon: Target,
  },
  {
    title: "Our Vision",
    description:
      "To become the most trusted vehicle care platform for every city we serve.",
    icon: Sparkles,
  },
  {
    title: "Our Values",
    description:
      "Integrity, quality, customer satisfaction and continuous improvement.",
    icon: HeartHandshake,
  },
];

const features = [
  "Trusted by 10,000+ customers",
  "Verified & experienced mechanics",
  "Genuine parts & quality service",
  "Fast, easy & secure bookings",
];

function About() {
  return (
    <div className="min-h-screen bg-[#f8fbff]">

      {/* HERO */}
      <section className="overflow-hidden border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50">

        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* LEFT */}
            <div>

              <div className="mb-4 text-sm font-semibold text-blue-600">
                About QuickFix
              </div>

              <h1 className="max-w-xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                We care for your vehicle
                <span className="block text-blue-600">
                  like it's our own.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-500">
                QuickFix Vehicle Care is your trusted partner
                for everything your vehicle needs. From routine
                maintenance to complex repairs, we connect you
                with expert mechanics and smart solutions.
              </p>

              <div className="mt-7 space-y-3">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm font-medium text-slate-600"
                  >
                    <CheckCircle2
                      size={17}
                      className="shrink-0 text-blue-600"
                    />

                    {feature}
                  </div>
                ))}
              </div>

            </div>

            {/* VISUAL */}
            <div className="relative flex justify-center lg:justify-end">

              <div className="relative flex h-[330px] w-full max-w-[540px] items-center justify-center overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 shadow-2xl shadow-blue-200">

                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

                <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10" />

                <div className="relative text-center text-white">

                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-xl">
                    <Wrench
                      size={60}
                      className="text-blue-600"
                      strokeWidth={1.5}
                    />
                  </div>

                  <h2 className="mt-6 text-2xl font-extrabold">
                    QuickFix
                  </h2>

                  <p className="mt-1 text-sm text-blue-100">
                    VEHICLE CARE
                  </p>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm"
            >
              <p className="text-3xl font-extrabold text-blue-600">
                {stat.value}
              </p>

              <p className="mt-2 text-sm font-medium text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* WHY QUICKFIX */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
            <ShieldCheck
              size={28}
              className="text-blue-600"
            />

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Trusted Service
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Every mechanic is verified so you can book
              vehicle services with confidence.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
            <Users
              size={28}
              className="text-blue-600"
            />

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Expert Mechanics
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Connect with experienced professionals based
              on your vehicle's specific requirements.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
            <Award
              size={28}
              className="text-blue-600"
            />

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Quality First
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              We focus on transparent pricing, quality work
              and a better customer experience.
            </p>
          </div>

        </div>

      </section>

      {/* MISSION / VISION / VALUES */}
      <section className="border-t border-slate-100 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

          <div className="mb-9 text-center">
            <p className="text-sm font-semibold text-blue-600">
              What drives us
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
              Built around your vehicle
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {values.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="px-6 py-12 lg:px-8">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-10 text-center text-white shadow-2xl shadow-blue-200">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
            <Wrench size={24} />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">
            Your vehicle deserves better care.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-blue-100">
            Find trusted mechanics, book vehicle services
            and get quick assistance with QuickFix.
          </p>

        </div>

      </section>

    </div>
  );
}

export default About;