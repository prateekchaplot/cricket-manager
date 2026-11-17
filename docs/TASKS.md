# Cricket Manager — Task Tracker

Source of truth for task definitions: docs/ARCHITECTURE.md §14.
This file tracks status only; the architecture document is binding.

**Working mode:** hold-after-every-task

Statuses: done (PR merged) · doing (branch open, pending review) · remaining · cut (with date + reason)

## Done

| ID | Branch | PR | Merge commit | Verified |
|---|---|---|---|---|
_(none yet)_

## Doing

- **T01** — branch `arch/cricket-manager/t01` — pending review

## Remaining

### Phase 1 — Foundation

| ID | Task | Files | Deps | Acceptance criteria (summary) |
|---|---|---|---|---|
| T02 | Define shared schemas/errors/IDs | `src/shared`, `src/game/types.ts`, `src/game/data/*` | T01 | All core entities and rules validate; no UI imports in game types. |

### Phase 2 — Game core

| ID | Task | Files | Deps | Acceptance criteria (summary) |
|---|---|---|---|---|
| T03 | Career, squad, finance, development | `src/game/career`, `src/game/squad`, `src/game/finance`, `src/game/development` | T02 | Commands are atomic; squad/funds/injury/training/retirement rules covered. |
| T04 | Competition, AI, selection | `src/game/competition`, `src/game/ai`, `src/game/selection` | T02, T03 | Full legal schedule and recommendations; standings derive from results. |
| T05 | Match engine, statistics | `src/game/match`, `src/game/statistics` | T02, T04 | Seeded over-step simulation terminates; scorecard invariants and statistics hold. |

### Phase 3 — Persistence

| ID | Task | Files | Deps | Acceptance criteria (summary) |
|---|---|---|---|---|
| T06 | IndexedDB, save schemas, import/export | `src/persistence` | T02 | Atomic slots, migration, checksum and corruption handling work. |

### Phase 4 — Player workflows

| ID | Task | Files | Deps | Acceptance criteria (summary) |
|---|---|---|---|---|
| T07 | App shell and career screens | `src/app`, `src/features/career` | T01, T02, T06 | Create/list/load/delete slots; recoverable errors; keyboard flow. |
| T08 | Squad/training/calendar/standings UI | `src/features/squad`, `src/features/training`, `src/features/calendar` | T03, T04, T07 | Commands and validation visible; no direct database/domain mutation. |
| T09 | Selection/match/review UI | `src/features/selection`, `src/features/match`, `src/features/review` | T04, T05, T07 | Playable match, pause/pace, over-boundary tactics, full review. |
| T10 | Guidance and help | `src/features/help` + screen integrations | T07–T09 | Walkthrough reaches match; contextual definitions on each management screen. |

### Phase 5 — Offline release

| ID | Task | Files | Deps | Acceptance criteria (summary) |
|---|---|---|---|---|
| T11 | PWA, release checks, user rules/help docs | `public`, `src`, `docs` (except PRD) | T01, T06–T10 | Offline after first load; acceptance suite and full-season demonstration pass. |

## Notes

- 2026-11-17: Tracker bootstrapped; working mode `hold-after-every-task` confirmed by the user. Environment: local Node 26.13.0 satisfies `engines >=24.11.1`; CI pins Node 24.11.1 and pnpm 10.24.0 (via `packageManager`); GitHub Actions pinned to release SHAs (checkout v7.0.1, setup-node v7.1.0, pnpm/action-setup v6.1.1).
- **T01 deviation — TypeScript version.** §5 pins TypeScript 7.0.2, but `typescript@7.0.2` ships only the native compiler (`bin/tsc`) with no JS API (`main`/`types` are absent from the package), and `typescript-eslint` — whose parser requires the JS API — has no release supporting TS 7 (latest 8.73.0 peers `typescript >=4.8.4 <6.1.0`). Resolved to `typescript@6.0.3` (latest JS-line release, inside the accepted peer range) plus `typescript-eslint@8.73.0` (latest; the §5 pin 8.48.0 rejects TS 6.0.x with peers `<6.0.0`). TS 7.0.2 adoption is deferred until the lint toolchain supports native TS 7; promoting it requires a §5 contract change via the shared-file protocol. All other §5 exact pins verified to exist on npm and used verbatim.
- **T01 additions.** Supporting packages required to implement named §5 capabilities but not itemized there: `@vitejs/plugin-react@6.3.0` (JSX transform for React on Vite 8), `@types/react@19.3.0`, `@types/react-dom@19.3.0`, `@types/node@24.19.2` (config-file types), `@eslint/js@9.39.1` (ESLint recommended preset). Everything is pinned exact.
- **T01 entry files.** Minimal `index.html` and a placeholder `src/main.tsx` are created here so the phase-1 gate ("static app builds, typechecks, and starts locally") is satisfiable; T07 replaces them with the real application shell. `src/styles` design tokens are deferred to the shell/UI tasks. `vite-plugin-pwa@2.0.0` is installed and pinned per §5 but the plugin is wired into `vite.config.ts` in T11.
- **CI zero-test policy.** Test stages run with `--passWithNoTests` (Vitest) and `--pass-with-no-tests` (Playwright) until tasks add tests; the workflow is T01-owned so later tasks should not need to edit it. Playwright specs serve the production build via `vite preview`, so `pnpm build` must precede `pnpm test:e2e`.
- **T01 verification (2026-11-17).** All commands run locally (Node 26.13.0, pnpm 10.24.0): `pnpm install --frozen-lockfile` (lockfile up to date) · `pnpm format:check` · `pnpm lint` · `pnpm typecheck` (`tsc -b`) · `pnpm test -- --passWithNoTests` · `pnpm build` (dist: index 0.46 kB, bundle 219.71 kB / 68.70 kB gzip) · `pnpm test:e2e -- --pass-with-no-tests` · manual check: `vite preview` serves the app shell (HTTP 200, title rendered). All passed.
- **T01 CI fix (2026-11-17).** PR CI failed at "Unit and component tests": pnpm's `--` separator handling differs by platform — on Windows (local) pnpm consumes `--` and forwards `--passWithNoTests` as a real flag; on Linux (CI, same pnpm 10.24.0) it forwards `--` verbatim, so Vitest treated post-`--` arguments as positional file filters and the flag never applied → exit 1 on zero test files. Fix: moved zero-test tolerance into `vite.config.ts` (`test.passWithNoTests: true`, CI runs `pnpm test` bare) and switched the e2e step to `pnpm exec playwright test --pass-with-no-tests` (args forwarded directly, no script-layer separator ambiguity). Re-verified locally with the exact CI commands; all green. Lesson recorded: avoid `pnpm <script> -- <flags>` in CI workflows on this repo — use config options or `pnpm exec`.
