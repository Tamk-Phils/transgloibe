const { execSync } = require('child_process');

console.log("--- TRANSGLOBE LOGISTICS BRAND CONSISTENCY CHECK ---");

try {
    console.log("1. Scanning for legacy 'NexusTrack' nomenclature...");
    const output = execSync("grep -rEi 'nexustrack' src | grep -v 'node_modules' || true").toString();
    if (output.trim()) {
        console.warn("WARNING: Legacy nomenclature detected in the following nodes:");
        console.log(output);
    } else {
        console.log("SUCCESS: Brand purge complete. No legacy 'NexusTrack' signatures detected in source.");
    }

    console.log("\n2. Scanning for legacy 'Nexus' signatures...");
    const nexusOutput = execSync("grep -rEi ' nexus' src | grep -v 'node_modules' | grep -v 'lucide-react' || true").toString();
    if (nexusOutput.trim()) {
        console.warn("WARNING: Potential legacy signatures detected:");
        console.log(nexusOutput);
    } else {
        console.log("SUCCESS: Protocol 'Nexus' purged.");
    }

    console.log("\n3. Scanning for legacy 'Transworld' signatures in UI & Content...");
    const twOutput = execSync("grep -rnEi 'transworld' src | grep -v 'transworldlogistics_shipments' || true").toString();
    if (twOutput.trim()) {
        console.warn("WARNING: Legacy 'Transworld' signatures detected:");
        console.log(twOutput);
    } else {
        console.log("SUCCESS: Brand updated to 'Transglobe Logistics'. No legacy 'Transworld' UI/content signatures found.");
    }

} catch (err) {
    console.error("Internal Diagnostic Failure:", err.message);
}

console.log("\n--- DIAGNOSTIC COMPLETE ---");
