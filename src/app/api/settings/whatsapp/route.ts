import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { WhatsAppSettings } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "whatsapp_settings.json");

const DEFAULT_SETTINGS: WhatsAppSettings = {
    enabled: false,
    phoneNumber: "",
    displayLabel: "WhatsApp Support",
    message: "Hello Transglobe Logistics, I would like to inquire about my cargo tracking.",
    showFloating: true,
    showHeader: true,
    showContactPage: true,
    showFooter: true,
    updatedAt: new Date().toISOString()
};

function readSettings(): WhatsAppSettings {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (fs.existsSync(SETTINGS_FILE)) {
            const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
            return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
        }
    } catch (e) {
        console.error("Failed to read WhatsApp settings file:", e);
    }
    return DEFAULT_SETTINGS;
}

function writeSettings(settings: WhatsAppSettings) {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

export async function GET() {
    const settings = readSettings();
    return NextResponse.json(settings, {
        headers: {
            "Cache-Control": "no-store, max-age=0"
        }
    });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const current = readSettings();

        const updated: WhatsAppSettings = {
            enabled: Boolean(body.enabled),
            phoneNumber: (body.phoneNumber || "").trim(),
            displayLabel: (body.displayLabel || "WhatsApp Support").trim(),
            message: (body.message || "").trim(),
            showFloating: body.showFloating !== undefined ? Boolean(body.showFloating) : true,
            showHeader: body.showHeader !== undefined ? Boolean(body.showHeader) : true,
            showContactPage: body.showContactPage !== undefined ? Boolean(body.showContactPage) : true,
            showFooter: body.showFooter !== undefined ? Boolean(body.showFooter) : true,
            updatedAt: new Date().toISOString()
        };

        writeSettings(updated);
        return NextResponse.json({ success: true, settings: updated });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 400 });
    }
}

export async function DELETE() {
    try {
        const cleared: WhatsAppSettings = {
            ...DEFAULT_SETTINGS,
            enabled: false,
            phoneNumber: "",
            updatedAt: new Date().toISOString()
        };
        writeSettings(cleared);
        return NextResponse.json({ success: true, settings: cleared });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 400 });
    }
}
