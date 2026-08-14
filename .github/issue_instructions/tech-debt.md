# Tech debt issue instructions

**Template:** [tech-debt.yml](../ISSUE_TEMPLATE/tech-debt.yml)  
**Labels (auto):** `tech-debt`, `todo`  
**Title prefix:** `[TECH-DEBT] `

---

## Title (one line)

**Pattern:** `[TECH-DEBT] <refactor or cleanup> in <area>`

**Examples:**

- `[TECH-DEBT] Upgrade outdated dependencies and clear known vulnerabilities`
- `[TECH-DEBT] Converge middleware.ts and proxy.ts across deployment targets`

---

## Field guide

### Technical Debt Description *(required)*

**One paragraph only.** No bullets or subheadings in this field.

State what is messy (architecture, duplication, missing tests, workaround, stale dependencies), where (`` `lib/` ``, `` `app/api/` ``, config files), and when it was introduced if known. Use `` `identifiers` `` inline where helpful.

### Impact *(required)*

Why it matters **now**:

- **Maintainability** — hard to change safely
- **Security** — known advisories or exposed surface
- **Performance** — measurable if possible
- **Reliability** — bugs, flakes, failed builds
- **Onboarding** — team confusion

### Proposed Solution *(optional)*

Suggested approach: refactor steps, target structure, versions. Bullet list or numbered plan. *If unknown, write "TBD — spike first".*

### Additional Remarks *(optional)*

- **Estimated size** — use full words only: *Small*, *Medium*, or *Large* (not S/M/L)
- Breaking changes
- Depends on other issues

### Source of Feedback *(required)*

*e.g. Engineering retro, code review, dependency audit, incident post-mortem.*

### App version *(required)*

`` `package.json` `` `version:` when the debt was identified.

### Dropdowns *(required)*

| Field | Guidance |
|-------|----------|
| **Deployment target(s)** | Both when the debt exists on each branch, which is common for dependency and tooling debt |
| **Priority** | `high` = blocks features or ships known vulnerabilities; `medium` = should schedule; `low` = cleanup when touching area |
| **Affected Area(s)** | See the area guide in [README](./README.md#area-guide) |

---

## Formatting tips

Follow [README drafting style](./README.md#drafting-style-agents--chat-drafts): one copyable code block no semicolons stay on topic do not overdetail always third person.

Link debt to **concrete files**:

```markdown
- `` `eslint.config.mjs` `` still wraps `eslint-config-next` in `FlatCompat`
- No test coverage for the IFU publish route
```

Avoid vague "clean up code" without scope.
