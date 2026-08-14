#!/usr/bin/env node
/**
 * Generate the SBOM and vulnerability report for the Neubond Web Portal.
 *
 * Produces engineering evidence that feeds the controlled QMS records
 * NBD-LP1-SBOM-001 and NBD-LP1-SOUP-001, which live in the QMS repository.
 * Nothing written here is itself a controlled record.
 *
 * See docs/ops_guide/sbom_and_vulnerability_management.md
 *
 * Usage:
 *   node scripts/sbom/generate.mjs [--omit-dev] [--out <dir>] [--fail-on <severity>]
 *                                  [--update-baseline] [--check]
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const SEVERITIES = ["info", "low", "moderate", "high", "critical"];
const SPEC_VERSION = "1.6";

/**
 * Product name as it appears in the regulated record. The npm `name` in package.json
 * must stay a valid npm identifier (lowercase, no spaces), so the two differ by design
 * and both are recorded in the SBOM.
 */
const PRODUCT_NAME = "Neubond Web Portal";

// ---------------------------------------------------------------- arguments

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f, d) => (argv.indexOf(f) > -1 ? argv[argv.indexOf(f) + 1] : d);

const omitDev = has("--omit-dev");
const updateBaseline = has("--update-baseline");
const checkOnly = has("--check");
const failOn = val("--fail-on", "high");

if (!SEVERITIES.includes(failOn)) {
  console.error(`--fail-on must be one of: ${SEVERITIES.join(", ")}`);
  process.exit(2);
}

// ------------------------------------------------------------------ helpers

const run = (cmd, args) =>
  execFileSync(cmd, args, { encoding: "utf8", maxBuffer: 128 * 1024 * 1024 });

/** npm audit exits non-zero when it finds anything, so failure is not fatal here. */
const runAllowFail = (cmd, args) => {
  try {
    return run(cmd, args);
  } catch (err) {
    return err.stdout ?? "";
  }
};

/**
 * Branch this SBOM describes. CI checkouts are frequently detached, where
 * `rev-parse --abbrev-ref HEAD` returns "HEAD", so prefer the ref GitHub reports.
 */
const branchName = () =>
  process.env.GITHUB_REF_NAME || git("rev-parse", "--abbrev-ref", "HEAD");

const git = (...args) => {
  try {
    return run("git", args).trim();
  } catch {
    return "unknown";
  }
};

/**
 * IEC 62304 Clause 8.1.2 requires each SOUP configuration item to be identified
 * by title, manufacturer and a unique designator. CycloneDX gives title (name)
 * and designator (version, purl) but leaves manufacturer empty for npm packages,
 * so it is recovered here from package metadata on disk.
 */
function resolveManufacturer(pkgDir) {
  const pkgPath = join(pkgDir, "package.json");
  if (!existsSync(pkgPath)) return null;

  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  } catch {
    return null;
  }

  if (pkg.author) {
    const name = typeof pkg.author === "string" ? pkg.author : pkg.author.name;
    // strip a trailing "<email> (url)" so the value stays a clean org/person name
    const cleaned = String(name ?? "").replace(/\s*[<(].*$/, "").trim();
    if (cleaned) return { name: cleaned, source: "package.author" };
  }

  const repo = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
  if (repo) {
    const m = String(repo).match(/(?:github\.com|gitlab\.com|bitbucket\.org)[/:]([^/]+)\//);
    if (m) return { name: m[1], source: "repository.owner" };
  }

  if (pkg.name?.startsWith("@")) {
    return { name: pkg.name.split("/")[0], source: "npm.scope" };
  }

  return null;
}

/** Map a bom-ref back to the directory the package was installed in. */
function indexInstalledPackages() {
  const index = new Map();
  const walk = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const path = join(dir, entry.name);
      if (entry.name.startsWith("@")) {
        walk(path);
        continue;
      }
      if (existsSync(join(path, "package.json"))) {
        try {
          const pkg = JSON.parse(readFileSync(join(path, "package.json"), "utf8"));
          if (pkg.name && pkg.version) index.set(`${pkg.name}@${pkg.version}`, path);
        } catch {
          /* unreadable manifest, skip */
        }
      }
      const nested = join(path, "node_modules");
      if (existsSync(nested)) walk(nested);
    }
  };
  walk("node_modules");
  return index;
}


/**
 * Locate the CycloneDX schema directory. npm hoists @cyclonedx/cyclonedx-library to the
 * top level on one branch and nests it under cyclonedx-npm on the other, so the path is
 * resolved rather than assumed. Returns null when it genuinely cannot be found.
 */
function findSchemaDir() {
  const require_ = createRequire(import.meta.url);
  try {
    return join(dirname(require_.resolve("@cyclonedx/cyclonedx-library/package.json")), "res", "schema");
  } catch {
    /* not resolvable via exports map, fall through to known layouts */
  }
  const candidates = [
    "node_modules/@cyclonedx/cyclonedx-library/res/schema",
    "node_modules/@cyclonedx/cyclonedx-npm/node_modules/@cyclonedx/cyclonedx-library/res/schema",
  ];
  return candidates.find((c) => existsSync(join(c, "bom-1.6.SNAPSHOT.schema.json"))) ?? null;
}

// ------------------------------------------------------------------ generate

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
if (!pkg.name) {
  console.error("package.json has no `name`. The SBOM would identify this app by its build directory.");
  process.exit(2);
}

const stamp = new Date().toISOString();
const day = stamp.slice(0, 10);
const suffix = omitDev ? "-prod" : "";
const outDir = val("--out", join("sbom", `v${pkg.version}_${day}${suffix}`));

console.log(`${PRODUCT_NAME} SBOM and vulnerability report`);
console.log(`  product     ${PRODUCT_NAME}`);
console.log(`  npm package ${pkg.name}@${pkg.version}`);
console.log(`  scope       ${omitDev ? "production dependencies only" : "all dependencies (prod + dev)"}`);
console.log(`  node        ${process.version}`);
console.log(`  commit      ${git("rev-parse", "HEAD")} (${branchName()})`);
console.log();

// 1. CycloneDX SBOM ----------------------------------------------------------
const sbomArgs = [
  "@cyclonedx/cyclonedx-npm",
  "--output-format", "json",
  "--spec-version", SPEC_VERSION,
  "--output-file", "-",
];
if (omitDev) sbomArgs.push("--omit", "dev");

process.stdout.write("Generating CycloneDX SBOM ... ");
const sbom = JSON.parse(run("npx", sbomArgs));
// CycloneDX takes the name from package.json; the regulated record names the product.
sbom.metadata.component.name = PRODUCT_NAME;
console.log(`${sbom.components.length} components`);

// 2. Manufacturer enrichment -------------------------------------------------
process.stdout.write("Resolving SOUP manufacturers ... ");
const installed = indexInstalledPackages();
const bySource = {};
let resolved = 0;

for (const component of sbom.components) {
  const key = `${component.group ? `${component.group}/` : ""}${component.name}@${component.version}`;
  const dir = installed.get(key);
  const manufacturer = dir ? resolveManufacturer(dir) : null;
  if (!manufacturer) continue;

  component.publisher = manufacturer.name;
  component.authors = [{ name: manufacturer.name }];
  bySource[manufacturer.source] = (bySource[manufacturer.source] ?? 0) + 1;
  resolved++;
}

const coverage = ((100 * resolved) / sbom.components.length).toFixed(1);
console.log(`${resolved}/${sbom.components.length} (${coverage}%)`);
for (const [source, count] of Object.entries(bySource)) console.log(`    via ${source}: ${count}`);

// record provenance of the enrichment step inside the document itself
sbom.metadata.properties = [
  ...(sbom.metadata.properties ?? []),
  { name: "neubond:sbom:generator", value: "scripts/sbom/generate.mjs" },
  { name: "neubond:sbom:npmPackage", value: `${pkg.name}@${pkg.version}` },
  { name: "neubond:sbom:commit", value: git("rev-parse", "HEAD") },
  { name: "neubond:sbom:branch", value: branchName() },
  { name: "neubond:sbom:scope", value: omitDev ? "production" : "all" },
  { name: "neubond:sbom:node", value: process.version },
  { name: "neubond:sbom:manufacturerCoverage", value: `${resolved}/${sbom.components.length}` },

];

// 3. Schema validation -------------------------------------------------------
process.stdout.write("Validating against CycloneDX 1.6 schema ... ");
let validationResult;
const schemaDir = findSchemaDir();
if (!schemaDir) {
  // Validation is a compliance control. Silently skipping it once already hid a real
  // failure, so an unavailable validator is an error unless explicitly waived.
  console.log("UNAVAILABLE");
  console.error(
    "\nCannot locate the CycloneDX schema. The SBOM has not been validated.\n" +
      "Run `npm ci` first, or pass --allow-unvalidated to accept an unvalidated document.",
  );
  if (!has("--allow-unvalidated")) process.exit(1);
  validationResult = "NOT VALIDATED (waived via --allow-unvalidated)";
} else {
  const { default: Ajv } = await import("ajv");
  const schema = JSON.parse(readFileSync(join(schemaDir, "bom-1.6.SNAPSHOT.schema.json"), "utf8"));
  const ajv = new Ajv({ strict: false, validateFormats: false, allowUnionTypes: true });
  // The bundled schemas $ref each other by filename, but declare $id as a URL, so
  // register the siblings under the URL those relative refs actually resolve to.
  for (const ref of ["spdx.SNAPSHOT.schema.json", "jsf-0.82.SNAPSHOT.schema.json"]) {
    const sibPath = join(schemaDir, ref);
    if (!existsSync(sibPath)) continue;
    const sibling = JSON.parse(readFileSync(sibPath, "utf8"));
    delete sibling.$id;
    ajv.addSchema(sibling, `http://cyclonedx.org/schema/${ref}`);
  }
  const validate = ajv.compile(schema);
  if (validate(sbom)) {
    validationResult = "valid";
    console.log("valid");
  } else {
    validationResult = `INVALID: ${validate.errors?.length} error(s)`;
    console.log(validationResult);
    console.error(JSON.stringify(validate.errors?.slice(0, 5), null, 2));
    process.exit(1);
  }
}

// 4. Vulnerability report ----------------------------------------------------
process.stdout.write("Running vulnerability scan ... ");
const auditArgs = ["audit", "--json"];
if (omitDev) auditArgs.push("--omit", "dev");
const audit = JSON.parse(runAllowFail("npm", auditArgs) || "{}");
const counts = audit.metadata?.vulnerabilities ?? {};
const total = counts.total ?? 0;
console.log(`${total} vulnerabilities`);

const findings = Object.entries(audit.vulnerabilities ?? {}).map(([name, v]) => ({
  name,
  severity: v.severity,
  range: v.range,
  direct: v.isDirect,
  via: (v.via ?? []).filter((x) => typeof x === "object").map((x) => ({ title: x.title, url: x.url, cwe: x.cwe })),
  effects: v.effects ?? [],
  fixAvailable: v.fixAvailable,
}));

const contentDigest = createHash("sha256")
  .update(sbom.components.map((c) => c.purl).sort().join("\n"))
  .update("|")
  .update(JSON.stringify(counts))
  .digest("hex");

const report = {
  schema: "neubond.vulnerability-report/1",
  contentDigest,
  generatedAt: stamp,
  component: { name: PRODUCT_NAME, npmPackage: pkg.name, version: pkg.version },
  scope: omitDev ? "production" : "all",
  provenance: {
    commit: git("rev-parse", "HEAD"),
    branch: branchName(),
    node: process.version,
    advisorySource: "npm audit (GitHub Advisory Database)",
  },
  summary: counts,
  findings,
};

// 5. Write outputs -----------------------------------------------------------
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "sbom.json"), `${JSON.stringify(sbom, null, 2)}\n`);
writeFileSync(join(outDir, "vulnerability-report.json"), `${JSON.stringify(report, null, 2)}\n`);

const severityLine = SEVERITIES
  .map((s) => `${s}: ${counts[s] ?? 0}`)
  .join(" · ");

const md = `# Vulnerability report — ${PRODUCT_NAME} ${pkg.version}

**Generated:** ${stamp}
**npm package:** \`${pkg.name}@${pkg.version}\`
**Scope:** ${omitDev ? "Production dependencies only" : "All dependencies (production and development)"}
**Commit:** \`${report.provenance.commit}\` (\`${report.provenance.branch}\`)
**Node:** ${process.version}
**Advisory source:** ${report.provenance.advisorySource}

Engineering evidence for **NBD-LP1-SBOM-001** and **NBD-LP1-SOUP-001**. Not itself a controlled record.

## Summary

${severityLine}

**Total: ${total}**

## Findings

${
  findings.length === 0
    ? "No known vulnerabilities were reported against the resolved dependency tree at the time of generation."
    : findings
        .sort((a, b) => SEVERITIES.indexOf(b.severity) - SEVERITIES.indexOf(a.severity))
        .map(
          (f) =>
            `### ${f.name} (${f.severity})\n\n` +
            `- Affected range: \`${f.range}\`\n` +
            `- Direct dependency: ${f.direct ? "yes" : "no"}\n` +
            (f.effects.length ? `- Also affects: ${f.effects.join(", ")}\n` : "") +
            (f.via.length
              ? `\n${f.via.map((v) => `  - ${v.title}${v.url ? ` (${v.url})` : ""}`).join("\n")}\n`
              : ""),
        )
        .join("\n")
}

## SOUP identification coverage

IEC 62304 Clause 8.1.2 requires title, manufacturer and unique designator per SOUP item.

- Components: ${sbom.components.length}
- Manufacturer resolved: ${resolved} (${coverage}%)
- Schema validation: ${validationResult}
`;

writeFileSync(join(outDir, "vulnerability-report.md"), md);

if (updateBaseline && !omitDev) {
  writeFileSync("sbom.json", `${JSON.stringify(sbom, null, 2)}\n`);
  console.log("Updated baseline sbom.json");
}

console.log(`\nWritten to ${outDir}/`);
console.log(`  sbom.json`);
console.log(`  vulnerability-report.json`);
console.log(`  vulnerability-report.md`);

// 6. Gate --------------------------------------------------------------------
const threshold = SEVERITIES.indexOf(failOn);
const breaching = SEVERITIES.filter((s, i) => i >= threshold).reduce((n, s) => n + (counts[s] ?? 0), 0);

console.log(`\n${severityLine}`);
if (breaching > 0) {
  console.error(`\nFAIL: ${breaching} vulnerability(ies) at or above "${failOn}".`);
  process.exit(1);
}
console.log(`PASS: no vulnerabilities at or above "${failOn}".`);

if (checkOnly) console.log("(--check: outputs written for inspection only)");
