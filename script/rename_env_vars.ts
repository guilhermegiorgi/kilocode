import { Glob } from "bun";
import { readFile, writeFile } from "node:fs/promises";

async function run() {
    const glob = new Glob("**/*.{ts,tsx,yml,yaml,md,rs}");
    for await (const file of glob.scan(".")) {
        if (file.includes("node_modules/") || file.includes("dist/") || file.includes(".git/") || file.includes("rename_")) {
            continue;
        }
        const content = await readFile(file, "utf-8");
        let updated = content;
        let changed = false;

        if (updated.includes("__KILO__")) {
            updated = updated.replaceAll("__KILO__", "__GGAI__");
            changed = true;
        }

        if (updated.includes("KILO_")) {
            updated = updated.replaceAll("KILO_", "GGAI_");
            changed = true;
        }

        if (updated.includes("kilo_")) {
            updated = updated.replaceAll("kilo_", "ggai_");
            changed = true;
        }

        if (changed) {
            await writeFile(file, updated, "utf-8");
            console.log(`Updated ${file}`);
        }
    }
}

run().catch(console.error);
