# A — Finance frontend audit and implementation instruction

## Outcome and business context

Audit `demo.finance`, complete missing Finance layouts and interactions, and prepare precise backend/database implementation instructions. Keep this assignment frontend-only. Finance needs to inspect booked cash movements, booked fills, accounting totals and reconciliation exceptions with trustworthy timestamps. Relevant requirements are BR-09 (atomic booking), BR-10 (correct cash/positions), BR-14 (durable attributed evidence), BR-15 (reconstruction), and, for historical summaries, BR-16/17 (isolated and defined reporting).

Finance may inspect records and run the existing reconciliation. It must not credit accounts, rewrite posted transactions, release holds, repair balances, edit immutable evidence or imply that the application has a full trial balance. Export policy, retention, account scope and any new financial metric need explicit definitions; a proposed screen is not approval of those policies.

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

| Area | Current implementation | Consequence |
| --- | --- | --- |
| Navigation | `core/auth/workspace-policy.ts` registers `FINANCE`, home `/finance/reconciliation`, links to overview and reconciliation | Preserve the working home and existing role priority |
| Overview | `app.routes.ts` maps `/finance/overview` to shared `StaffPageComponent`, requesting `/api/finance/summary` | A placeholder, not a populated finance dashboard |
| Summary backend | `StaffWorkspaceController.java` returns 503 for `GET /api/finance/summary` | Do not pretend summary data is currently available |
| Reconciliation frontend | `shared/workspace/reconciliation-page.component.ts` calls GET/POST `/api/finance/reconciliations` | Existing working functionality must survive |
| Reconciliation backend | `TradingOperationsController.java`, `ReconciliationService.java`, `ReconciliationMapper.java` | FINANCE without CLIENT can get the latest report or create a run |
| Run semantics | Repeatable-read snapshot; persists a report and related findings | POST records evidence; it does not repair books |
| Report shape | `evidenceVersion`, `runId`, `checkedAt`, `matched`, `exceptions[{kind,reference}]`, `historicalExceptions`, `scope`; no run returns `runId:null,message` | Type actual fields and distinguish no run from no exceptions |
| Checks | Cash/position journal totals, active holds, order processing, fill/posting links, movement postings and event/outbox links | Explain the check scope accurately |
| Accounting | USD internal posting journals and zero-fee fills | Do not label them double-entry books or external reconciliation |

Read the source files above plus `core/api/workspace-api.service.ts`, `shared/workspace/page-resource.ts`, `shared/workspace/request-state.component.ts`, reconciliation specs, `WorkspaceAuthorizationTest.java`, and `StaffWorkspaceControllerTest.java`. Read `database/README.md`, the relevant definitions in `database/fresh/001_schema.sql`, and the retained migration sequence through `012_managed_support.sql`. Inspect `ImplementationDocumentation/Frontend/ClientPageImplementation/ClientRefactorCrashCourse.MD`, `ImplementationDocumentation/Frontend/OperationsPageImplementation/OperationsRefactorCrashCourse.MD`, and `docs/operations-runbook.md` for current operational boundaries. Old role guides may incorrectly describe reconciliation as entirely unavailable; the current GET/POST implementation wins.

Local fixture identity is `demo.finance`; the existing optional demo seed uses public development password `RoleDemo2026!`. Do not reset credentials, reseed balances or modify database setup in this assignment. A failing login must be diagnosed as an environment issue rather than bypassed in Angular.

## File ownership

**May create/edit:** `frontend/src/app/features/finance/**`, new Finance-specific adapter/models/specs under that directory, and documentation under this instruction's directory. Keep contracts beside the feature; do not broaden `WorkspaceApi`.

**Narrow integration permission:** replace only `/finance/overview` and `/finance/reconciliation` loaders in `frontend/src/app/app.routes.ts`, delegating to feature-owned components or routes. Keep all other paths/data untouched. Add Finance-only cases in existing routing tests if necessary. Preserve the old shared reconciliation component for unrelated consumers; wrap or extract by composition before considering a move.

**Read-only:** Spring code, SQL, existing migration files, runtime grants, global styles, authentication, shared state utilities, root infrastructure, Operations feature and other role APIs. A shared-component refactor, new backend endpoint or correction of a core financial rule triggers the stop-and-proposal rule.

## Feature and gap specification

| Feature | Required frontend result | Data boundary |
| --- | --- | --- |
| Overview scope | Labeled reporting period, explicit UTC date range, currency USD, Apply/Reset and persistent query parameters | Proposed summary filtering until backend supports it |
| Movement summary | Incoming/outgoing internal movements, gross buy/sell consideration, booked fill count, fee total only if returned and defined | Unknown is unavailable; never calculate from a partial page |
| Evidence context | Data as of, generation time if supplied, definition version, reporting source/status and limitations | Source timestamps are distinct from fetch time |
| Latest reconciliation | Status, run ID, checked-at, unresolved count, historical exception count and exact scope | Existing reconciliation API, independent of summary |
| Run reconciliation | Explicit run action with busy state, repeat-click prevention and result feedback | Existing POST; no automatic retry of an uncertain POST |
| Exception review | Search/filter the fetched exceptions by kind/reference; semantic table and count | Local filtering may say “this run”; do not claim server-wide search |
| Record details | Space for immutable fill/movement/posting references and detail sections | Proposed Finance endpoints; do not link into privileged Operations routes |
| Accounting export | Explain availability, approved scope/purpose and definition version; disabled until a genuine authorized contract exists | Do not create an unaudited browser CSV export |
| Fees/trial balance | Show defined zero fee when authoritative; explain full general-ledger reporting is unavailable | Do not invent accounts, balancing entries, commissions or tax |

Do not expose numeric summary tiles until the summary API returns a valid typed success response. The page can remain useful by displaying reporting controls, explicit source-unavailable information, an independently loaded latest reconciliation and links to its working workflow. Failure of summary must not suppress reconciliation. Fixtures in specs must prove the populated layout now, while missing backend work is recorded precisely.

Reconciliation detail must distinguish current exceptions from preserved historical migration exceptions. `matched:true` means current checks found no differences in their stated scope; it does not erase historical obligations or prove external settlement. Do not use a green “all accounts verified” label.

## Ordered implementation with TDD

1. Capture the Finance route targets and actual GET/POST contracts. Add failing tests for role navigation, existing reconciliation rendering and overview behavior when summary returns 503 while reconciliation succeeds.
2. Add Finance models and adapter with `buildApiUrl`, exact GET/POST URLs, query encoding, cancellation and role-local error normalization. Test request bodies and error mapping before implementation. Reuse existing reconciliation paths unchanged.
3. Create the Finance overview component using the existing shell. Implement validated date scope without calling unsupported summary parameters an implemented backend feature. Render populated, no-activity, unavailable and delayed fixtures in tests. Clear or mark a prior report when filters change so its scope cannot be misread.
4. Wrap or implement the Finance reconciliation feature using the existing API. Test no run, matched run, mismatches, historical exceptions, unavailable backend, permission loss, timeout and rapid double click. Keep run feedback independent from report-loading feedback.
5. Add read-only record sections and gated export affordance. When no endpoint exists, show an explanation rather than a broken link or successful download toast. Test that no ledger/trade mutation request is issued.
6. Perform the small serialized route replacements. Verify Finance landing, direct links, refresh, return URLs and denial to CLIENT, ANALYST, ADVISOR and COMPLIANCE. Preserve mixed-role backend denial for reconciliation; do not weaken it to make a demo work.
7. Verify keyboard flow, narrow-width overflow, UTC labeling, text status alongside color and no layout shift that hides errors. Run the broader frontend checks once.
8. Write the two required handoff files from the final code, with a requirement-to-component-to-test matrix and honest backend gaps.

## Required backend/database handoff

Create `FinanceRoleBackendInstruction.MD` in this directory. It must be a standalone future-backend assignment, not a general suggestion list. Include:

- Exact existing reconciliation contracts and which fields the frontend consumes; tests preserving them. New summary and detail contracts must be labeled **proposed** and match the final adapter.
- A method/path/request/response/status table for `/api/finance/summary` and any proposed fill, movement, posting, reconciliation-history/detail or accounting-export endpoints. Specify filters, pagination, deterministic ordering, UTC date boundaries and decimal strings. Do not claim those new endpoints exist.
- Metric definitions: settled movements versus rejected requests, distinct fill versus distinct order counts, buy debits/sell credits, fees, opening entries, gross versus net totals, reservations versus posted amounts and historical exclusions. Unknown business choices are decision gates.
- A split between exact current reconciliation over transaction records and historical reporting over an isolated reporting source. Never add wide historical scans to the live order path or replace the current matcher without a separate scope approval.
- Role checks and approved account scope, purpose/access audit where sensitive, no implicit ADMIN bypass, and zero financial mutation rights. Include direct HTTP authorization tests and forbidden cross-account detail/export tests.
- Candidate role-owned DTO/service/mapper components. Map existing `cash_journal`, `position_journal`, `cash_movements`, `order_fills`, `reconciliation_runs`, and `financial_migration_exceptions` to required projections. Reuse source facts; do not introduce a second financial source of truth.
- Additive SQL only when justified; fresh-install/retained-upgrade parity, indexes, restricted read/insert permissions, no UPDATE/DELETE of evidence, migration rehearsal and rollback without deleting retained data. Allocate a migration version with the integrator rather than assuming the next number.
- Snapshot consistency, data-as-of semantics, max range/page size/query budget, unavailable versus valid-empty, immutable export manifests and download authorization. Retention/redaction policy remains gated when not supplied.
- Backend TDD sequence and controller/service/PostgreSQL tests. If shared security, financial writers, the global exception layer or core matching must change, the backend agent must stop and write its own scoped change proposal first.

Create `FinanceRoleFrontend_CrashCourse.MD` beside it. Explain what actually changed, why the layouts and state separation exist, how the adapter/components/routes work, what is live versus contract-only, how to run the UI, how to reproduce every major state, tests/results and backend integration steps. Include examples without confidential data.

## Verification and acceptance

From `frontend`, run focused specs first using `npm test -- --watch=false --include='src/app/features/finance/**/*.spec.ts'` (confirm the current CLI supports the selector). Then run `npm test -- --watch=false`, `npm run test:qof-styles`, and `npm run build`. Use existing dependencies; if installation is needed, use the lockfile with `npm ci`. Do not modify it casually. Report unavailable tooling rather than fabricating results.

Acceptance requires the two Finance routes to render consistent dedicated UI; existing reconciliation GET/POST to remain functional; summary failure to leave reconciliation usable; no fake totals, unauthorized exports or financial writes; test coverage of all significant states; unchanged neighboring workspaces; and both handoff files delivered. Backend integration may remain explicitly pending for proposed summary/detail APIs. Record an integration blocker separately from successful frontend layout verification.
