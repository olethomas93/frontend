# Modernization Roadmap

This document outlines practical steps to modernize the Atvise WebUI frontend while keeping feature parity during the transition.

## Goals
- Improve developer experience with faster builds, clearer typing, and consistent linting.
- Strengthen reliability for long-lived operator sessions (reconnects, caching, graceful degradation).
- Raise security and observability standards for production operations.

## Recommended Phases

### 1) Stabilize the current Nuxt 2 codebase
- **Audit dependencies**: update patch/minor versions, remove unused packages, and introduce `npm audit fix --force` only where risk is low.
- **Lint and format**: adopt Prettier + ESLint shared config to standardize Vue 2 code (no functional changes yet).
- **Runtime hardening**: add error boundaries around SVG loading/webMI calls and enable strict CSP headers in the Express server.
- **Configuration hygiene**: migrate secrets to environment variables, tighten default `webmicfg` values (timeouts, retries), and document `.env`.

### 2) Introduce TypeScript gradually
- Enable `lang="ts"` in Vue SFCs and add `vue-shims.d.ts` for SVG/display modules.
- Convert leaf modules first (`utils`, `plugins`) before moving to core display loader and webMI wrapper.
- Enforce type-safe APIs for read/write/tag subscription helpers to reduce runtime errors.

### 3) Migrate build tooling
- Swap Webpack for Vite using `nuxt-vite` during transition to reduce hot-reload times.
- Add modern testing stack: `vitest` for unit tests and `playwright` for E2E against mocked webMI endpoints.
- Introduce GitHub Actions for lint + test on push; cache `node_modules` and lockfile validation.

### 4) Upgrade the UI stack
- Plan the move from **Vuetify 2 (Vue 2)** to **Vuetify 3 (Vue 3/Nuxt 3)** with a compatibility layer for shared tokens.
- Standardize theming using CSS variables; ensure dark/light parity and accessible contrast for alarm views.
- Adopt a headless component approach (where possible) for better performance in SVG-heavy pages.

### 5) Transition to Nuxt 3/Vue 3
- Create a parallel Nuxt 3 app within `apps/modern` or a feature branch; reuse the `pages`/`layouts` structure where feasible.
- Port critical modules first: authentication, webMI client, display loader, and alarm/trend widgets.
- Replace legacy plugins (`@nuxtjs/auth-next`, `vue2-leaflet-*`) with Vue 3 equivalents or composables; validate SSR compatibility.
- Use `nitro` server routes to proxy atvise endpoints with structured error handling and caching headers.

### 6) Performance and resilience
- Memoize SVG→HTML conversions and cache per display version; consider offloading heavy transforms to Web Workers.
- Add request/subscribe debouncing in webMI helper to lower server load during navigation.
- Instrument key paths (alarms, trends, writes) with structured logs and metrics; surface a lightweight in-app diagnostics panel.

### 7) Delivery and release management
- Introduce feature flags (env-driven) for new layouts/components to allow staged rollout.
- Version static displays/assets with hashed filenames to avoid stale caches after deployment.
- Document deployment playbooks for on-prem vs. cloud, including health checks and rollback steps.

## Quick Wins Checklist
- [ ] Run dependency audit and prune unused packages.
- [ ] Add Prettier + ESLint autofix to CI.
- [ ] Write unit tests for the webMI wrapper reconnect logic.
- [ ] Create a proof-of-concept Nuxt 3 + Vite build that renders one atvise display end-to-end.
- [ ] Measure and log SVG load times and subscription counts per display.

### Nuxt 3 pilot app status
- Location: `apps/modern` (Nuxt 3, client-side rendering)
- Includes: baseline styling, proxy defaults for `/webmi`, `/customScripts`, `/vueComponents`, and a migration status page.
- Next: port the webMI wrapper as a Nuxt 3 composable and move a simple display to validate SVG→Vue rendering.

## Notes specific to Atvise integration
- Keep `frame.enableautofit` false for alignment; handle responsive scaling in Vue layouts instead.
- Sanitize incoming SVG before transformation to prevent script injection from displays.
- Centralize tag mappings per display to minimize accidental over-subscription.
- Provide offline/slow-connection fallbacks (cached displays, last-known values, retry UI) to support remote sites.

### Should you add an external server for atvise communication?
- **When it helps**: Introduce a thin proxy when you need centralized auth (OIDC/JWT) instead of embedding credentials in the browser, consistent TLS/CORS headers, rate limiting, caching of read-only values, structured error handling, protocol translation (REST/GraphQL facade over webMI), and audit logging of writes/subscriptions.
- **Operational benefits**: A proxy can normalize outages (retry/backoff), expose health checks, and provide feature flags for routing (e.g., stage vs. prod atvise instances) without redeploying the SPA.
- **When to stay client-only**: If you are in a trusted network, have no regulatory logging requirements, and latency is critical, direct webMI from the browser remains simpler—just harden CSP, sanitize SVG, and lock down subscriptions.
- **Practical recommendation**: Start with a minimal proxy that only handles auth + CORS + request throttling and keep it stateless; expand with caching/batching once you profile real-world traffic.
