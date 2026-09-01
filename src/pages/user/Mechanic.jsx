import { useState } from "react";
import {
  ChevronRight,
  MapPin,
  Search,
  Star,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const mechanics = [
  {
    id: 1,
    name: "Ravi Sharma",
    specialty: "Engine Specialist",
    experience: "8+ Years Exp.",
    expertise: "Engine Repair, Overhauling, Diagnostics",
    rating: 4.8,
    reviews: 126,
    available: true,
  },
  {
    id: 2,
    name: "Amit Verma",
    specialty: "Electrical Expert",
    experience: "6+ Years Exp.",
    expertise: "Electrical Systems, Battery, Sensors",
    rating: 4.7,
    reviews: 96,
    available: true,
  },
  {
    id: 3,
    name: "Imran Khan",
    specialty: "Brake Specialist",
    experience: "7+ Years Exp.",
    expertise: "Brake Repair, ABS, Safety Systems",
    rating: 4.9,
    reviews: 114,
    available: true,
  },
  {
    id: 4,
    name: "Sandeep Yadav",
    specialty: "AC Specialist",
    experience: "5+ Years Exp.",
    expertise: "AC Repair, Gas Refill, Cooling Systems",
    rating: 4.6,
    reviews: 88,
    available: true,
  },
];

function Mechanics() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("All Ratings");
  const [specialty, setSpecialty] =
    useState("All Specialties");

  const filteredMechanics = mechanics.filter(
    (mechanic) => {
      const searchMatch =
        mechanic.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        mechanic.specialty
          .toLowerCase()
          .includes(search.toLowerCase());

      const ratingMatch =
        rating === "All Ratings" ||
        mechanic.rating >= Number(rating);

      const specialtyMatch =
        specialty === "All Specialties" ||
        mechanic.specialty === specialty;

      return (
        searchMatch &&
        ratingMatch &&
        specialtyMatch
      );
    }
  );

  return (
    <div className="min-h-screen bg-[#f8fbff]">

      {/* HEADER */}
      <section className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
                <Wrench size={16} />
                Verified Professionals
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                Our Expert Mechanics
              </h1>

              <p className="mt-3 text-sm text-slate-500">
                Skilled professionals you can trust.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs text-slate-400">
                Available mechanics
              </p>
              <p className="mt-1 text-2xl font-extrabold text-blue-600">
                {mechanics.length}+
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* FILTER */}
        <div className="mb-6 grid gap-3 md:grid-cols-3">

          <select
            value={specialty}
            onChange={(e) =>
              setSpecialty(e.target.value)
            }
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 outline-none focus:border-blue-500"
          >
            <option>All Specialties</option>
            <option>Engine Specialist</option>
            <option>Electrical Expert</option>
            <option>Brake Specialist</option>
            <option>AC Specialist</option>
          </select>

          <select
            value={rating}
            onChange={(e) =>
              setRating(e.target.value)
            }
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 outline-none focus:border-blue-500"
          >
            <option>All Ratings</option>
            <option value="4.5">4.5+ Rating</option>
            <option value="4.7">4.7+ Rating</option>
            <option value="4.8">4.8+ Rating</option>
          </select>

          <div className="relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search mechanic..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

        </div>

        {/* MECHANICS */}
        <div className="space-y-3">

          {filteredMechanics.map((mechanic) => (
            <div
              key={mechanic.id}
              className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="grid items-center gap-5 lg:grid-cols-[280px_180px_1fr_110px_130px]">

                {/* PROFILE */}
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600">
                    <Wrench size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {mechanic.name}
                    </h3>

                    <p className="text-xs text-slate-400">
                      {mechanic.specialty}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {mechanic.experience}
                    </p>
                  </div>
                </div>

                {/* RATING */}
                <div>
                  <div className="flex items-center gap-1">
                    <Star
                      size={15}
                      className="fill-amber-400 text-amber-400"
                    />

                    <span className="font-bold text-slate-900">
                      {mechanic.rating}
                    </span>

                    <span className="text-xs text-slate-400">
                      ({mechanic.reviews})
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Customer rating
                  </p>
                </div>

                {/* EXPERTISE */}
                <div>
                  <p className="text-xs text-slate-400">
                    Expertise
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {mechanic.expertise}
                  </p>
                </div>

                {/* STATUS */}
                <div>
                  {mechanic.available ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Available
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">
                      Offline
                    </span>
                  )}
                </div>

                {/* BUTTON */}
                <button
                  onClick={() =>
                    navigate(
                      `/mechanics/${mechanic.id}`
                    )
                  }
                  className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  View Profile
                  <ChevronRight size={14} />
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* EMPTY */}
        {filteredMechanics.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center">
            <Search
              size={35}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-bold text-slate-800">
              No mechanics found
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        )}

      </section>
    </div>
  );
}

export default Mechanics;