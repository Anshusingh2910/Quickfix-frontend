import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const LanguageContext = createContext(null);

const translations = {
    en: {
        settings: "Settings",
        manageSettings:
            "Manage your mechanic account, notifications and preferences.",

        notifications: "Notifications",
        notificationsDesc:
            "Control how QuickFix alerts you.",

        bookingNotifications: "Booking notifications",
        bookingNotificationsDesc:
            "Get notified when a new service request is available.",

        notificationSound: "Notification sound",
        notificationSoundDesc:
            "Play a sound when a new booking notification arrives.",

        autoRefresh: "Auto refresh bookings",
        autoRefreshDesc:
            "Automatically refresh your booking list for new requests.",

        location: "Location",
        locationDesc:
            "Required to receive nearby service requests.",

        locationAccess: "Location access",
        locationActive:
            "Your browser location permission is enabled.",
        locationRequired:
            "Location permission is required for nearby bookings.",

        active: "ACTIVE",
        off: "OFF",
        enableLocation: "Enable Location",

        account: "Account",
        accountDesc:
            "Manage your mechanic account.",

        myProfile: "My Profile",
        myProfileDesc:
            "Update shop information, experience and specialization.",

        availability: "Availability",
        availabilityDesc:
            "Manage your online and available working status.",

        security: "Security",
        securityDesc:
            "Manage password and account security.",

        accountActive: "Account Active",
        accountActiveDesc:
            "Your mechanic account is ready to receive bookings.",

        privacySecurity: "Privacy & Security",
        privacySecurityDesc:
            "Your account and customer information is protected.",

        language: "Language",
        languageDesc: "Choose your preferred language.",

        helpSupport: "Help & Support",
        helpSupportDesc:
            "Get help with bookings or your mechanic account.",

        appInformation: "App Information",
        appInformationDesc:
            "QuickFix Mechanic Panel • Version 1.0.0",

        support: "Support",
        logout: "Logout",
        loggingOut: "Logging out...",

        languageChanged: "Language changed successfully.",
        notificationsEnabled:
            "Booking notifications enabled.",
        notificationsDisabled:
            "Booking notifications disabled.",
        soundEnabled:
            "Notification sound enabled.",
        soundDisabled:
            "Notification sound disabled.",
        refreshEnabled:
            "Auto refresh enabled.",
        refreshDisabled:
            "Auto refresh disabled.",

        locationEnabled:
            "Location permission is enabled.",
        locationNotSupported:
            "Your browser does not support location services.",
        locationDenied:
            "Location permission denied. Please enable it from your browser settings.",
        locationUnavailable:
            "Unable to determine your location.",
        locationTimeout:
            "Location request timed out.",

        logoutConfirm:
            "Are you sure you want to logout?",

        quickfix: "QuickFix",
        mechanicAccount: "Mechanic Account",
        quickfixPanel: "QuickFix Mechanic Panel",
        footerText:
            "Built for faster roadside assistance.",

        english: "English",
        hindi: "Hindi",
    },

    hi: {
        settings: "सेटिंग्स",
        manageSettings:
            "अपने मैकेनिक अकाउंट, नोटिफिकेशन और प्राथमिकताओं को मैनेज करें।",

        notifications: "नोटिफिकेशन",
        notificationsDesc:
            "QuickFix आपको कैसे अलर्ट करे, इसे कंट्रोल करें।",

        bookingNotifications: "बुकिंग नोटिफिकेशन",
        bookingNotificationsDesc:
            "नई सर्विस रिक्वेस्ट आने पर नोटिफिकेशन प्राप्त करें।",

        notificationSound: "नोटिफिकेशन साउंड",
        notificationSoundDesc:
            "नई बुकिंग आने पर साउंड बजाएं।",

        autoRefresh: "बुकिंग ऑटो रिफ्रेश",
        autoRefreshDesc:
            "नई बुकिंग रिक्वेस्ट के लिए बुकिंग लिस्ट अपने आप रिफ्रेश करें।",

        location: "लोकेशन",
        locationDesc:
            "पास की सर्विस रिक्वेस्ट प्राप्त करने के लिए जरूरी है।",

        locationAccess: "लोकेशन एक्सेस",
        locationActive:
            "आपके ब्राउज़र में लोकेशन परमिशन चालू है।",
        locationRequired:
            "पास की बुकिंग प्राप्त करने के लिए लोकेशन परमिशन जरूरी है।",

        active: "चालू",
        off: "बंद",
        enableLocation: "लोकेशन चालू करें",

        account: "अकाउंट",
        accountDesc:
            "अपने मैकेनिक अकाउंट को मैनेज करें।",

        myProfile: "मेरा प्रोफाइल",
        myProfileDesc:
            "शॉप की जानकारी, अनुभव और स्पेशलाइजेशन अपडेट करें।",

        availability: "उपलब्धता",
        availabilityDesc:
            "अपना ऑनलाइन और उपलब्ध वर्किंग स्टेटस मैनेज करें।",

        security: "सिक्योरिटी",
        securityDesc:
            "पासवर्ड और अकाउंट सिक्योरिटी मैनेज करें।",

        accountActive: "अकाउंट एक्टिव",
        accountActiveDesc:
            "आपका मैकेनिक अकाउंट बुकिंग प्राप्त करने के लिए तैयार है।",

        privacySecurity: "प्राइवेसी और सिक्योरिटी",
        privacySecurityDesc:
            "आपका अकाउंट और कस्टमर की जानकारी सुरक्षित है।",

        language: "भाषा",
        languageDesc:
            "अपनी पसंदीदा भाषा चुनें।",

        helpSupport: "हेल्प और सपोर्ट",
        helpSupportDesc:
            "बुकिंग या मैकेनिक अकाउंट से जुड़ी सहायता प्राप्त करें।",

        appInformation: "ऐप जानकारी",
        appInformationDesc:
            "QuickFix Mechanic Panel • Version 1.0.0",

        support: "सपोर्ट",
        logout: "लॉगआउट",
        loggingOut: "लॉगआउट हो रहा है...",

        languageChanged:
            "भाषा सफलतापूर्वक बदल दी गई।",

        notificationsEnabled:
            "बुकिंग नोटिफिकेशन चालू कर दिए गए।",
        notificationsDisabled:
            "बुकिंग नोटिफिकेशन बंद कर दिए गए।",

        soundEnabled:
            "नोटिफिकेशन साउंड चालू कर दिया गया।",
        soundDisabled:
            "नोटिफिकेशन साउंड बंद कर दिया गया।",

        refreshEnabled:
            "ऑटो रिफ्रेश चालू कर दिया गया।",
        refreshDisabled:
            "ऑटो रिफ्रेश बंद कर दिया गया।",

        locationEnabled:
            "लोकेशन परमिशन चालू है।",

        locationNotSupported:
            "आपका ब्राउज़र लोकेशन सर्विस सपोर्ट नहीं करता।",

        locationDenied:
            "लोकेशन परमिशन रिजेक्ट कर दी गई है। कृपया ब्राउज़र सेटिंग्स से इसे चालू करें।",

        locationUnavailable:
            "आपकी लोकेशन प्राप्त नहीं हो सकी।",

        locationTimeout:
            "लोकेशन रिक्वेस्ट का समय समाप्त हो गया।",

        logoutConfirm:
            "क्या आप लॉगआउट करना चाहते हैं?",

        quickfix: "QuickFix",
        mechanicAccount: "मैकेनिक अकाउंट",
        quickfixPanel: "QuickFix मैकेनिक पैनल",
        footerText:
            "तेज़ रोडसाइड असिस्टेंस के लिए बनाया गया।",

        english: "अंग्रेज़ी",
        hindi: "हिंदी",
    },
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("quickfix_language") || "en";
    });

    useEffect(() => {
        localStorage.setItem(
            "quickfix_language",
            language
        );

        document.documentElement.lang = language;
    }, [language]);

    const changeLanguage = (newLanguage) => {
        if (!translations[newLanguage]) return;

        setLanguage(newLanguage);
    };

    const t = (key) => {
        return (
            translations[language]?.[key] ||
            translations.en[key] ||
            key
        );
    };

    const value = useMemo(
        () => ({
            language,
            changeLanguage,
            t,
        }),
        [language]
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }

    return context;
};