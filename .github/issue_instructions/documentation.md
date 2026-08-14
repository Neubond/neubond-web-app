# Documentation issue instructions

**Template:** [documentation.yml](../ISSUE_TEMPLATE/documentation.yml)  
**Labels (auto):** `documentation`, `todo`  
**Title prefix:** `[DOCUMENTATION] `

---

## Title (one line)

**Pattern:** `[DOCUMENTATION] <what needs documenting> in <area>`

**Examples:**

- `[DOCUMENTATION] Document the local Cloudflare preview workflow`
- `[DOCUMENTATION] Record required environment variables per deployment target`

---

## Field guide

### Documentation Request *(required)*

**One paragraph only.** No bullets or subheadings in this field.

State what is undocumented or wrong, where a reader would look for it, and what they fail to do without it.

### Target Audience *(optional)*

Who reads this. *e.g. Engineering onboarding, clinical staff, auditors.*

### References / Links *(optional)*

Existing docs, tickets, or specs to build on. Up to 5 items.

### Additional Remarks *(optional)*

Whether this blocks onboarding or an audit.

### Source of Feedback *(required)*

*e.g. Onboarding friction, audit finding, repeated question.*

### App version *(required)*

`` `package.json` `` `version:` when the gap was found.

### Dropdowns *(required)*

| Field | Guidance |
|-------|----------|
| **Deployment target(s)** | Name the target when the docs differ, which is common for build and env setup |
| **Priority** | `high` = blocks onboarding or an audit; `medium` = should schedule; `low` = nice to have |
| **Affected Area(s)** | See the area guide in [README](./README.md#area-guide) |

---

## Formatting tips

Follow [README drafting style](./README.md#drafting-style-agents--chat-drafts): one copyable code block no semicolons stay on topic do not overdetail always third person.

Say where the doc should live (`` `README.md` ``, `` `docs/` ``) when it is obvious.
