# C — Compliance frontend audit and implementation instruction

## Outcome and business context

Audit `demo.compliance` and replace generic unavailable screens with a consistent, purpose-aware investigation and evidence workspace. Implement frontend layouts and interactions, then write a precise backend/database task. This assignment does not implement Compliance backend, authorize broad client access or change immutable records.

BR-14 requires permanent attributable instruction, quote, decision and financial evidence; BR-15 requires reconstruction of a filled or rejected order without manually assembling application logs. BR-02 and confidentiality requirements apply to all searches, totals, detail sections, exports and cached results. An operational audit row or an exported checksum alone does not prove evidence completeness or tamper resistance.

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

| Surface | Current behavior | Gap |
| --- | --- | --- |
| Role policy | COMPLIANCE home `/compliance/investigations`, links to investigations and evidence | Preserve existing role and navigation |
| Search | `/compliance/investigations` loads `StaffPageComponent` | No search/filter/result layout |
| Detail | `/compliance/investigations/:id` uses the same generic component | No lifecycle reconstruction UI |
| Exports | `/compliance/evidence` uses the same generic component | No purpose, export history, manifest or verification interface |
| Backend | `StaffWorkspaceController.java` declares GET `/api/compliance/investigations`, `/api/compliance/orders/{id}/evidence`, `/api/compliance/evidence` | These deliberately return 503; there is no successful Compliance evidence contract |
| Transaction evidence | Trading source retains order events, observations, rule decisions, attempts, fills, journals and outboxes | Reuse retained facts in a future authorized read boundary |
| Operations | Purpose contexts, scoped grants, evidence paging and immutable export mechanisms already exist | Useful design references, not Compliance authorization or interchangeable routes |
| Integrity | Append-only guards and restricted grants protect many evidence tables | Do not claim externally anchored cryptographic verification is implemented |

Read the route/policy/staff component source, `core/api/workspace-api.service.ts`, `shared/workspace/page-resource.ts`, request-state component and authorization/router tests. Locate and read `OperationsAccessService.java`, `OperationsOrderService.java`, `OperationsExportService.java`, `OperationsReconciliationService.java`, relevant Operations mappers/DTOs and their tests. Review `features/operations/order-detail.component.ts`, `evidence-table.component.ts`, `operations-context.component.ts`, and `policy-history.component.ts` for visual and evidence patterns. Read the current Operations crash courses, `docs/operations-runbook.md`, `ImplementationDocumentation/Backend/AuditLog.md`, `database/README.md` and relevant fresh/upgrade evidence definitions.

The optional seed supplies `demo.compliance` with public local-only password `RoleDemo2026!`. Existing login is not evidence that an approved account scope, purpose policy or export entitlement is configured. Do not fix an unavailable screen by granting another role or using Operations APIs under Compliance credentials.

## File ownership

**May create/edit:** `frontend/src/app/features/compliance/**`, a Compliance adapter/models/specs within that feature, and this instruction's documentation directory.

**Narrow shared seam:** replace only the three existing Compliance loaders/data entries in `frontend/src/app/app.routes.ts` with lazy feature components or feature routes. Add Compliance-only route tests as required. Keep current URLs and exact positive-ID behavior; serialize the route-table edit with other frontend assignments.

**Read-only:** backend, SQL, runtime grants, Operations APIs and feature files, shared request resources, auth/session/guard behavior, workspace policy, shell, global styles and root deployment files. Do not extract shared evidence components or broaden Operations permission helpers in this task. If reuse requires a cross-feature refactor, apply the stop-and-proposal rule.

## Required frontend surfaces

### Purpose and authorized scope

Provide a labeled purpose/case-reference entry and a clear scope indicator. The backend must eventually validate and bind purpose, identity, expiry and permissions. UI text or a selected checkbox never grants account access. Unknown purpose policy keeps sensitive fetches/export disabled with a precise explanation. Test valid/expired/revoked contexts using injected fixtures.

Do not persist free-text purposes, case prose or evidence in local/session storage or URL queries. Non-sensitive filters and an opaque context identifier may be URL-backed only if the final contract permits it. Keep context in memory by default and require it again after reload. An expired or denied purpose clears protected results and requires deliberate renewal; do not automatically expand the scope.

### Investigation search

Offer order ID, UTC start/end, permitted client reference, instrument and lifecycle status, Apply, Reset, result count, pagination and meaningful empty state. Accept only defined filter names and valid positive order IDs, date order and bounded ranges. Any frontend validation is repeated server-side later.

The result table should include order reference, safe client reference, instrument, side, quantity/unit, state, submitted/accepted/outcome times, execution mode/record kind and evidence-completeness indicator when supplied. Do not invent missing timestamps or derive fill success from an old `EXECUTED` label. No client names, bank references or unrestricted free text in broad search by default.

Scope and purpose must apply before counts and paging. The frontend must not fetch all client orders and hide disallowed rows locally. Keep a search in flight cancellable; changing filter/context invalidates old results and pagination. Preserve non-sensitive filters on a detail/back round trip, without exposing case prose in the URL.

### Investigation detail

Use independent evidence sections with explicit loading/error/empty/completeness states:

1. Original accepted instruction, identity-safe account reference, authenticated actor, side, exact quantity/unit, record kind and execution mode.
2. Acceptance evidence: validation outcomes, rule/policy version, original policy snapshot and reservation references.
3. Chronological lifecycle events with recorded sequence, actor and UTC occurrence time. Equal timestamps across different evidence types do not prove causation.
4. Quote observations: indicative/acceptance/execution stage, bid/ask selection, price/currency, source, provider/received times, staleness decision and used-for-fill reference.
5. Execution attempts and rejection explanations, with pre-acceptance versus execution-stage distinction.
6. Booked fills and linked cash/position postings, exact decimal strings, posting group and internal booking timestamp.
7. Relevant reconciliation findings, preserved historical exceptions and explicit limitations.
8. Access/export history, integrity checks and completeness assessment returned by the server.

Show PASS, FAIL, NOT_EVALUATED and UNKNOWN distinctly. Missing evidence is not PASS. Preserve server order/sequence and do not use timestamps to invent causal links. Legacy or partial records remain visibly partial. Separate accepted versus current policy; current changes must not appear to have governed earlier decisions.

An evidence diagram or timeline may improve scanning, but every fact needs an accessible text/table equivalent. Paginate large sections independently and keep totals scoped. Do not fetch unbounded history, full sensitive payloads or all exports on page load.

### Evidence and export workspace

Show export requests/history with request reference, scope, actor if permitted, created/as-of times, purpose reference, state, expiry, manifest metadata and authorized actions. Use neutral state names matching the future contract; do not invent an asynchronous lifecycle if the eventual export is synchronous.

Export remains disabled until a real server contract supplies approved purpose, scope, redaction, retention and any required approval. A frontend Blob/CSV built from displayed rows is not an acceptable replacement. If export is available in a test fixture, verify a deliberate request, confirmed receipt, pending/failure handling, manifest display, separately authorized download and expiry behavior. A guessed export ID or stale URL must not bypass authorization.

Display manifest schema version, source snapshot/watermark, per-section counts, content digest, signature/anchor status if actually supplied and verification result. A matching digest checks content consistency; it is not proof of legal admissibility, completeness or independently anchored immutability. Do not show “tamper-proof” badges. Do not enable retention edits, legal deletion or arbitrary audit mutation in the frontend.

## Contract design before integration

Preserve the existing three GET paths. Add successful DTOs in `features/compliance` and freeze method/path/payload/status examples in the backend handoff. Everything below beyond the current 503 responses is **proposed**:

- Search accepts bounded filters and an opaque authorized `contextId`; returns scoped `{items,page,pageSize,total,scope,asOf}` or an agreed cursor equivalent. Pick one pagination scheme and document it.
- Detail returns a safe summary and individually paged evidence sections with counts, coverage, source/as-of and integrity statuses. Reuse current retained domain names where possible.
- Purpose-context creation/renewal is a separate proposed API, for example POST `/api/compliance/access-contexts`; it returns a server-issued context ID and expiry. Never fabricate a valid context client-side. Specify how context is carried on subsequent requests. A new custom header would require a separately coordinated CORS change.
- Evidence GET returns scoped export history. Proposed export creation, receipt recovery, manifest and download paths must define idempotency, permission rechecks and retention. Freeze exact paths after contract design rather than assuming an Operations URL works.
- Sensitive reads are private/no-store. Error handling distinguishes 401, 403, non-disclosing 404, 409, 400 validation, 429, 503 and transport failure. No available source/policy remains 503, not empty success.

Keep UI independent of backend availability: tested populated layouts and valid unavailable states are deliverable now. Do not label pending backend policy/endpoint work as implemented.

## TDD sequence

1. Audit routes and role protections. Add failing tests asserting dedicated screens, exact API paths, no Operations fallback and no evidence request before required purpose/context is valid.
2. Add typed Compliance models/adapter; test query encoding, pagination reset, error mapping and cancellation. Normalize errors locally rather than changing shared utilities.
3. Implement search from tests: invalid filters, authorized results, true empty, partial records, denied scope, context expiry, out-of-order responses and unavailable backend.
4. Implement detail sections with filled, rejected and partial historical fixtures. Assert quote/provider times, exact values, record-kind labels, NOT_EVALUATED behavior and server sequence. Test direct navigation and missing/foreign ID denial.
5. Implement export history/manifest layouts and gated actions. Test that ordinary rendering never creates/downloads an export, disabled export makes no mutation call, and an authorized fixture still requires a deliberate user action. Cover expired/denied downloads and uncertain create outcomes without duplicate requests.
6. Apply the narrow serialized route replacements. Verify COMPLIANCE direct links and denied CLIENT/ANALYST/FINANCE/ADVISOR access. Preserve existing Operations functionality and no implicit ADMIN access.
7. Verify logout/context loss clears evidence, keyboard access and overflow, retry behavior and source-unavailable copy. Write both handoffs using actual final code.

## Required backend/database instruction

Create `ComplianceRoleBackendImplementation.MD` here. Include:

- Exact final frontend contracts and an existing-versus-proposed endpoint inventory. Match every filter, field, nullability, enum, page/cursor and status to a consumer/test.
- Explicit COMPLIANCE authorization plus account/object scopes, approved purpose and context expiry/revocation. No alias to AUDITOR, ADMIN or TRADING_OPS without a separate decision. Scope before joins, counts, paging and exports; no generic non-client bypass.
- A field-by-field evidence lineage map to retained order instruction, event, quote, rule, attempt, fill, posting, outbox and reconciliation sources. Legacy gaps stay partial; never fabricate history or infer fill from status alone.
- Snapshot-consistent summary/first sections, deterministic pagination for later reads, chronology/version semantics and protected access auditing. If access auditing is required and fails, sensitive reads fail closed. Do not alter booking transactions to reconstruct missing evidence.
- Immutable export snapshots, idempotent request/recovery, manifest counts/digests, signature/independent-anchor claims only where real, permission checks on download, private/no-store behavior, redaction, expiry and explicit retention decisions. No arbitrary statutory retention period or implied regulatory approval.
- Role-owned DTO/service/mapper candidates; evidence-access/context/export tables only when justified. Reuse Operations mechanisms only through an explicitly authorized compatible extension, not a role-annotation shortcut.
- Additive migrations and unique/index/FK constraints, runtime privileges, fresh/upgrade parity, migration ownership and non-destructive rollback. Never weaken append-only triggers/grants or delete retained evidence.
- TDD controller/service/mapper and real PostgreSQL tests: filled/rejected reconstruction, missing quotes, denial across account scopes, expired/revoked context, count/cursor leaks, export tamper/expiry, permission loss and unavailable audit/source dependencies.
- The mandatory stop-and-proposal rule for shared security, Operations scope policies, core evidence production, global error handling or transaction schema mechanisms.

Create `ComplianceRoleFrontend_CrashCourse.MD` beside it: explain implemented views, why purpose/completeness states exist, how routes/adapter/resources interact, actual live versus proposed functionality, user walkthroughs, source fields, fixture reproduction, tests/results and backend integration checklist. Explicitly distinguish frontend state coverage from a production evidence/export capability.

## Verification and acceptance

From `frontend`, run focused Compliance specs first using `npm test -- --watch=false --include='src/app/features/compliance/**/*.spec.ts'`, confirming selector support. Finish with `npm test -- --watch=false`, `npm run test:qof-styles` and `npm run build` once, recording real outcomes.

Acceptance: dedicated consistent search/detail/export layouts; valid purpose/scope gating; useful 503 handling; filled/rejected/partial fixture coverage; exact immutable-evidence presentation; no unauthorized backend access/export/mutation; unchanged neighboring role routes; and both handoff files delivered. Missing approved policies or real Compliance contracts remain explicit integration blockers, not silent frontend omissions.
