import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Phone,
    User,
    UserRound,
    Wrench,
} from "lucide-react";

import { registerUser } from "../../services/authApi";
import { mechanicRegister } from "../../services/mechanicApi";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [role, setRole] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };
    const handlePhoneChange = (event) => {
        const value = event.target.value
            .replace(/\D/g, "")
            .slice(0, 10);
        setFormData((previous) => ({
            ...previous,
            phone: value,
        }));
        setError("");
        setSuccess("");
    };
    const handleRoleChange = (selectedRole) => {
        if (loading) return;

        setRole(selectedRole);
        setError("");
        setSuccess("");
    };
    const validateForm = () => {
        const name = formData.name.trim();
        const email = formData.email.trim().toLowerCase();
        const phone = formData.phone.trim();

        if (!role) {
            return "Please select Customer or Mechanic.";
        }

        if (!name) {
            return "Full name is required.";
        }

        if (name.length < 2) {
            return "Name must be at least 2 characters.";
        }

        if (!email) {
            return "Email is required.";
        }

        if (
            !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                email
            )
        ) {
            return "Please enter a valid email address.";
        }

        if (!phone) {
            return "Phone number is required.";
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            return "Please enter a valid 10-digit phone number.";
        }

        if (!formData.password) {
            return "Password is required.";
        }

        if (formData.password.length < 6) {
            return "Password must be at least 6 characters.";
        }

        if (!formData.confirmPassword) {
            return "Please confirm your password.";
        }

        if (
            formData.password !== formData.confirmPassword
        ) {
            return "Passwords do not match.";
        }

        if (!acceptedTerms) {
            return "Please accept the Terms & Conditions and Privacy Policy.";
        }

        return "";
    };
    const getResponseData = (response) => {
        return response?.data || response || {};
    };
    const getVerificationToken = (response) => {
        const data = getResponseData(response);

        return (
            response?.verificationToken ||
            data?.verificationToken ||
            response?.token ||
            data?.token ||
            data?.data?.verificationToken ||
            data?.data?.token ||
            null
        );
    };
    const getErrorMessage = (error) => {
        const backend = error?.response?.data;

        return (
            backend?.message ||
            backend?.error ||
            backend?.data?.message ||
            backend?.data?.error ||
            error?.message ||
            "Unable to create account. Please try again."
        );
    };
    const clearRegistrationSession = () => {
        sessionStorage.removeItem("verificationToken");
        sessionStorage.removeItem("mechanicVerificationToken");
        sessionStorage.removeItem("pendingAuthRole");
        sessionStorage.removeItem("pendingAuthEmail");
    };
    const saveVerificationSession = ({ token, role, email, }) => {
        clearRegistrationSession();
        sessionStorage.setItem(
            "verificationToken",
            token
        );
        sessionStorage.setItem(
            "pendingAuthRole",
            role
        );
        sessionStorage.setItem(
            "pendingAuthEmail",
            email
        );
        if (role === "mechanic") {
            sessionStorage.setItem(
                "mechanicVerificationToken",
                token
            );
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;

        setError("");
        setSuccess("");
        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            const data = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                password: formData.password,
            };

            let response;
            if (role === "user") {
                console.log(
                    "REGISTER: CUSTOMER REGISTRATION STARTED"
                );

                response = await registerUser(data);

                console.log(
                    "REGISTER: CUSTOMER RESPONSE:",
                    response
                );
            }
            if (role === "mechanic") {
                console.log(
                    "REGISTER: MECHANIC REGISTRATION STARTED"
                );

                response = await mechanicRegister(data);

                console.log(
                    "REGISTER: MECHANIC RESPONSE:",
                    response
                );
            }
            if (!response) {
                throw new Error(
                    "Unable to determine registration type."
                );
            }
            const verificationToken =
                getVerificationToken(response);

            console.log(
                "VERIFICATION TOKEN RECEIVED:",
                Boolean(verificationToken)
            );
            if (!verificationToken) {
                console.error(
                    "VERIFICATION TOKEN NOT FOUND:",
                    response
                );

                setError(
                    "Registration was successful, but the OTP verification session was not created. Please try again."
                );

                return;
            }
            saveVerificationSession({
                token: verificationToken,
                role,
                email: data.email,
            });

            console.log(
                "OTP SESSION SAVED:",
                {
                    role,
                    email: data.email,
                }
            );
            setSuccess(
                `${role === "mechanic"
                    ? "Mechanic"
                    : "Customer"
                } account created successfully. Redirecting to OTP verification...`
            );
            const otpRoute =
                role === "mechanic"
                    ? "/mechanic/verify-otp"
                    : "/verify-otp";
            navigate(otpRoute, {
                replace: true,
                state: {
                    email: data.email,
                    role,
                },
            });
        } catch (error) {
            console.error(
                "REGISTER ERROR:",
                error
            );

            console.error(
                "REGISTER ERROR RESPONSE:",
                error?.response?.data
            );

            const message =
                getErrorMessage(error);

            const lowerMessage =
                message.toLowerCase();
            if (
                lowerMessage.includes("email") &&
                (
                    lowerMessage.includes("exist") ||
                    lowerMessage.includes("already") ||
                    lowerMessage.includes("duplicate")
                )
            ) {
                setError(
                    "This email is already registered. Please login or use another email."
                );

                return;
            }

            if (
                (
                    lowerMessage.includes("phone") ||
                    lowerMessage.includes("mobile")
                ) &&
                (
                    lowerMessage.includes("exist") ||
                    lowerMessage.includes("already") ||
                    lowerMessage.includes("duplicate")
                )
            ) {
                setError(
                    "This phone number is already registered. Please use another number."
                );

                return;
            }

            if (
                lowerMessage.includes("account") &&
                (
                    lowerMessage.includes("exist") ||
                    lowerMessage.includes("already")
                )
            ) {
                setError(
                    "An account with these details already exists. Please login."
                );

                return;
            }

            setError(message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="w-full">
            <div className="mb-5">
                <p className="mb-1.5 text-sm font-semibold text-blue-600">
                    Get started
                </p>

                <h1 className="text-[28px] font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">
                    Create your account
                </h1>

                <p className="mt-2 max-w-lg text-sm leading-5 text-gray-500">
                    Join QuickFix and choose how you want to
                    use the platform.
                </p>
            </div>
            {success && (
                <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium leading-5 text-emerald-600">
                    {success}
                </div>
            )}
            {error && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-600">
                    {error}
                </div>
            )}
            <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Register as
                </label>

                <div className="grid grid-cols-2 gap-3">

                    {/* CUSTOMER */}

                    <button
                        type="button"
                        disabled={loading}
                        onClick={() =>
                            handleRoleChange("user")
                        }
                        className={`
              flex
              min-h-[90px]
              flex-col
              items-center
              justify-center
              gap-1.5
              rounded-xl
              border
              px-3
              py-3
              transition-all
              duration-200
              ${role === "user"
                                ? "border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-500/10"
                                : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-gray-50"
                            }
              disabled:cursor-not-allowed
              disabled:opacity-60
            `}
                    >
                        <div
                            className={`
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                ${role === "user"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-500"
                                }
              `}
                        >
                            <UserRound size={18} />
                        </div>

                        <span className="text-sm font-semibold">
                            Customer
                        </span>

                        <span className="text-[11px] text-gray-400">
                            Book vehicle services
                        </span>
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={() =>
                            handleRoleChange("mechanic")
                        }
                        className={`
              flex
              min-h-[90px]
              flex-col
              items-center
              justify-center
              gap-1.5
              rounded-xl
              border
              px-3
              py-3
              transition-all
              duration-200
              ${role === "mechanic"
                                ? "border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-500/10"
                                : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-gray-50"
                            }
              disabled:cursor-not-allowed
              disabled:opacity-60
            `}
                    >
                        <div
                            className={`
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                ${role === "mechanic"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-500"
                                }
              `}
                        >
                            <Wrench size={18} />
                        </div>

                        <span className="text-sm font-semibold">
                            Mechanic
                        </span>

                        <span className="text-[11px] text-gray-400">
                            Provide vehicle services
                        </span>
                    </button>
                </div>

                {role && (
                    <p className="mt-1.5 text-[11px] text-blue-600">
                        Registering as{" "}
                        <span className="font-semibold">
                            {role === "mechanic"
                                ? "Mechanic"
                                : "Customer"}
                        </span>
                    </p>
                )}
            </div>
            <form
                onSubmit={handleSubmit}
                className="space-y-3.5"
            >
                <div>
                    <label
                        htmlFor="name"
                        className="mb-1.5 block text-sm font-semibold text-gray-700"
                    >
                        Full name
                    </label>

                    <div className="relative">
                        <User
                            size={17}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            disabled={loading}
                            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                    </div>
                </div>

                {/* EMAIL */}

                <div>
                    <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-semibold text-gray-700"
                    >
                        Email address
                    </label>

                    <div className="relative">
                        <Mail
                            size={17}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                            disabled={loading}
                            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                    </div>
                </div>

                {/* PHONE */}

                <div>
                    <label
                        htmlFor="phone"
                        className="mb-1.5 block text-sm font-semibold text-gray-700"
                    >
                        Phone number
                    </label>

                    <div className="relative">
                        <Phone
                            size={17}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            placeholder="10-digit phone number"
                            autoComplete="tel"
                            disabled={loading}
                            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                    </div>
                </div>

                {/* PASSWORD */}

                <div>
                    <label
                        htmlFor="password"
                        className="mb-1.5 block text-sm font-semibold text-gray-700"
                    >
                        Password
                    </label>

                    <div className="relative">
                        <LockKeyhole
                            size={17}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            id="password"
                            name="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            autoComplete="new-password"
                            disabled={loading}
                            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    (previous) => !previous
                                )
                            }
                            disabled={loading}
                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                            {showPassword ? (
                                <EyeOff size={17} />
                            ) : (
                                <Eye size={17} />
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="mb-1.5 block text-sm font-semibold text-gray-700"
                    >
                        Confirm password
                    </label>

                    <div className="relative">
                        <LockKeyhole
                            size={17}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            disabled={loading}
                            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(
                                    (previous) => !previous
                                )
                            }
                            disabled={loading}
                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                            {showConfirmPassword ? (
                                <EyeOff size={17} />
                            ) : (
                                <Eye size={17} />
                            )}
                        </button>
                    </div>
                </div>

                <label className="flex cursor-pointer items-start gap-2.5 pt-0.5">
                    <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(event) =>
                            setAcceptedTerms(
                                event.target.checked
                            )
                        }
                        disabled={loading}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-blue-600"
                    />

                    <span className="text-[11px] leading-4.5 text-gray-500">
                        I agree to the{" "}
                        <span className="font-semibold text-blue-600">
                            Terms & Conditions
                        </span>{" "}
                        and{" "}
                        <span className="font-semibold text-blue-600">
                            Privacy Policy
                        </span>
                        .
                    </span>
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="group mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Creating account...
                        </>
                    ) : (
                        <>
                            <span>
                                {role === "mechanic"
                                    ? "Create Mechanic Account"
                                    : role === "user"
                                        ? "Create Customer Account"
                                        : "Create Account"}
                            </span>

                            <ArrowRight
                                size={17}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-5 border-t border-gray-100 pt-5 text-center">
                <p className="text-sm text-gray-500">
                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;