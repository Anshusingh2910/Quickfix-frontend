import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://quick-fix-1.onrender.com";

console.log("🔥 API_URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
const getAccessToken = () => {
  return sessionStorage.getItem("accessToken");
};

const getRefreshToken = () => {
  return sessionStorage.getItem("refreshToken");
};
const getStoredUser = () => {
  try {
    const authUser = sessionStorage.getItem("authUser");

    if (authUser) {
      return JSON.parse(authUser);
    }

    const user = sessionStorage.getItem("user");

    if (user) {
      return JSON.parse(user);
    }

    return null;
  } catch (error) {
    console.error(
      "FAILED TO PARSE STORED USER:",
      error
    );

    return null;
  }
};
const getUserRole = () => {
  const storedRole =
    sessionStorage.getItem("authRole");

  if (
    storedRole === "user" ||
    storedRole === "mechanic" ||
    storedRole === "admin"
  ) {
    return storedRole;
  }

  const user = getStoredUser();

  if (
    user?.role === "user" ||
    user?.role === "mechanic" ||
    user?.role === "admin"
  ) {
    return user.role;
  }

  return null;
};
const getRefreshEndpoint = () => {
  const role = getUserRole();

  switch (role) {
    case "mechanic":
      return "/mechanic/refresh-token";

    case "admin":
      return "/admin/refresh-token";

    case "user":
      return "/user/refresh-token";

    default:
      return null;
  }
};
const publicAuthRoutes = [
  "/user/register",
  "/user/login",
  "/user/verify-otp",
  "/user/resend-otp",
  "/user/forgot-password",
  "/user/reset-password",

  "/mechanic/register",
  "/mechanic/login",
  "/mechanic/verify-otp",
  "/mechanic/resend-otp",
  "/mechanic/forgot-password",
  "/mechanic/reset-password",

  "/admin/register",
  "/admin/login",
  "/admin/verify-otp",
  "/admin/resend-otp",
  "/admin/forgot-password",
  "/admin/reset-password",
];

const isPublicAuthRoute = (url = "") => {
  return publicAuthRoutes.some((route) =>
    url.includes(route)
  );
};
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers =
        config.headers || {};
      config.headers.Authorization =
        accessToken;
    }

    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData
    ) {
      config.headers =
        config.headers || {};

      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;

let refreshSubscribers = [];
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};
const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach(
    (callback) => {
      callback(newAccessToken, null);
    }
  );
  refreshSubscribers = [];
};

const onRefreshFailed = (error) => {
  refreshSubscribers.forEach(
    (callback) => {
      callback(null, error);
    }
  );

  refreshSubscribers = [];
};

export const clearAuth = () => {
  sessionStorage.removeItem(
    "accessToken"
  );

  sessionStorage.removeItem(
    "refreshToken"
  );

  sessionStorage.removeItem(
    "authRole"
  );

  sessionStorage.removeItem(
    "authUser"
  );

  sessionStorage.removeItem(
    "user"
  );

  sessionStorage.removeItem(
    "verificationToken"
  );

  sessionStorage.removeItem(
    "mechanicVerificationToken"
  );

  sessionStorage.removeItem(
    "resetPasswordToken"
  );

  sessionStorage.removeItem(
    "pendingAuthRole"
  );

  sessionStorage.removeItem(
    "pendingAuthEmail"
  );

  window.dispatchEvent(
    new Event("authChanged")
  );
};
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest =
      error?.config;
    if (!error?.response) {
      return Promise.reject(error);
    }
    if (
      error.response.status !== 401
    ) {
      return Promise.reject(error);
    }
    if (!originalRequest) {
      return Promise.reject(error);
    }
    if (
      isPublicAuthRoute(
        originalRequest.url || ""
      )
    ) {
      return Promise.reject(error);
    }
    const refreshEndpoint =
      getRefreshEndpoint();
    if (!refreshEndpoint) {
      clearAuth();

      return Promise.reject(error);
    }
    if (
      originalRequest.url?.includes(
        refreshEndpoint
      )
    ) {
      clearAuth();

      return Promise.reject(error);
    }
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    if (isRefreshing) {
      return new Promise(
        (resolve, reject) => {
          subscribeTokenRefresh(
            (
              newAccessToken,
              refreshError
            ) => {
              if (refreshError) {
                reject(refreshError);
                return;
              }

              originalRequest.headers =
                originalRequest.headers || {};

              originalRequest.headers.Authorization =
                newAccessToken;

              resolve(
                api(originalRequest)
              );
            }
          );
        }
      );
    }
    isRefreshing = true;

    try {
      const refreshToken =
        getRefreshToken();
      if (!refreshToken) {
        throw new Error(
          "Refresh token not found. Please login again."
        );
      }

      const role = getUserRole();

      if (!role) {
        throw new Error(
          "Authentication role not found. Please login again."
        );
      }

      const endpoint =
        getRefreshEndpoint();
      if (!endpoint) {
        throw new Error("Refresh endpoint not found.");
      }
      const refreshResponse =
        await axios.post(
          `${API_URL}${endpoint}`,
          {},
          {
            headers: {
              Authorization:
                refreshToken,
              "Content-Type":
                "application/json",
            },
          }
        );

      const responseData =
        refreshResponse?.data || {};
      const newAccessToken =
        responseData?.accessToken ||
        responseData?.data?.accessToken ||
        responseData?.token ||
        responseData?.data?.token;
      const newRefreshToken =
        responseData?.refreshToken ||
        responseData?.data?.refreshToken;
      if (!newAccessToken) {
        throw new Error(
          "New access token was not received from server."
        );
      }
      sessionStorage.setItem(
        "accessToken",
        newAccessToken
      );

      if (newRefreshToken) {
        sessionStorage.setItem(
          "refreshToken",
          newRefreshToken
        );
      }
      onRefreshed(
        newAccessToken
      );
      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        newAccessToken;
      return api(
        originalRequest
      );
    } catch (refreshError) {
      console.error(
        "REFRESH TOKEN FAILED:",
        refreshError?.response?.data ||
        refreshError?.message ||
        refreshError
      );
      onRefreshFailed(
        refreshError
      );
      clearAuth();

      return Promise.reject(
        refreshError
      );
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;