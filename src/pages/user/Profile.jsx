import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Camera,
  CheckCircle2,
  Edit3,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import {
  getProfile,
  completeProfile,
} from "../../services/authApi";
function Profile() {
  const [userProfile, setUserProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  // Selected file - ONLY uploaded when Save Changes is clicked
  const [imageFile, setImageFile] = useState(null);
  // Existing server image / temporary browser preview
  const [imagePreview, setImagePreview] = useState("");

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",

    fullName: "",
    houseNo: "",
    area: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });

  const getErrorMessage = (err, fallback) => {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      fallback
    );
  };
  const setProfileData = (user) => {
    setUserProfile(user);

    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      fullName:
        user?.address?.fullName || "",
      houseNo:
        user?.address?.houseNo || "",
      area:
        user?.address?.area || "",
      city:
        user?.address?.city || "",
      state:
        user?.address?.state || "",
      country:
        user?.address?.country || "India",
      pincode:
        user?.address?.pincode || "",
    });
    setImagePreview(
      user?.profileImage?.url || ""
    );

    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getProfile();
      console.log("========== PROFILE RESPONSE ==========" );
      console.log(response);
      const user =
        response?.data?.data ||
        response?.data ||
        response;

      console.log(
        "PROFILE USER:",
        user
      );

      if (
        !user ||
        typeof user !== "object"
      ) {
        throw new Error(
          "Profile data not found."
        );
      }

      if (!user._id && !user.id && !user.email) {
        throw new Error(
          "Invalid profile data received."
        );
      }

      setProfileData(user);

    } catch (err) {
      console.error(
        "PROFILE LOAD ERROR:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Unable to load profile. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);
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
    setSuccess("");
  };
  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, JPEG and PNG images are allowed."
      );

      event.target.value = "";

      return;
    }
    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image size must be less than 5 MB."
      );
      event.target.value = "";
      return;
    }
    setImageFile(file);
    setError("");
    setSuccess("");
    setIsEditing(true);

    console.log(
      "IMAGE SELECTED:",
      {
        name: file.name,
        type: file.type,
        size: file.size,
      }
    );
  };
  const handleRemoveImage = () => {
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImagePreview(
      userProfile?.profileImage?.url || ""
    );
    setError("");
    setSuccess("");
  };
  const handleChooseImage = () => {
    if (saving) {
      return;
    }

    fileInputRef.current?.click();
  };
  const handleCancelEdit = () => {
    if (saving) {
      return;
    }
    setIsEditing(false);
    setError("");
    setSuccess("");
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (userProfile) {
      setFormData({
        name:
          userProfile?.name || "",

        phone:
          userProfile?.phone || "",

        fullName:
          userProfile?.address?.fullName || "",

        houseNo:
          userProfile?.address?.houseNo || "",

        area:
          userProfile?.address?.area || "",

        city:
          userProfile?.address?.city || "",

        state:
          userProfile?.address?.state || "",

        country:
          userProfile?.address?.country ||
          "India",

        pincode:
          userProfile?.address?.pincode || "",
      });
      setImagePreview(
        userProfile?.profileImage?.url || ""
      );
    }
  };
  const validateForm = () => {
    const name =
      formData.name.trim();

    const phone =
      formData.phone.trim();

    const fullName =
      formData.fullName.trim();

    const houseNo =
      formData.houseNo.trim();

    const area =
      formData.area.trim();

    const city =
      formData.city.trim();

    const state =
      formData.state.trim();

    const country =
      formData.country.trim();

    const pincode =
      formData.pincode.trim();

    if (!name) {
      return "Name is required.";
    }

    if (name.length < 2) {
      return "Name must contain at least 2 characters.";
    }

    if (!phone) {
      return "Phone number is required.";
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return "Phone number must be 10 digits.";
    }

    if (!fullName) {
      return "Address full name is required.";
    }

    if (!houseNo) {
      return "House / Flat number is required.";
    }

    if (!area) {
      return "Area is required.";
    }

    if (!city) {
      return "City is required.";
    }

    if (!state) {
      return "State is required.";
    }

    if (!country) {
      return "Country is required.";
    }

    if (!pincode) {
      return "Pincode is required.";
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      return "Pincode must be 6 digits.";
    }

    return null;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");
    setSuccess("");
    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      const data = new FormData();
      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "phone",
        formData.phone.trim()
      );
      const address = {
        fullName:
          formData.fullName.trim(),

        houseNo:
          formData.houseNo.trim(),

        area:
          formData.area.trim(),

        city:
          formData.city.trim(),

        state:
          formData.state.trim(),

        country:
          formData.country.trim() ||
          "India",

        pincode:
          formData.pincode.trim(),
      };

      data.append(
        "address",
        JSON.stringify(address)
      );

      if (imageFile instanceof File) {
        data.append(
          "profileImage",
          imageFile,
          imageFile.name
        );
      }
      console.log( "========== PROFILE UPDATE ==========");
      for (
        const [key, value]
        of data.entries()
      ) {
        console.log(
          key,
          value instanceof File
            ? {
                name: value.name,
                type: value.type,
                size: value.size,
              }
            : value
        );
      }
      const response =
        await completeProfile(data);

      console.log(
        "PROFILE UPDATE RESPONSE:",
        response
      );
      const updatedUser =
        response?.data?.data ||
        response?.data ||
        response;

      console.log(
        "UPDATED USER:",
        updatedUser
      );

      if (
        !updatedUser ||
        typeof updatedUser !== "object"
      ) {
        throw new Error(
          "Invalid response received from server."
        );
      }
      setUserProfile(
        (previous) => ({
          ...previous,
          ...updatedUser,
        })
      );
      setFormData({
        name:
          updatedUser?.name || "",

        phone:
          updatedUser?.phone || "",

        fullName:
          updatedUser?.address?.fullName ||
          "",

        houseNo:
          updatedUser?.address?.houseNo ||
          "",

        area:
          updatedUser?.address?.area ||
          "",

        city:
          updatedUser?.address?.city ||
          "",

        state:
          updatedUser?.address?.state ||
          "",

        country:
          updatedUser?.address?.country ||
          "India",

        pincode:
          updatedUser?.address?.pincode ||
          "",
      });
      const serverImage =
        updatedUser?.profileImage?.url ||
        "";

      setImagePreview(serverImage);
      setImageFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      try {
        const oldUser =
          JSON.parse(
            localStorage.getItem("user") ||
              "{}"
          );

        const newLocalUser = {
          ...oldUser,
          ...updatedUser,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(newLocalUser)
        );
      } catch (storageError) {
        console.warn(
          "LOCAL STORAGE UPDATE FAILED:",
          storageError
        );
      }
      window.dispatchEvent(
        new Event("authChanged")
      );
      setSuccess(
        response?.message ||
          "Profile updated successfully."
      );

      setIsEditing(false);

    } catch (err) {
      console.error(
        "PROFILE UPDATE ERROR:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Unable to update profile. Please try again."
        )
      );
      setImageFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setImagePreview(
        userProfile?.profileImage?.url || ""
      );

    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={32}
            className="animate-spin text-blue-600"
          />

          <p className="text-sm font-medium text-slate-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="mb-1 text-sm font-semibold text-blue-600">
              My Account
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Profile
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your personal information and address.
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setError("");
                setSuccess("");
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <Edit3 size={17} />
              Edit Profile
            </button>
          )}
        </div>
        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0"
            />

            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            <X
              size={19}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 p-6 sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

              {/* IMAGE */}

              <div className="relative shrink-0">

                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-50 shadow-md ring-1 ring-slate-200 sm:h-32 sm:w-32">

                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User
                      size={55}
                      className="text-blue-400"
                    />
                  )}

                </div>

                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={handleChooseImage}
                      disabled={saving}
                      className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      title="Change profile image"
                    >
                      <Camera size={17} />
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </>
                )}

              </div>

              {/* DETAILS */}

              <div className="min-w-0 flex-1">

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <h2 className="break-words text-xl font-bold text-slate-900">
                      {userProfile?.name ||
                        "User"}
                    </h2>

                    <p className="mt-1 break-all text-sm text-slate-500">
                      {userProfile?.email ||
                        ""}
                    </p>

                  </div>

                  {userProfile?.isVerified && (
                    <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                      <ShieldCheck size={15} />
                      Verified Account
                    </div>
                  )}

                </div>

                {isEditing && (
                  <p className="mt-4 text-xs leading-5 text-slate-500">
                    JPG, JPEG or PNG. Maximum image size 5 MB.
                    <br />
                    Image will be uploaded only after clicking Save Changes.
                  </p>
                )}

                {isEditing && imageFile && (
                  <div className="mt-3 flex items-center gap-3">

                    <span className="max-w-xs truncate text-xs font-medium text-slate-600">
                      {imageFile.name}
                    </span>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={saving}
                      className="text-xs font-semibold text-red-500 hover:text-red-600 disabled:opacity-50"
                    >
                      Remove
                    </button>

                  </div>
                )}

              </div>

            </div>

          </div>
          <div className="p-6 sm:p-8">

            <div className="mb-6">

              <div className="flex items-center gap-2">

                <User
                  size={19}
                  className="text-blue-600"
                />

                <h3 className="text-lg font-bold text-slate-900">
                  Personal Information
                </h3>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Your basic account information.
              </p>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* NAME */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing || saving}
                    placeholder="Enter your name"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-70"
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    value={
                      userProfile?.email || ""
                    }
                    disabled
                    className="h-12 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 pl-11 pr-4 text-sm text-slate-500 outline-none"
                  />

                </div>

              </div>

              {/* PHONE */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone Number
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing || saving}
                    placeholder="Enter 10 digit phone"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-70"
                  />

                </div>

              </div>

            </div>

          </div>
          <div className="border-t border-slate-100 p-6 sm:p-8">

            <div className="mb-6">

              <div className="flex items-center gap-2">

                <MapPin
                  size={19}
                  className="text-blue-600"
                />

                <h3 className="text-lg font-bold text-slate-900">
                  Address
                </h3>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Your delivery and service address.
              </p>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* ADDRESS FULL NAME */}

              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Address Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                  placeholder="Name for this address"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>

              {/* HOUSE */}

              <div>
                <label
                  htmlFor="houseNo"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  House / Flat Number
                </label>

                <input
                  id="houseNo"
                  name="houseNo"
                  value={formData.houseNo}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                  placeholder="House / Flat No."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>

              {/* AREA */}

              <div>
                <label
                  htmlFor="area"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Area
                </label>

                <input
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                  placeholder="Enter area"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>

              {/* CITY */}

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                  placeholder="Enter city"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>

              {/* STATE */}

              <div>
                <label
                  htmlFor="state"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  State
                </label>

                <input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                  placeholder="Enter state"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>

              {/* COUNTRY */}

              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                  placeholder="Country"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>

              <div>
                <label
                  htmlFor="pincode"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Pincode
                </label>

                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                  placeholder="6 digit pincode"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>

            </div>

          </div>
          {isEditing && (
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 p-6 sm:flex-row sm:justify-end sm:p-8">

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {saving ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />

                    Save Changes
                  </>
                )}

              </button>

            </div>
          )}

        </form>

      </div>
    </div>
  );
}

export default Profile;