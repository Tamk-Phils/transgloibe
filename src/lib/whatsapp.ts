"use client";

import { useState, useEffect, useCallback } from "react";
import { WhatsAppSettings } from "@/types";

export const WA_STORAGE_KEY = "transglobe_whatsapp_settings";
export const WA_EVENT_KEY = "transglobe:whatsapp-updated";

export const DEFAULT_WA_SETTINGS: WhatsAppSettings = {
    enabled: false,
    phoneNumber: "",
    displayLabel: "WhatsApp Support",
    message: "Hello Transglobe Logistics, I would like to inquire about my cargo tracking.",
    showFloating: true,
    showHeader: true,
    showContactPage: true,
    showFooter: true,
};

export function cleanWhatsAppNumber(phone: string): string {
    return phone.replace(/[^0-9]/g, "");
}

export function formatWhatsAppUrl(phoneNumber: string, message?: string): string {
    const clean = cleanWhatsAppNumber(phoneNumber);
    if (!clean) return "";
    const msg = (message || "").trim();
    if (msg) {
        return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
    }
    return `https://wa.me/${clean}`;
}

export function getLocalWhatsAppSettings(): WhatsAppSettings {
    if (typeof window === "undefined") return DEFAULT_WA_SETTINGS;
    try {
        const item = localStorage.getItem(WA_STORAGE_KEY);
        if (item) {
            return { ...DEFAULT_WA_SETTINGS, ...JSON.parse(item) };
        }
    } catch (e) {
        console.warn("Could not read WhatsApp settings from local storage:", e);
    }
    return DEFAULT_WA_SETTINGS;
}

export async function persistWhatsAppSettings(settings: WhatsAppSettings): Promise<boolean> {
    if (typeof window !== "undefined") {
        try {
            localStorage.setItem(WA_STORAGE_KEY, JSON.stringify(settings));
            window.dispatchEvent(new CustomEvent(WA_EVENT_KEY, { detail: settings }));
        } catch (e) {
            console.warn("Local storage write failed:", e);
        }
    }

    try {
        const res = await fetch("/api/settings/whatsapp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(settings)
        });
        return res.ok;
    } catch (e) {
        console.warn("Server API persist failed, relying on local storage cache:", e);
        return true;
    }
}

export async function removeWhatsAppSettings(): Promise<boolean> {
    const cleared: WhatsAppSettings = {
        ...DEFAULT_WA_SETTINGS,
        enabled: false,
        phoneNumber: "",
        updatedAt: new Date().toISOString()
    };

    if (typeof window !== "undefined") {
        try {
            localStorage.setItem(WA_STORAGE_KEY, JSON.stringify(cleared));
            window.dispatchEvent(new CustomEvent(WA_EVENT_KEY, { detail: cleared }));
        } catch (e) {
            console.warn("Local storage clear failed:", e);
        }
    }

    try {
        const res = await fetch("/api/settings/whatsapp", {
            method: "DELETE"
        });
        return res.ok;
    } catch (e) {
        console.warn("Server API delete failed, cleared locally:", e);
        return true;
    }
}

export function useWhatsAppSettings() {
    const [settings, setSettings] = useState<WhatsAppSettings>(DEFAULT_WA_SETTINGS);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // 1. Initial read from local cache
        const local = getLocalWhatsAppSettings();
        setSettings(local);
        setIsLoaded(true);

        // 2. Fetch fresh settings from server API
        let isMounted = true;
        fetch("/api/settings/whatsapp")
            .then(res => res.json())
            .then(data => {
                if (isMounted && data) {
                    setSettings(prev => {
                        const merged = { ...prev, ...data };
                        if (typeof window !== "undefined") {
                            try {
                                localStorage.setItem(WA_STORAGE_KEY, JSON.stringify(merged));
                            } catch {}
                        }
                        return merged;
                    });
                }
            })
            .catch(() => {
                // Silently keep local cache
            });

        // 3. Listen to cross-component and cross-tab update events
        const handleCustomUpdate = (e: Event) => {
            const customEvent = e as CustomEvent<WhatsAppSettings>;
            if (customEvent.detail) {
                setSettings(customEvent.detail);
            }
        };

        const handleStorageUpdate = (e: StorageEvent) => {
            if (e.key === WA_STORAGE_KEY && e.newValue) {
                try {
                    setSettings(JSON.parse(e.newValue));
                } catch {}
            }
        };

        window.addEventListener(WA_EVENT_KEY, handleCustomUpdate);
        window.addEventListener("storage", handleStorageUpdate);

        return () => {
            isMounted = false;
            window.removeEventListener(WA_EVENT_KEY, handleCustomUpdate);
            window.removeEventListener("storage", handleStorageUpdate);
        };
    }, []);

    const whatsappUrl = (settings.enabled && settings.phoneNumber)
        ? formatWhatsAppUrl(settings.phoneNumber, settings.message)
        : "";

    const update = useCallback(async (newSettings: WhatsAppSettings) => {
        setSettings(newSettings);
        return await persistWhatsAppSettings(newSettings);
    }, []);

    const remove = useCallback(async () => {
        const cleared: WhatsAppSettings = {
            ...DEFAULT_WA_SETTINGS,
            enabled: false,
            phoneNumber: ""
        };
        setSettings(cleared);
        return await removeWhatsAppSettings();
    }, []);

    return {
        settings,
        whatsappUrl,
        isLoaded,
        updateSettings: update,
        removeSettings: remove
    };
}
