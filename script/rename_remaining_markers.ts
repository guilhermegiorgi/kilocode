import { readFile, writeFile } from "node:fs/promises";

async function run() {
    const files = [
        "install",
        "packages/desktop/src-tauri/src/lib.rs",
        "packages/containers/publish/Dockerfile",
        "packages/containers/bun-node/Dockerfile",
        "packages/containers/tauri-linux/Dockerfile",
        "packages/containers/rust/Dockerfile",
        "packages/opencode/script/postinstall.mjs",
        "packages/opencode/bin/ggai"
    ];

    for (const file of files) {
        try {
            const content = await readFile(file, "utf-8");
            if (content.includes("kilocode_change")) {
                const updated = content.replaceAll("kilocode_change", "ggai_change");
                await writeFile(file, updated, "utf-8");
                console.log(`Updated ${file}`);
            }
        } catch (e) {
            console.log(`Failed to process ${file}: ${e.message}`);
        }
    }
}

run().catch(console.error);
