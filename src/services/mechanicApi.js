import api from "./api";

export const mechanicRegister = async (data) => {
    const response = await api.post("/mechanic/register", data);
    return response.data;
};

export const mechanicLogin = async (data) => {
    const response = await api.post("/mechanic/login", data);
    return response.data;
};

export const refreshMechanicToken = async (refreshToken) => {
    const response = await api.post(
        "/mechanic/refresh-token",
        null,
        {
            headers: {
                Authorization: refreshToken,
            },
        }
    );

    return response.data;
};

export const mechanicVerifyOTP = async (otp, token) => {
    const response = await api.post(
        "/mechanic/verify-otp",
        { otp },
        {
            headers: {
                Authorization: token,
            },
        }
    );

    return response.data;
};

export const mechanicResendOTP = async (token) => {
    const response = await api.post(
        "/mechanic/resend-otp",
        null,
        {
            headers: {
                Authorization: token,
            },
        }
    );

    return response.data;
};

export const mechanicForgotPassword = async (data) => {
    const response = await api.post(
        "/mechanic/forgot-password",
        data
    );

    return response.data;
};

export const mechanicResetPassword = async (data, token) => {
    const response = await api.put(
        "/mechanic/reset-password",
        data,
        {
            headers: {
                Authorization: token,
            },
        }
    );

    return response.data;
};

export const getMechanicProfile = async () => {
    const response = await api.get("/mechanic/profile");
    return response.data;
};

export const completeMechanicProfile = async (formData) => {
    if (!(formData instanceof FormData)) {
        throw new Error("Mechanic profile data must be FormData.");
    }

    const response = await api.put(
        "/mechanic/complete-profile",
        formData
    );

    return response.data;
};

export const updateMechanicProfile = async (formData) => {
    if (!(formData instanceof FormData)) {
        throw new Error("Mechanic profile data must be FormData.");
    }

    const response = await api.put(
        "/mechanic/updateProfile",
        formData
    );

    return response.data;
};

export const submitMechanicKYC = async (formData) => {
    if (!(formData instanceof FormData)) {
        throw new Error("KYC data must be FormData.");
    }

    const response = await api.put(
        "/mechanic/submitKYC",
        formData
    );

    return response.data;
};
export const startKYC = async () => {
    const response = await api.post("/mechanic/startKYC");

    return response.data;
};

export const updateMechanicBankDetails = async (data) => {
    const response = await api.post(
        "/mechanic/updateBankDetails",
        data
    );

    return response.data;
};

export const mechanicLogout = async () => {
    const response = await api.post("/mechanic/logout");
    return response.data;
};

export const deleteMechanicAccount = async () => {
    const response = await api.delete("/mechanic/delete");
    return response.data;
};

export const getMechanicDashboard = async () => {
    const response = await api.get("/mechanic/dashboard");
    return response.data;
};

export const getMechanicBookings = async () => {
    const response = await api.get("/mechanic/bookings");
    return response.data;
};
export const updateBankDetails = async (bankData) => {
    const response = await api.post(
        "/mechanic/updateBankDetails",
        bankData,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
};

export const startMechanicBooking = async (bookingId) => {
    const response = await api.put(
        `/mechanic/bookings/${bookingId}/start`
    );

    return response.data;
};