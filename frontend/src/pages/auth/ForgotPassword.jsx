import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Mail,
  ArrowLeft,
  ShieldCheck,
  UserRound,
  Wrench,
  ArrowRight,
} from "lucide-react";

import { forgotPassword } from "../../services/authApi";
import { mechanicForgotPassword } from "../../services/mechanicApi";

function ForgotPassword() {
  const navigate = useNavigate();

  // =====================================================
  // ROLE
  // =====================================================

  const [resetType, setResetType] = useState("user");

  // =====================================================
  // FORM
  // =====================================================

  const [email, setEmail] = useState("");

  // =====================================================
  // STATE
  // =====================================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // CHANGE ROLE
  // =====================================================

  const handleResetTypeChange = (type) => {
    if (loading) return;

    setResetType(type);
    setError("");
    setSuccess("");
  };

  // =====================================================
  // EMAIL CHANGE
  // =====================================================

  const handleEmailChange = (event) => {
    setEmail(event.target.value);

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  // =====================================================
  // VALIDATE EMAIL
  // =====================================================

  const validateEmail = () => {
    const value = email.trim().toLowerCase();

    if (!value) {
      return "Email is required.";
    }

    if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
        value
      )
    ) {
      return "Please enter a valid email address.";
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

    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    const validationError = validateEmail();

    if (validationError) {
      setError(validationError);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // -----------------------------------------------------
    // EXPECTED ROLE
    // -----------------------------------------------------

    const expectedRole =
      resetType === "mechanic"
        ? "mechanic"
        : "user";

    try {
      setLoading(true);

      // ===================================================
      // CLEAR OLD PASSWORD RESET SESSION
      // ===================================================

      sessionStorage.removeItem(
        "passwordResetToken"
      );

      sessionStorage.removeItem(
        "passwordResetRole"
      );

      sessionStorage.removeItem(
        "passwordResetEmail"
      );

      // Registration data should not interfere
      sessionStorage.removeItem(
        "verificationToken"
      );

      sessionStorage.removeItem(
        "pendingAuthRole"
      );

      sessionStorage.removeItem(
        "pendingAuthEmail"
      );

      // ===================================================
      // CALL API
      // ===================================================

      let response;

      if (resetType === "mechanic") {
        console.log(
          "FORGOT PASSWORD: MECHANIC"
        );

        response =
          await mechanicForgotPassword({
            email: normalizedEmail,
          });
      } else {
        console.log(
          "FORGOT PASSWORD: CUSTOMER"
        );

        response =
          await forgotPassword({
            email: normalizedEmail,
          });
      }

      console.log(
        "FORGOT PASSWORD RESPONSE:",
        response
      );

      // ===================================================
      // GET TOKEN
      // ===================================================

      const resetToken =
        response?.resetToken ||
        response?.data?.resetToken ||
        response?.data?.data?.resetToken ||
        response?.verificationToken ||
        response?.data?.verificationToken ||
        response?.data?.data?.verificationToken ||
        null;

      console.log(
        "PASSWORD RESET TOKEN:",
        resetToken
      );

      // ===================================================
      // SAVE RESET SESSION
      // ===================================================

      if (resetToken) {
        sessionStorage.setItem(
          "passwordResetToken",
          resetToken
        );
      }

      sessionStorage.setItem(
        "passwordResetRole",
        expectedRole
      );

      sessionStorage.setItem(
        "passwordResetEmail",
        normalizedEmail
      );

      // ===================================================
      // SUCCESS
      // ===================================================

      const successMessage =
        response?.message ||
        response?.data?.message ||
        "OTP has been sent to your registered email.";

      setSuccess(successMessage);

      // ===================================================
      // GO TO VERIFY OTP
      // ===================================================

      navigate("/verify-otp", {
        replace: true,
        state: {
          flow: "forgot-password",
          email: normalizedEmail,
          role: expectedRole,
          resetToken,
        },
      });
    } catch (err) {
      console.error(
        "FORGOT PASSWORD ERROR:",
        err
      );

      console.error(
        "FORGOT PASSWORD RESPONSE:",
        err?.response?.data
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.data?.message ||
        err?.message ||
        "Unable to send OTP. Please try again.";

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
            text-gray-500
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
          <Mail size={27} />
        </div>

        <h1
          className="
            text-3xl
            font-bold
            tracking-tight
            text-gray-900
          "
        >
          Forgot password?
        </h1>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-gray-500
          "
        >
          Select your account type and enter your
          registered email address to receive an OTP.
        </p>
      </div>

      {/* ACCOUNT TYPE */}

      <div className="mb-6">

        <p
          className="
            mb-3
            text-sm
            font-semibold
            text-slate-700
          "
        >
          Reset password for
        </p>

        <div className="grid grid-cols-2 gap-3">

          {/* CUSTOMER */}

          <button
            type="button"
            onClick={() =>
              handleResetTypeChange("user")
            }
            disabled={loading}
            className={`
              flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              text-sm
              font-semibold
              transition-all
              ${
                resetType === "user"
                  ? "border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-500/10"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }
              disabled:cursor-not-allowed
              disabled:opacity-60
            `}
          >
            <UserRound size={18} />
            Customer
          </button>

          {/* MECHANIC */}

          <button
            type="button"
            onClick={() =>
              handleResetTypeChange("mechanic")
            }
            disabled={loading}
            className={`
              flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              text-sm
              font-semibold
              transition-all
              ${
                resetType === "mechanic"
                  ? "border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-500/10"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }
              disabled:cursor-not-allowed
              disabled:opacity-60
            `}
          >
            <Wrench size={18} />
            Mechanic
          </button>

        </div>
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
            rounded-xl
            border
            border-green-100
            bg-green-50
            px-4
            py-3
            text-sm
            font-medium
            leading-5
            text-green-600
          "
        >
          {success}
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* EMAIL */}

        <div>

          <label
            htmlFor="email"
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-gray-700
            "
          >
            {resetType === "mechanic"
              ? "Mechanic email address"
              : "Email address"}
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder={
                resetType === "mechanic"
                  ? "Enter mechanic email"
                  : "Enter your email"
              }
              autoComplete="email"
              disabled={loading}
              className="
                h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-11
                pr-4
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

          </div>
        </div>

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
          className="
            group
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
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? (
            "Sending OTP..."
          ) : (
            <>
              <span>
                Send OTP
              </span>

              <ArrowRight
                size={18}
                className="
                  transition-transform
                  duration-200
                  group-hover:translate-x-1
                "
              />
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

        Your account information is secure
      </div>

      {/* REGISTER */}

      <div
        className="
          mt-7
          border-t
          border-slate-100
          pt-6
          text-center
        "
      >
        {resetType === "mechanic" ? (
          <p className="text-sm text-slate-500">
            Don't have a mechanic account?{" "}

            <Link
              to="/mechanic/register"
              className="
                font-semibold
                text-blue-600
                hover:text-blue-700
              "
            >
              Become a Mechanic
            </Link>
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}

            <Link
              to="/register"
              className="
                font-semibold
                text-blue-600
                hover:text-blue-700
              "
            >
              Create account
            </Link>
          </p>
        )}
      </div>

    </div>
  );
}

export default ForgotPassword;