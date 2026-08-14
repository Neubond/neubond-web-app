# Improvement issue instructions

**Template:** [improvement.yml](../ISSUE_TEMPLATE/improvement.yml)  
**Labels (auto):** `improvement`, `todo`  
**Title prefix:** `[IMPROVEMENT] `

---

## Title (one line)

**Pattern:** `[IMPROVEMENT] <change> in <area>`

**Examples:**

- `[IMPROVEMENT] Show upload progress while publishing an IFU`
- `[IMPROVEMENT] Keep the reset-password form usable on narrow viewports`

---

## Field guide

### Improvement Description *(required)*

**One paragraph only.** No bullets or subheadings in this field.

State what is weak about the existing behaviour and what better looks like. This is an enhancement to something that already works, not a bug and not a new capability.

### Current Behaviour *(required)*

How it behaves today. A few sentences or up to 5 bullets.

### Expected Behaviour *(required)*

The desired behaviour. Keep it observable, not prescriptive about implementation.

### Additional Remarks *(optional)*

Related issues, or a note on why this was not done originally.

### Source of Feedback *(required)*

*e.g. Usability review, clinician feedback, code review.*

### App version *(required)*

`` `package.json` `` `version:` when the improvement was raised.

### Dropdowns *(required)*

| Field | Guidance |
|-------|----------|
| **Device type(s)** | Which viewports the improvement matters on |
| **Deployment target(s)** | Both unless the behaviour differs by platform |
| **Priority** | `high` = actively frustrating users; `medium` = should schedule; `low` = polish |
| **Affected Area(s)** | See the area guide in [README](./README.md#area-guide) |

---

## Formatting tips

Follow [README drafting style](./README.md#drafting-style-agents--chat-drafts): one copyable code block no semicolons stay on topic do not overdetail always third person.

Keep current versus expected symmetrical so the delta is obvious at a glance.
