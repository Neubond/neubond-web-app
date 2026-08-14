# Feature issue instructions

**Template:** [feature.yml](../ISSUE_TEMPLATE/feature.yml)  
**Labels (auto):** `feature`, `todo`  
**Title prefix:** `[FEATURE] `

---

## Title (one line)

**Pattern:** `[FEATURE] <capability> in <area>`

**Examples:**

- `[FEATURE] Allow clinicians to supersede a published IFU version`
- `[FEATURE] Add passwordless email sign-in`

---

## Field guide

### Feature Description *(required)*

**One paragraph only.** No bullets or subheadings in this field.

State the capability and who needs it. Describe the gap in current behaviour and the desired outcome. Do not prescribe the implementation.

### Expected Benefit *(required)*

Who benefits and how. A few sentences or up to 5 bullets.

- **Users** — what becomes possible
- **Engineering** — reduced support burden or complexity
- **Compliance** — traceability or audit value

### Requirements / Acceptance Criteria *(required)*

**Absolute external gates only.** Browser support, platform capability, Supabase or Cloudflare service availability, regulatory requirement.

No UI layout, copy, or implementation steps. Use *None identified* if no external gates apply.

### Additional Remarks *(optional)*

Dependencies on other issues, or a note on sequencing.

### Source of Feedback *(required)*

*e.g. Clinical request, product planning, user interview.*

### App version *(required)*

`` `package.json` `` `version:` when the request was raised.

### Dropdowns *(required)*

| Field | Guidance |
|-------|----------|
| **Deployment target(s)** | Both unless the capability only makes sense on one platform |
| **Priority** | `high` = blocks a committed milestone; `medium` = planned; `low` = nice to have |
| **Affected Area(s)** | See the area guide in [README](./README.md#area-guide) |

---

## Formatting tips

Follow [README drafting style](./README.md#drafting-style-agents--chat-drafts): one copyable code block no semicolons stay on topic do not overdetail always third person.

Describe the outcome, not the build plan. "Clinicians can retire a published IFU" beats "add a `status` column and a soft-delete route".
