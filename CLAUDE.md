# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Required Reading

Review `.sdd/constitution.md` before starting work to understand project principles.

## Language Rules

- **Communication**: Korean
- **Documentation**: Korean
- **Code comments**: English
- **Commit messages**: English

## Project Overview

MCP server that automates GitHub Issue resolution. Analyzes bugs, errors, and feature requests, then creates PRs automatically. Sources: Sentry (automated), Asana (manual `/triage`), GitHub (direct).

## Build & Development Commands

```bash
# Install dependencies
npm install

# Build
npm run build

# Development (watch mode)
npm run dev

# Type check only
npm run type-check

# Lint
npm run lint

# Clean dist
npm run clean
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage (target: 80%+)
npm run test:coverage

# Run single test file
npx vitest run src/path/to/file.test.ts

# Watch mode for single file
npx vitest src/path/to/file.test.ts
```

Test files: `src/**/__tests__/**/*.test.ts` or `src/**/*.test.ts`

## Architecture

### Branch Strategy

```
main ◀─── (manual merge)
  └── autofixing ◀─── (PR target)
        ├── fix/issue-123
        ├── fix/issue-124-125 (grouped)
        └── fix/issue-126
```

### Source Structure

```
src/
├── index.ts          # MCP server entry point
├── analyzer/         # Task analysis, code exploration
├── asana/            # Asana API integration
├── checks/           # Code quality checks (typecheck, lint, tests)
├── commands/         # CLI commands (init, triage, autofix)
├── common/           # Shared utilities
├── git/              # Git/Worktree operations
├── github/           # GitHub API (issues, PRs, labels)
├── types/            # TypeScript type definitions
└── workflow/         # Orchestration logic
```

### MCP Tools

| Domain | Tools |
|--------|-------|
| GitHub | `list_issues`, `get_issue`, `update_issue`, `create_issue`, `create_pr` |
| Asana | `list_asana_tasks`, `get_asana_task`, `update_asana_task`, `analyze_asana_task` |
| Git | `manage_worktree`, `run_checks`, `group_issues` |

## SDD Workflow

This project follows Spec-Driven Development.

### Core Rules

- All features require spec documentation first (SHALL)
- Specs use RFC 2119 keywords (SHALL)
- All requirements include GIVEN-WHEN-THEN scenarios (SHALL)
- No implementation without spec (SHALL NOT)

### SDD Commands

| Command | Description |
|---------|-------------|
| `/sdd.new <feature>` | Create new spec |
| `/sdd.plan` | Create implementation plan |
| `/sdd.tasks` | Break down into tasks |
| `/sdd.validate` | Validate format |
| `/sdd.status` | Check status |
| `/sdd.reverse` | Extract spec from legacy code |

### SDD Directory

```
.sdd/
├── constitution.md   # Project principles
├── AGENTS.md         # AI workflow guidelines
├── domains.yml       # Domain definitions
├── specs/            # Spec documents
├── changes/          # Change proposals
└── templates/        # Templates
```

## Commit Convention

```
<type>(<scope>): <subject>

# Spec types: spec, spec-update, spec-status, plan, tasks, constitution, sdd-config
# Standard types: feat, fix, docs, style, refactor, test, chore

# Footer:
# Refs: #issue-number
# Breaking-Spec: affected-spec
# Depends-On: dependent-spec
```

## Configuration Files

- `.auto-fix.yaml` - Workflow config (tokens, repos, checks, AI budget)
- `.mcp.json` - MCP server setup

## CLI Usage

```bash
# Initialize project
npx auto-fix-workflow init

# Triage issues (analyze and prioritize)
npx auto-fix-workflow triage [--label=bug] [--dry-run]

# Run autofix workflow
npx auto-fix-workflow autofix <issue-ids> [--dry-run]
```

## Tech Stack

- Node.js 20+, TypeScript (strict mode)
- MCP SDK, `@octokit/rest`, `simple-git`, `zod`
- Vitest for testing, ESLint for linting
