---
name: create-issue
description: Draft or open a Neubond web app GitHub issue by type (bug, feature, improvement, tech-debt, design, documentation)
---

# Create issue

Draft or open a Neubond web app GitHub issue using `.github/issue_instructions/` and the matching `.github/ISSUE_TEMPLATE/*.yml` form.

## 1. Resolve issue type

The user **must** supply an issue type (slash arg, flag, or clear phrase). Map aliases:

| User says | Type | Instruction file | Labels | Title prefix |
|-----------|------|------------------|--------|--------------|
| `bug` | bug | `bug.md` | `bug`, `todo` | `[BUG] ` |
| `feature` | feature | `feature.md` | `feature`, `todo` | `[FEATURE] ` |
| `improvement` / `improv` | improvement | `improvement.md` | `improvement`, `todo` | `[IMPROVEMENT] ` |
| `tech-debt` / `techdebt` / `debt` | tech-debt | `tech-debt.md` | `tech-debt`, `todo` | `[TECH-DEBT] ` |
| `design` | design | `design.md` | `design`, `todo` | `[DESIGN] ` |
| `documentation` / `docs` | documentation | `documentation.md` | `documentation`, `todo` | `[DOCUMENTATION] ` |

If type is missing or ambiguous: ask once. Do not guess.

Examples:

- `/create-issue improvement` + feedback text
- `create issue bug: …`
- `create improvement issue for …`

## 2. Read instructions

1. Read `.github/issue_instructions/README.md` (drafting style + shared dropdowns).
2. Read the matching `.github/issue_instructions/<type>.md` in full (title pattern, required fields, dropdown guidance).
3. Skim the matching `.github/ISSUE_TEMPLATE/<type>.yml` so field names match the GitHub form.

Follow those files exactly for structure. Do not invent extra sections.

## 3. Gather facts

Run in parallel as needed:

- `node -p "require('./package.json').version"` → App version
- Spot-check the relevant route or component to confirm current behaviour

This repo ships **two long-lived branches** for two deployment targets:

| Branch | Target | Marker files |
|--------|--------|--------------|
| `main` | Cloudflare Workers via OpenNext | `wrangler.jsonc`, `open-next.config.ts`, `middleware.ts` |
| `vercel-deploy` | Vercel | `proxy.ts`, `@vercel/blob` |

Name the affected target when behaviour actually differs between them. Do **not** write "same on `main`" boilerplate when the behaviour is simply how the app works everywhere.

## 4. Content rules (ADHD + feedback style)

Shape the draft for a short attention span and for **feedback**, not a design doc.

**Must:**

1. **Lead with the problem or ask** — what is wrong or missing. Not a plan.
2. **Third person** only (`The app…`, `Users…`, `Clinicians…`). No `I` / `we` / `you`. No user stories.
3. **No semicolons** in title or body prose.
4. **Stay short** — other textareas: a few sentences or ≤5 bullets. Cap any list at 5 items.
5. **Primary description = one paragraph** — the template's main description field (Bug Description, Feature Description, Improvement Description, etc.) must be **one paragraph only**. No bullets, subheadings, or bold section labels in that field. Fold problem and scope into flowing prose.
6. **Concrete pointers only** — one or two `` `app/ifu/publish/page.tsx` `` or UI labels when known. Skip deep stack traces and speculative edge cases.
7. **Feedback not solution** — describe current vs desired behaviour (or the request). Do **not** prescribe implementation steps, APIs, refactors, or "suggested fix" designs unless the user explicitly included that in their feedback. For tech-debt *Proposed Solution*, prefer *TBD* or omit if the template allows.
8. **Requirements / Acceptance Criteria** (feature template) — **absolute requirements only**: browser, platform, or external service gates. No UI, copy, layout, or implementation steps. Use *None identified* if no external gates apply.
9. **Deployment target** — always set. Use both unless the issue is genuinely target-specific.
10. Fill **every required** field from the type's instruction file. Optional fields only if the user gave material.
11. **Source of Feedback** and **App version** always filled (version from `package.json` unless the user overrides).
12. Dropdown values must use the exact labels from the README / type guide (`target-cloudflare`, `priority-high`, `ifu`, …). Infer from context. Ask once if the area or target is truly unknown.

**Must not:**

- Long background, architecture tours, or "how to implement"
- Bullets, subheadings, or bold section labels in the primary description field
- UI or implementation steps in Requirements / Acceptance Criteria
- First/second person
- Semicolons in prose
- More than one outer copyable draft block in chat
- Cross-branch boilerplate when the behaviour does not actually differ by target

## 5. Draft format (chat)

Output **one** fenced code block the user can copy into the GitHub form, with:

```
Title
…

---

<field label from template>
…

---

…
```

Include a final **Dropdowns** line listing the selected options.

Lead the chat reply with one next action (e.g. paste into GitHub or confirm open). No preamble. No recap closers.

## 6. Open on GitHub (optional)

Default: **draft only** (chat code block).

If the user says **open**, **create on GitHub**, or **file it**:

1. `gh issue create` with `--title`, `--body` (markdown of the required textareas), and `--label` matching the type's auto labels.
2. Return the issue URL.

Body for `gh` should mirror the form fields as clear `###` headings (same labels as the yml). Do not use interactive `gh` prompts.

## 7. Overrides

| Phrase | Behaviour |
|--------|-----------|
| **draft only** | Chat draft only (default) |
| **open** / **file it** / **create on GitHub** | `gh issue create` |
| **cloudflare only** / **vercel only** | Restrict Deployment target(s) to that one |

Do not close or edit existing issues unless asked.
