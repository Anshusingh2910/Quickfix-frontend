import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { resetPassword } from "../../services/authApi";
import { mechanicResetPassword } from "../../services/mechanicApi";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // ROLE
  // =====================================================

  const pendingRole =
    location.state?.role ||
    localStorage.getItem("pendingAuthRole") ||
    "user";

  const isMechanic = pendingRole === "mechanic";

  // =====================================================
  // FORM
  // =====================================================

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const { password, confirmPassword } = formData;

    if (!password) {
      return "New password is required.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      return "Please confirm your new password.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    // ===================================================
    // GET RESET / VERIFICATION TOKEN
    // ===================================================

    const resetToken =
      localStorage.getItem("verificationToken") ||
      localStorage.getItem("resetToken");

    if (!resetToken) {
      setError(
        "Password reset session has expired. Please request a new OTP."
      );
      return;
    }

    try {
      setLoading(true);

      const data = {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      // =================================================
      // ROLE BASED API
      // =================================================

      let response;

      if (isMechanic) {
        response = await mechanicResetPassword(
          data,
          resetToken
        );
      } else {
        response = await resetPassword(
          data,
          resetToken
        );
      }

      console.log(
        "RESET PASSWORD RESPONSE:",
        response
      );

      setSuccess(
        response?.message ||
          "Password reset successfully."
      );

      // =================================================
      // REMOVE RESET DATA
      // =================================================

      localStorage.removeItem("verificationToken");
      localStorage.removeItem("resetToken");
      localStorage.removeItem("pendingAuthRole");

      // =================================================
      // REDIRECT LOGIN
      // =================================================

      setTimeout(() => {
        navigate("/login", {
          state: {
            role: pendingRole,
            message:
              "Password reset successfully. Please login with your new password.",
          },
        });
      }, 1500);
    } catch (err) {
      console.error(
        "RESET PASSWORD ERROR:",
        err
      );

      console.error(
        "RESET PASSWORD RESPONSE ERROR:",
        err?.response?.data
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
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

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">

        <Link
          to="/login"
          className="
            mb-6
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-slate-500
            transition
            hover:text-blue-600
          "
        >
          <ArrowLeft size={16} />

          Back to login
        </Link>

        {/* ICON */}

        <div
          className="
            mb-5
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-blue-50
            text-blue-600
          "
        >
          <LockKeyhole
            size={27}
            strokeWidth={1.8}
          />
        </div>

        {/* ROLE */}

        <p className="mb-2 text-sm font-semibold text-blue-600">
          {isMechanic
            ? "Mechanic account"
            : "Customer account"}
        </p>

        {/* TITLE */}

        <h1
          className="
            text-3xl
            font-bold
            tracking-tight
            text-slate-900
          "
        >
          Create new password
        </h1>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-slate-500
          "
        >
          Create a strong new password for your{" "}
          {isMechanic ? "mechanic" : "customer"} account.
        </p>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

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

      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (
        <div
          className="
            mb-5
            flex
            items-start
            gap-2
            rounded-xl
            border
            border-emerald-100
            bg-emerald-50
            px-4
            py-3
            text-sm
            font-medium
            leading-5
            text-emerald-600
          "
        >
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>
        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >

        {/* =================================================
            NEW PASSWORD
        ================================================= */}

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

            <LockKeyhole
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
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={formData.password}
              onChange={handleChange}
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
                  (previous) => !previous
                )
              }
              disabled={loading}
              className="
                absolute
                right-2
                top-1/2
                flex
                h-8
                w-8
                -translate-y-1/2
                items-center
                justify-center
                rounded-lg
                text-slate-400
                transition
                hover:bg-slate-100
                hover:text-slate-600
              "
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

        </div>

        {/* =================================================
            CONFIRM PASSWORD
        ================================================= */}

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

            <LockKeyhole
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
              name="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={formData.confirmPassword}
              onChange={handleChange}
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
                  (previous) => !previous
                )
              }
              disabled={loading}
              className="
                absolute
                right-2
                top-1/2
                flex
                h-8
                w-8
                -translate-y-1/2
                items-center
                justify-center
                rounded-lg
                text-slate-400
                transition
                hover:bg-slate-100
                hover:text-slate-600
              "
              aria-label={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

        </div>

        {/* =================================================
            PASSWORD INFO
        ================================================= */}

        <div
          className="
            rounded-xl
            border
            border-slate-100
            bg-slate-50
            px-4
            py-3
          "
        >
          <p className="text-xs leading-5 text-slate-500">
            Password must contain at least 6
            characters.
          </p>
        </div>

        {/* =================================================
            SUBMIT
        ================================================= */}

        <button
          type="submit"
          disabled={loading}
          className="
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            px-5
            text-sm
            font-semibold
            text-white
            shadow-lg
            shadow-blue-600/20
            transition-all
            duration-200
            hover:bg-blue-700
            hover:shadow-xl
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? (
            "Resetting password..."
          ) : (
            <>
              <span>
                Reset Password
              </span>

              <CheckCircle2 size={18} />
            </>
          )}
        </button>

      </form>

      {/* =================================================
          SECURITY
      ================================================= */}

      <div
        className="
          mt-7
          flex
          items-center
          justify-center
          gap-2
          text-xs
          text-slate-400
        "
      >
        <ShieldCheck
          size={14}
          className="text-blue-500"
        />

        Your account information is secure
      </div>

    </div>
  );
}

export default ResetPassword;