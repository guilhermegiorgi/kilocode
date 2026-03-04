import { Glob } from "bun";
import { readFile, writeFile } from "node:fs/promises";

async function run() {
    const glob = new Glob("packages/ggai-i18n/src/*.ts");
    for await (const file of glob.scan(".")) {
        const content = await readFile(file, "utf-8");
        let updated = content;
        let changed = false;

        if (updated.includes('"dialog.provider.kilo.note"')) {
            updated = updated.replaceAll('"dialog.provider.kilo.note"', '"dialog.provider.opencode.note"');
            changed = true;
        }

        // Also fix app/src/i18n files
        if (changed) {
            await writeFile(file, updated, "utf-8");
            console.log(`Updated ${file}`);
        }
    }

    const appGlob = new Glob("packages/app/src/i18n/*.ts");
    for await (const file of appGlob.scan(".")) {
        const content = await readFile(file, "utf-8");
        let updated = content;
        let changed = false;

        if (updated.includes('"dialog.provider.kilo.note"')) {
            updated = updated.replaceAll('"dialog.provider.kilo.note"', '"dialog.provider.opencode.note"');
            changed = true;
        }

        if (updated.includes("provider.connect.kiloGateway.")) {
            updated = updated.replaceAll("provider.connect.kiloGateway.", "provider.connect.opencodeZen.");
            changed = true;
        }

        if (changed) {
            await writeFile(file, updated, "utf-8");
            console.log(`Updated ${file}`);
        }
    }
}

run().catch(console.error);
