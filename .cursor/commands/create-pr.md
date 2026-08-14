---
name: create-pr
description: Create a Neubond web app pull request with the project title/body format
---

# Create PR

Open a Neubond web app pull request using the canonical rules in `.github/PULL_REQUEST_TEMPLATE.md`.

## 1. Read the template

Read `.github/PULL_REQUEST_TEMPLATE.md` and follow the PR title, body, and Fixes rules exactly.

## 2. Pick the correct base branch

This repo has **two long-lived deployment branches**. Never open a PR across them.

| Working branch off | Base | Target |
|--------------------|------|--------|
| `main` | `main` | Cloudflare Workers via OpenNext |
| `vercel-deploy` | `vercel-deploy` | Vercel |

```bash
git merge-base --is-ancestor origin/main HEAD && echo "main lineage"
git merge-base --is-ancestor origin/vercel-deploy HEAD && echo "vercel lineage"
```

If the change applies to both targets, open **two PRs**, one per lineage, and cross-reference them in the **Deployment target** section.

## 3. Gather branch changes

Run in parallel:

- `git status`
- `git diff <base>...HEAD`
- `git log <base>..HEAD --oneline`

Use the full branch history, not just the latest commit. Check whether the base branch has unpushed local commits that would be swept into the PR, and branch from `origin/<base>` when it does.

## 4. Draft the PR

- **Title:** `<Type>: <one line>`
- **Body sections:** `### Summary`, `### More details`, `### Deployment target`, `### Verification`, `### Fixes`
- **Verification:** state what was actually run (`npm run build`, `npm run lint`, `npm audit`). Do not claim checks that were not run
- **Fixes:** search GitHub issues with `gh issue list` / `gh issue view`; only link issues clearly addressed by the branch. Default to `Fixes #n`, which closes the issue on merge. Use `Refs #n` only when the issue must stay open, typically because the paired PR on the other deployment branch has not merged yet, and switch the last one to `Fixes`

## 5. Draft-only override

If the user says **draft only** or **don't open yet**, show the filled title and body in chat only.

## 6. Open on GitHub

If the user wants the PR opened:

1. Push the branch if needed (`git push -u origin HEAD`)
2. Run `gh pr create --base <base>` with the title/body
3. Return the PR URL

## 7. Base branch override

If the user says **against `<branch>`**, use that branch for both diffing and `gh pr create --base`.

Do not merge unless explicitly asked.
