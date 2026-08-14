# Design issue instructions

**Template:** [design.yml](../ISSUE_TEMPLATE/design.yml)  
**Labels (auto):** `design`, `todo`  
**Title prefix:** `[DESIGN] `

---

## Title (one line)

**Pattern:** `[DESIGN] <surface or flow> in <area>`

**Examples:**

- `[DESIGN] Rework the IFU version list for long filenames`
- `[DESIGN] Define dark mode tokens for email templates`

---

## Field guide

### Design Description *(required)*

**One paragraph only.** No bullets or subheadings in this field.

State the surface or flow that needs design attention and what is wrong or missing today. Describe the intent, not the CSS.

### Inspiration / References *(optional)*

Links, screenshots, or prior art. Up to 5 items.

### Requirements / Constraints *(optional)*

Brand, accessibility, or layout constraints that bound the work. Contrast ratios, minimum tap targets, and supported viewports belong here.

### Additional Remarks *(optional)*

Related issues or sequencing notes.

### Source of Feedback *(required)*

*e.g. Design review, clinician feedback, accessibility audit.*

### App version *(required)*

`` `package.json` `` `version:` when the design need was raised.

### Dropdowns *(required)*

| Field | Guidance |
|-------|----------|
| **Device type(s)** | Which viewports the design must cover |
| **Deployment target(s)** | Usually both, since design is shared across branches |
| **Priority** | `high` = blocks a release; `medium` = scheduled polish; `low` = opportunistic |
| **Affected Area(s)** | See the area guide in [README](./README.md#area-guide) |

---

## Formatting tips

Follow [README drafting style](./README.md#drafting-style-agents--chat-drafts): one copyable code block no semicolons stay on topic do not overdetail always third person.

Describe intent and constraints. Leave token names and class lists to implementation.
