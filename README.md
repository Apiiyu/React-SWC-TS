# 🌟 React SWC Starter With Vite

This project is built with React, TypeScript, TailwindCSS, and Vite (SWC).

## Starter Introduction

This starter uses a **feature-based module architecture** with domain-oriented naming — not formal Domain-Driven Design (no domain/application/infrastructure layering). Each feature lives in its own module under `src/modules/`, and within a module, views stay focused on rendering while business logic, data flow, and validation live in dedicated files (`hooks/`, `schemas/`, `store/`). If you want a deeper primer on DDD concepts generally, [see here](https://www.geeksforgeeks.org/domain-driven-design-ddd) — just don't expect this repo to implement bounded contexts or aggregates.

This project is the React/Vite sibling of [VueJS3-DDD-TS](https://github.com/existhink/VueJS3-DDD-TS) — same conventions, different framework.

---

## 🏆 Tips

Opinions for writing cleaner, more readable code in this codebase. Follow them or ignore them.

1. **Namespace local variables/functions inside a hook by the concern they belong to.**

```tsx
export const useAuthenticationLogin = () => {
  const [authentication_isSubmitting, setAuthentication_isSubmitting] =
    useState(false);

  const authentication_onSubmit = () => {
    // ...
  };

  return { authentication_isSubmitting, authentication_onSubmit };
};
```

Reason: we read top-to-bottom, left-to-right — namespacing lets you tell at a glance who owns a given variable or function.
Trade-off: names get longer, but stay easier to scan than unnamespaced flat locals.

2. **Order declarations ascending (state → derived → handlers → return).** Makes a file predictable to navigate when debugging or extending it.

### Conclusion

There are plenty of other ways to keep code clean — these two are the ones enforced consistently across this codebase. Keep new code consistent with them.

## 📖 Notes

Before adding a new dependency, check:

1. Is it actively maintained?
2. Is it widely used / battle-tested?
3. Does it have a healthy issue backlog (not abandoned, not on fire)?
4. Is it reasonably small?
5. Is it simple to use for the value it adds?

If it clears those, it's fair game. Open a discussion first if you're unsure.

## 🎖️ Web Technologies

| Technology  | Description                                                                | Version |
| ----------- | -------------------------------------------------------------------------- | ------- |
| Vite        | Native-ESM powered web dev build tool (SWC via `@vitejs/plugin-react-swc`) | 8.1.5   |
| TypeScript  | JavaScript with syntax for types                                           | 6.0.3   |
| React       | UI library                                                                 | 19.2.7  |
| TailwindCSS | Utility-first CSS framework (v4, CSS-first config)                         | 4.3.3   |

> **Why TypeScript 6.0.3 and not the newest 7.x?** `typescript-eslint` doesn't support TS 7 yet (peer range `<6.1.0`). This will move forward once that ecosystem catches up — check `package.json` for the current pin.

## 🏅 Dependencies & Libraries

| Library                     | Purpose                                                                      |
| --------------------------- | ---------------------------------------------------------------------------- |
| axios                       | HTTP client (transport only — see `plugins/axios`)                           |
| @tanstack/react-query       | Server-state caching, retries, mutations                                     |
| react-hook-form             | Form state                                                                   |
| @hookform/resolvers + zod   | Schema validation for forms and `import.meta.env`                            |
| zustand                     | App/module state (persisted where relevant)                                  |
| react-router-dom            | Routing, with per-route code splitting via `React.lazy`                      |
| react-i18next / i18next     | Translations (app-level + per-module namespaces)                             |
| mitt                        | Event bus (used to decouple HTTP errors from toast UI)                       |
| unplugin-auto-import        | Auto-imports for `app/constants`, `app/helpers`, `app/hooks`, and components |
| vite-plugin-svg-icons       | SVG sprite generation                                                        |
| vite-plugin-compression     | Gzip-compresses the production build                                         |
| vite-plugin-remove-console  | Strips `console`/`debugger` from the production build                        |
| vite-plugin-image-optimizer | Compresses raster/SVG assets at build time (sharp/svgo)                      |
| @fontsource/be-vietnam-pro  | Self-hosted font (no render-blocking Google Fonts `@import`)                 |
| babel-plugin-react-compiler | React Compiler — auto-memoization, no manual `useMemo`/`useCallback` ritual  |

Dev tooling: Vitest + React Testing Library (with coverage gate), Storybook (+ a11y addon), ESLint (flat config) + Prettier, Husky + lint-staged + commitlint, dependency-cruiser (architecture boundary enforcement), Changesets (versioning), Dependabot, GitHub Actions CI.

Every dependency is pinned to an explicit version in `package.json` — no `"latest"`. Bump deliberately, not implicitly.

## 🛠️ Setup Project

### 🍴 Prerequisites

- [Bun](https://bun.sh) — this project uses `bun`, not `npm`/`yarn`.
- [Git](https://git-scm.com/downloads)

### 🚀 Install & Run

```bash
git clone https://github.com/existhink/React-SWC-DDD-TS.git
cd React-SWC-DDD-TS
bun install
cp .env.example .env.local   # then edit as needed
bun start:dev
```

### 🎉 Build

```bash
bun run build   # tsc -b && vite build
```

### 🧪 Test

```bash
bun run test           # vitest run (unit project, jsdom)
bun run test:watch     # vitest, watch mode
bun run test:coverage  # unit tests + v8 coverage gate (fails below threshold)
bun run test:storybook # story-based tests in real Chromium (see vitest.config.ts note)
```

### 📊 Storybook

```bash
bun run storybook        # dev server on :6006
bun run build-storybook  # static build (component showcase for this template)
```

### 📦 Bundle & Architecture

```bash
bun run analyze     # ANALYZE=true build → dist/stats.html (bundle composition)
bun run size        # hard per-chunk gzip budget gate (fails CI on bloat)
bun run dep:check   # dependency-cruiser — enforces module boundaries
bun run dep:graph   # regenerate docs/architecture-graph.mmd
```

### 🚦 Releases

```bash
bun run changeset          # record a change (Changesets)
bun run changeset:version  # bump versions + update CHANGELOG
```

### ✅ Lint & Format

```bash
bun run lint          # eslint .
bun run format        # prettier --write .
bun run format:check  # prettier --check .
```

A pre-commit hook (Husky + lint-staged) runs `eslint --fix` and `prettier --write` on staged files automatically; commit messages are checked against [Conventional Commits](https://www.conventionalcommits.org/) via commitlint. A pre-push hook runs the architecture boundary check and full test suite so regressions are caught before they reach CI.

### 🧩 Generate a New Module

```bash
bun generate:module
```

Interactive (`@clack/prompts`): asks for the module name, then which optional folders it actually needs right now (`constants/`, `interfaces/`, `schemas/`, `hooks/`, `store/`) — nothing is scaffolded speculatively, an empty folder is dead weight, not DX. `router/`, `views/`, and `components/` are always created since a module needs at least a route and a screen to exist at all. Automatically registers the new router in `src/plugins/router/router.tsx`; if you opt into `locales/`, register the namespace in `src/plugins/i18n/i18n.ts` yourself.

---

## 📂 Folder Structure

```
src/
  app/                          # Cross-cutting, not feature-specific
    assets/                     # Fonts, icons, images
    components/
      base/                     # AppBaseSvg, AppBaseToast, AppBaseWrapper, AppBaseRouteGuard, ...
      common/                   # AppCommonEntryPoint (the real app root)
    constants/                  # Auto-imported app-wide constants (e.g. toast.constant.ts)
    helpers/                    # Auto-imports.helper.ts (drives unplugin-auto-import)
    hooks/                      # Shared hooks (useHttpAbort, useToast)
    locales/                    # App-level i18n namespace ("app")
    routes/                     # Top-level route table (app.routes.tsx)
    schemas/                    # App-level Zod schemas (env.schema.ts)
    store/                      # App-level Zustand stores (theme, session)
    types/                      # Ambient global types (interfaces.d.ts) + generated auto-imports.d.ts
  modules/                      # Feature modules — one bounded UI concern each
    dashboard/                  # Public landing page
    authentication/             # Login flow (RHF + Zod + TanStack Query)
    {module-name}/               # Generated via `bun generate:module`
  plugins/                      # Singletons wired once at app startup
    axios/                      # HTTP transport only
    errorHandler/                # HTTP error → toast dispatch (decoupled from axios)
    i18n/                        # react-i18next init, resource bundling
    mitt/                        # Event bus
    reactQuery/                  # Shared QueryClient
    router/                      # Merges app + module route tables
  main.tsx                      # Entry point
  index.css                     # Tailwind v4 entry + font import + dark-mode variant
test/                           # Vitest + React Testing Library specs, mirrors src/ layout
```

**Module layout convention** (see `src/modules/authentication` for a full example):

| Folder        | Holds                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| `components/` | Module-local presentational pieces                                                                          |
| `constants/`  | Module constants (e.g. API paths)                                                                           |
| `interfaces/` | API/data-shape types                                                                                        |
| `schemas/`    | Zod schemas (form validation, response validation)                                                          |
| `hooks/`      | Business logic — the "service" layer. Views call these, never `httpClient` directly                         |
| `store/`      | Zustand state genuinely local to the module (skip if there's nothing to hold — don't scaffold empty stores) |
| `router/`     | The module's own route table, lazy-loaded and merged in `plugins/router`                                    |
| `views/`      | The screens themselves — thin, call `hooks/` for logic                                                      |
| `locales/`    | Translations registered under the module's namespace in `plugins/i18n`                                      |

Session/auth state lives in `app/store/session.store.ts`, not inside the `authentication` module — `app/` components like `AppBaseRouteGuard` may depend on `app/`, but never on a feature module. Modules depend on `app/`, never the reverse.

### ⚒️ How to Contribute

- Fork the repo
- Create a new branch (`git checkout -b improve-feature`)
- Make your changes, keeping the conventions above
- `bun run lint && bun run format:check && bun run test && bun run build` before pushing
- Commit using a [Conventional Commits](https://www.conventionalcommits.org/) message (enforced by commitlint)
- Open a Pull Request

### 📩 Bug / Feature Request

Found a bug or want a feature? Open an issue [here](https://github.com/existhink/React-SWC-DDD-TS/issues/new) with steps to reproduce (bugs) or the use case (features).

## 📜 Credits

👦 Rafi Khoirulloh <br>
Email: khoirulloh.rafi2@gmail.com <br>
GitHub: @apiiyu

👦 Ramdhan Setiadhi <br>
Email: ramdhansetiadhi@gmail.com <br>
GitHub: @ramdhanstdi
