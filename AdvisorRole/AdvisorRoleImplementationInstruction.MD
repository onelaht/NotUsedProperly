# B — Advisor frontend and client recommendations instruction

## Outcome and business context

Implement a new Advisor workspace and its client-visible recommendation surfaces. Advisor can inspect assigned clients and their current holdings, set a holding recommendation and maintain a list of instruments the client does not yet hold. The client sees their assigned advisor on the profile, the advisor's view beside each current holding and a separate recommendations table beneath holdings.

This request authorizes advisory guidance as an additional feature. It does not authorize trading on another person's behalf, client impersonation, automatic execution or advisor approval gates for client orders. Preserve BR-02 client isolation, BR-09/10 financial integrity and BR-14 attributable history. Recommendation edits must never change cash, owned units, reservations or orders.

## Working contract for the implementing agent

This is an implementation assignment for Codex or Copilot, based on the source on 21 October 2026. Recheck the named files before editing; do not treat historical documentation as proof of current behavior. The instruction contains the required business context and does not depend on a private reference being available.

1. Inspect `git status --short` and applicable repository instructions. Preserve pre-existing edits, local environment files, credentials and retained volumes. Inventory only this assignment's files and immediate consumers; avoid repeated repository-wide reads.
2. Make a requirement matrix with `existing`, `missing frontend`, `backend prerequisite`, `policy decision`, and `deferred` states. Attach a source symbol and an acceptance test to each feature. Distinguish an existing endpoint from a proposed one.
3. Use TDD for implementation: write a behavioral test, run it and capture the meaningful failure, implement the smallest change, then refactor within scope. Missing dependencies are not a passing test or a demonstrated red phase. Do not claim checks ran when they did not.
4. Follow the current architecture. Angular uses standalone components, signals, RxJS, lazy routing, dependency injection and colocated Vitest specs. Spring uses thin controllers, service interfaces/implementations, DTOs and MyBatis mappers. The separate analytics service uses FastAPI, Pydantic, SQLAlchemy and pytest. Do not introduce an unrelated framework or persistence pattern.
5. Scope all data to the verified identity. Menu hiding and browser guards are UX controls; APIs enforce role and object ownership. Clear sensitive state on logout, session change and permission loss. Cancel obsolete requests and prevent late responses from restoring a prior user's data.
6. Runtime financial data must come from genuine approved sources. Use deterministic test fixtures for populated, empty, delayed and failure states; do not turn unavailable into zero or silently enable fixture data in normal operation. Never put credentials, bank details or identity data in fixtures, logs or browser storage.
7. The current financial model is one USD ledger, provider-backed quotes and internal booking. Cash/position journals are not a complete general ledger. An internally booked fill does not establish external bank transfer, exchange execution or custody. Fees are currently zero. Preserve all reservation, idempotency, ownership and durable-evidence guarantees. These assignments do not restore deferred multi-market execution.
8. Keep new code in role-owned files. Limited shared integration seams are listed below. Serialize shared-file edits with the integrator; do not reformat whole files. If another contributor owns a seam, supply the exact proposed patch and wait for integration instead of overwriting their work.
9. If a necessary change exceeds these boundaries, immediately stop code editing. Perform an in-depth impact analysis and write `SharedChangeProposal/README.MD` under this instruction's directory. Include the trigger, source evidence, exact files/symbols, all expected changes and reasons, alternatives, dependency order, affected callers, security/data implications, test plan, deployment/migration/rollback, ownership and unresolved decisions. Preserve completed work. Do not implement the broader change until the current session authorizes it or provides the prerequisite. Routine explicitly allowed role registration does not require a new approval.
10. End with changed files, requirement coverage, actual tests/results, remaining prerequisites and exact handoff paths. Frontend completion and backend integration are separate statuses; do not report a full workflow complete while its credential, route integration or data source is missing.

### Shared visual and state conventions

For frontend work, reuse `layout/authenticated-shell.component.ts`, the existing top navigation and the styles in `frontend/src/styles.css`. Use existing CSS variables, square corners, green accents, semantic headings, `.workspace-heading`, `.panel`, `.notice`, `.section-heading`, `.table-wrapper` and existing buttons/forms where applicable. Keep new styling local. Do not redesign the shell, duplicate navigation or add a component framework.

Use `PageResource<T>` and `RequestStateComponent` where suitable. `PageResource` cancels requests and clears data on session change; it currently reads error `message`, not FastAPI `detail`. Adapt differing errors inside the role's API layer instead of modifying the shared class. For mutations, separate read state from save state so a failed save preserves the user's draft. Distinguish loading, successful-empty, populated, 401, 403, non-disclosing 404, 409, validation, 429, unavailable and offline states. Do not keep protected stale content after permission loss. Tables need captions, header scope, stable row IDs, keyboard access, visible focus, labeled inputs and horizontal overflow at narrow widths. Display UTC or an explicitly named timezone and server-provided as-of times.

### Backend source-path convention

Java package directories are intentionally not hard-coded here. Locate each named Java file with `rg --files backend/src/main/java -g '<FileName>.java'`; use the existing package and neighboring tests. Locate corresponding tests under `backend/src/test/java` or `testing/src/test/java`. A basename in this instruction identifies the existing repository file, not permission to move it. Use repository-relative paths inside handoff Markdown so it remains portable.

## Verified baseline and reading map

| Area | Current state | Implication |
| --- | --- | --- |
| Role policy | `core/auth/workspace-policy.ts` recognizes CLIENT, TRADING_OPS, COMPLIANCE, ANALYST and FINANCE | ADVISOR is dropped by normalization and currently has no usable workspace |
| Routes | `app.routes.ts` has no Advisor feature | Add exact Advisor paths plus role registration |
| Current client overview | `features/client/account-page.component.ts` is routed at `/app/overview` | Edit this surface; `dashboard.ts/html` is a legacy mock, not the implementation target |
| Holdings | `Portfolio.currentPositions` has `instrumentId,ticker,name,currency,owned,reserved,available,updatedAt` | Join guidance by stable instrument ID, never by row index or ticker alone |
| Client profile | `profile.ts` and `user.service.ts` load onboarding/profile data | Profile response has no assigned advisor display contract |
| Advisor data | Existing advisors link to users; clients have `advisor_id` | Useful backend foundation, not proof of server-enforced self scope |
| Advisor API | `AdvisorController.java` includes `/api/advisors/{advisorId}/clients` | Current path/role checks do not establish that the path advisor is the authenticated advisor |
| Suggestions | `TradeSuggestionController.java` and service support BUY/SELL suggestions with quantity and client decision status | Not equivalent to N/A/HOLD/SELL holding guidance or advisor recommendation CRUD |
| Legacy ownership helper | `SecurityRoleSupport.java` permits a non-client ADVISOR through its client-ownership helper | Do not reuse this as proof of assigned-client security |
| Onboarding | `ClientOnboardingServiceImpl.java` completes profile and initializes client/account | Automatic advisor assignment is not currently implemented |
| Seed | `database/demo/role_workspaces.sql` has no `demo.advisor` | Frontend-only work cannot provision a working login |

Read these sources plus `core/auth/auth.guard.ts`, `auth.service.ts`, `auth.interceptor.ts`, `layout/authenticated-shell.component.ts`, account page specs, `AdvisorServiceImpl.java`, `ClientMapper.java`, `TradeSuggestionMapper.java`, and relevant DTOs. Review `ImplementationDocumentation/Backend/Advisor.md`, `ImplementationDocumentation/Backend/Refresh_Role_TradeSug.MD`, `docs/role-support-changes.md`, the current client crash course, `database/README.md`, and fresh definitions for advisors, clients, suggestions and current positions. Historical documents describe capabilities or schemas that may now differ; verify the actual annotations and SQL.

## Scope and credential prerequisite

**Owned files:** `frontend/src/app/features/advisor/**`; new advisory models/adapter there; new client presentation components under `frontend/src/app/features/client/advisory/**`; this instruction's documentation directory.

**Explicit narrow shared seams:** Advisor-only entries in `app.routes.ts`, `core/auth/workspace-policy.ts`, and their focused specs; add the Advisor column and recommendations component to `features/client/account-page.component.ts`; add an independent assigned-advisor section to `profile.ts` and a new profile spec if needed. Prefer an independent advisory request over changing shared `UserService` or the portfolio DTO. Serialize central route edits. Preserve existing role priority by appending the new role unless a separately authorized policy says otherwise.

**Outside scope:** all Spring/SQL/seed code, core onboarding/auth/session behavior, client financial calculations, order ticket, polling infrastructure, existing operations/support behavior, global style or shell changes. The backend handoff owns assignment, demo credential provisioning, persistence and authorization hardening. Do not change database records through an ad hoc browser or SQL command to get around this boundary.

Use username **`demo.advisor`** and neutral display name **`Demo Advisor`** in the handoff and test identity. Its only assigned demo client is **`demo.client`**; `demo.client2` remains unassigned to it and is a negative authorization fixture. The existing public demo password convention is `RoleDemo2026!`; any seed must hash it and preserve existing passwords. This credential is a backend prerequisite, not a frontend login bypass. Provide a test-harness preview using injected fixtures if runtime provisioning is pending, and explicitly report that interactive login verification remains blocked. Never assign every real client to the demo advisor in Angular.

## UI and behavior specification

### Advisor navigation and assigned clients

Add `/advisor/clients` as the Advisor home and `/advisor/clients/:id` as client detail. Accept positive integer IDs only, matching the project's existing ID style. Register these exact routes in role recognition and safe return URL handling. Reuse the authenticated shell's role-driven sidebar; do not create separate advisor authentication or hard-code a user ID into navigation.

The client list shows display name, safe client reference, assignment status if supplied, last-updated time and a View holdings action. Include search and bounded pagination when supported by the proposed API. A successful empty list says no clients are assigned. Authorization or server failure must never appear as an empty list. Detail loads only the selected client, with an explicit back link and independently recoverable holdings/recommendation requests. Cancel old requests on client switch and clear drafts before showing another client.

### Holding guidance

| UI value | Wire value proposed | Meaning |
| --- | --- | --- |
| N/A | `NONE` or absence of guidance | No current recommendation recorded |
| HOLD | `HOLD` | Advisor suggests retaining the position |
| SELL | `SELL` | Advisor suggests the client consider selling |

Keep the initial enum to these three values. Do not confuse `NONE` with an API outage. If guidance could not load, show Unavailable with retry rather than N/A. Do not map legacy `SUGGESTED`, `ACCEPTED` or trade type `BUY` directly onto these statuses.

Advisor detail shows instrument/name, owned units, reserved units, available units, current guidance, optional rationale, author/as-of and a Save action. N/A clears current guidance while preserving history in the future backend. Save uses version/conflict handling, disables repeat submission, preserves draft on failure and updates the row only after confirmed success. Guidance is an opinion, not a trade instruction or guarantee of outcome. A SELL label never issues an order.

### Recommendations for instruments not held

Under holdings, provide an Advisor Recommends table with **Ticker/Instrument**, **Comp Name** (use accessible heading Company / instrument name), and **Reasoning**. The advisor can add, edit and delete entries; the client has read-only access. Use instrument selection from an authorized catalog or proposed Advisor catalog endpoint; do not borrow a CLIENT-only instrument endpoint by widening its guard.

Validate a selected stable `instrumentId`, nonblank reasoning, and a documented UI bound such as 1–2000 trimmed characters, repeated in the backend contract. Present the bound as a proposed contract choice. Prevent duplicate active recommendations for the same client/instrument. Exclude instruments with positive owned units; holdings of zero remain eligible. Fractional units count as ownership. Do not decide held status from available-to-sell units, because all units could be reserved. Use server-provided eligibility where possible and an exact decimal-safe predicate for fixture/UI checks.

Removal requires a clear confirmation with instrument identity; preserve the row until success, and treat backend deletion as archival/history preservation. Recheck eligibility after portfolio refresh or a conflict. If the client acquires a recommended instrument, omit it from the not-held table while retaining recommendation history; do not automatically generate HOLD or SELL guidance.

### Client overview and profile

Add a column headed **Advisor’s** to the real current-positions table. Each row shows N/A, HOLD, SELL or a distinct unavailable state. Add the read-only recommendations section immediately below positions and before unrelated history. Advisory fetch failure must not hide cash, holdings, valuation or orders. Recommendations are not optimistic owned positions and cannot affect totals.

Profile shows the assigned advisor's name when assigned, Assignment pending when no advisor exists, and Assignment unavailable on read failure. Fetch assignment independently so a cached completed profile does not prevent an assignment refresh. No “select your advisor” control is requested. Automatic assignment happens on the server after onboarding; explain the pending state in the UI without pretending that Angular completed assignment.

## Proposed API boundary

Keep the following in role-owned TypeScript contracts and label them **proposed**, pending the backend handoff. Do not silently adapt insecure legacy APIs into these contracts.

| Method/path | Purpose and minimum result |
| --- | --- |
| GET `/api/workspace/advisor/clients` | Authenticated advisor's paginated assigned clients; `{items,page,pageSize,total}` |
| GET `/api/workspace/advisor/clients/{clientId}/portfolio` | Assigned client's identity-safe summary and exact current positions; timestamps |
| GET `/api/workspace/advisor/clients/{clientId}/guidance` | Per-instrument guidance, reasoning, author, version and updatedAt |
| PUT `/api/workspace/advisor/clients/{clientId}/guidance/{instrumentId}` | `{status,reasoning,expectedVersion}`; return confirmed versioned guidance |
| GET/POST `/api/workspace/advisor/clients/{clientId}/recommendations` | Read/create active not-held recommendations |
| PATCH/DELETE `/api/workspace/advisor/clients/{clientId}/recommendations/{id}` | Versioned edit/archive; exact response and delete-version transport must be frozen in the handoff |
| GET `/api/workspace/advisor/instruments` | Bounded authorized instrument selector; only if no suitable existing API exists |
| GET `/api/workspace/client/advisor` | Owned assignment `{assignmentStatus,advisor:{advisorId,name}|null,assignedAt}` |
| GET `/api/workspace/client/advisory` | Owned guidance and not-held recommendations, source/as-of metadata |

Freeze the final JSON examples, optional/null fields, string decimal representation, zero-based pagination, expected-version transport and status codes before adapter integration. A proposed 404/503 is unavailable functionality, not proof the client has no recommendations. Handle 400 validation, 401/403, non-disclosing 404, 409 conflict, 429 and temporary failure explicitly. Client APIs derive client ownership from the session; advisor APIs derive advisor identity from the session, never a browser-supplied advisor ID.

## TDD implementation sequence

1. Write failing policy tests for ADVISOR normalization/home, valid direct links and denial of other-role paths; preserve all existing multi-role behavior. Add component tests with injected services before requiring a new credential.
2. Test adapter request shapes, ID encoding, expected versions, error mapping and no calls to trade/order mutation endpoints. Implement the adapter without permissive fake-data fallback.
3. Test and implement client list/detail, correct client switching, no assigned clients, permission failures and late-response cancellation.
4. Test and implement HOLD/SELL/N/A saves and clears, validation, repeated clicks, conflict refresh and preserved failed drafts.
5. Test recommendation add/edit/archive, duplicate instrument, whitespace-only rationale, bound limits, fractional ownership, owned-but-fully-reserved exclusion, zero position eligibility and no automatic trade.
6. Test and implement the independent client overview column/panel and profile assignment states. Make existing client account tests pass without changing cash/holdings expectations. Test that advisory outage does not suppress financial information.
7. Serialize the small route/policy integration changes. Test reload/deep link, logout/relogin and session switch. A real `demo.advisor` walkthrough waits for actual authorized provisioning; do not call injected test identities a live login.
8. Verify consistent layout, keyboard interactions, delete confirmation focus, labels, table overflow and rationale text escaping. Write final handoffs after reviewing the diff.

## Required backend/database instruction

Create `AdvisorRoleBackendImplementation.MD` here, with a standalone TDD backend task including:

- Exact frontend DTOs, endpoints, request examples, version rules, error behavior and all consumer files. Existing APIs versus proposed endpoints must be unmistakable.
- Resolve authenticated user to `advisors.user_id`, then enforce `clients.advisor_id` in every list/detail/read/write query. Test advisor A against advisor B's client and guessed recommendation IDs. Role annotations alone are insufficient. Do not rely on the legacy non-client ownership bypass.
- Automatic assignment on successful onboarding, performed transactionally or by a durable idempotent post-onboarding mechanism. Preserve existing assignment on retry. No eligible advisor means pending, not fabricated assignment. Define advisor eligibility, deterministic allocation/tie-breaking, concurrency, reassignment and disabled-advisor behavior as explicit decisions. The demo mapping is not a production allocation policy.
- Dedicated holding-guidance and instrument-recommendation storage unless a justified compatible extension is demonstrated. Existing `trade_suggestions` requires BUY/SELL and positive quantity and has client decision statuses; do not alter those meanings to fit HOLD/N/A.
- Stable FKs; uniqueness for one active guidance per client/instrument and one active recommendation; rationale bounds; exact timestamps; optimistic versions; append-only change history; safe archive instead of erasing prior advice. Document history access and privacy.
- Reread committed owned quantity for recommendation eligibility, account for fractional and reserved units, and preserve history after acquisition. Advisory updates never write financial tables or enqueue execution.
- Repeatable optional demo seed for `demo.advisor`, ADVISOR role, linked advisor and only `demo.client`. Resolve IDs by username; preserve other assignments/passwords/balances; keep `demo.client2` as a negative fixture. Handle a conflicting pre-existing assignment explicitly rather than silently overwriting it. Do not modify the shared seed/Compose pipeline without coordinated scope.
- Fresh/upgrade parity, migration version allocation, targeted runtime grants, no destructive rollback, service/controller/mapper/PostgreSQL tests, and tests proving unchanged self-directed trading. Flag shared onboarding/auth helper changes under the stop-and-proposal rule.

Create `AdvisorRoleFrontend_CrashCourse.MD` here, explaining implemented routes/components, why recommendation state is independent of financial state, how identity/fixtures/API calls work, status/eligibility semantics, client and advisor walkthroughs, tests/results, credential prerequisite, proposed backend contract and limitations. Do not claim persistence or automatic assignment exists until verified against a real backend.

## Verification and done criteria

Run role specs first from `frontend` with `npm test -- --watch=false --include='src/app/features/advisor/**/*.spec.ts'`, then new client-advisory/profile specs and routing policy specs. Confirm CLI selector support. Finally run `npm test -- --watch=false`, `npm run test:qof-styles` and `npm run build` once. Record any environment blocker precisely.

Done means all requested frontend surfaces and tested interactions exist, role registration is integrated, neighboring client behavior is preserved, no advice action submits an order, populated/error/empty states are verified, and both backend/frontend handoffs are complete. State separately whether the demo credential, automatic assignment, backend ownership enforcement and persistence are integrated or pending; pending prerequisites prevent claiming a fully working end-to-end Advisor feature.
