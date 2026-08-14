# Issue instructions

Reference docs for filling GitHub issues from [`.github/ISSUE_TEMPLATE/`](../ISSUE_TEMPLATE/). Use these when creating or drafting issues (including with Cursor Agent).

These mirror the conventions used in `Neubond-App-v2`, adapted for this Next.js web app. Where that repo asks about iOS, Android, and app variants, this one asks about browsers and deployment targets.

## Templates

| Template | Instruction file | GitHub form |
|----------|------------------|-------------|
| Bug | [bug.md](./bug.md) | `bug.yml` |
| Feature | [feature.md](./feature.md) | `feature.yml` |
| Improvement | [improvement.md](./improvement.md) | `improvement.yml` |
| Tech debt | [tech-debt.md](./tech-debt.md) | `tech-debt.yml` |
| Design | [design.md](./design.md) | `design.yml` |
| Documentation | [documentation.md](./documentation.md) | `documentation.yml` |

## How to use (humans & agents)

1. **Pick the template** that matches the work (bug vs feature vs …).
2. **Open the matching `*.md`** in this folder and follow its **Title**, **Field guide**, and **Formatting** sections.
3. **Copy content into the GitHub issue form** field by field (GitHub issue forms do not read these files automatically).
4. For **dropdowns**, use the exact option labels listed below (e.g. `target-cloudflare`, `ifu`).
5. **App version**: read from `package.json` → `version:` (currently `1.0.0` unless the reporter specifies otherwise).

**Cursor:** `/create-issue <type>` (see `.cursor/commands/create-issue.md`). Pass the type (`bug`, `feature`, `improvement`, `tech-debt`, `design`, `documentation`) plus the feedback. Default is draft-only. Say **open** / **file it** to create on GitHub.

## Drafting style (agents & chat drafts)

When drafting an issue in chat (before pasting into GitHub or running `gh issue create`):

1. **Output the full draft inside a single fenced code block** so it is easy to copy.
2. **Do not use semicolons** in titles or body prose (prefer periods commas or short clauses).
3. **Stay on topic** — only what belongs in that template's fields.
4. **Do not overdetail** — concrete paths and impact are enough. Skip long background, implementation walkthroughs, and speculative edge cases. Cap lists at 5 items.
5. **Primary description = one paragraph** — each template's main description field (Bug Description, Feature Description, Improvement Description, Technical Debt Description, Design Description, Documentation Request) must be **one paragraph only**. No bullets, subheadings, or bold section labels in that field. Other fields (steps, acceptance criteria, current/expected) may still use lists.
6. **Always use third person** — describe the app users clinicians engineering or the system (`The app…` `Users can…` `Clinicians need…`). Do **not** use first person (`I` `we` `me`) or second person (`you` `your`) in titles or body fields. Do **not** use first-person user stories (`As a … I want …`).
7. **Feedback not solution** — write the problem or request (current vs desired). Do not prescribe how to implement unless the reporter already stated a fix.
8. **Name the deployment target when it matters** — this repo ships two, Cloudflare Workers from `main` and Vercel from `vercel-deploy`. Say which one is affected when the behaviour differs. Do not add "same on `main`" boilerplate when it does not.
9. **Requirements / Acceptance Criteria** (feature template): absolute browser, platform, or external service gates only. No UI or implementation tasks.

Follow the matching `*.md` field guide for required vs optional sections and dropdown option labels.

## Shared dropdown reference

- **Browser(s)** *(bug only)*: `browser-chrome`, `browser-safari`, `browser-firefox`, `browser-edge`
- **Device type(s)** *(bug, improvement, design)*: `device-desktop`, `device-mobile`, `device-tablet`
- **Deployment target(s):** `target-cloudflare`, `target-vercel`
- **Priority:** `priority-low`, `priority-medium`, `priority-high`
- **Affected area(s):** `auth`, `ifu`, `emails`, `supabase`, `ui`, `routing`, `storage`, `deployment`, `seo`, `app-wide`

### Area guide

| Area | Covers |
|------|--------|
| `auth` | `app/auth/**`, `app/login-callback`, `lib/supabase/` session handling |
| `ifu` | `app/ifu/**`, `app/api/ifu/**`, `lib/ifu/` |
| `emails` | `emails/**` React Email templates and the `email:dev` preview |
| `supabase` | `lib/supabase/**` clients, SSR wiring, RLS-facing calls |
| `ui` | `components/**`, `components/ui/**`, theming |
| `routing` | `middleware.ts` on Cloudflare, `proxy.ts` on Vercel, redirects |
| `storage` | R2 bucket on Cloudflare, Vercel Blob on Vercel |
| `deployment` | `wrangler.jsonc`, `open-next.config.ts`, `next.config.ts`, build config |
| `seo` | metadata, Open Graph and Twitter images, `apple-app-site-association` |
| `app-wide` | dependencies, tooling, or anything crossing most of the above |

## Formatting in textarea fields

GitHub issue textareas support Markdown. Prefer:

- **Bold** for emphasis (`**text**`)
- *Italic* for notes or soft emphasis (`*text*`)
- `` `inline code` `` for paths, APIs, labels, versions
- Fenced blocks for logs or stack traces:
  ````markdown
  ```
  log line here
  ```
  ````
- Numbered lists for steps bullet lists for symptoms or acceptance criteria

Do not rely on HTML in issue bodies.

When the agent presents a full issue draft in chat use one outer code block (see **Drafting style** above).
