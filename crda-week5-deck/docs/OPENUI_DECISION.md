# OpenUI decision

**Decision: integrated, as an optional, isolated “Explore CRDA” panel (key `E`). It is not one of the nine counted Week 5 slides.** GSAP + Reveal.js still drive every slide and all motion; OpenUI renders only the bounded explanatory panel.

## What OpenUI is (checked against thesysdev/openui, 19 Oct 2026)

A generative-UI framework: a component library is defined with Zod schemas, and a program in **OpenUI Lang** (a compact language, normally produced by an LLM) is parsed and rendered by a framework renderer. It is not an animation library, so it doesn't replace GSAP.

## What is genuinely powered by OpenUI

| Piece | File | OpenUI API used |
|---|---|---|
| Component library: `Explorer`, `Tab`, `StageCard`, `AssumptionToggle`, `Claim`, `ClaimsVsPlan` | `src/explore/library.tsx` | `defineComponent` (Zod v4 props, typed child refs via `Component.ref`), `createLibrary` |
| The panel’s content — an **authored** OpenUI Lang program | `src/explore/crda.oui.ts` | OpenUI Lang syntax (`root = Explorer(…)`, statement references) |
| Rendering | `src/explore/panel.tsx` | `<Renderer response={program} library={library} />` from `@openuidev/react-lang` |
| Validation | `tests/unit/openui.test.ts` | `createParser(library.toJSONSchema(), 'Explorer')`: 0 errors, 0 unresolved, 0 orphaned; server-render shows 4 `StageCard`s with KaTeX |

There is no model call, no API key and no network access. The program is a static fixture whose numbers come from `src/content/paper.ts` (paper abstract and Table 1), and it labels them “Original authors’ reported results — not our group’s reproduced results”.

## Versions (pinned to releases at least ~2 weeks old)

`@openuidev/react-lang` 0.3.0 (with `lang-core` 0.3.2), `react` / `react-dom` 19.3.0, `zod` 4.6.5. Newer 1.0.x releases came out four days before this work, so I avoided them.

## Isolation guarantees (each one tested)

- **Lazy**: React + OpenUI ship as a separate ≈124 KB-gzip chunk, loaded only on the first `E` press. The slides never import it.
- **Navigation untouched**: while the panel is open, Reveal’s keyboard is disabled. `Esc` or `E` closes it and the slide position is unchanged (browser test).
- **No export contamination**: the `E` binding isn't registered in `?print-pdf`, and the PDF has 9 pages with no panel (browser test).
- **Accessibility**: `role="dialog"`, `aria-modal`, labelled title, focus moves to Close and returns afterwards, tabs and radio toggles use ARIA roles.
- **Offline**: zero remote requests with the panel open (browser test).

## Risks found during the audit, and how they are handled

1. **Install-time telemetry.** `@openuidev/lang-core` has a `postinstall` script that sends a pseudonymous install event to PostHog. Its own disclosure says it includes a salted project ID, Node/OS/package-manager versions, and the IP that PostHog sees. **It already ran once on this machine during development.** To opt out on future installs, set `OPENUI_TELEMETRY_DISABLED=1` (or `DO_NOT_TRACK=1`) before `npm ci`; the README says so.
2. **Runtime telemetry**: opt-in only (`OPENUI_RUNTIME_TELEMETRY_ENABLED`), and inactive in a browser window anyway. Not triggered.
3. **Dev-mode devtools auto-mount**: in a `development` build, `react-lang` tries to load an inspector script from **cdn.jsdelivr.net**. The deck sets OpenUI’s documented `Symbol.for('openui.devtools.autoMount')` flag before importing it, so this never happens. In production builds the code is dead-code-eliminated, and `dist/` contains no jsDelivr/PostHog/CloudFront references (grep-verified).

## If you would rather not ship it

Delete `src/explore/` and the `E` binding in `src/main.ts`, then remove `@openuidev/react-lang react react-dom zod`. The nine slides, the PDF and the tests for everything else don't depend on it.
