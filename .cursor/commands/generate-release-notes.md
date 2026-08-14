---
name: generate-release-notes
description: Generate GitHub release notes and a user-facing CHANGELOG entry from a git tag range
---

# Generate release notes

Create engineering GitHub release notes and a user-facing `CHANGELOG.md` entry for a web app release.

The Flutter repo drives this from `scripts/release_notes/generate-release-notes.mjs`. **That script does not exist here.** Collect the same information directly from `git` and `gh` instead.

## 1. Collect inputs

Ask the user for:

| Input | Notes |
|-------|-------|
| **Current tag** | Tag being released, e.g. `v1.1.0` |
| **Previous tag** | Prior release tag, e.g. `v1.0.0` |

If not provided, suggest the two latest tags:

```bash
git tag --sort=-creatordate | head -5
```

Both tags must exist and must not be the same. If the repo has no tags yet, ask the user for a commit range instead.

## 2. Pre-checks

```bash
gh release list --limit 20
```

Confirm there is no existing draft or published release for the current tag.

## 3. Collect changes

```bash
git log <PREVIOUS>..<CURRENT> --oneline --no-merges
gh pr list --state merged --base main --limit 100
```

Sort every change into **two sources**, merged into the same category sections:

| Source | GitHub release reference | CHANGELOG |
|--------|-------------------------|-----------|
| PR-backed issues | `#123 Title (PR #456)` | Plain-language bullet |
| Direct commits (no PR) | `` `abc1234` Title `` | Only if user-facing |

Categorise from the commit type prefix (`feat`, `fix`, `improv`, `refactor`, `chore`, `techDebt`, `documentation`).

**Documentation scoping:** changes to `README.md`, `.github/`, or `docs/` that do **not** also touch app code (`app/`, `components/`, `lib/`, `emails/`) are **Documentation**. Mixed commits keep their subject-based category.

**Deployment scoping:** this repo releases from two branches. State which target a release covers, and do not mix Cloudflare-only and Vercel-only changes into one set of notes without saying so.

Engineering release header format, on a single metadata line:

```markdown
**Tag:** `v1.1.0` · **Commit:** `a1b2c3d` · **Version:** `1.1.0` · **Target:** `Cloudflare` · **Date:** `3 July 2026`
```

Read **Version** from `package.json`.

## 4. Write the changelog entries (required)

`CHANGELOG.md` is **user-facing only**. Exclude documentation, tech debt, and internal chore or CI work.

Write every bullet in natural language. Never copy issue titles, expected-behaviour fragments, or GitHub label tags.

- Good: `You can now download a published IFU without signing in again.`
- Good: `Password reset no longer fails with a generic error on restricted networks.`
- Bad: `The app now if there are no versions available…`
- Bad: `Fixed when attempting to publish a new IFU…`
- Bad: `[BUG] IFU download returns 404`

Style: `You can now…`, `X is now…`, `X no longer…`. Never `The app now…`.

Polish every line, even when the raw commit subject already reads reasonably.

## 5. Human review gate

Present both drafts in chat and wait for approval **before** writing `CHANGELOG.md` or creating the release.

Do not commit, push, or publish a release unless the user explicitly asks.

## 6. Publish

Once approved:

```bash
gh release create <CURRENT_TAG> --draft --title "<CURRENT_TAG>" --notes-file <path>
```

Return the draft release URL.
