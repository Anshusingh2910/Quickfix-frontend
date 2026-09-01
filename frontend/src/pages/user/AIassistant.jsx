import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Activity,
    AlertTriangle,
    Bot,
    Car,
    Check,
    CheckCircle2,
    ChevronRight,
    CircleAlert,
    Clipboard,
    Gauge,
    IndianRupee,
    Loader2,
    MessageCircle,
    RefreshCw,
    Send,
    ShieldCheck,
    Sparkles,
    Trash2,
    Wrench,
    X,
    Zap,
} from "lucide-react";

import { chatWithAI } from "../../services/aiApi";

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_MESSAGE_LENGTH = 1000;

const topics = [
    {
        title: "Engine Problems",
        icon: CircleAlert,
        question:
            "My car engine is making a strange noise. What could be the reason?",
    },
    {
        title: "Maintenance",
        icon: Wrench,
        question:
            "What regular maintenance does my car need?",
    },
    {
        title: "Warning Lights",
        icon: CircleAlert,
        question:
            "What does the check engine light mean?",
    },
    {
        title: "Mileage",
        icon: Gauge,
        question:
            "How can I improve my car's mileage?",
    },
    {
        title: "General Care",
        icon: Car,
        question:
            "Give me some general car care tips.",
    },
];

const quickQuestions = [
    "My car is making noise",
    "When should I change engine oil?",
    "How can I improve my car's mileage?",
    "What does the check engine light mean?",
];

/* =========================================================
   HELPERS
========================================================= */

const createId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random()}`;
};

const normalizeConfidence = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Math.min(Math.max(Math.round(number), 0), 100);
};

const formatCurrency = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN");
};

const formatTime = (date = new Date()) => {
    return new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const extractAIData = (response) => {
    /*
      Backend/Axios response support:

      response.data
      response.data.data
      response.data.result
    */

    if (!response) {
        return null;
    }

    const payload = response?.data;

    if (payload?.data && typeof payload.data === "object") {
        return payload.data;
    }

    if (payload?.result && typeof payload.result === "object") {
        return payload.result;
    }

    if (payload && typeof payload === "object") {
        return payload;
    }

    return null;
};

const getErrorMessage = (error) => {
    if (error?.name === "CanceledError") {
        return "Request cancelled.";
    }

    if (error?.code === "ERR_CANCELED") {
        return "Request cancelled.";
    }

    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to connect with QuickFix AI."
    );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

function AIAssistant() {
    const navigate = useNavigate();

    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const abortControllerRef = useRef(null);

    /* =====================================================
       AUTO SCROLL
    ===================================================== */

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages, loading]);

    /* =====================================================
       CLEANUP
    ===================================================== */

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    /* =====================================================
       INPUT
    ===================================================== */

    const handleInputChange = (event) => {
        const value = event.target.value;

        if (value.length <= MAX_MESSAGE_LENGTH) {
            setQuestion(value);
        }
    };

    /* =====================================================
       SEND QUESTION
    ===================================================== */

    const sendQuestion = useCallback(
        async (text = question) => {
            const value = String(text || "").trim();

            if (!value || loading) {
                return;
            }

            if (value.length > MAX_MESSAGE_LENGTH) {
                return;
            }

            const userMessageId = createId();

            setQuestion("");

            setMessages((prev) => [
                ...prev,
                {
                    id: userMessageId,
                    type: "user",
                    text: value,
                    timestamp: formatTime(),
                },
            ]);

            setLoading(true);

            const controller = new AbortController();

            abortControllerRef.current = controller;

            try {
                /*
                 * If your chatWithAI service accepts config:
                 *
                 * chatWithAI(value, {
                 *     signal: controller.signal
                 * })
                 *
                 * If it currently accepts only value,
                 * change the service accordingly.
                 */

                const response = await chatWithAI(value, {
                    signal: controller.signal,
                });

                console.log("AI BACKEND RESPONSE:", response);

                const aiData = extractAIData(response);

                if (!aiData) {
                    throw new Error(
                        "Invalid response received from QuickFix AI."
                    );
                }

                const aiMessageId = createId();

                setMessages((prev) => [
                    ...prev,
                    {
                        id: aiMessageId,
                        type: "ai",
                        data: aiData,
                        timestamp: formatTime(),
                    },
                ]);
            } catch (error) {
                console.error("AI CHAT ERROR:", error);

                if (
                    error?.name === "CanceledError" ||
                    error?.code === "ERR_CANCELED"
                ) {
                    return;
                }

                const errorMessage = getErrorMessage(error);

                setMessages((prev) => [
                    ...prev,
                    {
                        id: createId(),
                        type: "error",
                        text: errorMessage,
                        retryQuestion: value,
                        timestamp: formatTime(),
                    },
                ]);
            } finally {
                setLoading(false);
                abortControllerRef.current = null;

                setTimeout(() => {
                    inputRef.current?.focus();
                }, 50);
            }
        },
        [question, loading]
    );

    /* =====================================================
       CANCEL REQUEST
    ===================================================== */

    const cancelRequest = () => {
        abortControllerRef.current?.abort();

        setLoading(false);
        abortControllerRef.current = null;

        setTimeout(() => {
            inputRef.current?.focus();
        }, 50);
    };

    /* =====================================================
       CLEAR CHAT
    ===================================================== */

    const clearChat = () => {
        if (loading) {
            cancelRequest();
        }

        setMessages([]);
        setQuestion("");
        setShowClearConfirm(false);

        setTimeout(() => {
            inputRef.current?.focus();
        }, 50);
    };

    /* =====================================================
       FIND MECHANIC
    ===================================================== */

    const findMechanic = () => {
        navigate("/bookings");
    };

    /* =====================================================
       COPY AI RESPONSE
    ===================================================== */

    const copyAIResponse = async (data, messageId) => {
        try {
            const text = buildCopyText(data);

            await navigator.clipboard.writeText(text);

            setCopiedId(messageId);

            setTimeout(() => {
                setCopiedId(null);
            }, 1800);
        } catch (error) {
            console.error("COPY ERROR:", error);
        }
    };

    /* =====================================================
       MEMO
    ===================================================== */

    const hasMessages = useMemo(
        () => messages.length > 0,
        [messages]
    );

    return (
        <div className="min-h-screen bg-[#f7faff]">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50">

                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

                <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">

                    <div className="grid items-center gap-10 lg:grid-cols-2">

                        {/* LEFT */}

                        <div>

                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 shadow-sm">

                                <Sparkles
                                    size={16}
                                    className="text-blue-600"
                                />

                                <span className="text-xs font-bold text-blue-600">
                                    Smart Vehicle Assistance
                                </span>

                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                                <span className="text-[10px] font-semibold text-emerald-600">
                                    ONLINE
                                </span>

                            </div>

                            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">

                                Your Vehicle.

                                <br />

                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Your AI Mechanic.
                                </span>

                            </h1>

                            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                                Describe your vehicle problem and QuickFix AI
                                will analyze possible causes, recommended
                                actions, estimated repair costs and safety
                                concerns.
                            </p>

                            <div className="mt-7 flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                                    <Bot size={22} />
                                </div>

                                <div>

                                    <p className="text-sm font-bold text-slate-800">
                                        QuickFix AI
                                    </p>

                                    <p className="text-xs text-emerald-600">
                                        ● Ready to diagnose your vehicle
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* AI VISUAL */}

                        <div className="flex justify-center lg:justify-end">

                            <div className="relative flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">

                                <div className="absolute inset-0 rounded-full bg-blue-100/50 blur-2xl" />

                                <div className="absolute inset-5 rounded-full border border-blue-100 bg-white/70 shadow-inner" />

                                <div className="absolute inset-12 rounded-full border border-indigo-100" />

                                <div className="relative flex h-32 w-32 items-center justify-center rounded-[32%] bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/30 sm:h-36 sm:w-36">

                                    <Bot
                                        size={70}
                                        strokeWidth={1.2}
                                        className="text-white"
                                    />

                                </div>

                                <div className="absolute right-0 top-8 rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-xl">

                                    <div className="flex items-center gap-2">

                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                            <Sparkles size={14} />
                                        </div>

                                        <div>

                                            <p className="text-[10px] font-bold text-slate-700">
                                                AI Diagnosis
                                            </p>

                                            <p className="text-[9px] text-emerald-600">
                                                Instant analysis
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <div className="absolute bottom-5 left-0 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl">

                                    <div className="flex items-center gap-2">

                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                            <ShieldCheck size={14} />
                                        </div>

                                        <div>

                                            <p className="text-[10px] font-bold text-slate-700">
                                                Safety First
                                            </p>

                                            <p className="text-[9px] text-slate-400">
                                                Mechanic guidance
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* =================================================
                MAIN
            ================================================= */}

            <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">

                {/* QUICK QUESTIONS */}

                <div className="mb-7">

                    <div className="mb-3">

                        <p className="text-sm font-bold text-slate-800">
                            Start with a question
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                            Choose a common vehicle issue
                        </p>

                    </div>

                    <div className="flex flex-wrap gap-2">

                        {quickQuestions.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => sendQuestion(item)}
                                disabled={loading}
                                className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                <MessageCircle
                                    size={14}
                                    className="text-slate-300 transition group-hover:text-blue-500"
                                />

                                {item}

                            </button>
                        ))}

                    </div>

                </div>

                {/* =================================================
                    CHAT CARD
                ================================================= */}

                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">

                    {/* CHAT HEADER */}

                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

                        <div className="flex items-center gap-3">

                            <div className="relative">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Bot size={20} />
                                </div>

                                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />

                            </div>

                            <div>

                                <p className="text-sm font-bold text-slate-900">
                                    QuickFix AI
                                </p>

                                <p className="text-[11px] text-emerald-600">
                                    {loading
                                        ? "Analyzing vehicle..."
                                        : "Online • Vehicle Assistant"}
                                </p>

                            </div>

                        </div>

                        {hasMessages && (
                            <button
                                type="button"
                                onClick={() =>
                                    setShowClearConfirm(true)
                                }
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                aria-label="Clear chat"
                            >

                                <Trash2 size={15} />

                                <span className="hidden sm:block">
                                    Clear
                                </span>

                            </button>
                        )}

                    </div>

                    {/* =================================================
                        MESSAGES
                    ================================================= */}

                    <div className="min-h-[360px] max-h-[620px] overflow-y-auto px-4 py-5 sm:px-6">

                        {/* EMPTY */}

                        {messages.length === 0 && !loading && (
                            <EmptyState
                                onQuestion={sendQuestion}
                            />
                        )}

                        <div className="space-y-5">

                            {messages.map((message) => (
                                <MessageItem
                                    key={message.id}
                                    message={message}
                                    onRetry={sendQuestion}
                                    onCopy={copyAIResponse}
                                    copiedId={copiedId}
                                    onFindMechanic={findMechanic}
                                />
                            ))}

                            {/* LOADING */}

                            {loading && (
                                <LoadingMessage
                                    onCancel={cancelRequest}
                                />
                            )}

                        </div>

                        <div ref={messagesEndRef} />

                    </div>

                    {/* =================================================
                        INPUT
                    ================================================= */}

                    <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5">

                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10">

                            <MessageCircle
                                size={19}
                                className="ml-2 shrink-0 text-slate-300"
                            />

                            <input
                                ref={inputRef}
                                value={question}
                                onChange={handleInputChange}
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" &&
                                        !event.shiftKey
                                    ) {
                                        event.preventDefault();
                                        sendQuestion();
                                    }
                                }}
                                disabled={loading}
                                maxLength={MAX_MESSAGE_LENGTH}
                                placeholder="Describe your vehicle problem..."
                                className="h-12 flex-1 bg-transparent px-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-50"
                                aria-label="Describe your vehicle problem"
                            />

                            {loading ? (
                                <button
                                    type="button"
                                    onClick={cancelRequest}
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100"
                                    aria-label="Cancel request"
                                >
                                    <X size={18} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => sendQuestion()}
                                    disabled={!question.trim()}
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 transition hover:scale-[1.03] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Send message"
                                >
                                    <Send size={18} />
                                </button>
                            )}

                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">

                            <p className="text-[10px] leading-4 text-slate-400">
                                AI responses are informational only. For
                                critical issues, consult a professional
                                mechanic.
                            </p>

                            <span className="hidden shrink-0 items-center gap-1 text-[10px] font-semibold text-slate-400 sm:flex">
                                <ShieldCheck size={12} />
                                Secure
                            </span>

                        </div>

                        <div className="mt-1 text-right text-[9px] text-slate-300">
                            {question.length}/{MAX_MESSAGE_LENGTH}
                        </div>

                    </div>

                </div>

                {/* =================================================
                    TOPICS
                ================================================= */}

                <div className="mt-10">

                    <div className="mb-5">

                        <h2 className="text-lg font-black text-slate-900">
                            Explore Vehicle Topics
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            Get instant AI assistance for common vehicle
                            issues
                        </p>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                        {topics.map((topic) => {

                            const Icon = topic.icon;

                            return (
                                <button
                                    key={topic.title}
                                    type="button"
                                    onClick={() =>
                                        sendQuestion(topic.question)
                                    }
                                    disabled={loading}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-blue-50 opacity-0 transition group-hover:opacity-100" />

                                    <div className="relative">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

                                            <Icon size={20} />

                                        </div>

                                        <h3 className="mt-4 text-sm font-bold text-slate-800">
                                            {topic.title}
                                        </h3>

                                        <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-slate-400 transition group-hover:text-blue-500">

                                            Ask QuickFix AI

                                            <ChevronRight size={12} />

                                        </div>

                                    </div>

                                </button>
                            );
                        })}

                    </div>

                </div>

            </section>

            {/* CLEAR CONFIRMATION */}

            {showClearConfirm && (
                <ClearChatModal
                    onCancel={() =>
                        setShowClearConfirm(false)
                    }
                    onConfirm={clearChat}
                />
            )}

        </div>
    );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ onQuestion }) {
    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center text-center">

            <div className="relative">

                <div className="absolute inset-0 rounded-3xl bg-blue-100 blur-xl" />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
                    <Bot size={38} />
                </div>

            </div>

            <h3 className="mt-6 text-lg font-black text-slate-800">
                How can I help your vehicle?
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                Tell me what your car, bike or EV is experiencing.
                I'll analyze the problem and suggest the next steps.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">

                {["Engine", "Battery", "Brakes", "EV"].map(
                    (item) => (
                        <span
                            key={item}
                            className="rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-400"
                        >
                            {item}
                        </span>
                    )
                )}

            </div>

        </div>
    );
}

/* =========================================================
   MESSAGE ITEM
========================================================= */

function MessageItem({
    message,
    onRetry,
    onCopy,
    copiedId,
    onFindMechanic,
}) {
    if (message.type === "user") {
        return (
            <div className="flex justify-end">

                <div className="max-w-[85%]">

                    <div className="rounded-2xl rounded-br-md bg-gradient-to-br from-blue-600 to-indigo-600 px-4 py-3 text-sm leading-6 text-white shadow-md shadow-blue-500/10">
                        {message.text}
                    </div>

                    <p className="mt-1 text-right text-[9px] text-slate-300">
                        {message.timestamp}
                    </p>

                </div>

            </div>
        );
    }

    if (message.type === "error") {
        return (
            <div className="flex justify-start">

                <div className="max-w-[85%]">

                    <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">

                        <AlertTriangle
                            size={18}
                            className="mt-0.5 shrink-0 text-red-500"
                        />

                        <div>

                            <p className="text-sm leading-6 text-red-600">
                                {message.text}
                            </p>

                            {message.retryQuestion && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        onRetry(
                                            message.retryQuestion
                                        )
                                    }
                                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-red-600 shadow-sm transition hover:bg-red-100"
                                >
                                    <RefreshCw size={12} />
                                    Try again
                                </button>
                            )}

                        </div>

                    </div>

                    <p className="mt-1 text-[9px] text-slate-300">
                        {message.timestamp}
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="flex w-full items-start gap-3">

            <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex">
                <Bot size={18} />
            </div>

            <div className="w-full max-w-[900px] rounded-2xl rounded-bl-md border border-slate-100 bg-slate-50/70 px-4 py-4 shadow-sm sm:px-5">

                <AIResponse
                    data={message.data}
                    messageId={message.id}
                    onCopy={onCopy}
                    copiedId={copiedId}
                    onFindMechanic={onFindMechanic}
                />

                <p className="mt-4 text-[9px] text-slate-300">
                    QuickFix AI • {message.timestamp}
                </p>

            </div>

        </div>
    );
}

/* =========================================================
   AI RESPONSE
========================================================= */

function AIResponse({
    data,
    messageId,
    onCopy,
    copiedId,
    onFindMechanic,
}) {
    const confidence = normalizeConfidence(data?.confidence);

    const vehicle = data?.vehicle || {};

    const hasVehicle =
        vehicle?.company ||
        vehicle?.model ||
        vehicle?.registrationNumber;

    const causes = Array.isArray(data?.possibleCauses)
        ? data.possibleCauses.filter(Boolean)
        : [];

    const steps = Array.isArray(data?.recommendedSteps)
        ? data.recommendedSteps.filter(Boolean)
        : [];

    const mechanicRequired =
        data?.needMechanic?.required === true;

    const costMin = Number(data?.estimatedCost?.min);
    const costMax = Number(data?.estimatedCost?.max);

    const hasCost =
        Number.isFinite(costMin) ||
        Number.isFinite(costMax);

    const isCritical = Boolean(data?.safetyAdvice);

    return (
        <div className="space-y-5">

            {/* AI HEADER */}

            <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                    <Bot size={20} />
                </div>

                <div className="flex-1">

                    <div className="flex items-center gap-2">

                        <p className="text-sm font-bold text-slate-900">
                            QuickFix AI
                        </p>

                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-blue-600">
                            AI
                        </span>

                    </div>

                    <p className="text-[11px] text-emerald-600">
                        ● Vehicle specialist
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        onCopy(data, messageId)
                    }
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] font-semibold text-slate-400 transition hover:border-blue-200 hover:text-blue-600"
                    aria-label="Copy AI response"
                >

                    {copiedId === messageId ? (
                        <>
                            <Check size={13} />
                            Copied
                        </>
                    ) : (
                        <>
                            <Clipboard size={13} />
                            Copy
                        </>
                    )}

                </button>

            </div>

            {/* VEHICLE */}

            {hasVehicle && (
                <div className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">

                    <div className="flex items-center gap-3 border-b border-blue-100 px-4 py-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                            <Car size={18} />
                        </div>

                        <div>

                            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                                Your Vehicle
                            </p>

                            <p className="text-sm font-bold text-slate-800">

                                {vehicle.company ||
                                    "Vehicle"}{" "}

                                {vehicle.model || ""}

                            </p>

                        </div>

                    </div>

                    <div className="grid gap-3 p-4 sm:grid-cols-2">

                        {vehicle.company && (
                            <VehicleItem
                                label="Company"
                                value={vehicle.company}
                            />
                        )}

                        {vehicle.model && (
                            <VehicleItem
                                label="Model"
                                value={vehicle.model}
                            />
                        )}

                        {vehicle.fuelType && (
                            <VehicleItem
                                label="Fuel Type"
                                value={vehicle.fuelType}
                            />
                        )}

                        {vehicle.vehicleType && (
                            <VehicleItem
                                label="Vehicle Type"
                                value={vehicle.vehicleType}
                            />
                        )}

                        {vehicle.registrationNumber && (
                            <VehicleItem
                                label="Registration"
                                value={
                                    vehicle.registrationNumber
                                }
                            />
                        )}

                    </div>

                </div>
            )}

            {/* PROBLEM */}

            {data?.problem && (
                <ResponseSection
                    title="Problem Identified"
                    icon={<Activity size={17} />}
                >
                    <p className="text-sm leading-6 text-slate-600">
                        {data.problem}
                    </p>
                </ResponseSection>
            )}

            {/* DIAGNOSIS */}

            {data?.diagnosis && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">

                    <div className="mb-2 flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <Zap size={16} />
                        </div>

                        <h4 className="text-sm font-bold text-slate-800">
                            AI Diagnosis
                        </h4>

                    </div>

                    <p className="text-sm leading-6 text-slate-600">
                        {data.diagnosis}
                    </p>

                </div>
            )}

            {/* POSSIBLE CAUSES */}

            {causes.length > 0 && (
                <ResponseSection
                    title="Possible Causes"
                    icon={<CircleAlert size={17} />}
                >

                    <div className="space-y-2">

                        {causes.map((cause, index) => (
                            <div
                                key={`${cause}-${index}`}
                                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                            >

                                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                                    <CircleAlert size={14} />
                                </div>

                                <p className="text-sm leading-5 text-slate-600">
                                    {cause}
                                </p>

                            </div>
                        ))}

                    </div>

                </ResponseSection>
            )}

            {/* RECOMMENDED STEPS */}

            {steps.length > 0 && (
                <ResponseSection
                    title="Recommended Steps"
                    icon={<CheckCircle2 size={17} />}
                >

                    <div className="space-y-3">

                        {steps.map((step, index) => (
                            <div
                                key={`${step}-${index}`}
                                className="flex items-start gap-3"
                            >

                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm">
                                    {index + 1}
                                </div>

                                <div className="flex-1 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">

                                    <p className="text-sm leading-5 text-slate-600">
                                        {step}
                                    </p>

                                </div>

                            </div>
                        ))}

                    </div>

                </ResponseSection>
            )}

            {/* COST */}

            {hasCost && (
                <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">

                    <div className="flex items-center justify-between gap-3 p-4">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                <IndianRupee size={19} />
                            </div>

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                                    Estimated Repair Cost
                                </p>

                                <p className="mt-1 text-xl font-black text-slate-900">

                                    ₹
                                    {formatCurrency(
                                        Number.isFinite(costMin)
                                            ? costMin
                                            : costMax
                                    )}

                                    {Number.isFinite(costMin) &&
                                        Number.isFinite(costMax) &&
                                        " - ₹"}

                                    {Number.isFinite(costMin) &&
                                        Number.isFinite(costMax) &&
                                        formatCurrency(costMax)}

                                </p>

                            </div>

                        </div>

                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700">
                            INR
                        </span>

                    </div>

                    <div className="border-t border-emerald-100 px-4 py-2.5">

                        <p className="text-[10px] leading-4 text-emerald-700">
                            Final cost may vary depending on vehicle,
                            parts and mechanic inspection.
                        </p>

                    </div>

                </div>
            )}

            {/* MECHANIC */}

            {mechanicRequired && (
                <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-yellow-50 to-white p-4">

                    <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                            <Wrench size={19} />
                        </div>

                        <div className="flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                                <h4 className="text-sm font-bold text-orange-900">
                                    Mechanic Recommended
                                </h4>

                                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[9px] font-bold text-orange-700">
                                    IMPORTANT
                                </span>

                            </div>

                            <p className="mt-1 text-xs leading-5 text-orange-800">
                                {data.needMechanic.reason ||
                                    "Professional mechanic inspection is recommended."}
                            </p>

                            <button
                                type="button"
                                onClick={onFindMechanic}
                                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-orange-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-md active:translate-y-0"
                            >

                                <Wrench size={14} />

                                Find a mechanic

                                <ChevronRight size={14} />

                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* SAFETY */}

            {data?.safetyAdvice && (
                <div
                    className={`rounded-2xl p-4 ${
                        isCritical
                            ? "border-2 border-red-300 bg-red-50"
                            : "border border-red-200 bg-red-50"
                    }`}
                >

                    <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                            <AlertTriangle size={18} />
                        </div>

                        <div>

                            <div className="flex items-center gap-2">

                                <h4 className="text-sm font-bold text-red-800">
                                    Safety Advice
                                </h4>

                                {isCritical && (
                                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold text-red-700">
                                        SAFETY
                                    </span>
                                )}

                            </div>

                            <p className="mt-1 text-xs leading-5 text-red-700">
                                {data.safetyAdvice}
                            </p>

                        </div>

                    </div>

                </div>
            )}

            {/* ADDITIONAL ADVICE */}

            {data?.additionalAdvice && (
                <ResponseSection
                    title="Additional Advice"
                    icon={<ShieldCheck size={17} />}
                >
                    <p className="text-sm leading-6 text-slate-600">
                        {data.additionalAdvice}
                    </p>
                </ResponseSection>
            )}

            {/* CONFIDENCE */}

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <ShieldCheck size={16} />
                        </div>

                        <div>

                            <p className="text-xs font-bold text-slate-700">
                                AI Confidence
                            </p>

                            <p className="text-[10px] text-slate-400">
                                Based on available information
                            </p>

                        </div>

                    </div>

                    <span className="text-sm font-black text-emerald-600">
                        {confidence}%
                    </span>

                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                        style={{
                            width: `${confidence}%`,
                        }}
                    />

                </div>

            </div>

        </div>
    );
}

/* =========================================================
   LOADING MESSAGE
========================================================= */

function LoadingMessage({ onCancel }) {
    return (
        <div className="flex items-start gap-3">

            <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex">
                <Bot size={18} />
            </div>

            <div className="flex items-center gap-3 rounded-2xl rounded-bl-md border border-slate-100 bg-slate-50 px-4 py-3">

                <Loader2
                    size={18}
                    className="animate-spin text-blue-600"
                />

                <div>

                    <p className="text-xs font-semibold text-slate-600">
                        QuickFix AI is analyzing...
                    </p>

                    <div className="mt-1 flex gap-1">

                        <span className="h-1 w-1 animate-pulse rounded-full bg-blue-400" />

                        <span className="h-1 w-1 animate-pulse rounded-full bg-blue-400 [animation-delay:150ms]" />

                        <span className="h-1 w-1 animate-pulse rounded-full bg-blue-400 [animation-delay:300ms]" />

                    </div>

                </div>

                <button
                    type="button"
                    onClick={onCancel}
                    className="ml-2 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                >
                    Cancel
                </button>

            </div>

        </div>
    );
}

/* =========================================================
   VEHICLE ITEM
========================================================= */

function VehicleItem({ label, value }) {
    return (
        <div className="rounded-xl bg-white/70 p-3">

            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 break-words text-xs font-bold text-slate-700">
                {value}
            </p>

        </div>
    );
}

/* =========================================================
   RESPONSE SECTION
========================================================= */

function ResponseSection({ title, icon, children }) {
    return (
        <div>

            <div className="mb-2 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    {icon}
                </div>

                <h4 className="text-sm font-bold text-slate-800">
                    {title}
                </h4>

            </div>

            {children}

        </div>
    );
}

/* =========================================================
   CLEAR CHAT MODAL
========================================================= */

function ClearChatModal({ onCancel, onConfirm }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-5 backdrop-blur-sm"
            onMouseDown={onCancel}
        >

            <div
                className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <Trash2 size={21} />
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-900">
                    Clear conversation?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    All messages from this AI session will be removed
                    from the current screen.
                </p>

                <div className="mt-6 flex gap-3">

                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-red-700"
                    >
                        Clear Chat
                    </button>

                </div>

            </div>

        </div>
    );
}

/* =========================================================
   COPY FORMAT
========================================================= */

function buildCopyText(data) {
    const parts = [];

    if (data?.problem) {
        parts.push(`Problem: ${data.problem}`);
    }

    if (data?.diagnosis) {
        parts.push(`Diagnosis: ${data.diagnosis}`);
    }

    if (Array.isArray(data?.possibleCauses)) {
        parts.push(
            `Possible Causes:\n${data.possibleCauses
                .filter(Boolean)
                .map((item) => `• ${item}`)
                .join("\n")}`
        );
    }

    if (Array.isArray(data?.recommendedSteps)) {
        parts.push(
            `Recommended Steps:\n${data.recommendedSteps
                .filter(Boolean)
                .map(
                    (item, index) =>
                        `${index + 1}. ${item}`
                )
                .join("\n")}`
        );
    }

    if (data?.estimatedCost) {
        const min = Number(data.estimatedCost.min);
        const max = Number(data.estimatedCost.max);

        if (
            Number.isFinite(min) &&
            Number.isFinite(max)
        ) {
            parts.push(
                `Estimated Cost: ₹${formatCurrency(
                    min
                )} - ₹${formatCurrency(max)}`
            );
        }
    }

    if (data?.needMechanic?.required) {
        parts.push(
            `Mechanic Recommended: ${
                data.needMechanic.reason ||
                "Professional inspection recommended."
            }`
        );
    }

    if (data?.safetyAdvice) {
        parts.push(
            `Safety Advice: ${data.safetyAdvice}`
        );
    }

    if (data?.additionalAdvice) {
        parts.push(
            `Additional Advice: ${data.additionalAdvice}`
        );
    }

    return `QuickFix AI\n\n${parts.join("\n\n")}`;
}

export default AIAssistant;