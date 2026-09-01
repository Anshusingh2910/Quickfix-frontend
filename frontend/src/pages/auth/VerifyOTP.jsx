import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  Wrench,
  KeyRound,
} from "lucide-react";

import { verifyOTP } from "../../services/authApi";

import {
  mechanicVerifyOTP,
  mechanicResendOTP,
} from "../../services/mechanicApi";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // OTP
  // =====================================================

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  // =====================================================
  // UI
  // =====================================================

  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =====================================================
  // REFS
  // =====================================================

  const inputRefs = useRef([]);

  // =====================================================
  // FORGOT PASSWORD FLOW
  // =====================================================

  const isForgotPasswordFlow = () => {
    const stateFlow =
      location.state?.flow;

    const resetToken =
      sessionStorage.getItem(
        "passwordResetToken"
      );

    return (
      stateFlow === "forgot-password" ||
      Boolean(resetToken)
    );
  };

  // =====================================================
  // ROLE
  // =====================================================

  const getPendingRole = () => {
    // ---------------------------------------------------
    // FORGOT PASSWORD
    // ---------------------------------------------------

    if (isForgotPasswordFlow()) {
      const stateRole =
        location.state?.role;

      const sessionRole =
        sessionStorage.getItem(
          "passwordResetRole"
        );

      const role =
        stateRole || sessionRole;

      if (
        role !== "user" &&
        role !== "mechanic"
      ) {
        return null;
      }

      return role;
    }

    // ---------------------------------------------------
    // REGISTRATION
    // ---------------------------------------------------

    const stateRole =
      location.state?.role;

    const sessionRole =
      sessionStorage.getItem(
        "pendingAuthRole"
      );

    const role =
      stateRole || sessionRole;

    if (
      role !== "user" &&
      role !== "mechanic"
    ) {
      return null;
    }

    return role;
  };

  // =====================================================
  // EMAIL
  // =====================================================

  const getEmail = () => {
    // ---------------------------------------------------
    // FORGOT PASSWORD
    // ---------------------------------------------------

    if (isForgotPasswordFlow()) {
      return (
        location.state?.email ||
        sessionStorage.getItem(
          "passwordResetEmail"
        ) ||
        ""
      );
    }

    // ---------------------------------------------------
    // REGISTRATION
    // ---------------------------------------------------

    return (
      location.state?.email ||
      sessionStorage.getItem(
        "pendingAuthEmail"
      ) ||
      ""
    );
  };

  // =====================================================
  // TOKEN
  // =====================================================

  const getVerificationToken = () => {
    // ---------------------------------------------------
    // FORGOT PASSWORD
    // ---------------------------------------------------

    if (isForgotPasswordFlow()) {
      return (
        location.state?.resetToken ||
        location.state?.verificationToken ||
        sessionStorage.getItem(
          "passwordResetToken"
        ) ||
        sessionStorage.getItem(
          "verificationToken"
        ) ||
        ""
      );
    }

    // ---------------------------------------------------
    // REGISTRATION
    // ---------------------------------------------------

    return (
      location.state?.verificationToken ||
      sessionStorage.getItem(
        "verificationToken"
      ) ||
      ""
    );
  };

  // =====================================================
  // INITIAL CHECK
  // =====================================================

  useEffect(() => {
    const forgot =
      isForgotPasswordFlow();

    const token =
      getVerificationToken();

    const role =
      getPendingRole();

    const email =
      getEmail();

    console.log(
      "========== VERIFY OTP SESSION =========="
    );

    console.log(
      "Forgot Password:",
      forgot
    );

    console.log(
      "Role:",
      role
    );

    console.log(
      "Email:",
      email
    );

    console.log(
      "Token:",
      token
    );

    console.log(
      "========================================"
    );

    if (!token) {
      setError(
        forgot
          ? "Password reset session has expired. Please request OTP again."
          : "Verification session has expired. Please register again."
      );

      return;
    }

    if (!role) {
      setError(
        forgot
          ? "Invalid password reset account type. Please request OTP again."
          : "Invalid registration role. Please register again."
      );

      return;
    }

    if (!email) {
      setError(
        forgot
          ? "Password reset email was not found. Please request OTP again."
          : "Registration email was not found. Please register again."
      );

      return;
    }

    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  // =====================================================
  // OTP CHANGE
  // =====================================================

  const handleOtpChange = (
    index,
    value
  ) => {
    const numericValue =
      value.replace(/\D/g, "");

    if (!numericValue) {
      const updatedOtp = [...otp];

      updatedOtp[index] = "";

      setOtp(updatedOtp);

      return;
    }

    // ---------------------------------------------------
    // MULTIPLE DIGITS
    // ---------------------------------------------------

    if (numericValue.length > 1) {
      const updatedOtp = [...otp];

      const numbers =
        numericValue
          .slice(0, 6 - index)
          .split("");

      numbers.forEach(
        (number, numberIndex) => {
          const targetIndex =
            index + numberIndex;

          if (targetIndex < 6) {
            updatedOtp[targetIndex] =
              number;
          }
        }
      );

      setOtp(updatedOtp);
      setError("");

      const nextIndex =
        Math.min(
          index + numbers.length,
          5
        );

      inputRefs.current[
        nextIndex
      ]?.focus();

      return;
    }

    // ---------------------------------------------------
    // SINGLE DIGIT
    // ---------------------------------------------------

    const updatedOtp = [...otp];

    updatedOtp[index] =
      numericValue;

    setOtp(updatedOtp);

    setError("");

    if (index < 5) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  // =====================================================
  // KEY DOWN
  // =====================================================

  const handleKeyDown = (
    index,
    event
  ) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();
    }

    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < 5
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  // =====================================================
  // PASTE
  // =====================================================

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedData =
      event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

    if (!pastedData) {
      return;
    }

    const updatedOtp = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pastedData
      .split("")
      .forEach(
        (number, index) => {
          updatedOtp[index] =
            number;
        }
      );

    setOtp(updatedOtp);

    setError("");

    const focusIndex =
      Math.min(
        pastedData.length,
        5
      );

    inputRefs.current[
      focusIndex
    ]?.focus();
  };

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ---------------------------------------------------
    // OTP
    // ---------------------------------------------------

    const enteredOtp =
      otp.join("");

    if (enteredOtp.length !== 6) {
      setError(
        "Please enter the complete 6-digit OTP."
      );

      return;
    }

    // ---------------------------------------------------
    // FLOW
    // ---------------------------------------------------

    const forgot =
      isForgotPasswordFlow();

    // ---------------------------------------------------
    // ROLE
    // ---------------------------------------------------

    const role =
      getPendingRole();

    if (!role) {
      setError(
        forgot
          ? "Invalid password reset account type. Please request OTP again."
          : "Invalid registration role. Please register again."
      );

      return;
    }

    // ---------------------------------------------------
    // EMAIL
    // ---------------------------------------------------

    const email =
      getEmail();

    if (!email) {
      setError(
        forgot
          ? "Password reset email was not found. Please request OTP again."
          : "Registration email was not found. Please register again."
      );

      return;
    }

    // ---------------------------------------------------
    // TOKEN
    // ---------------------------------------------------

    const verificationToken =
      getVerificationToken();

    if (!verificationToken) {
      setError(
        forgot
          ? "Password reset session has expired. Please request OTP again."
          : "Verification session has expired. Please register again."
      );

      return;
    }

    try {
      setLoading(true);

      let response;

      // =================================================
      // FORGOT PASSWORD
      // =================================================

      if (forgot) {
        console.log(
          "VERIFYING PASSWORD RESET OTP"
        );

        console.log(
          "ROLE:",
          role
        );

        console.log(
          "OTP:",
          enteredOtp
        );

        console.log(
          "TOKEN:",
          verificationToken
        );

        // IMPORTANT:
        // Same verifyOTP service
        // token + otp + role

        response =
          await verifyOTP(
            enteredOtp,
            verificationToken,
            role
          );

        console.log(
          "PASSWORD RESET OTP RESPONSE:",
          response
        );

        // -------------------------------------------------
        // NEW TOKEN
        // -------------------------------------------------

        const newResetToken =
          response?.resetToken ||
          response?.data?.resetToken ||
          response?.data?.data?.resetToken ||
          response?.verificationToken ||
          response?.data?.verificationToken ||
          response?.data?.data?.verificationToken ||
          verificationToken;

        // -------------------------------------------------
        // KEEP RESET TOKEN
        // -------------------------------------------------

        sessionStorage.setItem(
          "passwordResetToken",
          newResetToken
        );

        sessionStorage.setItem(
          "passwordResetRole",
          role
        );

        sessionStorage.setItem(
          "passwordResetEmail",
          email
        );

        // -------------------------------------------------
        // REMOVE REGISTRATION SESSION ONLY
        // -------------------------------------------------

        sessionStorage.removeItem(
          "verificationToken"
        );

        sessionStorage.removeItem(
          "pendingAuthRole"
        );

        sessionStorage.removeItem(
          "pendingAuthEmail"
        );

        // -------------------------------------------------
        // SUCCESS
        // -------------------------------------------------

        setSuccess(
          response?.message ||
          response?.data?.message ||
          "OTP verified successfully. You can now reset your password."
        );

        // -------------------------------------------------
        // RESET PASSWORD
        // -------------------------------------------------

        setTimeout(() => {
          navigate(
            "/reset-password",
            {
              replace: true,
              state: {
                flow: "forgot-password",
                email,
                role,
              },
            }
          );
        }, 1000);

        return;
      }

      // =================================================
      // CUSTOMER REGISTRATION
      // =================================================

      if (role === "user") {
        console.log(
          "VERIFYING CUSTOMER OTP"
        );

        console.log(
          "API: /user/verify-otp"
        );

        response =
          await verifyOTP(
            enteredOtp,
            verificationToken
          );
      }

      // =================================================
      // MECHANIC REGISTRATION
      // =================================================

      if (role === "mechanic") {
        console.log(
          "VERIFYING MECHANIC OTP"
        );

        console.log(
          "API: /mechanic/verify-otp"
        );

        response =
          await mechanicVerifyOTP(
            enteredOtp,
            verificationToken
          );
      }

      console.log(
        "OTP VERIFICATION RESPONSE:",
        response
      );

      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(
        response?.message ||
        response?.data?.message ||
        `${
          role === "mechanic"
            ? "Mechanic"
            : "Customer"
        } account verified successfully.`
      );

      // =================================================
      // CLEAR REGISTRATION SESSION
      // =================================================

      sessionStorage.removeItem(
        "verificationToken"
      );

      sessionStorage.removeItem(
        "pendingAuthRole"
      );

      sessionStorage.removeItem(
        "pendingAuthEmail"
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
              verified: true,
            },
          }
        );
      }, 1200);

    } catch (err) {
      console.error(
        "OTP VERIFICATION ERROR:",
        err
      );

      console.error(
        "OTP RESPONSE ERROR:",
        err?.response?.data
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.data?.message ||
        err?.message ||
        "Invalid or expired OTP. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESEND OTP
  // =====================================================

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");

    const forgot =
      isForgotPasswordFlow();

    // ---------------------------------------------------
    // FORGOT PASSWORD
    // ---------------------------------------------------

    if (forgot) {
      setError(
        "Please go back to Forgot Password and request a new OTP."
      );

      return;
    }

    // ---------------------------------------------------
    // REGISTRATION
    // ---------------------------------------------------

    const role =
      getPendingRole();

    const email =
      getEmail();

    const token =
      getVerificationToken();

    if (
      !role ||
      !email ||
      !token
    ) {
      setError(
        "Registration session expired. Please register again."
      );

      return;
    }

    try {
      setResendLoading(true);

      let response;

      // -------------------------------------------------
      // CUSTOMER
      // -------------------------------------------------

      if (role === "user") {
        setError(
          "Customer resend OTP API ko authApi.js mein connect karo."
        );

        return;
      }

      // -------------------------------------------------
      // MECHANIC
      // -------------------------------------------------

      if (role === "mechanic") {
        response =
          await mechanicResendOTP(
            token
          );
      }

      console.log(
        "RESEND OTP RESPONSE:",
        response
      );

      // -------------------------------------------------
      // NEW TOKEN
      // -------------------------------------------------

      const newToken =
        response?.verificationToken ||
        response?.data?.verificationToken ||
        response?.data?.data?.verificationToken;

      if (newToken) {
        sessionStorage.setItem(
          "verificationToken",
          newToken
        );
      }

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      setSuccess(
        response?.message ||
        response?.data?.message ||
        "A new OTP has been sent to your email."
      );

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

    } catch (err) {
      console.error(
        "RESEND OTP ERROR:",
        err
      );

      console.error(
        "RESEND OTP RESPONSE:",
        err?.response?.data
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to resend OTP. Please try again.";

      setError(message);

    } finally {
      setResendLoading(false);
    }
  };

  // =====================================================
  // UI DATA
  // =====================================================

  const pendingRole =
    getPendingRole();

  const forgot =
    isForgotPasswordFlow();

  const isMechanic =
    pendingRole === "mechanic";

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full">

      {/* HEADER */}

      <div className="mb-8 text-center">

        {/* ICON */}

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
          {forgot ? (
            <KeyRound
              size={30}
              strokeWidth={1.8}
            />
          ) : isMechanic ? (
            <Wrench
              size={30}
              strokeWidth={1.8}
            />
          ) : (
            <ShieldCheck
              size={30}
              strokeWidth={1.8}
            />
          )}
        </div>

        {/* ROLE */}

        <div
          className="
            mb-2
            flex
            items-center
            justify-center
            gap-2
          "
        >
          {forgot ? (
            <KeyRound
              size={15}
              className="text-blue-600"
            />
          ) : isMechanic ? (
            <Wrench
              size={15}
              className="text-blue-600"
            />
          ) : (
            <UserCheck
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
            {forgot
              ? `${
                  isMechanic
                    ? "Mechanic"
                    : "Customer"
                } password reset`
              : isMechanic
              ? "Mechanic account verification"
              : "Customer account verification"}
          </span>
        </div>

        {/* TITLE */}

        <h1
          className="
            text-3xl
            font-extrabold
            tracking-tight
            text-slate-900
            sm:text-[34px]
          "
        >
          {forgot
            ? "Verify reset OTP"
            : "Verify your account"}
        </h1>

        {/* DESCRIPTION */}

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
          {forgot
            ? "We've sent a 6-digit OTP to your registered email. Verify it to continue resetting your password."
            : "We've sent a 6-digit verification code to your registered email address."}
        </p>

        {/* EMAIL */}

        {getEmail() && (
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
            <Mail
              size={14}
              className="text-slate-400"
            />

            <span>
              {getEmail()}
            </span>
          </div>
        )}

      </div>

      {/* ERROR */}

      {error && (
        <div
          className="
            mb-5
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-red-100
            bg-red-50
            px-4
            py-3
            text-sm
            font-medium
            text-red-600
          "
        >
          <span className="mt-0.5">
            ⚠
          </span>

          <p>{error}</p>
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

          <p>{success}</p>
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* OTP */}

        <div>

          <div
            className="
              mb-3
              flex
              items-center
              justify-between
            "
          >
            <label
              className="
                text-sm
                font-semibold
                text-slate-700
              "
            >
              {forgot
                ? "Enter reset OTP"
                : "Enter verification code"}
            </label>

            <span
              className="
                text-xs
                font-medium
                text-slate-400
              "
            >
              6 digits
            </span>
          </div>

          {/* OTP INPUTS */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              sm:gap-3
            "
            onPaste={handlePaste}
          >
            {otp.map(
              (value, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[
                      index
                    ] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(event) =>
                    handleOtpChange(
                      index,
                      event.target.value
                    )
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(
                      index,
                      event
                    )
                  }
                  disabled={
                    loading ||
                    resendLoading
                  }
                  aria-label={`OTP digit ${
                    index + 1
                  }`}
                  className="
                    h-12
                    w-11
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    text-center
                    text-lg
                    font-bold
                    text-slate-900
                    outline-none
                    transition-all
                    duration-200
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                    disabled:cursor-not-allowed
                    disabled:bg-slate-50
                    disabled:opacity-60
                    sm:h-14
                    sm:w-12
                  "
                />
              )
            )}
          </div>
        </div>

        {/* VERIFY */}

        <button
          type="submit"
          disabled={
            loading ||
            resendLoading
          }
          className="
            group
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
            duration-300
            hover:bg-blue-700
            hover:shadow-xl
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? (
            <>
              <RefreshCw
                size={17}
                className="animate-spin"
              />

              Verifying...
            </>
          ) : (
            <>
              {forgot
                ? "Verify & Continue"
                : "Verify OTP"}

              <CheckCircle2
                size={18}
                className="
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />
            </>
          )}
        </button>

      </form>

      {/* RESEND */}

      {!forgot && (
        <div className="mt-7 text-center">

          <p className="text-sm text-slate-500">
            Didn't receive the code?
          </p>

          <button
            type="button"
            onClick={
              handleResendOTP
            }
            disabled={
              loading ||
              resendLoading
            }
            className="
              mt-2
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-blue-600
              transition
              hover:text-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={15}
              className={
                resendLoading
                  ? "animate-spin"
                  : ""
              }
            />

            {resendLoading
              ? "Sending..."
              : "Resend OTP"}
          </button>

        </div>
      )}

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
        {forgot ? (
          <Link
            to="/forgot-password"
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

            Back to forgot password
          </Link>
        ) : (
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
        )}
      </div>

    </div>
  );
}

export default VerifyOTP;