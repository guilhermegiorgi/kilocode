# Contributing to GG.AI CLI

See [the Documentation for details on contributing](https://genesisgrid.ai/docs/contributing).

## TL;DR

There are lots of ways to contribute to the project:

- **Code Contributions:** Implement new features or fix bugs
- **Documentation:** Improve existing docs or create new guides
- **Bug Reports:** Report issues you encounter
- **Feature Requests:** Suggest new features or improvements
- **Community Support:** Help other users in the community

The GG.AI Community is [on Discord](https://genesisgrid.ai/discord).

## Developing GG.AI CLI

- **Requirements:** Bun 1.3+
- Install dependencies and start the dev server from the repo root:

  ```bash
  bun install
  bun dev
  ```

### Running against a different directory

By default, `bun dev` runs GG.AI CLI in the `packages/opencode` directory. To run it against a different directory or repository:

```bash
bun dev <directory>
```

To run GG.AI CLI in the root of the repo itself:

```bash
bun dev .
```

### Building a "local" binary

To compile a standalone executable:

```bash
./packages/opencode/script/build.ts --single
```

Then run it with:

```bash
./packages/opencode/dist/ggai-cli-<platform>/bin/ggai
```

Replace `<platform>` with your platform (e.g., `darwin-arm64`, `linux-x64`).

### Understanding bun dev vs ggai

During development, `bun dev` is the local equivalent of the built `ggai` command. Both run the same CLI interface:

```bash
# Development (from project root)
bun dev --help           # Show all available commands
bun dev serve            # Start headless API server
bun dev web              # Start server + open web interface

# Production
ggai --help          # Show all available commands
ggai serve           # Start headless API server
ggai web             # Start server + open web interface
```

### Pull Request Expectations

- **Issue First Policy:** All PRs must reference an existing issue.
- **UI Changes:** Include screenshots or videos (before/after).
- **Logic Changes:** Explain how you verified it works.
- **PR Titles:** Follow conventional commit standards (`feat:`, `fix:`, `docs:`, etc.).

### Issue and PR Lifecycle

To keep our backlog manageable, we automatically close inactive issues and PRs after a period of inactivity. This isn't a judgment on quality — older items tend to lose context over time and we'd rather start fresh if they're still relevant. Feel free to reopen or create a new issue/PR if you're still working on something!

### Style Preferences

- **Functions:** Keep logic within a single function unless breaking it out adds clear reuse.
- **Destructuring:** Avoid unnecessary destructuring.
- **Control flow:** Avoid `else` statements; prefer early returns.
- **Types:** Avoid `any`.
- **Variables:** Prefer `const`.
- **Naming:** Concise single-word identifiers when descriptive.
- **Runtime APIs:** Use Bun helpers (e.g., `Bun.file()`).
