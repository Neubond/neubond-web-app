# Bug issue instructions

**Template:** [bug.yml](../ISSUE_TEMPLATE/bug.yml)  
**Labels (auto):** `bug`, `todo`  
**Title prefix:** `[BUG] `

---

## Title (one line)

**Pattern:** `[BUG] <what breaks> in <area>`

**Examples:**

- `[BUG] Password reset link expires before the form loads`
- `[BUG] IFU download returns 404 on Cloudflare after publish`

---

## Field guide

### Bug Description *(required)*

**One paragraph only.** No bullets or subheadings in this field.

State what breaks, where, and who hits it. Name the route (`` `app/auth/update-password` ``) or component when known. Fold impact into the same paragraph.

### Steps to Reproduce *(required)*

Numbered list. Start from a known state. Cap at 5 steps.

```markdown
1. Open `/auth/forgot-password` in a signed-out browser
2. Submit a registered email address
3. Open the emailed link
```

### Expected Behaviour *(required)*

One or two sentences describing what should happen.

### Actual Behaviour *(required)*

What happens instead. Include the error text or status code in a fenced block when there is one.

### Additional Remarks *(optional)*

Console output, request IDs, or a note that the bug is target-specific. Keep it short.

### Source of Feedback *(required)*

*e.g. Internal testing, clinician report, Sentry, code review.*

### App version *(required)*

`` `package.json` `` `version:` when the bug was seen.

### Dropdowns *(required)*

| Field | Guidance |
|-------|----------|
| **Browser(s)** | Only those actually reproduced on. Do not guess the full set |
| **Device type(s)** | `device-desktop`, `device-mobile`, `device-tablet` by viewport, not hardware |
| **Deployment target(s)** | `target-cloudflare` for `main`, `target-vercel` for `vercel-deploy`, both if it reproduces on each |
| **Priority** | `high` = blocks auth, IFU access, or data integrity; `medium` = broken but has a workaround; `low` = cosmetic |
| **Affected Area(s)** | See the area guide in [README](./README.md#area-guide) |

---

## Formatting tips

Follow [README drafting style](./README.md#drafting-style-agents--chat-drafts): one copyable code block no semicolons stay on topic do not overdetail always third person.

Point at concrete paths:

```markdown
- `` `app/ifu/download/route.ts` `` returns 404 when the blob prefix is empty
```

Skip full stack traces. One framing line plus the failing call is enough.
