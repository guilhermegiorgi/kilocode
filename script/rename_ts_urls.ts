import { Glob } from "bun";
import { readFile, writeFile } from "node:fs/promises";

async function run() {
    const glob = new Glob("**/*.{ts,tsx}");
    for await (const file of glob.scan(".")) {
        if (file.includes("node_modules/") || file.includes("dist/") || file.includes(".git/") || file.includes("rename_")) {
            continue;
        }
        const content = await readFile(file, "utf-8");
        let updated = content;
        let changed = false;

        if (updated.includes("kilo.ai")) {
            updated = updated.replaceAll(/kilo\.ai/g, "gg.ai");
            changed = true;
        }

        if (updated.includes("Kilo Code")) {
            updated = updated.replaceAll("Kilo Code", "GG.AI");
            changed = true;
        }

        if (updated.includes("KiloCode")) {
            updated = updated.replaceAll("KiloCode", "GGAI");
            changed = true;
        }

        if (changed) {
            await writeFile(file, updated, "utf-8");
            console.log(`Updated ${file}`);
        }
    }
}

run().catch(console.error);
