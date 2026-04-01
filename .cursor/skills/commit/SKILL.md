---
name: commit
description: Generate a commit based on staged changes only, following the repository's existing commit convention. Use when the user invokes /commit or asks for a commit message based on changes.
---

# Commit Message Generator

## When to Use

Apply this skill when the user:

- Invokes `/commit`
- Asks for a commit message based on changes
- Asks to write a commit message following the project's pattern

## Instructions

1. **Get changes**: Run `git diff --cached` to see staged changes only.
2. **Infer convention**: Run `git log --oneline -15` to observe the project's commit message format.
3. **Verify build**: Run `pnpm build` before committing. If there are errors, fix them before proceeding.
4. **Generate commit**: Produce a single-line commit that matches the convention.

## Commit Convention (this project)

From recent history, the format is **Conventional Commits**:

- `type(scope): short description` — when scope applies (e.g. `transaction`)
- `type: short description` — when scope is omitted

**Types**: `fix`, `feat`, `refactor`, `docs`, `chore`  
**Scope**: lowercase, in parentheses, when changes are scoped (e.g. `transaction`, `auth`)  
**Description**: lowercase, imperative, concise
