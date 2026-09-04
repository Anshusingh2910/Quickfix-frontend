import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Wrench,
  UserRound,
} from "lucide-react";

import {
  resetPassword,
} from "../../services/authApi";

import {
  mechanicResetPassword,
} from "../../services/mechanicApi";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // FORM
  // =====================================================

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  // =====================================================
  // UI
  // =====================================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =====================================================
  // SESSION
  // =====================================================

  const email =
    location.state?.email ||
    sessionStorage.getItem(
      "passwordResetEmail"
    ) ||
    "";

  const role =
    location.state?.role ||
    sessionStorage.getItem(
      "passwordResetRole"
    ) ||
    "";

  const resetToken =
    sessionStorage.getItem(
      "passwordResetToken"
    );

  const isMechanic =
    role === "mechanic";

  // =====================================================
  // INITIAL CHECK
  // =====================================================

  useEffect(() => {
    if (!resetToken) {
      setError(
        "Password reset session has expired. Please request OTP again."
      );
    }

    if (
      role !== "user" &&
      role !== "mechanic"
    ) {
      setError(
        "Invalid password reset account type. Please request OTP again."
      );
    }

    if (!email) {
      setError(
        "Password reset email was not found. Please request OTP again."
      );
    }
  }, [
    resetToken,
    role,
    email,
  ]);

  // =====================================================
  // PASSWORD CHANGE
  // =====================================================

  const handlePasswordChange = (
    event
  ) => {
    setPassword(
      event.target.value
    );

    setError("");
    setSuccess("");
  };

  // =====================================================
  // CONFIRM PASSWORD CHANGE
  // =====================================================

  const handleConfirmPasswordChange = (
    event
  ) => {
    setConfirmPassword(
      event.target.value
    );

    setError("");
    setSuccess("");
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ===================================================
    // SESSION VALIDATION
    // ===================================================

    if (!resetToken) {
      setError(
        "Password reset session has expired. Please request OTP again."
      );

      return;
    }

    if (
      role !== "user" &&
      role !== "mechanic"
    ) {
      setError(
        "Invalid password reset account type."
      );

      return;
    }

    if (!email) {
      setError(
        "Password reset email was not found."
      );

      return;
    }

    // ===================================================
    // PASSWORD VALIDATION
    // ===================================================

    if (!password) {
      setError(
        "Please enter your new password."
      );

      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );

      return;
    }

    if (!confirmPassword) {
      setError(
        "Please confirm your new password."
      );

      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    try {
      setLoading(true);

      let response;

      // =================================================
      // CUSTOMER
      // =================================================

      if (role === "user") {
        console.log(
          "RESETTING CUSTOMER PASSWORD"
        );

        response =
          await resetPassword(
            {
              password,
              confirmPassword,
            },
            resetToken
          );
      }

      // =================================================
      // MECHANIC
      // =================================================

      if (role === "mechanic") {
        console.log(
          "RESETTING MECHANIC PASSWORD"
        );

        response =
          await mechanicResetPassword(
            {
              password,
              confirmPassword,
            },
            resetToken
          );
      }

      console.log(
        "RESET PASSWORD RESPONSE:",
        response
      );

      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(
        response?.message ||
        response?.data?.message ||
        "Password changed successfully."
      );

      // =================================================
      // CLEAR RESET SESSION
      // =================================================

      sessionStorage.removeItem(
        "passwordResetToken"
      );

      sessionStorage.removeItem(
        "passwordResetRole"
      );

      sessionStorage.removeItem(
        "passwordResetEmail"
      );

      // =================================================
      // LOGIN
      // =================================================

      setTimeout(() => {
        navigate(
          "/login",
          {
            replace: true,
            state: {
              email,
              role,
              passwordReset: true,
            },
          }
        );
      }, 1200);

    } catch (err) {
      console.error(
        "RESET PASSWORD ERROR:",
        err
      );

      console.error(
        "RESET PASSWORD RESPONSE:",
        err?.response?.data
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.data?.message ||
        err?.message ||
        "Unable to reset password. Please try again.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full">

      {/* HEADER */}

      <div className="mb-8 text-center">

        <div
          className="
            mx-auto
            mb-5
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-blue-50
            text-blue-600
            shadow-sm
          "
        >
          {isMechanic ? (
            <Wrench
              size={30}
              strokeWidth={1.8}
            />
          ) : (
            <KeyRound
              size={30}
              strokeWidth={1.8}
            />
          )}
        </div>

        <div
          className="
            mb-2
            flex
            items-center
            justify-center
            gap-2
          "
        >
          {isMechanic ? (
            <Wrench
              size={15}
              className="text-blue-600"
            />
          ) : (
            <UserRound
              size={15}
              className="text-blue-600"
            />
          )}

          <span
            className="
              text-sm
              font-semibold
              text-blue-600
            "
          >
            {isMechanic
              ? "Mechanic password reset"
              : "Customer password reset"}
          </span>
        </div>

        <h1
          className="
            text-3xl
            font-extrabold
            tracking-tight
            text-slate-900
          "
        >
          Create new password
        </h1>

        <p
          className="
            mx-auto
            mt-3
            max-w-sm
            text-sm
            leading-6
            text-slate-500
          "
        >
          Enter a new password for your account.
        </p>

        {email && (
          <div
            className="
              mx-auto
              mt-4
              flex
              w-fit
              items-center
              gap-2
              rounded-lg
              bg-slate-50
              px-3
              py-2
              text-xs
              font-medium
              text-slate-600
            "
          >
            {isMechanic ? (
              <Wrench
                size={14}
                className="text-slate-400"
              />
            ) : (
              <UserRound
                size={14}
                className="text-slate-400"
              />
            )}

            <span>
              {email}
            </span>
          </div>
        )}

      </div>

      {/* ERROR */}

      {error && (
        <div
          className="
            mb-5
            rounded-xl
            border
            border-red-100
            bg-red-50
            px-4
            py-3
            text-sm
            font-medium
            leading-5
            text-red-600
          "
        >
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div
          className="
            mb-5
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-emerald-100
            bg-emerald-50
            px-4
            py-3
            text-sm
            font-medium
            text-emerald-600
          "
        >
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0"
          />

          <p>
            {success}
          </p>
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* PASSWORD */}

        <div>

          <label
            htmlFor="password"
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-slate-700
            "
          >
            New password
          </label>

          <div className="relative">

            <KeyRound
              size={18}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={
                handlePasswordChange
              }
              placeholder="Enter new password"
              autoComplete="new-password"
              disabled={loading}
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-11
                pr-12
                text-sm
                text-slate-900
                outline-none
                transition-all
                placeholder:text-slate-400
                hover:border-slate-300
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-500/10
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (value) => !value
                )
              }
              disabled={loading}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                p-1
                text-slate-400
                transition
                hover:text-slate-600
              "
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

          <p
            className="
              mt-2
              text-xs
              text-slate-400
            "
          >
            Password must be at least 8 characters.
          </p>

        </div>

        {/* CONFIRM PASSWORD */}

        <div>

          <label
            htmlFor="confirmPassword"
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-slate-700
            "
          >
            Confirm new password
          </label>

          <div className="relative">

            <KeyRound
              size={18}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              id="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={
                handleConfirmPasswordChange
              }
              placeholder="Confirm new password"
              autoComplete="new-password"
              disabled={loading}
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-11
                pr-12
                text-sm
                text-slate-900
                outline-none
                transition-all
                placeholder:text-slate-400
                hover:border-slate-300
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-500/10
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (value) => !value
                )
              }
              disabled={loading}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                p-1
                text-slate-400
                transition
                hover:text-slate-600
              "
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

        </div>

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={
            loading ||
            !resetToken ||
            !email ||
            !role
          }
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            px-5
            py-3.5
            text-sm
            font-semibold
            text-white
            shadow-lg
            shadow-blue-500/20
            transition-all
            duration-200
            hover:bg-blue-700
            hover:shadow-xl
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? (
            "Changing password..."
          ) : (
            <>
              Change password
              <CheckCircle2 size={18} />
            </>
          )}
        </button>

      </form>

      {/* SECURITY */}

      <div
        className="
          mt-7
          flex
          items-center
          justify-center
          gap-2
          text-xs
          text-gray-400
        "
      >
        <ShieldCheck
          size={14}
          className="text-blue-500"
        />

        Your password is securely encrypted
      </div>

      {/* BACK */}

      <div
        className="
          mt-7
          border-t
          border-slate-100
          pt-6
          text-center
        "
      >
        <Link
          to="/login"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-slate-500
            transition
            hover:text-blue-600
          "
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>

    </div>
  );
}

export default ResetPassword;