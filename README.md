# Mise en place

![CI](https://github.com/Mysia222/mise-en-place/actions/workflows/ci.yml/badge.svg)

An AI agent that turns messy recipes (blog posts, plain text, photos of handwritten cards)
into structured data, and plans a week of meals around your pantry, budget and dietary constraints.

> **Status:** work in progress. Built in public as a portfolio project on agent architecture,
> MCP, structured output and LLM evaluation.

## Core idea

The LLM understands messy input and makes decisions.
Deterministic, tested code does the math, the data and the validation.
The model never converts units or adds up a shopping list.

## Planned architecture

| Package               | Role                                                                       |
| --------------------- | -------------------------------------------------------------------------- |
| `packages/core`       | Pure domain logic: Zod schemas, units, scaling, nutrition. No LLM, no I/O. |
| `packages/ingest`     | Recipe extraction with Claude (structured output)                          |
| `packages/evals`      | Golden set, eval runner, accuracy and cost reports                         |
| `packages/mcp-server` | MCP server exposing recipes, pantry and shopping lists                     |
| `packages/agent`      | Meal-planning agent                                                        |
| `apps/cli`            | Command-line entry point                                                   |

## Roadmap

- [x] Monorepo, strict TypeScript, lint, CI
- [x] Ingredient schema (tests first)
- [ ] Recipe extraction with structured output
- [ ] Golden set and evals in CI
- [ ] Deterministic core: units, scaling, shopping list
- [ ] MCP server
- [ ] Meal-planning agent: workflow vs agent comparison
- [ ] Context management, observability, cost tracking

## Getting started

Requires Node 22 and pnpm (version pinned in `package.json`).

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
```

## Docs

- [Architecture decisions](docs/adr/)
- [Development journal](docs/journal.md)
