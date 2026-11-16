import { cleanWhatsAppNumber, formatWhatsAppUrl } from '../../src/lib/whatsapp';
import fs from 'fs';
import path from 'path';

console.log("--- TRANSGLOBE LOGISTICS WHATSAPP CONTACT TEST SUITE ---");

// Test 1: Number normalization
console.log("\n[TEST 1] Testing Phone Number Cleaning...");
const rawNumbers = [
    { input: "+1 (555) 019-2834", expected: "15550192834" },
    { input: "+44 7911 123456", expected: "447911123456" },
    { input: "1-800-555-0199", expected: "18005550199" },
    { input: "  +33 (0) 1 42 68 55 55 ", expected: "330142685555" }
];

let allPassed = true;
for (const test of rawNumbers) {
    const cleaned = cleanWhatsAppNumber(test.input);
    if (cleaned === test.expected) {
        console.log(`✓ Cleaned '${test.input}' -> '${cleaned}'`);
    } else {
        console.error(`✗ FAILED: Expected '${test.expected}', got '${cleaned}'`);
        allPassed = false;
    }
}

// Test 2: URL generation
console.log("\n[TEST 2] Testing WhatsApp Direct URL Formatting...");
const urlTests = [
    {
        phone: "+1 555 019 2834",
        msg: "Hello Transglobe Logistics",
        expected: "https://wa.me/15550192834?text=Hello%20Transglobe%20Logistics"
    },
    {
        phone: "+44 7911 123456",
        msg: "",
        expected: "https://wa.me/447911123456"
    }
];

for (const test of urlTests) {
    const url = formatWhatsAppUrl(test.phone, test.msg);
    if (url === test.expected) {
        console.log(`✓ URL formatted: '${url}'`);
    } else {
        console.error(`✗ FAILED: Expected '${test.expected}', got '${url}'`);
        allPassed = false;
    }
}

// Test 3: Local Data Directory & File Read/Write
console.log("\n[TEST 3] Testing Settings File Persistence...");
const dataDir = path.join(process.cwd(), "data");
const settingsFile = path.join(dataDir, "whatsapp_settings.json");

try {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    const sampleConfig = {
        enabled: true,
        phoneNumber: "+1 (555) 019-2834",
        displayLabel: "Direct WhatsApp Dispatch",
        message: "Hello Transglobe Logistics, I need cargo tracking assistance.",
        showFloating: true,
        showHeader: true,
        showContactPage: true,
        showFooter: true,
        updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(settingsFile, JSON.stringify(sampleConfig, null, 2), "utf-8");
    const readBack = JSON.parse(fs.readFileSync(settingsFile, "utf-8"));

    if (readBack.phoneNumber === sampleConfig.phoneNumber && readBack.enabled === true) {
        console.log("✓ Settings file successfully written and read back.");
    } else {
        console.error("✗ Variance detected in settings readback.");
        allPassed = false;
    }
} catch (e: any) {
    console.error("✗ Failed file persistence test:", e.message);
    allPassed = false;
}

if (allPassed) {
    console.log("\nSUCCESS: All WhatsApp unit and persistence tests passed!");
} else {
    console.error("\nFAILURE: One or more WhatsApp tests failed.");
    process.exit(1);
}
