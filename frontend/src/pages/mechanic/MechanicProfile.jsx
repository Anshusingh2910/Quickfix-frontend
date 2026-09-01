import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Camera,
  Check,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Navigation,
  Save,
  ShieldCheck,
  Store,
  Upload,
  User,
  Wrench,
  X,
  BriefcaseBusiness,
  FileText,
  MapPinned,
  LocateFixed,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Landmark,
  CreditCard,
  Search,
} from "lucide-react";

import {
  getMechanicProfile,
  completeMechanicProfile,
  updateMechanicProfile,
  updateBankDetails,
} from "../../services/mechanicApi";

function MechanicProfile() {
  const navigate = useNavigate();

  const profileImageRef = useRef(null);
  const shopImageRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [checkingIFSC, setCheckingIFSC] = useState(false);

  const [profileExists, setProfileExists] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const [shopImage, setShopImage] = useState(null);

  const [profilePreview, setProfilePreview] = useState("");
  const [shopPreview, setShopPreview] = useState("");

  const [formData, setFormData] = useState({
    // Workshop
    shopName: "",
    experience: "",
    specialization: [],
    description: "",
    serviceArea: "10",

    // Address
    fullName: "",
    houseNo: "",
    area: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",

    // Location
    latitude: "",
    longitude: "",

    // Bank
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    upiId: "",
  });

  const [bankSuggestions] = useState([
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "Indian Bank",
    "Bank of India",
    "Kotak Mahindra Bank",
    "IDBI Bank",
    "IndusInd Bank",
    "Yes Bank",
    "Federal Bank",
    "IDFC FIRST Bank",
    "AU Small Finance Bank",
    "Punjab & Sind Bank",
    "UCO Bank",
    "Central Bank of India",
  ]);

  const specializationOptions = [
    "General Service",
    "Engine Repair",
    "Oil Change",
    "Brake Repair",
    "Tyre Service",
    "Battery Service",
    "AC Repair",
    "Electrical Repair",
    "Clutch Repair",
    "Suspension",
    "Car Washing",
    "Bike Repair",
    "Diagnostic",
    "Emergency Repair",
  ];

  // ============================================================
  // LOAD PROFILE
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setFetching(true);
        setError("");

        const response = await getMechanicProfile();

        console.log(
          "MECHANIC PROFILE RESPONSE:",
          response
        );

        if (!mounted) return;

        const mechanic = response?.data;

        if (!mechanic) {
          setProfileExists(false);
          return;
        }

        setProfileExists(true);

        const user = mechanic?.user || {};
        const address = user?.address || {};
        const bank = mechanic?.bankDetails || {};

        setFormData({
          // Workshop
          shopName: mechanic?.shopName || "",

          experience:
            mechanic?.experience !== undefined &&
              mechanic?.experience !== null
              ? String(mechanic.experience)
              : "",

          specialization: Array.isArray(
            mechanic?.specialization
          )
            ? mechanic.specialization
            : [],

          description: mechanic?.description || "",

          serviceArea:
            mechanic?.serviceArea !== undefined &&
              mechanic?.serviceArea !== null
              ? String(mechanic.serviceArea)
              : "10",

          // Address
          fullName:
            address?.fullName ||
            user?.name ||
            "",

          houseNo: address?.houseNo || "",
          area: address?.area || "",
          city: address?.city || "",
          state: address?.state || "",
          country:
            address?.country || "India",
          pincode:
            address?.pincode || "",

          // Location
          latitude:
            mechanic?.location?.coordinates?.[1] ??
            "",

          longitude:
            mechanic?.location?.coordinates?.[0] ??
            "",

          // Bank
          accountHolderName:
            bank?.accountHolderName || "",

          accountNumber:
            bank?.accountNumber || "",

          confirmAccountNumber:
            bank?.accountNumber || "",

          ifscCode:
            bank?.ifscCode || "",

          bankName:
            bank?.bankName || "",

          branchName:
            bank?.branchName || "",

          upiId:
            bank?.upiId || "",
        });

        const profileUrl =
          mechanic?.profileImage?.url ||
          mechanic?.profileImage ||
          mechanic?.documents?.profileImage?.url ||
          mechanic?.documents?.profileImage ||
          "";

        const shopUrl =
          mechanic?.shopImage?.url ||
          mechanic?.shopImage ||
          mechanic?.documents?.shopImage?.url ||
          mechanic?.documents?.shopImage ||
          "";

        setProfilePreview(profileUrl);
        setShopPreview(shopUrl);
      } catch (err) {
        console.error(
          "GET MECHANIC PROFILE ERROR:",
          err
        );

        if (!mounted) return;

        if (err?.response?.status === 404) {
          setProfileExists(false);
        } else {
          setError(
            err?.response?.data?.message ||
            "Unable to load mechanic profile."
          );
        }
      } finally {
        if (mounted) {
          setFetching(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ============================================================
  // SPECIALIZATION
  // ============================================================

  const toggleSpecialization = (item) => {
    setFormData((previous) => {
      const exists =
        previous.specialization.includes(item);

      return {
        ...previous,

        specialization: exists
          ? previous.specialization.filter(
            (value) => value !== item
          )
          : [
            ...previous.specialization,
            item,
          ],
      };
    });

    setError("");
    setSuccess("");
  };

  // ============================================================
  // PROFILE IMAGE
  // ============================================================

  const handleProfileImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid profile image."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile image must be less than 5MB."
      );
      return;
    }

    setProfileImage(file);

    const preview =
      URL.createObjectURL(file);

    setProfilePreview(preview);

    setError("");
    setSuccess("");
  };

  // ============================================================
  // SHOP IMAGE
  // ============================================================

  const handleShopImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid shop image."
      );
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError(
        "Shop image must be less than 8MB."
      );
      return;
    }

    setShopImage(file);

    const preview =
      URL.createObjectURL(file);

    setShopPreview(preview);

    setError("");
    setSuccess("");
  };

  // ============================================================
  // GPS
  // ============================================================

  const getCurrentLocation = () => {
    setError("");
    setSuccess("");

    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setFormData((previous) => ({
          ...previous,
          latitude: String(latitude),
          longitude: String(longitude),
        }));

        setGettingLocation(false);

        setSuccess(
          "Current GPS location captured successfully."
        );
      },

      (locationError) => {
        console.error(
          "LOCATION ERROR:",
          locationError
        );

        setGettingLocation(false);

        if (
          locationError.code ===
          locationError.PERMISSION_DENIED
        ) {
          setError(
            "Location permission denied. Please allow location access."
          );
          return;
        }

        if (
          locationError.code ===
          locationError.POSITION_UNAVAILABLE
        ) {
          setError(
            "Your current location is unavailable."
          );
          return;
        }

        if (
          locationError.code ===
          locationError.TIMEOUT
        ) {
          setError(
            "Location request timed out."
          );
          return;
        }

        setError(
          "Unable to get your current location."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // ============================================================
  // IFSC LOOKUP
  // ============================================================

  const fetchBankByIFSC = async (ifsc) => {
    const cleanIFSC = ifsc
      .trim()
      .toUpperCase();

    if (
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(
        cleanIFSC
      )
    ) {
      return;
    }

    try {
      setCheckingIFSC(true);
      setError("");

      const response = await fetch(
        `https://ifsc.razorpay.com/${cleanIFSC}`
      );

      if (!response.ok) {
        throw new Error(
          "Invalid IFSC code."
        );
      }

      const bankData =
        await response.json();

      console.log(
        "IFSC BANK DATA:",
        bankData
      );

      setFormData((previous) => ({
        ...previous,

        ifscCode: cleanIFSC,

        bankName:
          bankData?.BANK ||
          previous.bankName,

        branchName:
          bankData?.BRANCH ||
          previous.branchName,
      }));

      setSuccess(
        `${bankData?.BANK || "Bank"} - ${bankData?.BRANCH || "Branch"
        } found successfully.`
      );
    } catch (err) {
      console.error(
        "IFSC LOOKUP ERROR:",
        err
      );

      setError(
        "Unable to find bank details from this IFSC code."
      );

      setFormData((previous) => ({
        ...previous,
        bankName: "",
        branchName: "",
      }));
    } finally {
      setCheckingIFSC(false);
    }
  };

  const handleIFSCChange = (event) => {
    const value = event.target.value
      .toUpperCase()
      .replace(/\s/g, "")
      .slice(0, 11);

    setFormData((previous) => ({
      ...previous,
      ifscCode: value,
    }));

    setError("");
    setSuccess("");

    if (value.length === 11) {
      fetchBankByIFSC(value);
    }
  };

  // ============================================================
  // FORM VALIDATION
  // ============================================================

  const validateProfile = () => {
    if (!formData.shopName.trim()) {
      return "Workshop / shop name is required.";
    }

    if (
      formData.experience === "" ||
      Number(formData.experience) < 0
    ) {
      return "Please enter valid experience.";
    }

    if (
      Number(formData.experience) > 60
    ) {
      return "Experience cannot be more than 60 years.";
    }

    if (
      !formData.specialization.length
    ) {
      return "Please select at least one specialization.";
    }

    if (
      !formData.description.trim()
    ) {
      return "Workshop description is required.";
    }

    if (
      !formData.serviceArea ||
      Number(formData.serviceArea) <= 0
    ) {
      return "Please enter a valid service area.";
    }

    if (
      Number(formData.serviceArea) > 100
    ) {
      return "Service area cannot be more than 100 KM.";
    }

    // Address

    if (!formData.fullName.trim()) {
      return "Full name is required.";
    }

    if (!formData.houseNo.trim()) {
      return "House / street is required.";
    }

    if (!formData.area.trim()) {
      return "Area is required.";
    }

    if (!formData.city.trim()) {
      return "City is required.";
    }

    if (!formData.state.trim()) {
      return "State is required.";
    }

    if (!formData.country.trim()) {
      return "Country is required.";
    }

    if (
      !/^[0-9]{6}$/.test(
        formData.pincode.trim()
      )
    ) {
      return "Please enter a valid 6-digit pincode.";
    }

    // GPS

    if (
      !formData.latitude ||
      !formData.longitude
    ) {
      return "Please capture your current GPS location.";
    }

    // Profile image

    if (!profilePreview) {
      return "Please upload your profile photo.";
    }

    return "";
  };

  // ============================================================
  // BANK VALIDATION
  // ============================================================

  const validateBank = () => {
    if (
      !formData.accountHolderName.trim()
    ) {
      return "Account holder name is required.";
    }

    if (
      !/^[0-9]{9,18}$/.test(
        formData.accountNumber.trim()
      )
    ) {
      return "Please enter a valid bank account number.";
    }

    if (
      formData.accountNumber.trim() !==
      formData.confirmAccountNumber.trim()
    ) {
      return "Bank account numbers do not match.";
    }

    if (
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(
        formData.ifscCode
          .trim()
          .toUpperCase()
      )
    ) {
      return "Please enter a valid IFSC code.";
    }

    if (!formData.bankName.trim()) {
      return "Bank name is required.";
    }

    if (!formData.branchName.trim()) {
      return "Bank branch could not be detected.";
    }

    return "";
  };

  // ============================================================
  // SAVE PROFILE + BANK
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // -----------------------------
    // PROFILE VALIDATION
    // -----------------------------

    const profileError =
      validateProfile();

    if (profileError) {
      setError(profileError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // -----------------------------
    // BANK VALIDATION
    // -----------------------------

    const bankError =
      validateBank();

    if (bankError) {
      setError(bankError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setLoading(true);

      // ========================================================
      // 1. PROFILE FORM DATA
      // ========================================================

      const data = new FormData();

      data.append(
        "shopName",
        formData.shopName.trim()
      );

      data.append(
        "experience",
        String(
          Number(formData.experience)
        )
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "serviceArea",
        String(
          Number(formData.serviceArea)
        )
      );

      formData.specialization.forEach(
        (item) => {
          data.append(
            "specialization",
            item
          );
        }
      );

      // Address

      data.append(
        "fullName",
        formData.fullName.trim()
      );

      data.append(
        "houseNo",
        formData.houseNo.trim()
      );

      data.append(
        "area",
        formData.area.trim()
      );

      data.append(
        "city",
        formData.city.trim()
      );

      data.append(
        "state",
        formData.state.trim()
      );

      data.append(
        "country",
        formData.country.trim()
      );

      data.append(
        "pincode",
        formData.pincode.trim()
      );

      // GPS

      data.append(
        "latitude",
        formData.latitude
      );

      data.append(
        "longitude",
        formData.longitude
      );

      // Images

      if (profileImage) {
        data.append(
          "profileImage",
          profileImage
        );
      }

      if (shopImage) {
        data.append(
          "shopImage",
          shopImage
        );
      }

      console.log(
        "PROFILE EXISTS:",
        profileExists
      );

      // ========================================================
      // 2. SAVE PROFILE
      // ========================================================

      let profileResponse;

      if (profileExists) {
        profileResponse =
          await updateMechanicProfile(
            data
          );
      } else {
        profileResponse =
          await completeMechanicProfile(
            data
          );
      }

      console.log(
        "PROFILE SAVE RESPONSE:",
        profileResponse
      );

      // ========================================================
      // 3. SAVE BANK SEPARATELY
      // ========================================================
      //
      // IMPORTANT:
      // updateBankDetails expects JSON req.body.
      // Do NOT send FormData here.
      //
      // ========================================================

      const bankPayload = {
        accountHolderName:
          formData.accountHolderName.trim(),

        accountNumber:
          formData.accountNumber.trim(),

        ifscCode:
          formData.ifscCode
            .trim()
            .toUpperCase(),

        bankName:
          formData.bankName.trim(),

        branchName:
          formData.branchName.trim(),

        upiId:
          formData.upiId.trim(),
      };
      console.log(
        "BANK PAYLOAD:",
        bankPayload
      );

      const bankResponse =
        await updateBankDetails(
          bankPayload
        );

      console.log(
        "BANK SAVE RESPONSE:",
        bankResponse
      );

      // ========================================================
      // 4. UPDATE PREVIEW
      // ========================================================

      const mechanic =
        profileResponse?.data;

      if (mechanic) {
        const profileUrl =
          mechanic?.profileImage?.url ||
          mechanic?.profileImage ||
          mechanic?.documents?.profileImage?.url ||
          mechanic?.documents?.profileImage ||
          "";

        const shopUrl =
          mechanic?.shopImage?.url ||
          mechanic?.shopImage ||
          mechanic?.documents?.shopImage?.url ||
          mechanic?.documents?.shopImage ||
          "";

        if (profileUrl) {
          setProfilePreview(
            profileUrl
          );
        }

        if (shopUrl) {
          setShopPreview(
            shopUrl
          );
        }
      }

      setProfileExists(true);

      setSuccess(
        "Profile and bank details saved successfully. Continue to KYC."
      );

      setProfileImage(null);
      setShopImage(null);

      if (profileImageRef.current) {
        profileImageRef.current.value =
          "";
      }

      if (shopImageRef.current) {
        shopImageRef.current.value =
          "";
      }

      // ========================================================
      // 5. GO TO KYC
      // ========================================================

      setTimeout(() => {
        navigate("/mechanic/kyc", {
          replace: true,
        });
      }, 1200);
    } catch (err) {
      console.error(
        "SAVE MECHANIC PROFILE ERROR:",
        err
      );

      console.error(
        "BACKEND RESPONSE:",
        err?.response?.data
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to save mechanic profile.";

      setError(message);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // REMOVE PROFILE IMAGE
  // ============================================================

  const removeProfileImage = () => {
    if (profileImage) {
      setProfileImage(null);

      if (!profileExists) {
        setProfilePreview("");
      }

      if (profileImageRef.current) {
        profileImageRef.current.value =
          "";
      }

      setError("");
      setSuccess("");

      return;
    }

    setError(
      "Profile photo is required."
    );
  };

  // ============================================================
  // REMOVE SHOP IMAGE
  // ============================================================

  const removeShopImage = () => {
    setShopImage(null);

    if (!shopImage) {
      setShopPreview("");
    }

    if (shopImageRef.current) {
      shopImageRef.current.value =
        "";
    }

    setError("");
    setSuccess("");
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 shadow-sm">
              <Loader2
                size={30}
                className="animate-spin"
              />
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Loading your mechanic profile...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-extrabold text-blue-600">
            <Wrench size={14} />
            Mechanic Profile
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {profileExists
                  ? "Update your mechanic profile"
                  : "Complete your mechanic profile"}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Add your workshop details,
                services, location and bank
                details. After this step,
                complete your KYC verification.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <ShieldCheck
                size={19}
                className="text-emerald-600"
              />

              <div>
                <p className="text-xs font-bold text-emerald-700">
                  Secure Profile
                </p>

                <p className="text-[10px] text-emerald-600">
                  Your information stays protected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 shadow-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertCircle size={18} />
            </div>

            <div>
              <p className="text-sm font-bold text-red-700">
                Please check the following
              </p>

              <p className="mt-0.5 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 shadow-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <p className="text-sm font-bold text-emerald-700">
                Success
              </p>

              <p className="mt-0.5 text-sm text-emerald-600">
                {success}
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ==================================================
              PROFILE & PHOTOS
          ================================================== */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <SectionHeader
              icon={<Camera size={21} />}
              title="Profile & workshop photos"
              description="Your profile photo is required. Workshop photo is optional."
            />

            <div className="grid gap-8 p-6 md:grid-cols-[220px_1fr]">

              {/* PROFILE */}

              <div className="flex flex-col items-center">

                <div className="relative">

                  <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-xl ring-1 ring-slate-200">

                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Mechanic profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User
                        size={58}
                        strokeWidth={1.5}
                        className="text-slate-300"
                      />
                    )}

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      profileImageRef.current?.click()
                    }
                    disabled={loading}
                    className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Camera size={18} />
                  </button>

                  {profilePreview &&
                    profileImage && (
                      <button
                        type="button"
                        onClick={
                          removeProfileImage
                        }
                        disabled={loading}
                        className="absolute left-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
                      >
                        <X size={15} />
                      </button>
                    )}

                </div>

                <input
                  ref={profileImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImage}
                  className="hidden"
                />

                <div className="mt-4 text-center">
                  <p className="text-sm font-black text-slate-800">
                    Profile photo
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    JPG, PNG or WEBP
                    <br />
                    Maximum 5MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    profileImageRef.current?.click()
                  }
                  disabled={loading}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
                >
                  <Upload size={14} />

                  {profilePreview
                    ? "Change photo"
                    : "Upload photo"}
                </button>

              </div>

              {/* SHOP */}

              <div>

                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-800">
                      Workshop / shop image
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Optional — recommended for customer trust.
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                    OPTIONAL
                  </span>
                </div>

                <div className="relative flex min-h-[250px] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">

                  {shopPreview ? (
                    <>
                      <img
                        src={shopPreview}
                        alt="Workshop"
                        className="absolute inset-0 h-full w-full object-cover"
                      />

                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-4 py-3 text-white">

                        <span className="text-xs font-semibold">
                          Workshop image
                        </span>

                        {shopImage && (
                          <button
                            type="button"
                            onClick={
                              removeShopImage
                            }
                            className="rounded-lg bg-white/10 p-2 hover:bg-white/20"
                          >
                            <X size={16} />
                          </button>
                        )}

                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        shopImageRef.current?.click()
                      }
                      disabled={loading}
                      className="flex flex-col items-center px-6 text-center"
                    >

                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                        <ImageIcon size={25} />
                      </div>

                      <p className="text-sm font-bold text-slate-700">
                        Add workshop photo
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Show your workshop clearly
                      </p>

                      <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white">
                        <Upload size={14} />
                        Choose image
                      </span>

                    </button>
                  )}

                </div>

                <input
                  ref={shopImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleShopImage}
                  className="hidden"
                />

                <p className="mt-2 text-xs text-slate-400">
                  JPG, PNG or WEBP · Maximum 8MB · Optional
                </p>

              </div>

            </div>

          </section>

          {/* ==================================================
              WORKSHOP
          ================================================== */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <SectionHeader
              icon={<Store size={21} />}
              title="Workshop details"
              description="Tell customers what you do and what services you provide."
            />

            <div className="grid gap-5 p-6 md:grid-cols-2">

              <InputField
                label="Workshop / Shop name"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="e.g. Singh Auto Care"
                icon={<Store size={18} />}
                required
                disabled={loading}
              />

              <InputField
                label="Experience"
                name="experience"
                type="number"
                min="0"
                max="60"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Years of experience"
                icon={
                  <BriefcaseBusiness size={18} />
                }
                suffix="Years"
                required
                disabled={loading}
              />

              <InputField
                label="Service area"
                name="serviceArea"
                type="number"
                min="1"
                max="100"
                value={formData.serviceArea}
                onChange={handleChange}
                placeholder="10"
                icon={<Navigation size={18} />}
                suffix="KM"
                required
                disabled={loading}
              />

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Workshop description
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">

                  <FileText
                    size={18}
                    className="pointer-events-none absolute left-4 top-4 text-slate-400"
                  />

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    maxLength={500}
                    placeholder="Tell customers about your workshop, experience and services..."
                    disabled={loading}
                    className="w-full resize-none rounded-2xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

                <p className="mt-1 text-right text-xs text-slate-400">
                  {formData.description.length} / 500
                </p>

              </div>

            </div>

            <div className="border-t border-slate-100 p-6">

              <label className="mb-3 block text-sm font-bold text-slate-700">
                Specializations
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <div className="flex flex-wrap gap-2">

                {specializationOptions.map(
                  (item) => {
                    const selected =
                      formData.specialization.includes(
                        item
                      );

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          toggleSpecialization(
                            item
                          )
                        }
                        disabled={loading}
                        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${selected
                            ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
                          }`}
                      >
                        {selected && (
                          <Check size={13} />
                        )}

                        {item}
                      </button>
                    );
                  }
                )}

              </div>

            </div>

          </section>

          {/* ==================================================
              ADDRESS
          ================================================== */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <SectionHeader
              icon={<MapPinned size={21} />}
              title="Address & workshop location"
              description="Your location allows customers to find and request your services."
            />

            <div className="space-y-6 p-6">

              {/* GPS */}

              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <LocateFixed size={21} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Current workshop location
                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Capture your current GPS coordinates.
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={
                      getCurrentLocation
                    }
                    disabled={
                      loading ||
                      gettingLocation
                    }
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                  >

                    {gettingLocation ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                        Getting location...
                      </>
                    ) : (
                      <>
                        <Navigation size={16} />

                        {formData.latitude
                          ? "Refresh location"
                          : "Use current location"}
                      </>
                    )}

                  </button>

                </div>

                {formData.latitude &&
                  formData.longitude && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">

                      <Coordinate
                        title="Latitude"
                        value={
                          formData.latitude
                        }
                      />

                      <Coordinate
                        title="Longitude"
                        value={
                          formData.longitude
                        }
                      />

                    </div>
                  )}

              </div>

              {/* ADDRESS */}

              <div className="grid gap-5 md:grid-cols-2">

                <InputField
                  label="Full name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  icon={<User size={18} />}
                  required
                  disabled={loading}
                />

                <InputField
                  label="House / Street"
                  name="houseNo"
                  value={formData.houseNo}
                  onChange={handleChange}
                  placeholder="House no, street"
                  icon={<MapPin size={18} />}
                  required
                  disabled={loading}
                />

                <InputField
                  label="Area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Area / locality"
                  icon={<MapPin size={18} />}
                  required
                  disabled={loading}
                />

                <InputField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  icon={<MapPin size={18} />}
                  required
                  disabled={loading}
                />

                <InputField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  icon={<MapPin size={18} />}
                  required
                  disabled={loading}
                />

                <InputField
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  icon={<MapPin size={18} />}
                  required
                  disabled={loading}
                />

                <InputField
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={(event) => {
                    const value =
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);

                    setFormData(
                      (previous) => ({
                        ...previous,
                        pincode: value,
                      })
                    );

                    setError("");
                    setSuccess("");
                  }}
                  placeholder="6-digit pincode"
                  icon={<MapPin size={18} />}
                  required
                  disabled={loading}
                />

              </div>

            </div>

          </section>

          {/* ==================================================
              BANK
          ================================================== */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <SectionHeader
              icon={<Landmark size={21} />}
              title="Bank details"
              description="Add your bank account details for mechanic service payments."
            />

            <div className="p-6">

              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <CreditCard size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold text-amber-800">
                    Payment account
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    Make sure your bank details
                    are correct. Payments will be
                    transferred to this account after
                    successful service completion.
                  </p>
                </div>

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* ACCOUNT HOLDER */}

                <InputField
                  label="Account holder name"
                  name="accountHolderName"
                  value={
                    formData.accountHolderName
                  }
                  onChange={handleChange}
                  placeholder="Name as per bank account"
                  icon={<User size={18} />}
                  required
                  disabled={loading}
                />

                {/* ACCOUNT NUMBER */}

                <InputField
                  label="Account number"
                  name="accountNumber"
                  type="password"
                  value={
                    formData.accountNumber
                  }
                  onChange={(event) => {
                    const value =
                      event.target.value.replace(
                        /\D/g,
                        ""
                      );

                    setFormData(
                      (previous) => ({
                        ...previous,
                        accountNumber:
                          value,
                      })
                    );

                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Enter account number"
                  icon={
                    <CreditCard size={18} />
                  }
                  required
                  disabled={loading}
                />

                {/* CONFIRM ACCOUNT */}

                <InputField
                  label="Confirm account number"
                  name="confirmAccountNumber"
                  type="password"
                  value={
                    formData.confirmAccountNumber
                  }
                  onChange={(event) => {
                    const value =
                      event.target.value.replace(
                        /\D/g,
                        ""
                      );

                    setFormData(
                      (previous) => ({
                        ...previous,
                        confirmAccountNumber:
                          value,
                      })
                    );

                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Re-enter account number"
                  icon={
                    <CreditCard size={18} />
                  }
                  required
                  disabled={loading}
                />

                {/* IFSC */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    IFSC code
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <Landmark
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      name="ifscCode"
                      value={
                        formData.ifscCode
                      }
                      onChange={
                        handleIFSCChange
                      }
                      placeholder="e.g. SBIN0001234"
                      maxLength={11}
                      disabled={loading}
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm uppercase text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                    />

                    {checkingIFSC ? (
                      <Loader2
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-600"
                      />
                    ) : (
                      <Search
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    )}

                  </div>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Enter 11-character IFSC. Bank and branch will be detected automatically.
                  </p>
                </div>

                {/* BANK NAME */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Bank name
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <Landmark
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      list="bank-suggestions"
                      name="bankName"
                      value={
                        formData.bankName
                      }
                      onChange={handleChange}
                      placeholder="Select / enter bank name"
                      disabled={loading}
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                    />

                    <datalist id="bank-suggestions">
                      {bankSuggestions.map(
                        (bank) => (
                          <option
                            key={bank}
                            value={bank}
                          />
                        )
                      )}
                    </datalist>

                  </div>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Bank name is automatically filled from IFSC. You can also search manually.
                  </p>
                </div>

                {/* BRANCH */}

                <InputField
                  label="Branch name"
                  name="branchName"
                  value={
                    formData.branchName
                  }
                  onChange={handleChange}
                  placeholder="Branch will appear automatically"
                  icon={<MapPin size={18} />}
                  required
                  disabled={true}
                />

                {/* UPI */}

                <InputField
                  label="UPI ID"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="example@upi"
                  icon={<CreditCard size={18} />}
                  disabled={loading}
                />

              </div>

              {/* BANK STATUS */}

              {formData.bankName &&
                formData.branchName && (
                  <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <CheckCircle2
                        size={19}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-emerald-800">
                        Bank details detected
                      </p>

                      <p className="mt-1 text-xs text-emerald-700">
                        {formData.bankName} ·{" "}
                        {formData.branchName}
                      </p>
                    </div>

                  </div>
                )}

            </div>

          </section>

          {/* ==================================================
              SUBMIT
          ================================================== */}

          <div className="sticky bottom-4 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheck size={19} />
                </div>

                <div>

                  <p className="text-xs font-black text-slate-700">
                    Profile information is secure
                  </p>

                  <p className="mt-0.5 text-[11px] leading-5 text-slate-400">
                    Save your profile and bank
                    details, then continue to KYC.
                  </p>

                </div>

              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  checkingIFSC
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Saving profile...
                  </>
                ) : (
                  <>
                    {profileExists ? (
                      <RefreshCw size={18} />
                    ) : (
                      <Save size={18} />
                    )}

                    {profileExists
                      ? "Update & Continue"
                      : "Save & Continue to KYC"}
                  </>
                )}

              </button>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
}

// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
  icon,
  title,
  description,
}) {
  return (
    <div className="border-b border-slate-100 px-6 py-5">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div>

          <h2 className="font-black text-slate-900">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}

// ============================================================
// INPUT FIELD
// ============================================================

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
  min,
  max,
  suffix,
  required = false,
  disabled = false,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-2 block text-sm font-bold text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="relative">

        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={disabled}
          className={`w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 ${suffix
              ? "pr-16"
              : "pr-4"
            } text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50`}
        />

        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
            {suffix}
          </span>
        )}

      </div>
    </div>
  );
}

// ============================================================
// COORDINATE
// ============================================================

function Coordinate({
  title,
  value,
}) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white px-4 py-3">

      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-sm font-black text-slate-700">
        {value}
      </p>

    </div>
  );
}

export default MechanicProfile;