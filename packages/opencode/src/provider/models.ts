import { Global } from "../global"
import { Log } from "../util/log"
import path from "path"
import z from "zod"
import { Installation } from "../installation"
import { Flag } from "../flag/flag"
import { lazy } from "@/util/lazy"
import { Config } from "../config/config" // ggai_change
import { ModelCache } from "./model-cache" // ggai_change
import { Auth } from "../auth" // ggai_change
import { GGAI_OPENROUTER_BASE } from "@ggai/gateway" // ggai_change
import { Filesystem } from "../util/filesystem"

// Try to import bundled snapshot (generated at build time)
// Falls back to undefined in dev mode when snapshot doesn't exist
/* @ts-ignore */

// ggai_change start
const normalizeKiloBaseURL = (baseURL: string | undefined, orgId: string | undefined): string | undefined => {
  if (!baseURL) return undefined
  const trimmed = baseURL.replace(/\/+$/, "")
  if (orgId) {
    if (trimmed.includes("/api/organizations/")) return trimmed
    if (trimmed.endsWith("/api")) return `${trimmed}/organizations/${orgId}`
    return `${trimmed}/api/organizations/${orgId}`
  }
  if (trimmed.includes("/openrouter")) return trimmed
  if (trimmed.endsWith("/api")) return `${trimmed}/openrouter`
  return `${trimmed}/api/openrouter`
}

export const Prompt = z.enum(["codex", "gemini", "beast", "anthropic", "trinity", "anthropic_without_todo"])
// ggai_change end

export namespace ModelsDev {
  const log = Log.create({ service: "models.dev" })
  const filepath = path.join(Global.Path.cache, "models.json")

  export const Model = z.object({
    id: z.string(),
    name: z.string(),
    family: z.string().optional(),
    release_date: z.string(),
    attachment: z.boolean(),
    reasoning: z.boolean(),
    temperature: z.boolean(),
    tool_call: z.boolean(),
    interleaved: z
      .union([
        z.literal(true),
        z
          .object({
            field: z.enum(["reasoning_content", "reasoning_details"]),
          })
          .strict(),
      ])
      .optional(),
    cost: z
      .object({
        input: z.number(),
        output: z.number(),
        cache_read: z.number().optional(),
        cache_write: z.number().optional(),
        context_over_200k: z
          .object({
            input: z.number(),
            output: z.number(),
            cache_read: z.number().optional(),
            cache_write: z.number().optional(),
          })
          .optional(),
      })
      .optional(),
    limit: z.object({
      context: z.number(),
      input: z.number().optional(),
      output: z.number(),
    }),
    modalities: z
      .object({
        input: z.array(z.enum(["text", "audio", "image", "video", "pdf"])),
        output: z.array(z.enum(["text", "audio", "image", "video", "pdf"])),
      })
      .optional(),

    // ggai_change start
    recommendedIndex: z.number().optional(),
    prompt: Prompt.optional().catch(undefined),
    // ggai_change end

    experimental: z.boolean().optional(),
    status: z.enum(["alpha", "beta", "deprecated"]).optional(),
    options: z.record(z.string(), z.any()),
    headers: z.record(z.string(), z.string()).optional(),
    provider: z.object({ npm: z.string().optional(), api: z.string().optional() }).optional(),
    variants: z.record(z.string(), z.record(z.string(), z.any())).optional(),
  })
  export type Model = z.infer<typeof Model>

  export const Provider = z.object({
    api: z.string().optional(),
    name: z.string(),
    env: z.array(z.string()),
    id: z.string(),
    npm: z.string().optional(),
    models: z.record(z.string(), Model),
  })

  export type Provider = z.infer<typeof Provider>

  function url() {
    return Flag.GGAI_MODELS_URL || "https://models.dev"
  }

  export const Data = lazy(async () => {
    const result = await Filesystem.readJson(Flag.GGAI_MODELS_PATH ?? filepath).catch(() => { })
    if (result) return result
    // @ts-ignore
    const snapshot = await import("./models-snapshot")
      .then((m) => m.snapshot as Record<string, unknown>)
      .catch(() => undefined)
    if (snapshot) return snapshot
    if (Flag.GGAI_DISABLE_MODELS_FETCH) return {}
    const json = await fetch(`${url()}/api.json`).then((x) => x.text())
    return JSON.parse(json)
  })

  export async function get() {
    const result = await Data()
    // ggai_change start
    const providers = result as Record<string, Provider>

    const gateways = [
      { id: "kilo", name: "Kilo Gateway", env: "KILO_API_KEY", url: "https://api.kilo.ai" },
      { id: "opencode", name: "Opencode Zen", env: "OPENCODE_API_KEY", url: "https://api.opencode.ai" },
      { id: "ggai", name: "GG.AI Gateway", env: "GGAI_API_KEY", url: "https://api.gg.ai" }
    ];

    for (const gw of gateways) {
      if (providers[gw.id]) delete providers[gw.id];

      const config = await Config.get()
      const options = config.provider?.[gw.id]?.options
      const auth = await Auth.get(gw.id)
      const orgId =
        options?.kilocodeOrganizationId ?? (auth?.type === "oauth" ? auth.accountId : undefined)

      const normalizedBaseURL = normalizeKiloBaseURL(options?.baseURL, orgId)
      const fetchOptions: any = {
        ...(orgId ? { kilocodeOrganizationId: orgId } : {}),
      }

      const defaultBaseURL = orgId
        ? `${gw.url}/api/organizations/${orgId}`
        : `${gw.url}/api/openrouter`

      const providerBaseURL = normalizedBaseURL ?? defaultBaseURL
      fetchOptions.baseURL = providerBaseURL

      const ensureTrailingSlash = (value: string): string => (value.endsWith("/") ? value : `${value}/`)
      const fetchedModels = await ModelCache.fetch(gw.id, fetchOptions).catch(() => ({}))

      providers[gw.id] = {
        id: gw.id,
        name: gw.name,
        env: [gw.env],
        api: ensureTrailingSlash(providerBaseURL),
        npm: "@ggai/gateway",
        models: fetchedModels,
      }

      if (Object.keys(fetchedModels).length === 0) {
        ModelCache.refresh(gw.id, fetchOptions).catch(() => { })
      }
    }

    return providers
    // ggai_change end
  }

  export async function refresh() {
    const result = await fetch(`${url()}/api.json`, {
      headers: {
        "User-Agent": Installation.USER_AGENT,
      },
      signal: AbortSignal.timeout(10 * 1000),
    }).catch((e) => {
      log.error("Failed to fetch models.dev", {
        error: e,
      })
    })
    if (result && result.ok) {
      await Filesystem.write(filepath, await result.text())
      ModelsDev.Data.reset()
    }
  }
}

if (!Flag.GGAI_DISABLE_MODELS_FETCH && !process.argv.includes("--get-yargs-completions")) {
  ModelsDev.refresh()
  setInterval(
    async () => {
      await ModelsDev.refresh()
    },
    60 * 1000 * 60,
  ).unref()
}
