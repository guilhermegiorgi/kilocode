/**
 * Language context
 * Provides i18n translations for kilo-ui components.
 * Merges UI translations from @opencode-ai/ui and Kilo overrides from @ggai/i18n.
 *
 * Locale priority: user override → VS Code display language → browser language → "en"
 */

import { createSignal, createMemo, createEffect, ParentComponent, Accessor } from "solid-js"
import { I18nProvider } from "@ggai/ui/context"
import type { UiI18nKey, UiI18nParams } from "@ggai/ui/context"
import { dict as uiEn } from "@ggai/ui/i18n/en"
import { dict as uiZh } from "@ggai/ui/i18n/zh"
import { dict as uiZht } from "@ggai/ui/i18n/zht"
import { dict as uiKo } from "@ggai/ui/i18n/ko"
import { dict as uiDe } from "@ggai/ui/i18n/de"
import { dict as uiEs } from "@ggai/ui/i18n/es"
import { dict as uiFr } from "@ggai/ui/i18n/fr"
import { dict as uiDa } from "@ggai/ui/i18n/da"
import { dict as uiJa } from "@ggai/ui/i18n/ja"
import { dict as uiPl } from "@ggai/ui/i18n/pl"
import { dict as uiRu } from "@ggai/ui/i18n/ru"
import { dict as uiAr } from "@ggai/ui/i18n/ar"
import { dict as uiNo } from "@ggai/ui/i18n/no"
import { dict as uiBr } from "@ggai/ui/i18n/br"
import { dict as uiTh } from "@ggai/ui/i18n/th"
import { dict as uiBs } from "@ggai/ui/i18n/bs"
import { dict as appEn } from "../i18n/en"
import { dict as appZh } from "../i18n/zh"
import { dict as appZht } from "../i18n/zht"
import { dict as appKo } from "../i18n/ko"
import { dict as appDe } from "../i18n/de"
import { dict as appEs } from "../i18n/es"
import { dict as appFr } from "../i18n/fr"
import { dict as appDa } from "../i18n/da"
import { dict as appJa } from "../i18n/ja"
import { dict as appPl } from "../i18n/pl"
import { dict as appRu } from "../i18n/ru"
import { dict as appAr } from "../i18n/ar"
import { dict as appNo } from "../i18n/no"
import { dict as appBr } from "../i18n/br"
import { dict as appTh } from "../i18n/th"
import { dict as appBs } from "../i18n/bs"
import { dict as amEn } from "../../agent-manager/i18n/en"
import { dict as amZh } from "../../agent-manager/i18n/zh"
import { dict as amZht } from "../../agent-manager/i18n/zht"
import { dict as amKo } from "../../agent-manager/i18n/ko"
import { dict as amDe } from "../../agent-manager/i18n/de"
import { dict as amEs } from "../../agent-manager/i18n/es"
import { dict as amFr } from "../../agent-manager/i18n/fr"
import { dict as amDa } from "../../agent-manager/i18n/da"
import { dict as amJa } from "../../agent-manager/i18n/ja"
import { dict as amPl } from "../../agent-manager/i18n/pl"
import { dict as amRu } from "../../agent-manager/i18n/ru"
import { dict as amAr } from "../../agent-manager/i18n/ar"
import { dict as amNo } from "../../agent-manager/i18n/no"
import { dict as amBr } from "../../agent-manager/i18n/br"
import { dict as amTh } from "../../agent-manager/i18n/th"
import { dict as amBs } from "../../agent-manager/i18n/bs"
import { dict as kiloEn } from "@ggai/i18n/en"
import { dict as kiloZh } from "@ggai/i18n/zh"
import { dict as kiloZht } from "@ggai/i18n/zht"
import { dict as kiloKo } from "@ggai/i18n/ko"
import { dict as kiloDe } from "@ggai/i18n/de"
import { dict as kiloEs } from "@ggai/i18n/es"
import { dict as kiloFr } from "@ggai/i18n/fr"
import { dict as kiloDa } from "@ggai/i18n/da"
import { dict as kiloJa } from "@ggai/i18n/ja"
import { dict as kiloPl } from "@ggai/i18n/pl"
import { dict as kiloRu } from "@ggai/i18n/ru"
import { dict as kiloAr } from "@ggai/i18n/ar"
import { dict as kiloNo } from "@ggai/i18n/no"
import { dict as kiloBr } from "@ggai/i18n/br"
import { dict as kiloTh } from "@ggai/i18n/th"
import { dict as kiloBs } from "@ggai/i18n/bs"
import { useVSCode } from "./vscode"
import { normalizeLocale as _normalizeLocale, resolveTemplate as _resolveTemplate } from "./language-utils"

export type { Locale } from "./language-utils"
export { LOCALES } from "./language-utils"
import type { Locale } from "./language-utils"
import { LOCALES } from "./language-utils"

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  zh: "简体中文",
  zht: "繁體中文",
  ko: "한국어",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  da: "Dansk",
  ja: "日本語",
  pl: "Polski",
  ru: "Русский",
  ar: "العربية",
  no: "Norsk",
  br: "Português (Brasil)",
  th: "ภาษาไทย",
  bs: "Bosanski",
}

// Merge 4 dict layers: app + ui + kilo + agent manager (kilo and agent manager override last)
const base = { ...appEn, ...uiEn, ...kiloEn }
const dicts: Record<Locale, Record<string, string>> = {
  en: { ...base, ...amEn },
  zh: { ...base, ...appZh, ...uiZh, ...kiloZh, ...amEn, ...amZh },
  zht: { ...base, ...appZht, ...uiZht, ...kiloZht, ...amEn, ...amZht },
  ko: { ...base, ...appKo, ...uiKo, ...kiloKo, ...amEn, ...amKo },
  de: { ...base, ...appDe, ...uiDe, ...kiloDe, ...amEn, ...amDe },
  es: { ...base, ...appEs, ...uiEs, ...kiloEs, ...amEn, ...amEs },
  fr: { ...base, ...appFr, ...uiFr, ...kiloFr, ...amEn, ...amFr },
  da: { ...base, ...appDa, ...uiDa, ...kiloDa, ...amEn, ...amDa },
  ja: { ...base, ...appJa, ...uiJa, ...kiloJa, ...amEn, ...amJa },
  pl: { ...base, ...appPl, ...uiPl, ...kiloPl, ...amEn, ...amPl },
  ru: { ...base, ...appRu, ...uiRu, ...kiloRu, ...amEn, ...amRu },
  ar: { ...base, ...appAr, ...uiAr, ...kiloAr, ...amEn, ...amAr },
  no: { ...base, ...appNo, ...uiNo, ...kiloNo, ...amEn, ...amNo },
  br: { ...base, ...appBr, ...uiBr, ...kiloBr, ...amEn, ...amBr },
  th: { ...base, ...appTh, ...uiTh, ...kiloTh, ...amEn, ...amTh },
  bs: { ...base, ...appBs, ...uiBs, ...kiloBs, ...amEn, ...amBs },
}

function normalizeLocale(lang: string): Locale {
  return _normalizeLocale(lang)
}

function resolveTemplate(text: string, params?: UiI18nParams) {
  return _resolveTemplate(text, params as Record<string, string | number | boolean | undefined>)
}

interface LanguageProviderProps {
  vscodeLanguage?: Accessor<string | undefined>
  languageOverride?: Accessor<string | undefined>
}

export const LanguageProvider: ParentComponent<LanguageProviderProps> = (props) => {
  const vscode = useVSCode()
  const [userOverride, setUserOverride] = createSignal<Locale | "">("")

  // Initialize from extension-side override
  createEffect(() => {
    const override = props.languageOverride?.()
    if (override) {
      setUserOverride(normalizeLocale(override))
    }
  })

  // Resolved locale: user override → VS Code language → browser language → "en"
  const locale = createMemo<Locale>(() => {
    const override = userOverride()
    if (override) {
      return override
    }
    const vscodeLang = props.vscodeLanguage?.()
    if (vscodeLang) {
      return normalizeLocale(vscodeLang)
    }
    if (typeof navigator !== "undefined" && navigator.language) {
      return normalizeLocale(navigator.language)
    }
    return "en"
  })

  const dict = createMemo(() => dicts[locale()] ?? dicts.en)

  const t = (key: UiI18nKey, params?: UiI18nParams) => {
    const text = (dict() as Record<string, string>)[key] ?? String(key)
    return resolveTemplate(text, params)
  }

  const setLocale = (next: Locale | "") => {
    setUserOverride(next)
    vscode.postMessage({ type: "setLanguage", locale: next })
  }

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, userOverride, t: t as (key: string, params?: UiI18nParams) => string }}
    >
      <I18nProvider value={{ locale: () => locale(), t }}>{props.children}</I18nProvider>
    </LanguageContext.Provider>
  )
}

// Expose locale + setLocale for the LanguageTab
import { createContext, useContext } from "solid-js"

interface LanguageContextValue {
  locale: Accessor<Locale>
  setLocale: (locale: Locale | "") => void
  userOverride: Accessor<Locale | "">
  t: (key: string, params?: UiI18nParams) => string
}

export const LanguageContext = createContext<LanguageContextValue>()

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return ctx
}
