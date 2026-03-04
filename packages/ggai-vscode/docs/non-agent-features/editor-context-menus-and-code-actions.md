# Editor Context Menus & Code Actions

**Priority:** P1
**Status:** 🔨 Partial

## What Exists

- **CodeActionProvider**: `GGAIActionProvider` provides lightbulb quick fixes (QuickFix for "Fix with GG.AI" when diagnostics exist, RefactorRewrite for "Add/Explain/Improve with GG.AI")
- **Editor context menu**: "GG.AI" submenu under `editor/context` with Explain, Fix, Improve, Add to Context
- **Terminal context menu**: "GG.AI" submenu under `terminal/context` with Add Terminal Content, Fix Command, Explain Command
- **Keyboard shortcuts**: `Cmd+Shift+A` (focus chat), `Cmd+Shift+M` (agent manager), `Cmd+K Cmd+A` (add selection to context), plus Agent Manager shortcuts
- **Prompt templates**: Hardcoded prompt templates for all actions
- All commands registered in `extension.ts` and `package.json contributes`

## Remaining Work

- Terminal content capture — `getTerminalSelection()` is a **placeholder** returning empty string. Needs VS Code shell integration API for actual terminal content reading
- Custom prompt overrides via extension settings (user-customizable prompt templates)

## Prompt Templates Reference

The following prompt templates are implemented with hardcoded defaults. The old extension allowed users to override these via `customSupportPrompts` settings — that override mechanism is the remaining gap.

Templates: EXPLAIN, FIX, IMPROVE, ADD_TO_CONTEXT, TERMINAL_ADD_TO_CONTEXT, TERMINAL_FIX, TERMINAL_EXPLAIN, TERMINAL_GENERATE, ENHANCE, CONDENSE, COMMIT_MESSAGE, NEW_TASK
