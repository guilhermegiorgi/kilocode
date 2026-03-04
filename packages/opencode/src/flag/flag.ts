// ggai_change - renamed all OPENCODE_ env vars to GGAI_
function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

export namespace Flag {
  export const GGAI_AUTO_SHARE = truthy("GGAI_AUTO_SHARE")
  export const GGAI_GIT_BASH_PATH = process.env["GGAI_GIT_BASH_PATH"]
  export const GGAI_CONFIG = process.env["GGAI_CONFIG"]
  export declare const GGAI_TUI_CONFIG: string | undefined
  export declare const GGAI_CONFIG_DIR: string | undefined
  export const GGAI_CONFIG_CONTENT = process.env["GGAI_CONFIG_CONTENT"]
  export const GGAI_DISABLE_AUTOUPDATE = truthy("GGAI_DISABLE_AUTOUPDATE")
  export const GGAI_DISABLE_PRUNE = truthy("GGAI_DISABLE_PRUNE")
  export const GGAI_DISABLE_TERMINAL_TITLE = truthy("GGAI_DISABLE_TERMINAL_TITLE")
  export const GGAI_PERMISSION = process.env["GGAI_PERMISSION"]
  export const GGAI_DISABLE_DEFAULT_PLUGINS = truthy("GGAI_DISABLE_DEFAULT_PLUGINS")
  export const GGAI_DISABLE_LSP_DOWNLOAD = truthy("GGAI_DISABLE_LSP_DOWNLOAD")
  export const GGAI_ENABLE_EXPERIMENTAL_MODELS = truthy("GGAI_ENABLE_EXPERIMENTAL_MODELS")
  export const GGAI_DISABLE_AUTOCOMPACT = truthy("GGAI_DISABLE_AUTOCOMPACT")
  export const GGAI_DISABLE_MODELS_FETCH = truthy("GGAI_DISABLE_MODELS_FETCH")
  export const GGAI_DISABLE_CLAUDE_CODE = truthy("GGAI_DISABLE_CLAUDE_CODE")
  export const GGAI_DISABLE_CLAUDE_CODE_PROMPT = GGAI_DISABLE_CLAUDE_CODE || truthy("GGAI_DISABLE_CLAUDE_CODE_PROMPT")
  export const GGAI_DISABLE_CLAUDE_CODE_SKILLS = GGAI_DISABLE_CLAUDE_CODE || truthy("GGAI_DISABLE_CLAUDE_CODE_SKILLS")
  export const GGAI_DISABLE_EXTERNAL_SKILLS = GGAI_DISABLE_CLAUDE_CODE_SKILLS || truthy("GGAI_DISABLE_EXTERNAL_SKILLS")
  export declare const GGAI_DISABLE_PROJECT_CONFIG: boolean
  export const GGAI_FAKE_VCS = process.env["GGAI_FAKE_VCS"]
  export declare const GGAI_CLIENT: string
  export const GGAI_SERVER_PASSWORD = process.env["GGAI_SERVER_PASSWORD"]
  export const GGAI_SERVER_USERNAME = process.env["GGAI_SERVER_USERNAME"]
  export const GGAI_ENABLE_QUESTION_TOOL = truthy("GGAI_ENABLE_QUESTION_TOOL")

  // Experimental
  export const GGAI_EXPERIMENTAL = truthy("GGAI_EXPERIMENTAL")
  export const GGAI_EXPERIMENTAL_FILEWATCHER = truthy("GGAI_EXPERIMENTAL_FILEWATCHER")
  export const GGAI_EXPERIMENTAL_DISABLE_FILEWATCHER = truthy("GGAI_EXPERIMENTAL_DISABLE_FILEWATCHER")
  export const GGAI_EXPERIMENTAL_ICON_DISCOVERY = GGAI_EXPERIMENTAL || truthy("GGAI_EXPERIMENTAL_ICON_DISCOVERY")

  const copy = process.env["GGAI_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
  export const GGAI_EXPERIMENTAL_DISABLE_COPY_ON_SELECT =
    copy === undefined ? process.platform === "win32" : truthy("GGAI_EXPERIMENTAL_DISABLE_COPY_ON_SELECT")
  export const GGAI_ENABLE_EXA = truthy("GGAI_ENABLE_EXA") || GGAI_EXPERIMENTAL || truthy("GGAI_EXPERIMENTAL_EXA")
  export const GGAI_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS = number("GGAI_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS")
  export const GGAI_EXPERIMENTAL_OUTPUT_TOKEN_MAX = number("GGAI_EXPERIMENTAL_OUTPUT_TOKEN_MAX")
  export const GGAI_EXPERIMENTAL_OXFMT = GGAI_EXPERIMENTAL || truthy("GGAI_EXPERIMENTAL_OXFMT")
  export const GGAI_EXPERIMENTAL_LSP_TY = truthy("GGAI_EXPERIMENTAL_LSP_TY")
  export const GGAI_EXPERIMENTAL_LSP_TOOL = GGAI_EXPERIMENTAL || truthy("GGAI_EXPERIMENTAL_LSP_TOOL")
  export const GGAI_DISABLE_FILETIME_CHECK = truthy("GGAI_DISABLE_FILETIME_CHECK")
  export const GGAI_EXPERIMENTAL_PLAN_MODE = GGAI_EXPERIMENTAL || truthy("GGAI_EXPERIMENTAL_PLAN_MODE")
  export const GGAI_EXPERIMENTAL_MARKDOWN = truthy("GGAI_EXPERIMENTAL_MARKDOWN")
  export const GGAI_MODELS_URL = process.env["GGAI_MODELS_URL"]
  export const GGAI_MODELS_PATH = process.env["GGAI_MODELS_PATH"]

  function number(key: string) {
    const value = process.env[key]
    if (!value) return undefined
    const parsed = Number(value)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
  }
}

// Dynamic getter for GGAI_DISABLE_PROJECT_CONFIG
// This must be evaluated at access time, not module load time,
// because external tooling may set this env var at runtime
Object.defineProperty(Flag, "GGAI_DISABLE_PROJECT_CONFIG", {
  get() {
    return truthy("GGAI_DISABLE_PROJECT_CONFIG")
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for GGAI_TUI_CONFIG
// This must be evaluated at access time, not module load time,
// because tests and external tooling may set this env var at runtime
Object.defineProperty(Flag, "GGAI_TUI_CONFIG", {
  get() {
    return process.env["GGAI_TUI_CONFIG"]
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for GGAI_CONFIG_DIR
// This must be evaluated at access time, not module load time,
// because external tooling may set this env var at runtime
Object.defineProperty(Flag, "GGAI_CONFIG_DIR", {
  get() {
    return process.env["GGAI_CONFIG_DIR"]
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for GGAI_CLIENT
// This must be evaluated at access time, not module load time,
// because some commands override the client at runtime
Object.defineProperty(Flag, "GGAI_CLIENT", {
  get() {
    return process.env["GGAI_CLIENT"] ?? "cli"
  },
  enumerable: true,
  configurable: false,
})
