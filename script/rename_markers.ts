import { Glob } from "bun";
import { readFile, writeFile } from "node:fs/promises";

async function run() {
    const glob = new Glob("**/*.{ts,tsx,js,jsx,json,md,yml,yaml,html,css}");
    for await (const file of glob.scan(".")) {
        if (file.includes("node_modules/") || file.includes("dist/") || file.includes(".git/")) {
            continue;
        }
        const content = await readFile(file, "utf-8");
        if (content.includes("ggai_change")) {
            const updated = content.replaceAll("ggai_change", "ggai_change");
            await writeFile(file, updated, "utf-8");
            console.log(`Updated ${file}`);
        }
    }
}

run().catch(console.error);
