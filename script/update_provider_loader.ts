import { readFile, writeFile } from "node:fs/promises";

async function run() {
    const file = "packages/opencode/src/provider/provider.ts";
    const content = await readFile(file, "utf-8");

    const replacement = `
    const gatewayHandler = async (input: any) => {
      const env = Env.all()
      const hasKey = await (async () => {
        if (input.env.some((item: any) => env[item])) return true
        if (await Auth.get(input.id)) return true
        const config = await Config.get()
        if (config.provider?.[input.id]?.options?.apiKey) return true
        return false
      })()

      if (!hasKey) {
        for (const [key, value] of Object.entries(input.models as Record<string, any>)) {
          if (value.cost.input === 0) continue
          delete input.models[key]
        }
      }

      const options: Record<string, string> = {}
      
      const envOrgKey = input.id === "ggai" ? "GGAI_ORG_ID" : input.id === "kilo" ? "KILO_ORG_ID" : "OPENCODE_ORG_ID";
      if (env[envOrgKey]) {
        options.kilocodeOrganizationId = env[envOrgKey]
      }
      
      if (!hasKey) {
        options.apiKey = "anonymous"
      }

      return {
        autoload: Object.keys(input.models).length > 0,
        options,
      }
    };
`;

    // We need to replace `opencode: async () => { ... }` and `kilo: async (input) => { ... }` inside CUSTOM_LOADERS
    // Instead of complex regex, let's just use string replacement.

    let updated = content;

    // Replace opencode
    updated = updated.replace(/opencode: async \(\) => \{\n\s+return \{\n\s+autoload: false,\n\s+options: \{\n\s+headers: DEFAULT_HEADERS,\n\s+\},\n\s+\}\n\s+\},\n\s+\/\/ ggai_change end/, "");

    // Replace kilo
    updated = updated.replace(/kilo: async \(input\) => \{[\s\S]*?\},/m, `
    kilo: gatewayHandler,
    opencode: gatewayHandler,
    ggai: gatewayHandler,
  `);

    if (!updated.includes("gatewayHandler")) {
        updated = updated.replace(/const CUSTOM_LOADERS: Record<string, CustomLoader> = \{/, replacement + "\n  const CUSTOM_LOADERS: Record<string, CustomLoader> = {");
    } else {
        // If we've already run it, avoid re-inserting gatewayHandler
    }

    // Make sure gatewayHandler is declared before CUSTOM_LOADERS
    if (!content.includes("const gatewayHandler")) {
        updated = updated.replace(/const CUSTOM_LOADERS: Record<string, CustomLoader> = \{/, replacement + "\n  const CUSTOM_LOADERS: Record<string, CustomLoader> = {");
    }

    await writeFile(file, updated, "utf-8");
    console.log("Updated", file);
}

run().catch(console.error);
