### Summary

<!--
One line only: what was done.
No second sentence, no platform essay, no file paths.

Good:
- Upgraded dependencies to Next 16 and cleared all known vulnerabilities.
- Fixed IFU download returning 404 when the blob prefix is empty.
-->



### More details

<!--
High level only. One short block per logical change.
Pattern:

**Title**: What changed and the user-visible or product outcome. One or two sentences max.

Rules:
- Outcome-first — what the app now does or supports, not how the code is wired.
- No file paths unless the reviewer cannot understand the change without them.
- No unnecessary implementation nuance.
- Group related work into one block.
- Delete unused placeholders.
-->

**Change 1**: …

**Change 2**: …



### Deployment target

<!--
This repo ships two targets from two long-lived branches:

- `main` → Cloudflare Workers via OpenNext (`wrangler.jsonc`, `open-next.config.ts`, `middleware.ts`)
- `vercel-deploy` → Vercel (`proxy.ts`, `@vercel/blob`)

State which this PR targets, and whether a matching PR is needed on the other branch.
Delete this section only if the change genuinely cannot affect either deployment.
-->

Targets: `main` (Cloudflare) / `vercel-deploy` (Vercel)

Matching PR on the other branch: #… / not needed



### Verification

<!--
How this was checked. Keep it to what was actually run.

- `npm run build` passes
- `npm run lint` clean, or note pre-existing findings
- `npm audit` result if dependencies changed
- Manual steps taken, if any
-->



### Fixes

<!--
Search repo issues and link any that this PR addresses.
Do not guess. Search GitHub issues and match them to the More details blocks.

Suggested workflow:
1. Draft More details first so you know the themes to search for.
2. Use:
   gh issue list --state all --limit 100
   gh issue list --search "ifu" --state all
   gh issue view 1
3. Include an issue only if this PR clearly addresses it.
4. Use:
   Fixes #123

If a PR only partially advances an issue, use `Refs #123` so the issue stays open.
If no issue matches, leave Fixes empty or write None.
-->

Fixes #
