# Contributing

Thanks for your interest in improving this base project. It's a public template, so the bar is: **would this make the starting point better for the next person who forks it?**

## Getting started

```bash
git clone https://github.com/existhink/React-SWC-DDD-TS.git
cd React-SWC-DDD-TS
bun install
bun start:dev
```

## Development workflow

| Command                                   | What it does                                     |
| ----------------------------------------- | ------------------------------------------------ |
| `bun start:dev`                           | Dev server                                       |
| `bun run build`                           | Typecheck (`tsc -b`) + production bundle         |
| `bun run lint`                            | ESLint                                           |
| `bun run format` / `bun run format:check` | Prettier write / check                           |
| `bun run test`                            | Unit tests (Vitest, jsdom)                       |
| `bun run test:storybook`                  | Story tests (real Chromium via Playwright)       |
| `bun run test:coverage`                   | Unit tests with coverage thresholds              |
| `bun run dep:check`                       | Architecture boundary check (dependency-cruiser) |
| `bun run dep:graph`                       | Regenerate `docs/architecture-graph.mmd`         |
| `bun run generate:module`                 | Scaffold a new feature module (interactive)      |
| `bun run storybook`                       | Component workshop                               |
| `bun run size`                            | Bundle-size budget gate                          |

## Before you open a PR

1. **Run the gates.** `bun run build`, `bun run lint`, `bun run format:check`, `bun run test`, `bun run dep:check` must all pass. CI runs the same gates; a pre-commit hook runs lint-staged and a pre-push hook runs the full test suite.
2. **Add tests.** New behavior needs a test that fails without your change. Bug fixes need a regression test.
3. **Add a changeset** if your change affects people consuming the template: `bun run changeset`.
4. **Respect the architecture.** See below.

## Architecture rules (enforced by `dep:check`)

- `src/app/**` is the shared foundation. It must **not** import from `src/modules/**`. The dependency arrow only points one way: modules depend on app, never the reverse.
- Feature modules under `src/modules/**` are self-contained: `components/`, `constants/`, `interfaces/`, `schemas/`, `hooks/` (business logic / services), `store/`, `router/`, `views/`, `locales/`.
- **Views stay thin.** A view renders; business logic, data flow, and validation live in `hooks/`, `schemas/`, and `constants/`. This separation is the whole point of the structure.

## Commit conventions

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced by commitlint on `commit-msg`):

```
feat(auth): add password reset flow
fix(toast): guard against rendering an empty toast
docs(readme): document the module generator
chore(deps): pin vite to 8.1.5
```

## Adding a dependency

Research first. Open a discussion, and make the case against these five criteria:

1. Is it actively maintained by its author?
2. Is it widely adopted by other developers?
3. Is its open-issue situation healthy?
4. Is it reasonably small?
5. Is it simple to use and does it have real impact on the project?

Pin the exact version — this template does not use floating ranges.

## Code style

- Namespace domain variables/functions (`authentication_form`, `authentication_onSubmit`) so ownership reads left-to-right.
- Order declarations ascending.
- Prettier and ESLint are the source of truth; don't hand-fight them.
