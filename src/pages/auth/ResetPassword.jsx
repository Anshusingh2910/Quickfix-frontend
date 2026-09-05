import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    LockKeyhole,
    ShieldCheck,
    Sparkles,
    XCircle,
} from "lucide-react";

import { resetPassword } from "../../services/authApi";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const passwordRules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
    };

    const isStrongPassword =
        passwordRules.length &&
        passwordRules.uppercase &&
        passwordRules.lowercase &&
        passwordRules.number;

    const passwordsMatch =
        password.length > 0 &&
        confirmPassword.length > 0 &&
        password === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!token) {
            setError("Reset password link is invalid or expired.");
            return;
        }

        if (!isStrongPassword) {
            setError(
                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number."
            );
            return;
        }

        if (!passwordsMatch) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await resetPassword({
                token,
                newPassword: password,
            });

            setSuccess(
                "Password reset successfully. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1800);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    err?.message ||
                    "Unable to reset password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-8 relative overflow-hidden">

            {/* Background glow */}
            <div className="absolute -top-32 -left-32 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />

            <div className="relative w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-7">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 group"
                    >
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <span className="font-black text-lg">
                                QF
                            </span>
                        </div>

                        <span className="text-2xl font-black tracking-tight">
                            Quick<span className="text-blue-400">Fix</span>
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">

                    {/* Heading */}
                    <div className="mb-7">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/10 flex items-center justify-center mb-5">
                            <LockKeyhole
                                size={27}
                                className="text-blue-400"
                            />
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <h1 className="text-2xl sm:text-3xl font-bold">
                                Reset Password
                            </h1>

                            <Sparkles
                                size={19}
                                className="text-blue-400"
                            />
                        </div>

                        <p className="text-sm text-slate-400 leading-6">
                            Create a new secure password for your QuickFix
                            account.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 flex gap-3 items-start rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                            <XCircle
                                size={19}
                                className="text-red-400 mt-0.5 shrink-0"
                            />

                            <p className="text-sm text-red-300 leading-5">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="mb-5 flex gap-3 items-start rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                            <CheckCircle2
                                size={19}
                                className="text-emerald-400 mt-0.5 shrink-0"
                            />

                            <p className="text-sm text-emerald-300 leading-5">
                                {success}
                            </p>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                New Password
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                    className="w-full h-13 rounded-2xl bg-white/[0.05] border border-white/10 pl-11 pr-12 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>

                            {/* Password rules */}
                            {password && (
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <PasswordRule
                                        valid={passwordRules.length}
                                        text="8+ characters"
                                    />

                                    <PasswordRule
                                        valid={passwordRules.uppercase}
                                        text="Uppercase"
                                    />

                                    <PasswordRule
                                        valid={passwordRules.lowercase}
                                        text="Lowercase"
                                    />

                                    <PasswordRule
                                        valid={passwordRules.number}
                                        text="Number"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Confirm Password
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                    className={`w-full h-13 rounded-2xl bg-white/[0.05] border pl-11 pr-12 text-sm text-white placeholder:text-slate-600 outline-none transition focus:ring-4 ${
                                        confirmPassword
                                            ? passwordsMatch
                                                ? "border-emerald-500/50 focus:ring-emerald-500/10"
                                                : "border-red-500/50 focus:ring-red-500/10"
                                            : "border-white/10 focus:border-blue-500/60 focus:ring-blue-500/10"
                                    }`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>

                            {confirmPassword && (
                                <p
                                    className={`mt-2 text-xs ${
                                        passwordsMatch
                                            ? "text-emerald-400"
                                            : "text-red-400"
                                    }`}
                                >
                                    {passwordsMatch
                                        ? "✓ Passwords match"
                                        : "Passwords do not match"}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !password ||
                                !confirmPassword
                            }
                            className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-sm shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Resetting Password...
                                </span>
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                    </form>

                    {/* Security */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                        <ShieldCheck
                            size={16}
                            className="text-emerald-400"
                        />
                        Your password is securely protected
                    </div>
                </div>

                {/* Back */}
                <Link
                    to="/login"
                    className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition"
                >
                    <ArrowLeft size={16} />
                    Back to Login
                </Link>

                <p className="text-center text-xs text-slate-600 mt-5">
                    © {new Date().getFullYear()} QuickFix. All rights reserved.
                </p>
            </div>
        </div>
    );
};

const PasswordRule = ({ valid, text }) => (
    <div
        className={`flex items-center gap-1.5 text-xs ${
            valid
                ? "text-emerald-400"
                : "text-slate-500"
        }`}
    >
        <CheckCircle2 size={13} />
        {text}
    </div>
);

export default ResetPassword;