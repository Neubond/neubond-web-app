---
name: create-work-instruction
description: Draft a Neubond Loop I Work Instruction from the QMS template
---

# Create work instruction

Draft a **Neubond Loop I Work Instruction (WI)** using the canonical template in `docs/qms/Templates/work_instruction_template.md`.

## 1. Read the template

Read `docs/qms/Templates/work_instruction_template.md` in full — especially **Document types**, **Writing rules**, and the correct procedure table (**manufacturing** vs **software / operations**).

Human guide: `docs/ops_guide/work_instruction_generation.md`

## 2. Collect inputs

Ask the user for:

| Input | Notes |
|-------|-------|
| **WI number** | e.g. `WI001`, `WI010` |
| **Title** | e.g. `Work Instruction for Main Unit Assembly` |
| **Type** | `manufacturing` or `software` / `operations` |
| **Revision** | e.g. `01`, `Ver 2.1` |
| **Source material** | Ops guide path, BOM, existing steps, photos notes, or free-text process |

If not provided, infer type from context:

- Assembly, soldering, parts (LP1-XXX) → **manufacturing**
- Release, deploy, SBOM, scripts, App Store → **software / operations**

Optional overrides:

- **draft only** — show WI in chat; do not write files
- **from `<path>`** — read that file as the primary source (e.g. `docs/ops_guide/loop1-release.md`)

## 3. Gather evidence

For **manufacturing** WIs:

- Part numbers in `LP1-XXX` format from user input or BOM reference
- Equipment, consumables, tools, time estimates
- IQC criteria from user or existing process notes

For **software / operations** WIs:

- Read referenced ops guides (`docs/ops_guide/`) as **drafting inputs only**
- Convert informal steps into numbered **Step N / N-M** imperative procedure rows
- Map columns to **Procedure · Inputs / artifacts · Verification**
- Cite controlled QMS IDs (**NBD-LP1-***) in the draft where the informal guide references them — do **not** cite `docs/ops_guide/` paths in text meant for approval (add a template *Guidance* note if needed)

## 4. Draft the WI

Write markdown following the template section order:

1. Document control (per-instance)
2. Cover + Statement of use
3. Approvals
4. Revision history (include DRAFT row + this revision)
5. WI metadata
6. Equipment (manufacturing only — omit for software)
7. Procedure table (correct variant)

**Writing rules:**

- Imperative verbs; American English
- Step numbering: **Step 1**, **1-1**, **1-2**, **Step 2**, …
- Manufacturing parts: `NAME (LP1-XXX)` with `x1` / `2x` quantities
- **IQC:** blocks after applicable steps
- **Note:** for jigs, polarity, timing
- No arrows in procedure prose
- Keep *Guidance* blocks only in draft for reviewer context — remind user to remove before eQMS approval

## 5. Write output

Unless **draft only**:

```text
docs/qms/work_instructions/<wi-number>_<slug>.md
```

Slug: lowercase kebab-case from title (e.g. `WI010_loop-i-ios-release.md`).

Create `docs/qms/work_instructions/` if it does not exist.

Do **not** overwrite an existing WI draft without confirming with the user.

## 6. Present for review

Show:

- Output path (or full draft if draft only)
- WI type and procedure row count
- Any **TBD** steps or missing BOM/IQC data
- Reminder: remove *Guidance* blocks and `«placeholders»` before eQMS approval

Review checklist from `docs/ops_guide/work_instruction_generation.md`.

## 7. Commit (only when asked)

Do not commit unless the user explicitly requests it.

---

## Templates

Canonical structure: `docs/qms/Templates/work_instruction_template.md`

Example software source: `docs/ops_guide/loop1-release.md`

Legacy manufacturing reference (garbled export — use for content hints only): `docs/work_instruction.md`
