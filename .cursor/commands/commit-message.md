---
name: commit-message
description: Draft a concise commit message (and optional extra lines) from uncommitted changes
---

# Commit message

Draft a **concise** commit message from the current uncommitted working tree. Do **not** create a git commit unless the user explicitly asks to commit.

## 1. Inspect uncommitted changes

Run in parallel:

- `git status` (include untracked; e.g. `git status --short` so `??` paths are visible)
- `git diff` and `git diff --staged` (or `git diff HEAD` for full unstaged+staged picture)
- `git log -8 --oneline` (match this repo’s type prefixes)

Also enumerate **untracked** paths (`??` / untracked in `git status`). For each untracked path that is likely part of the next commit (skip obvious secrets / junk such as `.env`, build artifacts):

- Note the path in the change set
- Skim file contents (or `git add -N` / read the file) so the message reflects new files, not only tracked diffs

Only report **no uncommitted changes** and stop when **both** are absent:

1. No staged or unstaged tracked changes, and
2. No untracked paths that belong in the commit

Untracked files are not on GitHub yet, but they often **are** what the user is about to commit — ignore them and the draft message will be wrong.

## 2. Decide the primary vs secondary work

From the tracked diffs **and** untracked file contents, identify **one main theme** for the first line.

- Prefer the change that is largest in intent (feature, fix, test, refactor), not necessarily line count alone.
- If docs/tests/chores are supporting the same theme, fold them into that one line when possible.
- If there are **clearly separate** main themes, put the most important on the first line and list the others on following lines as additional commit-message-style subjects.

## 3. Message style

- Each line: `<type>: <short summary>`
- Types used in this repo include: `feat`, `fix` / `bug`, `improv`, `refactor`, `test`, `chore`, `design`, `techDebt`, `documentation` (use the closest fit).
- Imperative, concise, focus on **why / what was done**, not a file list.
- No trailing period on the subject.
- Do not mention secrets (`.env` values, tokens, service-role keys).
- This repo has two deployment branches. Do not describe a change as landing on both unless it actually did.

## 4. Output format (exact)

Reply with **only** a single markdown fenced code block that contains the message line(s). Do **not** print labels like `commit message` or `description`. Do **not** add commentary unless the user asks.

Inside the code block:

- One `<type>: <summary>` per line
- Primary theme on the first line
- Each secondary theme on its own following line (`fix:`, `chore:`, `test:`, etc.)
- No blank lines inside the block

**Single theme** — one line inside the code block:

````markdown
```text
fix: stop IFU download 404 when the blob prefix is empty
```
````

**Multiple themes** — primary first, then one `<type>: <summary>` per line:

````markdown
```text
fix: harden reset-password against retryable server errors
chore: ignore local admin scripts and Cloudflare build output
```
````

Rules:

- If there is only one main theme, output **exactly one line** inside the code block. Do **not** write `none`, `-`, or a blank placeholder line.
- Secondary lines are alternate commit messages for leftover work, not a prose paragraph.
- Do **not** paste the full diff or a long bullet dump of files.
- Do **not** put the messages as bare chat text outside the code block.

## 5. Do not commit

This command **only drafts** the message. Create a commit only if the user separately asks to commit (then follow the repo’s git commit rules / HEREDOC flow).
