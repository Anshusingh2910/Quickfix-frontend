import {
    Car,
    Mail,
    MapPin,
    Phone,
    Wrench,
    ShieldCheck,
    Clock3,
    ArrowRight,
    Globe,
    MessageCircle,
} from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-white">

            {/* Main Footer */}
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr]">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                                <Car size={23} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    Quick<span className="text-blue-500">Fix</span>
                                </h2>

                                <p className="text-xs tracking-widest text-slate-400">
                                    ROADSIDE ASSISTANCE
                                </p>
                            </div>
                        </div>

                        <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
                            Your trusted roadside assistance partner.
                            Get fast and reliable help from verified mechanics
                            whenever and wherever you need it.
                        </p>

                        {/* Social Icons */}
                        <div className="mt-7 flex gap-3">

                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Quick Links
                        </h3>

                        <ul className="mt-6 space-y-4 text-sm">

                            <li>
                                <a
                                    href="/"
                                    className="text-slate-400 transition hover:text-blue-400"
                                >
                                    Home
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/about"
                                    className="text-slate-400 transition hover:text-blue-400"
                                >
                                    About Us
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/services"
                                    className="text-slate-400 transition hover:text-blue-400"
                                >
                                    Our Services
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/mechanics"
                                    className="text-slate-400 transition hover:text-blue-400"
                                >
                                    Find a Mechanic
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/become-mechanic"
                                    className="text-slate-400 transition hover:text-blue-400"
                                >
                                    Become a Mechanic
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/contact"
                                    className="text-slate-400 transition hover:text-blue-400"
                                >
                                    Contact Us
                                </a>
                            </li>

                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Services
                        </h3>

                        <ul className="mt-6 space-y-4 text-sm">

                            <li className="flex items-center gap-2 text-slate-400">
                                <Wrench size={15} className="text-blue-500" />
                                Vehicle Service
                            </li>

                            <li className="flex items-center gap-2 text-slate-400">
                                <Car size={15} className="text-blue-500" />
                                Emergency Repair
                            </li>

                            <li className="flex items-center gap-2 text-slate-400">
                                <ShieldCheck size={15} className="text-blue-500" />
                                Vehicle Inspection
                            </li>

                            <li className="flex items-center gap-2 text-slate-400">
                                <Clock3 size={15} className="text-blue-500" />
                                24/7 Roadside Assistance
                            </li>

                            <li className="text-sm text-slate-500">
                                Battery Assistance
                                <span className="ml-2 rounded-full bg-orange-500/10 px-2 py-1 text-[10px] text-orange-400">
                                    COMING SOON
                                </span>
                            </li>

                            <li className="text-sm text-slate-500">
                                Towing Assistance
                                <span className="ml-2 rounded-full bg-orange-500/10 px-2 py-1 text-[10px] text-orange-400">
                                    COMING SOON
                                </span>
                            </li>

                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Get In Touch
                        </h3>

                        <div className="mt-6 space-y-5">

                            <div className="flex gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-500">
                                    <Phone size={17} />
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Call us
                                    </p>

                                    <a
                                        href="tel:+919999999999"
                                        className="text-sm text-slate-300 hover:text-blue-400"
                                    >
                                        +91 99999 99999
                                    </a>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-500">
                                    <Mail size={17} />
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Email
                                    </p>

                                    <a
                                        href="mailto:support@quickfix.com"
                                        className="text-sm text-slate-300 hover:text-blue-400"
                                    >
                                        support@quickfix.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-500">
                                    <MapPin size={17} />
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Location
                                    </p>

                                    <p className="text-sm text-slate-300">
                                        Delhi, India
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Emergency Button */}
                        <button
                            type="button"
                            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700"
                        >
                            Get Roadside Help
                            <ArrowRight size={17} />
                        </button>

                    </div>

                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-slate-800">

                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8">

                    <p className="text-slate-500">
                        © {new Date().getFullYear()} QuickFix. All rights reserved.
                    </p>

                    <div className="flex flex-wrap gap-5">

                        <a
                            href="/privacy-policy"
                            className="text-slate-500 transition hover:text-blue-400"
                        >
                            Privacy Policy
                        </a>

                        <a
                            href="/terms"
                            className="text-slate-500 transition hover:text-blue-400"
                        >
                            Terms & Conditions
                        </a>

                        <a
                            href="/refund-policy"
                            className="text-slate-500 transition hover:text-blue-400"
                        >
                            Refund Policy
                        </a>

                    </div>

                </div>

            </div>

        </footer>
    );
};

export default Footer;