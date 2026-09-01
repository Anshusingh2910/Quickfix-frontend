import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Bell,
    BellOff,
    CheckCircle2,
    ChevronRight,
    CircleHelp,
    Clock3,
    Globe2,
    KeyRound,
    Lock,
    LogOut,
    MapPin,
    Navigation,
    RefreshCw,
    ShieldCheck,
    SlidersHorizontal,
    Smartphone,
    Volume2,
    VolumeX,
    Wrench,
    XCircle,
} from "lucide-react";

import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";

function MechanicSettings() {
    const navigate = useNavigate();

    const { language, changeLanguage, t } =
        useLanguage();

    const [notifications, setNotifications] =
        useState(true);

    const [sound, setSound] =
        useState(true);

    const [autoRefresh, setAutoRefresh] =
        useState(true);

    const [locationEnabled, setLocationEnabled] =
        useState(false);

    const [loggingOut, setLoggingOut] =
        useState(false);

    const [success, setSuccess] =
        useState("");

    const [error, setError] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | ERROR MESSAGE
    |--------------------------------------------------------------------------
    */

    const getErrorMessage = (error) => {
        return (
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Something went wrong."
        );
    };

    /*
    |--------------------------------------------------------------------------
    | CLEAR SUCCESS MESSAGE
    |--------------------------------------------------------------------------
    */

    const clearMessage = () => {
        setTimeout(() => {
            setSuccess("");
        }, 2500);
    };

    /*
    |--------------------------------------------------------------------------
    | LOAD SETTINGS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const savedNotifications =
            localStorage.getItem(
                "mechanic_notifications"
            );

        const savedSound =
            localStorage.getItem(
                "mechanic_notification_sound"
            );

        const savedAutoRefresh =
            localStorage.getItem(
                "mechanic_auto_refresh"
            );

        if (savedNotifications !== null) {
            setNotifications(
                savedNotifications === "true"
            );
        }

        if (savedSound !== null) {
            setSound(
                savedSound === "true"
            );
        }

        if (savedAutoRefresh !== null) {
            setAutoRefresh(
                savedAutoRefresh === "true"
            );
        }

        checkLocationPermission();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | LOCATION PERMISSION CHECK
    |--------------------------------------------------------------------------
    */

    const checkLocationPermission = async () => {
        if (!navigator.geolocation) {
            setLocationEnabled(false);
            return;
        }

        try {
            if (navigator.permissions) {
                const permission =
                    await navigator.permissions.query({
                        name: "geolocation",
                    });

                setLocationEnabled(
                    permission.state === "granted"
                );

                permission.onchange = () => {
                    setLocationEnabled(
                        permission.state === "granted"
                    );
                };
            }
        } catch (locationError) {
            console.log(
                "LOCATION PERMISSION CHECK:",
                locationError
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | NOTIFICATION TOGGLE
    |--------------------------------------------------------------------------
    */

    const toggleNotifications = () => {
        const value = !notifications;

        setNotifications(value);

        localStorage.setItem(
            "mechanic_notifications",
            String(value)
        );

        setError("");

        setSuccess(
            value
                ? t("notificationsEnabled")
                : t("notificationsDisabled")
        );

        clearMessage();
    };

    /*
    |--------------------------------------------------------------------------
    | SOUND TOGGLE
    |--------------------------------------------------------------------------
    */

    const toggleSound = () => {
        const value = !sound;

        setSound(value);

        localStorage.setItem(
            "mechanic_notification_sound",
            String(value)
        );

        setError("");

        setSuccess(
            value
                ? t("soundEnabled")
                : t("soundDisabled")
        );

        clearMessage();
    };

    /*
    |--------------------------------------------------------------------------
    | AUTO REFRESH TOGGLE
    |--------------------------------------------------------------------------
    */

    const toggleAutoRefresh = () => {
        const value = !autoRefresh;

        setAutoRefresh(value);

        localStorage.setItem(
            "mechanic_auto_refresh",
            String(value)
        );

        setError("");

        setSuccess(
            value
                ? t("refreshEnabled")
                : t("refreshDisabled")
        );

        clearMessage();
    };

    /*
    |--------------------------------------------------------------------------
    | LANGUAGE CHANGE
    |--------------------------------------------------------------------------
    */

    const handleLanguageChange = (newLanguage) => {
        if (newLanguage === language) {
            return;
        }

        changeLanguage(newLanguage);

        setError("");

        /*
         * Small delay so the translation context
         * updates before displaying the message.
         */
        setTimeout(() => {
            setSuccess(
                newLanguage === "hi"
                    ? "भाषा सफलतापूर्वक बदल दी गई।"
                    : "Language changed successfully."
            );
        }, 50);

        setTimeout(() => {
            setSuccess("");
        }, 2550);
    };

    /*
    |--------------------------------------------------------------------------
    | REQUEST LOCATION
    |--------------------------------------------------------------------------
    */

    const requestLocation = () => {
        setError("");

        if (!navigator.geolocation) {
            setError(
                t("locationNotSupported")
            );

            return;
        }

        navigator.geolocation.getCurrentPosition(
            () => {
                setLocationEnabled(true);

                setSuccess(
                    t("locationEnabled")
                );

                clearMessage();
            },

            (locationError) => {
                console.error(
                    "LOCATION ERROR:",
                    locationError
                );

                setLocationEnabled(false);

                if (locationError.code === 1) {
                    setError(
                        t("locationDenied")
                    );
                } else if (
                    locationError.code === 2
                ) {
                    setError(
                        t("locationUnavailable")
                    );
                } else {
                    setError(
                        t("locationTimeout")
                    );
                }
            },

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    const handleLogout = async () => {
        const confirmed = window.confirm(
            t("logoutConfirm")
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoggingOut(true);
            setError("");

            /*
             * Logout API is optional.
             * Even if backend logout fails,
             * local session will still be cleared.
             */
            try {
                await api.post(
                    "/mechanic/logout"
                );
            } catch (logoutError) {
                console.log(
                    "LOGOUT API:",
                    logoutError
                );
            }

            /*
             * Clear authentication tokens
             */
            localStorage.removeItem("token");
            localStorage.removeItem(
                "accessToken"
            );
            localStorage.removeItem(
                "refreshToken"
            );

            /*
             * Clear mechanic preferences
             */
            localStorage.removeItem(
                "mechanic_notifications"
            );

            localStorage.removeItem(
                "mechanic_notification_sound"
            );

            localStorage.removeItem(
                "mechanic_auto_refresh"
            );

            /*
             * IMPORTANT:
             * Language preference is NOT removed.
             *
             * So if mechanic selected Hindi,
             * Hindi will remain selected after logout.
             */

            navigate("/login", {
                replace: true,
            });
        } catch (logoutError) {
            console.error(
                "LOGOUT ERROR:",
                logoutError
            );

            setError(
                getErrorMessage(logoutError)
            );
        } finally {
            setLoggingOut(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | SETTING TOGGLE COMPONENT
    |--------------------------------------------------------------------------
    */

    const SettingToggle = ({
        icon: Icon,
        title,
        description,
        enabled,
        onClick,
        iconBg = "bg-blue-50",
        iconColor = "text-blue-600",
    }) => {
        return (
            <button
                type="button"
                onClick={onClick}
                className="flex w-full items-center gap-4 rounded-2xl p-4 text-left transition hover:bg-slate-50"
            >
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
                >
                    <Icon size={21} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">
                        {title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        {description}
                    </p>
                </div>

                <div
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${enabled
                            ? "bg-blue-600"
                            : "bg-slate-300"
                        }`}
                >
                    <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${enabled
                                ? "left-6"
                                : "left-1"
                            }`}
                    />
                </div>
            </button>
        );
    };

    /*
    |--------------------------------------------------------------------------
    | NAVIGATION ROW
    |--------------------------------------------------------------------------
    */

    const NavigationRow = ({
        icon: Icon,
        title,
        description,
        onClick,
        iconBg = "bg-slate-100",
        iconColor = "text-slate-600",
    }) => {
        return (
            <button
                type="button"
                onClick={onClick}
                className="flex w-full items-center gap-4 rounded-2xl p-4 text-left transition hover:bg-slate-50"
            >
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
                >
                    <Icon size={21} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">
                        {title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        {description}
                    </p>
                </div>

                <ChevronRight
                    size={19}
                    className="shrink-0 text-slate-400"
                />
            </button>
        );
    };

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">

                {/* HEADER */}

                <div className="mb-7 flex items-center gap-4">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/mechanic/dashboard"
                            )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                    >
                        <ArrowLeft size={19} />
                    </button>

                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                            {t("quickfix")}
                        </p>

                        <h1 className="mt-1 text-3xl font-black text-slate-900">
                            {t("settings")}
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            {t("manageSettings")}
                        </p>
                    </div>
                </div>

                {/* SUCCESS */}

                {success && (
                    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">

                        <CheckCircle2
                            size={19}
                            className="text-emerald-600"
                        />

                        <p className="text-sm font-semibold text-emerald-700">
                            {success}
                        </p>
                    </div>
                )}

                {/* ERROR */}

                {error && (
                    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">

                        <XCircle
                            size={19}
                            className="text-red-500"
                        />

                        <p className="text-sm font-semibold text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

                    {/* LEFT */}

                    <div className="space-y-6">

                        {/* NOTIFICATIONS */}

                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Bell size={21} />
                                </div>

                                <div>
                                    <h2 className="font-black text-slate-900">
                                        {t("notifications")}
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        {t("notificationsDesc")}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 divide-y divide-slate-100">

                                <SettingToggle
                                    icon={notifications ? Bell : BellOff}
                                    title={t(
                                        "bookingNotifications"
                                    )}
                                    description={t(
                                        "bookingNotificationsDesc"
                                    )}
                                    enabled={
                                        notifications
                                    }
                                    onClick={
                                        toggleNotifications
                                    }
                                />

                                <SettingToggle
                                    icon={
                                        sound
                                            ? Volume2
                                            : VolumeX
                                    }
                                    title={t(
                                        "notificationSound"
                                    )}
                                    description={t(
                                        "notificationSoundDesc"
                                    )}
                                    enabled={sound}
                                    onClick={
                                        toggleSound
                                    }
                                    iconBg="bg-violet-50"
                                    iconColor="text-violet-600"
                                />

                                <SettingToggle
                                    icon={RefreshCw}
                                    title={t(
                                        "autoRefresh"
                                    )}
                                    description={t(
                                        "autoRefreshDesc"
                                    )}
                                    enabled={
                                        autoRefresh
                                    }
                                    onClick={
                                        toggleAutoRefresh
                                    }
                                    iconBg="bg-emerald-50"
                                    iconColor="text-emerald-600"
                                />

                            </div>
                        </section>

                        {/* LOCATION */}

                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <MapPin size={21} />
                                </div>

                                <div>
                                    <h2 className="font-black text-slate-900">
                                        {t("location")}
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        {t("locationDesc")}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 rounded-2xl bg-slate-50 p-4">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">

                                        {locationEnabled ? (
                                            <CheckCircle2
                                                size={21}
                                            />
                                        ) : (
                                            <MapPin
                                                size={21}
                                            />
                                        )}

                                    </div>

                                    <div className="flex-1">

                                        <p className="font-bold text-slate-900">
                                            {t(
                                                "locationAccess"
                                            )}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {locationEnabled
                                                ? t(
                                                    "locationActive"
                                                )
                                                : t(
                                                    "locationRequired"
                                                )}
                                        </p>

                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-[10px] font-black ${locationEnabled
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-orange-100 text-orange-700"
                                            }`}
                                    >
                                        {locationEnabled
                                            ? t("active")
                                            : t("off")}
                                    </span>

                                </div>

                                {!locationEnabled && (
                                    <button
                                        type="button"
                                        onClick={
                                            requestLocation
                                        }
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                                    >
                                        <Navigation
                                            size={17}
                                        />

                                        {t(
                                            "enableLocation"
                                        )}
                                    </button>
                                )}

                            </div>
                        </section>

                        {/* ACCOUNT */}

                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                    <SlidersHorizontal
                                        size={21}
                                    />
                                </div>

                                <div>
                                    <h2 className="font-black text-slate-900">
                                        {t("account")}
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        {t("accountDesc")}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 divide-y divide-slate-100">

                                <NavigationRow
                                    icon={Wrench}
                                    title={t(
                                        "myProfile"
                                    )}
                                    description={t(
                                        "myProfileDesc"
                                    )}
                                    onClick={() =>
                                        navigate(
                                            "/mechanic/profile"
                                        )
                                    }
                                    iconBg="bg-blue-50"
                                    iconColor="text-blue-600"
                                />

                                <NavigationRow
                                    icon={Clock3}
                                    title={t(
                                        "availability"
                                    )}
                                    description={t(
                                        "availabilityDesc"
                                    )}
                                    onClick={() =>
                                        navigate(
                                            "/mechanic/dashboard"
                                        )
                                    }
                                    iconBg="bg-emerald-50"
                                    iconColor="text-emerald-600"
                                />

                                <NavigationRow
                                    icon={KeyRound}
                                    title={t(
                                        "security"
                                    )}
                                    description={t(
                                        "securityDesc"
                                    )}
                                    onClick={() =>
                                        navigate(
                                            "/mechanic/security"
                                        )
                                    }
                                    iconBg="bg-orange-50"
                                    iconColor="text-orange-600"
                                />

                            </div>
                        </section>
                    </div>

                    {/* RIGHT */}

                    <aside className="space-y-6">

                        {/* ACCOUNT STATUS */}

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                                        {t("quickfix")}
                                    </p>

                                    <h2 className="mt-1 text-xl font-black text-slate-900">
                                        {t(
                                            "mechanicAccount"
                                        )}
                                    </h2>

                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <ShieldCheck
                                        size={22}
                                    />
                                </div>

                            </div>

                            <div className="mt-5 rounded-2xl bg-emerald-50 p-4">

                                <div className="flex items-center gap-3">

                                    <CheckCircle2
                                        size={21}
                                        className="text-emerald-600"
                                    />

                                    <div>

                                        <p className="font-black text-emerald-800">
                                            {t(
                                                "accountActive"
                                            )}
                                        </p>

                                        <p className="mt-1 text-xs text-emerald-600">
                                            {t(
                                                "accountActiveDesc"
                                            )}
                                        </p>

                                    </div>

                                </div>

                            </div>
                        </section>

                        {/* PRIVACY / LANGUAGE */}

                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

                            <NavigationRow
                                icon={Lock}
                                title={t(
                                    "privacySecurity"
                                )}
                                description={t(
                                    "privacySecurityDesc"
                                )}
                                onClick={() =>
                                    navigate(
                                        "/mechanic/security"
                                    )
                                }
                                iconBg="bg-indigo-50"
                                iconColor="text-indigo-600"
                            />

                            {/* LANGUAGE */}

                            <div className="border-t border-slate-100 pt-2">

                                <div className="rounded-2xl p-4">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                            <Globe2
                                                size={21}
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">

                                            <p className="font-bold text-slate-900">
                                                {t(
                                                    "language"
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                {t(
                                                    "languageDesc"
                                                )}
                                            </p>

                                        </div>

                                        <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-black uppercase text-cyan-700">
                                            {language === "hi"
                                                ? "HI"
                                                : "EN"}
                                        </span>

                                    </div>

                                    {/* LANGUAGE BUTTONS */}

                                    <div className="mt-4 grid grid-cols-2 gap-2">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleLanguageChange(
                                                    "en"
                                                )
                                            }
                                            className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${language ===
                                                    "en"
                                                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                }`}
                                        >
                                            🇬🇧{" "}
                                            {t(
                                                "english"
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleLanguageChange(
                                                    "hi"
                                                )
                                            }
                                            className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${language ===
                                                    "hi"
                                                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                }`}
                                        >
                                            🇮🇳{" "}
                                            {t(
                                                "hindi"
                                            )}
                                        </button>

                                    </div>
                                </div>
                            </div>

                        </section>

                        {/* SUPPORT */}

                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

                            <p className="px-4 text-xs font-black uppercase tracking-widest text-slate-400">
                                {t("support")}
                            </p>

                            <div className="mt-2">

                                <NavigationRow
                                    icon={CircleHelp}
                                    title={t(
                                        "helpSupport"
                                    )}
                                    description={t(
                                        "helpSupportDesc"
                                    )}
                                    onClick={() =>
                                        setSuccess(
                                            "Support section will be available soon."
                                        )
                                    }
                                    iconBg="bg-blue-50"
                                    iconColor="text-blue-600"
                                />

                                <NavigationRow
                                    icon={Smartphone}
                                    title={t(
                                        "appInformation"
                                    )}
                                    description={t(
                                        "appInformationDesc"
                                    )}
                                    onClick={() =>
                                        setSuccess(
                                            "You are using QuickFix Mechanic Panel v1.0.0."
                                        )
                                    }
                                    iconBg="bg-slate-100"
                                    iconColor="text-slate-600"
                                />

                            </div>
                        </section>

                        {/* LOGOUT */}

                        <section className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm">

                            <button
                                type="button"
                                onClick={
                                    handleLogout
                                }
                                disabled={
                                    loggingOut
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {loggingOut ? (
                                    <>
                                        <RefreshCw
                                            size={18}
                                            className="animate-spin"
                                        />

                                        {t(
                                            "loggingOut"
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <LogOut
                                            size={18}
                                        />

                                        {t("logout")}
                                    </>
                                )}

                            </button>
                        </section>

                    </aside>
                </div>

                {/* FOOTER */}

                <div className="mt-8 text-center">

                    <p className="text-xs font-semibold text-slate-400">
                        {t("quickfixPanel")}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                        {t("footerText")}
                    </p>

                </div>

            </div>
        </div>
    );
}

export default MechanicSettings;
