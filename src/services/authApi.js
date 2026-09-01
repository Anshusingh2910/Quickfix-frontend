import api from "./api";
export const loginUser = async (data) => {
  const response = await api.post(
    "/user/login",
    data
  );

  return response.data;
};
export const registerUser = async (data) => {
  const response = await api.post(
    "/user/register",
    data
  );

  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await api.post(
    "/user/forgot-password",
    data
  );

  return response.data;
};
export const verifyOTP = async (
  otp,
  token
) => {
  if (!token) {
    throw new Error(
      "Verification token is required."
    );
  }

  const response = await api.post(
    "/user/verify-otp",
    {
      otp,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};
export const resendOTP = async (
  token
) => {
  if (!token) {
    throw new Error(
      "Verification token is required."
    );
  }
  const response = await api.post(
    "/user/resend-otp",
    {},
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
};
export const resetPassword = async (data, token) => {
  if (!token) {
    throw new Error(
      "Reset password token is required."
    );
  }

  const response = await api.put(
    "/user/reset-password",
    data,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};
export const getProfile = async () => {
  const response = await api.get(
    "/user/profile"
  );

  return response.data;
};
export const completeProfile = async (
  formData
) => {
  if (!(formData instanceof FormData)) {
    throw new Error(
      "Profile update data must be FormData."
    );
  }

  const response = await api.put(
    "/user/complete-profile",
    formData
  );

  return response.data;
};
export const logoutUser = async () => {
  const response = await api.post(
    "/user/logout"
  );

  return response.data;
};
export const getMyVehicles = async () => {
  const response = await api.get("/vehicles/my");
  return response.data;
};
export const addVehicle = async (data) => {
  const response = await api.post(
    "/vehicles/add",
    data
  );

  return response.data;
};

export const updateVehicle = async (id, data) => {
  const response = await api.put(
    `/vehicles/update/${id}`,
    data
  );

  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await api.delete(
    `/vehicles/delete/${id}`
  );

  return response.data;
};