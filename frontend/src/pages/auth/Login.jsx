import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { loginUser } from "../../services/authApi";
import { mechanicLogin } from "../../services/mechanicApi";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");
  useEffect(() => {
    const state = location.state;

    if (state?.verified) {
      setSuccess(
        `${state.role === "mechanic"
          ? "Mechanic"
          : "Customer"
        } account verified successfully. Please login.`
      );
    }

    if (state?.email) {
      setFormData((previous) => ({
        ...previous,
        email: state.email,
      }));
    }

    if (state) {
      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, [
    location.state,
    location.pathname,
    navigate,
  ]);
  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };
  const validateForm = () => {
    const email =
      formData.email
        .trim()
        .toLowerCase();

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

    if (!formData.password) {
      return "Password is required.";
    }

    return "";
  };
  const extractAuthData = (response) => {
    const root =
      response || {};

    const data =
      root?.data || {};

    const nestedData =
      data?.data || {};

    const accessToken =
      root?.accessToken ||
      data?.accessToken ||
      nestedData?.accessToken ||
      root?.token ||
      data?.token ||
      nestedData?.token;

    const refreshToken =
      root?.refreshToken ||
      data?.refreshToken ||
      nestedData?.refreshToken;

    const user =
      root?.user ||
      data?.user ||
      nestedData?.user ||
      root?.data?.user;

    const isVerified =
      root?.isVerified ??
      data?.isVerified ??
      nestedData?.isVerified ??
      user?.isVerified;

    return {
      accessToken,
      refreshToken,
      user,
      isVerified,
    };
  };
  const saveAuthData = (
    response,
    role
  ) => {
    const {
      accessToken,
      refreshToken,
      user,
    } = extractAuthData(response);

    if (!accessToken) {
      throw new Error(
        "Login successful, but access token was not received from server."
      );
    }
    const authUser = {
      ...(user || {}),
      role,
    };
    sessionStorage.setItem(
      "accessToken",
      accessToken
    );

    if (refreshToken) {
      sessionStorage.setItem(
        "refreshToken",
        refreshToken
      );
    } else {
      sessionStorage.removeItem(
        "refreshToken"
      );
    }

    sessionStorage.setItem(
      "authRole",
      role
    );

    sessionStorage.setItem(
      "authUser",
      JSON.stringify(authUser)
    );

    sessionStorage.setItem(
      "user",
      JSON.stringify(authUser)
    );
    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "refreshToken"
    );

    localStorage.removeItem(
      "authRole"
    );

    localStorage.removeItem(
      "authUser"
    );

    localStorage.removeItem(
      "user"
    );
    window.dispatchEvent(
      new Event("authChanged")
    );
  };
  const getErrorMessage = (error) => {
    const backend =
      error?.response?.data;

    return (
      backend?.message ||
      backend?.error ||
      backend?.data?.message ||
      backend?.data?.error ||
      error?.message ||
      "Invalid email or password."
    );
  };
  const isNotUserAccountError = (
    error
  ) => {
    const status =
      error?.response?.status;

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.data?.message ||
      "";

    return (
      status === 403 &&
      message
        .toLowerCase()
        .includes(
          "not a user account"
        )
    );
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const loginData = {
      email: formData.email
        .trim()
        .toLowerCase(),
      password:
        formData.password,
    };
    let response = null;
    let role = null;
    try {
      try {
        console.log("LOGIN: Trying user login..."
        );
        response =
          await loginUser(
            loginData
          );
        role = "user";
        console.log(
          "LOGIN: User login successful."
        );
      } catch (userError) {
        if (
          !isNotUserAccountError(
            userError
          )
        ) {
          throw userError;
        }
        console.log(
          "LOGIN: Account is not a user. Trying mechanic login..."
        );
        try {
          response =
            await mechanicLogin(
              loginData
            );
          role = "mechanic";
          console.log(
            "LOGIN: Mechanic login successful."
          );
        } catch (mechanicError) {
          throw mechanicError;
        }
      }
      if (!response) {
        throw new Error(
          "No login response received."
        );
      }
      const {
        accessToken,
        user,
        isVerified,
      } =
        extractAuthData(
          response
        );
      if (!accessToken) {
        throw new Error(
          "Login response does not contain an access token."
        );
      }
      if (isVerified === false) {
        setError(
          "Your email is not verified. Please verify your OTP first."
        );

        return;
      }
      if (
        role !== "user" &&
        role !== "mechanic"
      ) {
        throw new Error(
          "Unable to determine account type."
        );
      }
      saveAuthData(
        response,
        role
      );
      sessionStorage.removeItem(
        "verificationToken"
      );

      sessionStorage.removeItem(
        "mechanicVerificationToken"
      );

      sessionStorage.removeItem(
        "pendingAuthRole"
      );

      sessionStorage.removeItem(
        "pendingAuthEmail"
      );

      sessionStorage.removeItem(
        "resetPasswordToken"
      );
      setSuccess(
        role === "mechanic"
          ? "Mechanic login successful."
          : "Customer login successful."
      );
      if (role === "mechanic") {
        navigate("/mechanic/dashboard", {
          replace: true,
        });
        return;
      }

      if (role === "user") {
        navigate("/", {
          replace: true,
        });
        return;
      }
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error?.response?.data ||
        error?.message ||
        error
      );

      setError(
        getErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-7">
        <p className="mb-2 text-sm font-semibold text-blue-600">
          Welcome back
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Enter your email and password to
          continue to QuickFix.
        </p>
      </div>
      {success && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0"
          />

          <p>{success}</p>
        </div>
      )}
      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-600">
          <span className="mt-0.5">
            ⚠
          </span>

          <p>{error}</p>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={18}
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
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <LockKeyhole
              size={18}
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
              value={
                formData.password
              }
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (previous) =>
                    !previous
                )
              }
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <RefreshCw
                size={17}
                className="animate-spin"
              />

              Signing in...
            </>
          ) : (
            <>
              <span>
                Sign in
              </span>

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </form>

      <div className="mt-7 border-t border-gray-100 pt-6 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Create account
          </Link>
        </p>
      </div>
      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
        <UserRound size={14} />

        <span>
          Customer or Mechanic — enter your
          registered email
        </span>
      </div>
    </div>
  );
}

export default Login;