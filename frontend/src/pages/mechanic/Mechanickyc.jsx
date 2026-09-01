import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Check,
    CheckCircle2,
    FileCheck2,
    Loader2,
    ShieldCheck,
    Upload,
    X,
    AlertCircle,
    ExternalLink,
} from "lucide-react";

import {
    submitMechanicKYC,
    startKYC,
} from "../../services/mechanicApi";

function MechanicKYC() {
    const navigate = useNavigate();

    const aadhaarRef = useRef(null);
    const drivingLicenseRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [startingKYC, setStartingKYC] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [aadhaar, setAadhaar] = useState(null);
    const [drivingLicense, setDrivingLicense] = useState(null);

    const [existingAadhaar, setExistingAadhaar] = useState("");
    const [existingDrivingLicense, setExistingDrivingLicense] =
        useState("");

    const [kycStatus, setKycStatus] = useState("not_started");

    const [verificationId, setVerificationId] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /*
    |--------------------------------------------------------------------------
    | RESTORE KYC DATA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        try {
            const savedKYC =
                localStorage.getItem("mechanicKYC");

            if (!savedKYC) {
                return;
            }

            const parsedKYC = JSON.parse(savedKYC);

            if (parsedKYC?.aadhaar) {
                setExistingAadhaar(parsedKYC.aadhaar);
            }

            if (parsedKYC?.drivingLicense) {
                setExistingDrivingLicense(
                    parsedKYC.drivingLicense
                );
            }

            if (parsedKYC?.status) {
                setKycStatus(parsedKYC.status);
            }

            if (parsedKYC?.verificationId) {
                setVerificationId(
                    parsedKYC.verificationId
                );
            }
        } catch (error) {
            console.error(
                "RESTORE KYC ERROR:",
                error
            );

            localStorage.removeItem(
                "mechanicKYC"
            );
        }
    }, []);

    /*
    |--------------------------------------------------------------------------
    | DOCUMENT VALIDATION
    |--------------------------------------------------------------------------
    */

    const validateDocument = (file, name) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
        ];

        if (!allowedTypes.includes(file.type)) {
            setError(
                `${name} must be JPG, PNG, WEBP or PDF.`
            );

            return false;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError(
                `${name} must be less than 10MB.`
            );

            return false;
        }

        return true;
    };

    /*
    |--------------------------------------------------------------------------
    | AADHAAR
    |--------------------------------------------------------------------------
    */

    const handleAadhaar = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!validateDocument(file, "Aadhaar")) {
            return;
        }

        setAadhaar(file);

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | DRIVING LICENSE
    |--------------------------------------------------------------------------
    */

    const handleDrivingLicense = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (
            !validateDocument(
                file,
                "Driving License"
            )
        ) {
            return;
        }

        setDrivingLicense(file);

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | REMOVE AADHAAR
    |--------------------------------------------------------------------------
    */

    const removeAadhaar = () => {
        setAadhaar(null);

        if (aadhaarRef.current) {
            aadhaarRef.current.value = "";
        }

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | REMOVE DRIVING LICENSE
    |--------------------------------------------------------------------------
    */

    const removeDrivingLicense = () => {
        setDrivingLicense(null);

        if (drivingLicenseRef.current) {
            drivingLicenseRef.current.value = "";
        }

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | SUBMIT DOCUMENTS
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        /*
        |--------------------------------------------------------------------------
        | VALIDATION
        |--------------------------------------------------------------------------
        */

        if (
            !aadhaar &&
            !existingAadhaar
        ) {
            setError(
                "Please upload your Aadhaar document."
            );

            return;
        }

        if (
            !drivingLicense &&
            !existingDrivingLicense
        ) {
            setError(
                "Please upload your Driving License."
            );

            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            if (aadhaar) {
                formData.append(
                    "aadhaar",
                    aadhaar
                );
            }

            if (drivingLicense) {
                formData.append(
                    "drivingLicense",
                    drivingLicense
                );
            }

            /*
            |--------------------------------------------------------------------------
            | BACKEND API
            |--------------------------------------------------------------------------
            */

            const response =
                await submitMechanicKYC(
                    formData
                );

            console.log(
                "SUBMIT KYC RESPONSE:",
                response
            );

            /*
            |--------------------------------------------------------------------------
            | RESPONSE DATA
            |--------------------------------------------------------------------------
            */

            const responseData =
                response?.data?.data ||
                response?.data ||
                response;

            /*
            |--------------------------------------------------------------------------
            | DOCUMENT DATA
            |--------------------------------------------------------------------------
            */

            const savedAadhaar =
                responseData?.kyc?.aadhaar ||
                responseData?.aadhaar ||
                existingAadhaar ||
                "uploaded";

            const savedDrivingLicense =
                responseData?.kyc?.drivingLicense ||
                responseData?.drivingLicense ||
                existingDrivingLicense ||
                "uploaded";

            /*
            |--------------------------------------------------------------------------
            | KYC STATUS
            |--------------------------------------------------------------------------
            */

            const backendStatus =
                responseData?.kyc?.status ||
                "documents_submitted";

            setKycStatus(
                backendStatus
            );

            setExistingAadhaar(
                savedAadhaar
            );

            setExistingDrivingLicense(
                savedDrivingLicense
            );

            /*
            |--------------------------------------------------------------------------
            | SAVE LOCAL STATE
            |--------------------------------------------------------------------------
            */

            localStorage.setItem(
                "mechanicKYC",
                JSON.stringify({
                    aadhaar:
                        savedAadhaar,
                    drivingLicense:
                        savedDrivingLicense,
                    status:
                        backendStatus,
                    submitted: true,
                    submittedAt:
                        new Date().toISOString(),
                })
            );

            /*
            |--------------------------------------------------------------------------
            | CLEAR NEW FILES
            |--------------------------------------------------------------------------
            */

            setAadhaar(null);
            setDrivingLicense(null);

            if (aadhaarRef.current) {
                aadhaarRef.current.value = "";
            }

            if (
                drivingLicenseRef.current
            ) {
                drivingLicenseRef.current.value =
                    "";
            }

            setSuccess(
                "Documents submitted successfully. You can now start KYC verification."
            );
        } catch (error) {
            console.error(
                "KYC SUBMIT ERROR:",
                error
            );

            console.error(
                "KYC BACKEND RESPONSE:",
                error?.response?.data
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Unable to submit KYC documents.";

            setError(message);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | START CASHFREE KYC
    |--------------------------------------------------------------------------
    */

    const handleStartKYC = async () => {
        try {
            setStartingKYC(true);

            setError("");
            setSuccess("");

            /*
            |--------------------------------------------------------------------------
            | CALL BACKEND
            |--------------------------------------------------------------------------
            */

            const response =
                await startKYC();

            console.log(
                "START KYC RESPONSE:",
                response
            );

            /*
            |--------------------------------------------------------------------------
            | IMPORTANT
            |--------------------------------------------------------------------------
            |
            | Axios response:
            |
            | response.data.data.formLink
            |
            |--------------------------------------------------------------------------
            */

            const responseData =
                response?.data?.data ||
                response?.data ||
                response;

            const formLink =
                responseData?.formLink;

            const newVerificationId =
                responseData?.verificationId;

            const newStatus =
                responseData?.kycStatus ||
                "verification_started";

            if (!formLink) {
                throw new Error(
                    "Cashfree KYC form link was not received."
                );
            }

            /*
            |--------------------------------------------------------------------------
            | UPDATE STATE
            |--------------------------------------------------------------------------
            */

            setKycStatus(
                newStatus
            );

            if (newVerificationId) {
                setVerificationId(
                    newVerificationId
                );
            }

            /*
            |--------------------------------------------------------------------------
            | SAVE LOCAL STATE
            |--------------------------------------------------------------------------
            */

            localStorage.setItem(
                "mechanicKYC",
                JSON.stringify({
                    aadhaar:
                        existingAadhaar ||
                        "uploaded",

                    drivingLicense:
                        existingDrivingLicense ||
                        "uploaded",

                    status:
                        newStatus,

                    verificationId:
                        newVerificationId ||
                        "",

                    submitted: true,

                    started: true,

                    startedAt:
                        new Date().toISOString(),
                })
            );

            setSuccess(
                "KYC verification started. Opening Cashfree verification form..."
            );

            /*
            |--------------------------------------------------------------------------
            | OPEN CASHFREE
            |--------------------------------------------------------------------------
            */

            window.open(
                formLink,
                "_blank",
                "noopener,noreferrer"
            );
        } catch (error) {
            console.error(
                "START KYC ERROR:",
                error
            );

            console.error(
                "START KYC BACKEND RESPONSE:",
                error?.response?.data
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Unable to start KYC.";

            setError(message);
        } finally {
            setStartingKYC(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | STATUS HELPERS
    |--------------------------------------------------------------------------
    */

    const documentsSubmitted =
        Boolean(
            existingAadhaar &&
            existingDrivingLicense
        );

    const verificationStarted =
        [
            "verification_started",
            "pending",
        ].includes(kycStatus);

    const verified =
        kycStatus === "verified";

    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (fetching) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">

                        <Loader2
                            size={30}
                            className="animate-spin"
                        />

                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-500">
                        Loading KYC...
                    </p>

                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-4xl">

                {/* HEADER */}

                <div className="mb-8">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/mechanic/profile"
                            )
                        }
                        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600"
                    >
                        <ArrowLeft size={17} />

                        Back to Profile
                    </button>

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-extrabold text-blue-600">

                                <ShieldCheck
                                    size={14}
                                />

                                Mechanic KYC

                            </div>

                            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                                Verify your identity
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Submit your identity documents
                                and complete Cashfree KYC
                                verification.
                            </p>

                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">

                            <ShieldCheck
                                size={20}
                                className="text-emerald-600"
                            />

                            <div>

                                <p className="text-xs font-black text-emerald-700">
                                    Secure KYC
                                </p>

                                <p className="text-[10px] text-emerald-600">
                                    Identity verification
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">

                            <AlertCircle
                                size={18}
                            />

                        </div>

                        <div>

                            <p className="text-sm font-bold text-red-700">
                                KYC Error
                            </p>

                            <p className="mt-1 text-sm text-red-600">
                                {error}
                            </p>

                        </div>

                    </div>
                )}

                {/* SUCCESS */}

                {success && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">

                            <CheckCircle2
                                size={18}
                            />

                        </div>

                        <div>

                            <p className="text-sm font-bold text-emerald-700">
                                KYC Update
                            </p>

                            <p className="mt-1 text-sm text-emerald-600">
                                {success}
                            </p>

                        </div>

                    </div>
                )}

                {/* STATUS */}

                <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                KYC Status
                            </p>

                            <p className="mt-1 text-lg font-black capitalize text-slate-900">
                                {kycStatus.replace(
                                    /_/g,
                                    " "
                                )}
                            </p>

                        </div>

                        <div
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${verified
                                    ? "bg-emerald-100 text-emerald-600"
                                    : verificationStarted
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-slate-100 text-slate-500"
                                }`}
                        >

                            {verified ? (
                                <CheckCircle2
                                    size={22}
                                />
                            ) : verificationStarted ? (
                                <Loader2
                                    size={22}
                                    className="animate-spin"
                                />
                            ) : (
                                <ShieldCheck
                                    size={22}
                                />
                            )}

                        </div>

                    </div>

                    {verificationId && (
                        <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">

                            <p className="text-[10px] font-bold uppercase text-slate-400">
                                Verification ID
                            </p>

                            <p className="mt-1 break-all text-xs font-semibold text-slate-600">
                                {verificationId}
                            </p>

                        </div>
                    )}

                </section>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* WHY KYC */}

                    <section className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6">

                        <div className="flex gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">

                                <ShieldCheck
                                    size={23}
                                />

                            </div>

                            <div>

                                <h2 className="text-sm font-black text-slate-900">
                                    Why is KYC required?
                                </h2>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    KYC helps us verify that you
                                    are a genuine mechanic and
                                    keeps customers safe while
                                    requesting your services.
                                </p>

                            </div>

                        </div>

                    </section>

                    {/* DOCUMENTS */}

                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-100 px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                                    <FileCheck2
                                        size={21}
                                    />

                                </div>

                                <div>

                                    <h2 className="font-black text-slate-900">
                                        Identity documents
                                    </h2>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Upload both documents before
                                        starting verification.
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="grid gap-5 p-6 md:grid-cols-2">

                            <KYCDocument
                                title="Aadhaar Card"
                                description="Upload a clear copy of your Aadhaar card."
                                file={aadhaar}
                                existingUrl={
                                    existingAadhaar
                                }
                                inputRef={
                                    aadhaarRef
                                }
                                onChange={
                                    handleAadhaar
                                }
                                onRemove={
                                    removeAadhaar
                                }
                                disabled={
                                    loading ||
                                    verified
                                }
                            />

                            <KYCDocument
                                title="Driving License"
                                description="Upload your valid driving license."
                                file={
                                    drivingLicense
                                }
                                existingUrl={
                                    existingDrivingLicense
                                }
                                inputRef={
                                    drivingLicenseRef
                                }
                                onChange={
                                    handleDrivingLicense
                                }
                                onRemove={
                                    removeDrivingLicense
                                }
                                disabled={
                                    loading ||
                                    verified
                                }
                            />

                        </div>

                    </section>

                    {/* REQUIREMENTS */}

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h3 className="text-sm font-black text-slate-900">
                            Document requirements
                        </h3>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">

                            <Requirement text="JPG, PNG, WEBP or PDF" />

                            <Requirement text="Maximum file size 10MB" />

                            <Requirement text="Document must be clearly visible" />

                            <Requirement text="Documents must belong to you" />

                        </div>

                    </section>

                    {/* BOTTOM ACTION */}

                    <div className="sticky bottom-4 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">

                        <div className="flex flex-col gap-4">

                            {/* STEP 1 */}

                            {!documentsSubmitted &&
                                !verified && (
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                        <div className="flex items-start gap-3">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                                <Upload
                                                    size={19}
                                                />

                                            </div>

                                            <div>

                                                <p className="text-xs font-black text-slate-700">
                                                    Step 1 — Submit documents
                                                </p>

                                                <p className="mt-0.5 text-[11px] leading-5 text-slate-400">
                                                    Upload Aadhaar and Driving License.
                                                </p>

                                            </div>

                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >

                                            {loading ? (
                                                <>
                                                    <Loader2
                                                        size={18}
                                                        className="animate-spin"
                                                    />

                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload
                                                        size={18}
                                                    />

                                                    Submit Documents
                                                </>
                                            )}

                                        </button>

                                    </div>
                                )}

                            {/* STEP 2 */}

                            {documentsSubmitted &&
                                !verified && (
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                        <div className="flex items-start gap-3">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                                <CheckCircle2
                                                    size={19}
                                                />

                                            </div>

                                            <div>

                                                <p className="text-xs font-black text-slate-700">
                                                    Step 2 — Start KYC verification
                                                </p>

                                                <p className="mt-0.5 text-[11px] leading-5 text-slate-400">
                                                    Your documents are submitted.
                                                    Complete verification with Cashfree.
                                                </p>

                                            </div>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={
                                                handleStartKYC
                                            }
                                            disabled={
                                                startingKYC ||
                                                verificationStarted
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >

                                            {startingKYC ? (
                                                <>
                                                    <Loader2
                                                        size={18}
                                                        className="animate-spin"
                                                    />

                                                    Starting KYC...
                                                </>
                                            ) : verificationStarted ? (
                                                <>
                                                    <Loader2
                                                        size={18}
                                                        className="animate-spin"
                                                    />

                                                    Verification Pending
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldCheck
                                                        size={18}
                                                    />

                                                    Start KYC Verification

                                                    <ExternalLink
                                                        size={16}
                                                    />
                                                </>
                                            )}

                                        </button>

                                    </div>
                                )}

                            {/* VERIFIED */}

                            {verified && (
                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">

                                        <CheckCircle2
                                            size={20}
                                        />

                                    </div>

                                    <div>

                                        <p className="text-sm font-black text-emerald-700">
                                            KYC Verified
                                        </p>

                                        <p className="text-xs text-emerald-600">
                                            Your mechanic account is ready.
                                        </p>

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>

                </form>

            </div>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| KYC DOCUMENT COMPONENT
|--------------------------------------------------------------------------
*/

function KYCDocument({
    title,
    description,
    file,
    existingUrl,
    inputRef,
    onChange,
    onRemove,
    disabled,
}) {
    const uploaded = Boolean(
        file || existingUrl
    );

    return (
        <div
            className={`rounded-2xl border p-5 transition ${uploaded
                    ? "border-emerald-200 bg-emerald-50/40"
                    : "border-slate-200 bg-slate-50/50"
                }`}
        >

            <div className="flex items-start justify-between gap-4">

                <div className="flex gap-3">

                    <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${uploaded
                                ? "bg-emerald-600 text-white"
                                : "bg-white text-slate-500"
                            }`}
                    >

                        {uploaded ? (
                            <Check size={21} />
                        ) : (
                            <FileCheck2
                                size={21}
                            />
                        )}

                    </div>

                    <div>

                        <p className="text-sm font-black text-slate-800">

                            {title}

                            <span className="ml-1 text-red-500">
                                *
                            </span>

                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                            {description}
                        </p>

                    </div>

                </div>

                {file && (
                    <button
                        type="button"
                        onClick={onRemove}
                        disabled={disabled}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                        <X size={16} />
                    </button>
                )}

            </div>

            <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={onChange}
                className="hidden"
            />

            <div className="mt-5">

                {file ? (
                    <div className="rounded-xl border border-emerald-100 bg-white px-4 py-3">

                        <p className="truncate text-xs font-bold text-slate-700">
                            {file.name}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                            {(
                                file.size /
                                1024 /
                                1024
                            ).toFixed(2)}{" "}
                            MB
                        </p>

                    </div>
                ) : existingUrl ? (
                    <div className="rounded-xl border border-emerald-100 bg-white px-4 py-3">

                        <div className="flex items-center gap-2">

                            <CheckCircle2
                                size={15}
                                className="text-emerald-600"
                            />

                            <p className="text-xs font-bold text-emerald-600">
                                Document already uploaded
                            </p>

                        </div>

                        {!disabled && (
                            <button
                                type="button"
                                onClick={() =>
                                    inputRef.current?.click()
                                }
                                className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                            >
                                Replace document
                            </button>
                        )}

                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() =>
                            inputRef.current?.click()
                        }
                        disabled={disabled}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600 transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <Upload size={15} />

                        Choose document

                    </button>
                )}

            </div>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| REQUIREMENT
|--------------------------------------------------------------------------
*/

function Requirement({ text }) {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">

                <Check size={15} />

            </div>

            <span className="text-xs font-semibold text-slate-600">
                {text}
            </span>

        </div>
    );
}

export default MechanicKYC;