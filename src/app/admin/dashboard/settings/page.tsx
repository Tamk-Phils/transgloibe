"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
    Settings,
    Shield,
    Globe,
    Bell,
    CreditCard,
    Save,
    RefreshCw,
    Radar,
    Trash2,
    Check,
    AlertCircle,
    ExternalLink,
    PhoneCall,
    Sparkles,
    Eye,
    EyeOff
} from "lucide-react";
import { useWhatsAppSettings, formatWhatsAppUrl, cleanWhatsAppNumber } from "@/lib/whatsapp";
import { WhatsAppSettings } from "@/types";

function SettingsContent() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get("tab") === "whatsapp" ? "WHATSAPP" : "WHATSAPP";

    const [activeTab, setActiveTab] = useState<string>(initialTab);
    const { settings: savedSettings, isLoaded, updateSettings, removeSettings } = useWhatsAppSettings();

    // Local form state for WhatsApp
    const [formData, setFormData] = useState<WhatsAppSettings>({
        enabled: false,
        phoneNumber: "",
        displayLabel: "Direct WhatsApp Dispatch",
        message: "Hello Transglobe Logistics, I would like to inquire about my cargo tracking.",
        showFloating: true,
        showHeader: true,
        showContactPage: true,
        showFooter: true
    });

    const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Sync from loaded settings
    useEffect(() => {
        if (isLoaded) {
            setFormData(savedSettings);
        }
    }, [isLoaded, savedSettings]);

    // Handle tab change from query param
    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "whatsapp") {
            setActiveTab("WHATSAPP");
        }
    }, [searchParams]);

    const previewUrl = formData.phoneNumber
        ? formatWhatsAppUrl(formData.phoneNumber, formData.message)
        : "";

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        setStatusMsg(null);

        const clean = cleanWhatsAppNumber(formData.phoneNumber);
        if (formData.enabled && (!clean || clean.length < 5)) {
            setStatusMsg({
                type: "error",
                text: "Please enter a valid international phone number with country code (e.g. +1 555 019 2834)."
            });
            setIsSaving(false);
            return;
        }

        try {
            const success = await updateSettings(formData);
            if (success) {
                setStatusMsg({
                    type: "success",
                    text: formData.enabled
                        ? "WhatsApp contact successfully saved and live across all public pages!"
                        : "WhatsApp settings saved (currently disabled from public view)."
                });
            } else {
                setStatusMsg({
                    type: "error",
                    text: "Failed to persist settings. Please check network connection."
                });
            }
        } catch (err: any) {
            setStatusMsg({ type: "error", text: err.message || "An unexpected error occurred." });
        } finally {
            setIsSaving(false);
            setTimeout(() => setStatusMsg(null), 6000);
        }
    };

    const handleRemove = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to remove the WhatsApp display contact? It will be immediately removed from the website."
        );
        if (!confirmed) return;

        setIsSaving(true);
        try {
            await removeSettings();
            setFormData({
                enabled: false,
                phoneNumber: "",
                displayLabel: "Direct WhatsApp Dispatch",
                message: "Hello Transglobe Logistics, I would like to inquire about my cargo tracking.",
                showFloating: true,
                showHeader: true,
                showContactPage: true,
                showFooter: true
            });
            setStatusMsg({
                type: "info",
                text: "WhatsApp display contact has been completely removed from the website."
            });
        } catch (err: any) {
            setStatusMsg({ type: "error", text: err.message || "Failed to remove WhatsApp contact." });
        } finally {
            setIsSaving(false);
            setTimeout(() => setStatusMsg(null), 6000);
        }
    };

    const navTabs = [
        { label: "WHATSAPP CONTACT", id: "WHATSAPP", icon: PhoneCall, highlight: true },
        { label: "NETWORK IDENTITY", id: "GENERAL", icon: Globe, highlight: false },
        { label: "AUTOMATED DISPATCH", id: "DISPATCH", icon: Bell, highlight: false },
        { label: "UPLINK SECURITY", id: "SECURITY", icon: Shield, highlight: false },
    ];

    return (
        <div className="space-y-10 pb-24 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Radar size={20} className="text-blue-600 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                            System Administration
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
                        HUB <span className="text-blue-600 italic">PARAMETERS.</span>
                    </h1>
                    <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">
                        Configure customer touchpoints, WhatsApp direct dispatch, and network credentials.
                    </p>
                </div>

                {activeTab === "WHATSAPP" && (
                    <div className="flex items-center gap-3">
                        {formData.phoneNumber && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={isSaving}
                                className="bg-red-50 hover:bg-red-100 text-red-600 px-5 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 border border-red-200 transition-all cursor-pointer"
                            >
                                <Trash2 size={16} /> Remove Contact
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => handleSave()}
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                        >
                            <Save size={16} /> {isSaving ? "Saving..." : "Save & Deploy"}
                        </button>
                    </div>
                )}
            </div>

            {/* Notification Banner */}
            {statusMsg && (
                <div
                    className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border transition-all animate-in fade-in ${
                        statusMsg.type === "success"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : statusMsg.type === "error"
                            ? "bg-red-50 text-red-800 border-red-200"
                            : "bg-blue-50 text-blue-800 border-blue-200"
                    }`}
                >
                    {statusMsg.type === "success" && <Check size={18} className="text-emerald-600 shrink-0" />}
                    {statusMsg.type === "error" && <AlertCircle size={18} className="text-red-600 shrink-0" />}
                    {statusMsg.type === "info" && <Sparkles size={18} className="text-blue-600 shrink-0" />}
                    <span>{statusMsg.text}</span>
                </div>
            )}

            {/* Main Tabs Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-2">
                    {navTabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
                                    isActive
                                        ? "bg-slate-900 text-white border-slate-900 shadow-xl"
                                        : tab.highlight
                                        ? "bg-emerald-50/60 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                        : "text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <tab.icon
                                        size={18}
                                        className={
                                            isActive
                                                ? "text-blue-400"
                                                : tab.highlight
                                                ? "text-emerald-600"
                                                : "text-slate-400"
                                        }
                                    />
                                    <span>{tab.label}</span>
                                </div>
                                {tab.highlight && !isActive && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content Panes */}
                <div className="lg:col-span-3">
                    {/* TAB: WHATSAPP CONTACT */}
                    {activeTab === "WHATSAPP" && (
                        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-10">
                            {/* Status Card */}
                            <div
                                className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                    formData.enabled && formData.phoneNumber
                                        ? "bg-emerald-50/70 border-emerald-200"
                                        : "bg-slate-50 border-slate-200"
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                                            formData.enabled && formData.phoneNumber
                                                ? "bg-[#25D366]"
                                                : "bg-slate-400"
                                        }`}
                                    >
                                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-black text-sm text-slate-900 uppercase tracking-tight">
                                                Public WhatsApp Status:
                                            </h4>
                                            <span
                                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                                    formData.enabled && formData.phoneNumber
                                                        ? "bg-emerald-200 text-emerald-800"
                                                        : "bg-slate-200 text-slate-600"
                                                }`}
                                            >
                                                {formData.enabled && formData.phoneNumber ? "LIVE / ACTIVE" : "DISABLED"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                                            {formData.enabled && formData.phoneNumber
                                                ? `Currently routing incoming website traffic to ${formData.phoneNumber}`
                                                : "WhatsApp contact is currently hidden from public visitors."}
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Switch */}
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={formData.enabled}
                                        onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-14 h-8 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#25D366]"></div>
                                    <span className="ml-3 text-xs font-black uppercase tracking-wider text-slate-700">
                                        {formData.enabled ? "Enabled" : "Disabled"}
                                    </span>
                                </label>
                            </div>

                            {/* Form Fields */}
                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Phone Number */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                                            <span>WhatsApp Phone Number *</span>
                                            <span className="text-[10px] text-slate-400 font-normal">Include country code</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                            placeholder="e.g. +1 (555) 019-2834 or 447911123456"
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                                        />
                                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                            The destination mobile phone number registered with WhatsApp. Digits will be automatically normalized.
                                        </p>
                                    </div>

                                    {/* Display Label */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                                            <span>Public Button Label</span>
                                            <span className="text-[10px] text-slate-400 font-normal">Shown to visitors</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.displayLabel || ""}
                                            onChange={(e) => setFormData(prev => ({ ...prev, displayLabel: e.target.value }))}
                                            placeholder="e.g. Direct WhatsApp Dispatch or +1 555-019-2834"
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                                        />
                                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                            Friendly title displayed on the floating widget and contact buttons.
                                        </p>
                                    </div>
                                </div>

                                {/* Pre-filled Welcome Message */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                                        <span>Pre-filled Welcome Message</span>
                                        <span className="text-[10px] text-slate-400 font-normal">Optional starter prompt</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.message || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                        placeholder="e.g. Hello Transglobe Logistics, I would like to inquire about my consignment tracking."
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all resize-none"
                                    />
                                    <p className="text-[11px] text-slate-400 font-medium">
                                        When visitors click the button, this message is automatically typed in their WhatsApp chat window ready to send.
                                    </p>
                                </div>

                                {/* Display Positions */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                                        Display Locations
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { key: "showFloating", label: "Floating Widget (Bottom Left Screen)", desc: "Always visible floating pill on all pages" },
                                            { key: "showHeader", label: "Top Announcement Header Bar", desc: "Visible in top bar on desktop and in mobile menu" },
                                            { key: "showContactPage", label: "Contact Us Page Card", desc: "Dedicated high-priority contact card on /contact" },
                                            { key: "showFooter", label: "Website Footer Support", desc: "Listed with official email in website footer" },
                                        ].map((pos) => {
                                            const isChecked = Boolean((formData as any)[pos.key] ?? true);
                                            return (
                                                <label
                                                    key={pos.key}
                                                    className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={(e) =>
                                                            setFormData(prev => ({ ...prev, [pos.key]: e.target.checked }))
                                                        }
                                                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                    />
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900">{pos.label}</p>
                                                        <p className="text-[11px] text-slate-500 font-normal">{pos.desc}</p>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Live Preview & Test Link Box */}
                                <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-xl">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 flex items-center gap-2">
                                            <Eye size={14} /> LIVE NAVIGATION PREVIEW
                                        </span>
                                        {previewUrl && (
                                            <a
                                                href={previewUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#25D366] hover:underline"
                                            >
                                                Test Link in WhatsApp <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>

                                    {formData.phoneNumber ? (
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                                            <div className="space-y-1">
                                                <p className="text-xs text-slate-400 font-mono font-medium">
                                                    Target URL: <span className="text-white break-all">{previewUrl}</span>
                                                </p>
                                                <p className="text-[11px] text-slate-400">
                                                    Normalized digits: <strong className="text-sky-300 font-mono">{cleanWhatsAppNumber(formData.phoneNumber)}</strong>
                                                </p>
                                            </div>

                                            {/* Preview Pill */}
                                            <a
                                                href={previewUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-full shadow-lg font-bold text-xs shrink-0 transition-transform hover:scale-105"
                                            >
                                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                </svg>
                                                <span>{formData.displayLabel || "Chat on WhatsApp"}</span>
                                            </a>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">
                                            Enter a WhatsApp phone number above to preview the direct navigation link.
                                        </p>
                                    )}
                                </div>

                                {/* Form Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                                    {formData.phoneNumber ? (
                                        <button
                                            type="button"
                                            onClick={handleRemove}
                                            disabled={isSaving}
                                            className="w-full sm:w-auto text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-red-200"
                                        >
                                            <Trash2 size={16} /> Remove From Website
                                        </button>
                                    ) : (
                                        <div />
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                                    >
                                        <Save size={16} /> {isSaving ? "Saving..." : "Save & Deploy Contact"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TAB: GENERAL & NETWORK */}
                    {activeTab === "GENERAL" && (
                        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-8">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <Globe size={18} className="text-blue-600" /> Platform Nomenclature & Identity
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Brand Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Transglobe Logistics"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Official Domain</label>
                                    <input
                                        type="text"
                                        defaultValue="transglobelogistics.org"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Support Email</label>
                                    <input
                                        type="email"
                                        defaultValue="info@transglobelogistics.org"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Dispatch Center</label>
                                    <input
                                        type="text"
                                        defaultValue="24/7 Satellite Global Dispatch"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: AUTOMATED DISPATCH */}
                    {activeTab === "DISPATCH" && (
                        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <Bell size={18} className="text-blue-600" /> Automated Telemetry & Dispatch
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: "EMAIL DISPATCH NOTIFICATIONS", desc: "Notify clients via SMTP when waybill status progresses.", active: true },
                                    { label: "SATELLITE POSITION RE-CALCULATION", desc: "Automatic interpolation of lat/long coordinates along cargo path.", active: true },
                                    { label: "SMS CRITICAL VARIANCE ALERTS", desc: "Urgent notifications for customs holds or delivery postponements.", active: false },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                        <div>
                                            <p className="font-extrabold text-xs text-slate-900 uppercase">{item.label}</p>
                                            <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${item.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                                            {item.active ? 'ENABLED' : 'DISABLED'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB: SECURITY */}
                    {activeTab === "SECURITY" && (
                        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <Shield size={18} className="text-blue-600" /> Security Access & Uplink Tokens
                            </h3>
                            <div className="p-8 bg-slate-950 text-white rounded-2xl space-y-4">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                                    ACTIVE CRYPTOGRAPHIC GATEWAY
                                </span>
                                <code className="block bg-black/60 p-4 rounded-xl font-mono text-xs text-blue-400 break-all border border-slate-800">
                                    TGL_SECURE_GATEWAY_NODE_ACTIVE_2026_SAT_8829
                                </code>
                                <p className="text-xs text-slate-400">
                                    Role-Based Access Control verified. Operator sessions expire after 24 hours of inactivity.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[40vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <SettingsContent />
        </Suspense>
    );
}
