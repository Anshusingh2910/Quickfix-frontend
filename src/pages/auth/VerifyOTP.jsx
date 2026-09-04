import {
  useEffect,
  useRef,
  useState,
} from "react";

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

import {
  verifyOTP,
  resendOTP,
} from "../../services/authApi";

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

  const [loading, setLoading] =
    useState(false);

  const [resendLoading, setResendLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =====================================================
  // REFS
  // =====================================================

  const inputRefs = useRef([]);

  // =====================================================
  // FORGOT FLOW
  // =====================================================

  const isForgotPasswordFlow = () => {
    return (
      location.state?.flow ===
        "forgot-password" ||
      Boolean(
        sessionStorage.getItem(
          "passwordResetToken"
        )
      )
    );
  };

  // =====================================================
  // ROLE
  // =====================================================

  const getRole = () => {
    const forgot =
      isForgotPasswordFlow();

    const role = forgot
      ? location.state?.role ||
        sessionStorage.getItem(
          "passwordResetRole"
        )
      : location.state?.role ||
        sessionStorage.getItem(
          "pendingAuthRole"
        );

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
    const forgot =
      isForgotPasswordFlow();

    return forgot
      ? location.state?.email ||
          sessionStorage.getItem(
            "passwordResetEmail"
          ) ||
          ""
      : location.state?.email ||
          sessionStorage.getItem(
            "pendingAuthEmail"
          ) ||
          "";
  };

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    const forgot =
      isForgotPasswordFlow();

    if (forgot) {
      return (
        location.state?.resetToken ||
        sessionStorage.getItem(
          "passwordResetToken"
        ) ||
        ""
      );
    }

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

    const role = getRole();
    const email = getEmail();
    const token = getToken();

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
          ? "Invalid password reset account type."
          : "Invalid registration role."
      );

      return;
    }

    if (!email) {
      setError(
        forgot
          ? "Password reset email was not found."
          : "Registration email was not found."
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
      const updated = [...otp];

      updated[index] = "";

      setOtp(updated);

      return;
    }

    // ---------------------------------------------------
    // MULTIPLE DIGITS / PASTE
    // ---------------------------------------------------

    if (numericValue.length > 1) {
      const updated = [...otp];

      const numbers = numericValue
        .slice(0, 6 - index)
        .split("");

      numbers.forEach(
        (number, numberIndex) => {
          const targetIndex =
            index + numberIndex;

          if (targetIndex < 6) {
            updated[targetIndex] =
              number;
          }
        }
      );

      setOtp(updated);
      setError("");

      const nextIndex = Math.min(
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

    const updated = [...otp];

    updated[index] = numericValue;

    setOtp(updated);
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

    if (!pastedData) return;

    const updated = [
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
          updated[index] = number;
        }
      );

    setOtp(updated);
    setError("");

    const focusIndex = Math.min(
      pastedData.length,
      5
    );

    inputRefs.current[
      focusIndex
    ]?.focus();
  };

  // =====================================================
  // VERIFY
  // =====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const enteredOtp =
      otp.join("");

    if (enteredOtp.length !== 6) {
      setError(
        "Please enter the complete 6-digit OTP."
      );

      return;
    }

    const forgot =
      isForgotPasswordFlow();

    const role = getRole();
    const email = getEmail();
    const token = getToken();

    if (!role) {
      setError(
        "Invalid account type. Please request OTP again."
      );

      return;
    }

    if (!email) {
      setError(
        "Email was not found. Please request OTP again."
      );

      return;
    }

    if (!token) {
      setError(
        "Verification session has expired. Please request OTP again."
      );

      return;
    }

    try {
      setLoading(true);

      let response;

      // =================================================
      // MECHANIC
      // =================================================

      if (role === "mechanic") {
        response =
          await mechanicVerifyOTP(
            enteredOtp,
            token
          );
      }

      // =================================================
      // CUSTOMER
      // =================================================

      if (role === "user") {
        response =
          await verifyOTP(
            enteredOtp,
            token
          );
      }

      console.log(
        "OTP RESPONSE:",
        response
      );

      // =================================================
      // FORGOT PASSWORD
      // =================================================

      if (forgot) {
        sessionStorage.setItem(
          "passwordResetToken",
          token
        );

        sessionStorage.setItem(
          "passwordResetRole",
          role
        );

        sessionStorage.setItem(
          "passwordResetEmail",
          email
        );

        // Registration session clear

        sessionStorage.removeItem(
          "verificationToken"
        );

        sessionStorage.removeItem(
          "pendingAuthRole"
        );

        sessionStorage.removeItem(
          "pendingAuthEmail"
        );

        setSuccess(
          response?.message ||
            response?.data?.message ||
            "OTP verified successfully. You can now reset your password."
        );

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
        }, 800);

        return;
      }

      // =================================================
      // REGISTRATION SUCCESS
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

      sessionStorage.removeItem(
        "verificationToken"
      );

      sessionStorage.removeItem(
        "pendingAuthRole"
      );

      sessionStorage.removeItem(
        "pendingAuthEmail"
      );

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
      }, 1000);
    } catch (err) {
      console.error(
        "OTP VERIFY ERROR:",
        err
      );

      console.error(
        "SERVER:",
        err?.response?.data
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.data?.message ||
        err?.message ||
        "Invalid or expired OTP.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESEND
  // =====================================================

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");

    const forgot =
      isForgotPasswordFlow();

    if (forgot) {
      setError(
        "Please go back to Forgot Password and request a new OTP."
      );

      return;
    }

    const role = getRole();
    const token = getToken();

    if (!role || !token) {
      setError(
        "Verification session expired. Please register again."
      );

      return;
    }

    try {
      setResendLoading(true);

      let response;

      if (role === "mechanic") {
        response =
          await mechanicResendOTP(
            token
          );
      } else {
        response =
          await resendOTP(token);
      }

      console.log(
        "RESEND OTP:",
        response
      );

      const newToken =
        response?.verificationToken ||
        response?.token ||
        response?.data?.verificationToken ||
        response?.data?.token ||
        null;

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
          "A new OTP has been sent."
      );

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      console.error(
        "RESEND ERROR:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to resend OTP.";

      setError(message);
    } finally {
      setResendLoading(false);
    }
  };

  // =====================================================
  // UI DATA
  // =====================================================

  const role = getRole();
  const email = getEmail();
  const forgot =
    isForgotPasswordFlow();

  const isMechanic =
    role === "mechanic";

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
          {forgot ? (
            <KeyRound size={30} />
          ) : isMechanic ? (
            <Wrench size={30} />
          ) : (
            <ShieldCheck size={30} />
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

        <h1
          className="
            text-3xl
            font-extrabold
            tracking-tight
            text-slate-900
          "
        >
          {forgot
            ? "Verify reset OTP"
            : "Verify your account"}
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
          {forgot
            ? "We've sent a 6-digit OTP to your registered email. Verify it to continue resetting your password."
            : "We've sent a 6-digit verification code to your registered email address."}
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
            <Mail
              size={14}
              className="text-slate-400"
            />

            {email}
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
          <span>⚠</span>
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
          <CheckCircle2 size={18} />
          <p>{success}</p>
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

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
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                    disabled:opacity-60
                    sm:h-14
                    sm:w-12
                  "
                />
              )
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={
            loading ||
            resendLoading
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
            transition-all
            hover:bg-blue-700
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

              <CheckCircle2 size={18} />
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
        <Link
          to={
            forgot
              ? "/forgot-password"
              : "/login"
          }
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-slate-500
            hover:text-blue-600
          "
        >
          <ArrowLeft size={16} />

          {forgot
            ? "Back to forgot password"
            : "Back to login"}
        </Link>
      </div>

    </div>
  );
}

export default VerifyOTP;