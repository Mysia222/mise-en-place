# Mise en place

Recipe ingestion + meal-planning agent. TypeScript monorepo, portfolio project.
Core idea: the LLM understands messy input and makes decisions; deterministic code does math, data, and validation.

## Commands

pnpm workspace, Node ESM, packages consumed as TS source (no build step).

pnpm install
pnpm -r typecheck
pnpm -r test
pnpm --filter @mise/core exec vitest run path/to/file.test.ts
pnpm --filter @mise/core exec vitest run -t "test name"
pnpm exec tsx <file.ts>

## Architecture

packages/core pure domain logic: Zod schemas, units, scaling, nutrition
packages/ingest recipe extraction via Claude -> core
packages/agent meal-planning agent -> core
packages/mcp-server MCP server over core + storage -> core
packages/evals golden set, eval runner, reports -> core
apps/cli CLI entry point

## Invariants (never break these)

- `@mise/core` has NO LLM calls, NO network, NO I/O. Pure functions only.
- All external data (model output, HTML, user input, files) is parsed with Zod before use.
- The model never does arithmetic. Unit conversion, scaling and totals live in core.
- Unknown values stay `null`. Never invent a default (e.g. "to taste" -> amount: null).
- Feature packages depend on core, not on each other, unless declared in package.json.

## TypeScript

- strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes are on. Handle `T | undefined`, don't cast it away.
- NodeNext: relative imports need `.js` extensions.
- No `any`, no `as` casts to silence errors, no `@ts-ignore`.
- Errors are typed (discriminated unions or Error subclasses), not bare strings.

## Testing

- Vitest. Tests next to source: `foo.ts` -> `foo.test.ts`.
- When asked for tests first, write only tests and do not implement.
- Never modify existing tests to make them pass unless explicitly asked.

## Rules for you

- Never disable or weaken lint/type rules to make checks pass. If a check fails, explain why.
- Never read or print `.env*` files or API keys.
- Keep changes scoped to the task. No drive-by refactors.
- Definition of done: `pnpm -r typecheck` and `pnpm -r test` both pass. Report results.# Mise en place

Recipe ingestion + meal-planning agent. TypeScript monorepo, portfolio project.
Core idea: the LLM understands messy input and makes decisions; deterministic code does math, data, and validation.

## Commands

pnpm workspace, Node ESM, packages consumed as TS source (no build step).

pnpm install
pnpm -r typecheck
pnpm -r test
pnpm --filter @mise/core exec vitest run path/to/file.test.ts
pnpm --filter @mise/core exec vitest run -t "test name"
pnpm exec tsx <file.ts>

## Architecture

packages/core pure domain logic: Zod schemas, units, scaling, nutrition
packages/ingest recipe extraction via Claude -> core
packages/agent meal-planning agent -> core
packages/mcp-server MCP server over core + storage -> core
packages/evals golden set, eval runner, reports -> core
apps/cli CLI entry point

## Invariants (never break these)

- `@mise/core` has NO LLM calls, NO network, NO I/O. Pure functions only.
- All external data (model output, HTML, user input, files) is parsed with Zod before use.
- The model never does arithmetic. Unit conversion, scaling and totals live in core.
- Unknown values stay `null`. Never invent a default (e.g. "to taste" -> amount: null).
- Feature packages depend on core, not on each other, unless declared in package.json.

## TypeScript

- strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes are on. Handle `T | undefined`, don't cast it away.
- NodeNext: relative imports need `.js` extensions.
- No `any`, no `as` casts to silence errors, no `@ts-ignore`.
- Errors are typed (discriminated unions or Error subclasses), not bare strings.

## Testing

- Vitest. Tests next to source: `foo.ts` -> `foo.test.ts`.
- When asked for tests first, write only tests and do not implement.
- Never modify existing tests to make them pass unless explicitly asked.

## Rules for you

- Never disable or weaken lint/type rules to make checks pass. If a check fails, explain why.
- Never read or print `.env*` files or API keys.
- Keep changes scoped to the task. No drive-by refactors.
- Definition of done: `pnpm -r typecheck` and `pnpm -r test` both pass. Report results.
- Never add, remove or upgrade dependencies without asking first. Explain why it's needed
  and why the standard library isn't enough. "Pure" in core means no LLM/network/I/O,
  not "any side-effect-free library is fine".
