---
name: generate-sbom
description: Regenerate the CycloneDX SBOM for the web app from the npm lockfile
---

# Generate SBOM

Regenerate `sbom.json` for the web app using [`@cyclonedx/cyclonedx-npm`](https://github.com/CycloneDX/cyclonedx-node-npm), which is already a devDependency on `main`.

This is the npm-lockfile equivalent of the Flutter app's IPA SBOM scripts. There is no IPA and no Python generator in this repo.

## 1. Preconditions

- Node **20.9+** (see `.nvmrc`). The build and the generator both require it
- Dependencies installed from the committed lockfile:

```bash
npm ci
```

Run against a clean `npm ci` tree, not a hand-modified `node_modules`. The SBOM describes what the lockfile resolves to.

## 2. Generate

From the repository root:

```bash
npx @cyclonedx/cyclonedx-npm --output-file sbom.json --output-format json --spec-version 1.6
```

Useful flags to pass through when the user asks:

| Flag | Effect |
|------|--------|
| `--omit dev` | Production dependencies only, which is usually what a release SBOM wants |
| `--short-PURLs` | Smaller output |
| `--output-format xml` | CycloneDX XML instead of JSON |

Default output is CycloneDX **1.6** JSON at `sbom.json` in the repository root, matching the committed file.

## 3. Note on the two branches

`sbom.json` is committed on `main` only. The dependency sets differ between targets, so an SBOM generated on `vercel-deploy` describes a different tree. State which branch the SBOM was generated from when reporting.

## 4. Report results

- Confirm success or surface generator errors
- Report the component count and the `metadata.timestamp` written
- Diff against the previous `sbom.json` and summarise added, removed, or version-bumped components
- Do **not** commit the regenerated file unless the user explicitly asks

## 5. Vulnerability scan (optional)

If the user asks for a vulnerability view alongside the SBOM:

```bash
npm audit --json
```

Report counts by severity. `npm audit` reads the lockfile directly, so it does not require the SBOM to be regenerated first.
