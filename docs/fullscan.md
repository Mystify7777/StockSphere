# StockSphere Full Scan Report

Date: 2026-04-13
Scope: frontend, backend, deployment, documentation, and production-readiness posture
Status: Functional product with strong momentum, but still in hardening phase before "reliable product" maturity

---

## Executive Summary

StockSphere has crossed the "demo app" line and now behaves like a real product in key user flows:

- Auth onboarding now uses Login/Register (no public JWT debug recovery screen)
- Protected route behavior is in place
- Session persistence and expiry handling are implemented
- Product CRUD with filters/sort/stock actions is implemented
- First-shop onboarding gap is closed via Create Shop CTA/modal
- Free-tier backend cold-start is now handled transparently in UI (status + retry + delayed hint)
- Backend is Dockerized and deployable
- Frontend and backend are both live

Live endpoints:

- Frontend: https://stock-sphere-sable.vercel.app/
- Backend API: https://stocksphere-4xt1.onrender.com/api

Current reality: the app is usable and deployable, but reliability and operational maturity need focused work (testing, observability, stricter production config, and runbooks).

---

## What Changed Recently (Verified)

### Frontend

- Replaced public JWT paste flow with proper Login/Register onboarding
- Added role mapping to backend enums (ROLE_OWNER / ROLE_STAFF / ROLE_BUYER)
- Added register role selector (Owner/Buyer)
- Added confirm-password validation and live mismatch hint
- Added backend wake-up UX:
  - initial health ping
  - warming status banner
  - manual retry health check button
  - delayed "still waking up" hint (~10s)
- Added first-shop onboarding in products page:
  - no-shop empty state CTA
  - create-shop modal
  - shop creation + refresh + auto-select
- Added inter-shop stock transfer UX from product rows:
  - transfer button per product
  - transfer modal (destination shop + quantity)
  - loading-disabled submit state
  - refresh products and stock activity after successful transfer

### Backend

- Moved key config to env-driven behavior in application configuration
- Added actuator dependency and exposed health/info endpoints
- Allowed actuator health/info through security filter chain
- Added production startup safety validator to block unsafe prod startup when:
  - JWT secret is placeholder
  - JPA_DDL_AUTO is update
  - JPA_SHOW_SQL is true
- Extended env template with new config keys
- Added stock movement module with owner-scoped fetch and movement audit records
- Added inter-shop transfer API `POST /api/stock-transfers` with transactional safety:
  - ownership validation for both shops
  - source/destination shop mismatch validation
  - source stock sufficiency validation
  - SKU-based destination merge-or-create behavior
  - paired movement entries: `TRANSFER_OUT` and `TRANSFER_IN`

### Documentation

- Updated README and docs files with live URLs and current flow changes
- Updated roadmap/todo/logs to reflect deployment and UX hardening progress

---

## Verified Breaking Points and Risks

Severity model:

- Critical: likely to cause production outage/security compromise/data risk
- High: major reliability/usability/operational risk
- Medium: quality and maintainability risk with compounding impact
- Low: polish and consistency

### Critical

1. Unsafe default persistence behavior still available by default
- File: backend/src/main/resources/application.yml
- Risk: schema mutation in production if env not set correctly
- Evidence: JPA_DDL_AUTO default remains update
- Immediate action: set JPA_DDL_AUTO=validate in production environment and keep startup guard active

2. Weak fallback secrets/credentials remain in config defaults
- File: backend/src/main/resources/application.yml
- Risk: accidental insecure startup when env vars are missing
- Immediate action: ensure production deployment always defines DB and JWT env vars; add CI check to fail if placeholders are detected

### High

1. Backend run behavior inconsistency in developer context
- Symptom seen repeatedly: mvn spring-boot:run exits non-zero while package succeeds
- Risk: hidden startup/runtime dependency issue may reappear in other environments
- Action: capture and document root-cause startup logs; add runbook section

2. No backend automated tests yet
- Path: backend/src/test
- Risk: regressions in auth/security/data flows during rapid iteration
- Action: add integration tests for auth, shops, and products first

3. No frontend test harness yet
- File: frontend/package.json (no test script)
- Risk: UI/auth regressions in critical onboarding flows
- Action: add minimal frontend integration test coverage for auth and first-shop flow

4. CORS policy is currently broad
- File: backend/src/main/java/com/stocksphere/config/security/SecurityConfig.java
- Risk: overly permissive request metadata handling
- Action: constrain allowed headers and methods to required set

### Medium

1. Observability baseline still minimal
- Current: custom /api/health plus new actuator health/info
- Missing: structured app metrics, error-rate visibility, runtime dashboards, runbooked triage flow
- Action: expand actuator exposure deliberately and add monitoring dashboards/alerts

2. Ops documentation not yet complete for incident handling
- Missing: rollback runbook, incident checklist, smoke-test playbook, release gate criteria
- Action: add docs/runbooks with explicit owner steps

3. Product-level guardrails can be stronger
- Example: additional validations and idempotency protections in high-click actions
- Action: strengthen optimistic/disabled states and backend-side validation contracts

---

## System Health Snapshot

### Product UX

- Entry onboarding: good
- Empty-state guidance: good
- Error transparency: improved
- Cold-start transparency: strong
- First-use usability: improved significantly

### Platform

- Build status: frontend and backend package builds passing
- Deployment status: both tiers live
- Config management: improved, but still needs stricter production profile discipline
- Runtime observability: partial

### Engineering posture

- Architecture direction: solid for stage
- Test maturity: low
- Runbook maturity: low
- Security hardening maturity: medium-low

---

## Improvement Agenda (Product-First, Not Resume-First)

## Phase 1 (0-3 days): Reliability Floor

1. Lock production env values explicitly
- Set APP_ENV=production, JPA_DDL_AUTO=validate, JPA_SHOW_SQL=false
- Rotate JWT secret if current value has ever been exposed in logs or chat

2. Resolve and document spring-boot:run failure path
- Reproduce locally with full logs
- Add a short startup-troubleshooting section in docs

3. Add release smoke checklist and enforce it per deploy
- auth register/login
- first-shop creation
- products CRUD + stock adjustments
- logout + refresh session behavior

## Phase 2 (1-2 weeks): Engineering Safety Net

1. Add backend integration tests for:
- auth register/login/me
- shops create/list
- product create/list/update/delete/stock patch
- stock transfer success/failure paths and movement audit writes

2. Add frontend critical-flow tests for:
- login/register validation
- no-shop onboarding CTA and modal
- product page guarded access

3. Tighten CORS and security defaults
- restrict headers and methods
- review public endpoint allowlist

## Phase 3 (2-4 weeks): Observability and Operability

1. Add observability baseline
- actuator readiness/liveness + selected metrics
- error-rate and latency visibility

2. Add incident and rollback runbooks
- deploy rollback
- backend unavailable handling
- DB connection/runtime troubleshooting

3. Add deployment quality gates
- pre-deploy checklist
- post-deploy synthetic smoke checks

## Phase 4 (4+ weeks): Product Maturity

1. Refresh-token and session management hardening
2. stock movement history/audit trail
3. role-based capability refinement (OWNER/STAFF/BUYER)
4. domain validation hardening and abuse protections

---

## Breaking Point Themes (Root Cause Patterns)

1. Environment drift and fallback defaults
- Fast iteration left too many implicit defaults

2. Feature-first pace outran safety rails
- UX improved quickly; tests and runbooks lagged

3. Deployment succeeded before operations matured
- App is live, but operational confidence systems are still being built

---

## Product Readiness Scorecard

Scoring: 1 (weak) to 10 (strong)

- Core feature completeness: 8.5
- Authentication and session UX: 8.5
- Onboarding completeness: 8.0
- Deployment readiness: 7.5
- Production safety defaults: 6.5
- Observability: 5.5
- Automated testing: 3.0
- Operational runbooks: 4.0

Overall current grade: 7.1/10

Interpretation: real product trajectory, not yet reliably "production-mature" until testing and operations are upgraded.

---

## Immediate Next Sprint Recommendation

Sprint title:

feat: production hardening baseline (tests, startup reliability, runbooks)

Sprint goals:

1. Eliminate startup ambiguity (spring-boot:run root-cause and fix)
2. Add first integration test pack (auth + shops + products)
3. Add release runbook and smoke-check template
4. Enforce production env profile checklist in docs

Definition of done:

- one-command local runbook verified
- backend integration tests passing in CI/local
- smoke checklist executed successfully against live URLs
- rollback instructions documented and test-walked once

---

## Final Assessment

StockSphere is no longer just a portfolio shell. It now has real user-facing decisions in auth, onboarding, and failure transparency.

The next step is not adding shiny features; it is making reliability boring and repeatable.

That is exactly the shift from "resume watermark" to product engineering.
