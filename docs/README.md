# Documentation

Engineering documentation for `neubond-web-app`.

> Nothing in this folder is a controlled QMS record. Controlled records for the
> Neubond Loop I system live in the QMS repository under `docs/qms/`. Documents here
> are engineering **inputs** to those records.

## Contents

| Path | Purpose |
|------|---------|
| [`ops_guide/sbom_and_vulnerability_management.md`](./ops_guide/sbom_and_vulnerability_management.md) | Generating the SBOM and vulnerability report, the automation behind it, and the IEC 62304 / IEC 81001-5-1 mapping |
| `sbom/` | Generated SBOM and vulnerability report output. Large `sbom.json` snapshots are git-ignored and reproducible from the lockfile |

## Conventions

Mirrors `Neubond-App-v2`:

- `docs/ops_guide/` — operational engineering guides
- `docs/sbom/` — SBOM generator workspace, outside the QMS boundary

Controlled document IDs are written `NBD-LP1-<DocCode>-001` when referenced.
