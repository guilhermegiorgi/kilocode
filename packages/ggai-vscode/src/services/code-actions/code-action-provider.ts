import * as vscode from "vscode"

export class GGAIActionProvider implements vscode.CodeActionProvider {
  static readonly metadata: vscode.CodeActionProviderMetadata = {
    providedCodeActionKinds: [vscode.CodeActionKind.QuickFix, vscode.CodeActionKind.RefactorRewrite],
  }

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
  ): vscode.CodeAction[] {
    if (range.isEmpty) return []

    const actions: vscode.CodeAction[] = []

    const add = new vscode.CodeAction("Add to GG.AI", vscode.CodeActionKind.RefactorRewrite)
    add.command = { command: "kilo-code.new.addToContext", title: "Add to GG.AI" }
    actions.push(add)

    const hasDiagnostics = context.diagnostics.length > 0

    if (hasDiagnostics) {
      const fix = new vscode.CodeAction("Fix with GG.AI", vscode.CodeActionKind.QuickFix)
      fix.command = { command: "kilo-code.new.fixCode", title: "Fix with GG.AI" }
      fix.isPreferred = true
      actions.push(fix)
    }

    if (!hasDiagnostics) {
      const explain = new vscode.CodeAction("Explain with GG.AI", vscode.CodeActionKind.RefactorRewrite)
      explain.command = { command: "kilo-code.new.explainCode", title: "Explain with GG.AI" }
      actions.push(explain)

      const improve = new vscode.CodeAction("Improve with GG.AI", vscode.CodeActionKind.RefactorRewrite)
      improve.command = { command: "kilo-code.new.improveCode", title: "Improve with GG.AI" }
      actions.push(improve)
    }

    return actions
  }
}
