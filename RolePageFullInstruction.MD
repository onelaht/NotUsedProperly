# Implement separate pages for each trading-platform role

## 1. Execution contract

Implement separate, authenticated pages for Retail Client, Trading Operations, Risk & Compliance, Business Analyst, and Finance / Reconciliation. This is a self-contained implementation prompt: all required scope and acceptance criteria are included here. Do not require another Markdown specification or assume that an API exists because a document lists it. Read this entire prompt before editing, then inspect the current source and tests. The repository findings below were verified on 13 October 2026 and must be checked against the checkout in which you execute this task.

Deliver working routes, role-aware navigation, typed API integration, server-side authorization, appropriate tests, and an accurate implementation record. Separate pages must have their own URLs and support refresh, direct linking, back navigation, and independent loading/error states. Do not put every capability on one dashboard or build an administrator role-management screen in place of the requested role workspaces.

Preserve the project's Angular, Spring Boot, MyBatis, SQL, and visual conventions. Backend and database changes are permitted when an actual requirement cannot be met safely with the existing implementation. Keep changes proportional, explain the alternatives and why the selected approach is best for this codebase, and test their compatibility. Do not rebuild unrelated subsystems merely to organize pages.

During implementation, create or append to **`impDocs/Frontend/Features/SepratePages.MD`**, preserving that exact spelling and capitalization. Write the actual step-by-step account there, not in this instruction file. Document each meaningful step as it happens: what changed, why it was necessary, how it works, affected files/contracts, verification, failures and their resolution. Never pre-fill successful results or describe planned work as completed. Section 12 defines the record in detail.

## 2. Business scope and priorities

The platform supports self-directed retail trading. Clients register, sign in, submit their own buy/sell instructions, and inspect cash, holdings, and order outcomes. Staff investigate activity without changing client trades. Historical analytics must use separate reporting storage/compute.

The mandatory business outcomes are: registration/login; identity-based client isolation; buy/sell entry and server validation; durable acceptance with a stable order identifier; authoritative execution and atomic booking; balances/holdings and chronological order history; approved instrument coverage; reconstructable evidence; operational investigation; and aggregate historical reporting isolated from live trading. Session revocation, automatic status updates, quote freshness improvements, richer historical analysis, and a selected optional pre-trade impact preview are additional priorities. Distinguish mandatory outcomes from these enhancements in the completion record.

Launch instrument categories are UK equities, US equities, Indian equities, FX, and crypto. Actual supported instruments, provider capabilities, quantity precision, market hours, currencies, and execution rules require verified configuration. Do not imply support by hardcoding category labels or allowing arbitrary quoted symbols to trade.

Full regulated KYC, banking/deposit integration, native mobile apps, advised/discretionary trading, a new administrator portal, and wholesale order-matching/ETL architecture are outside this page feature. Preserve existing basic client onboarding, but do not introduce a regulated onboarding workflow. If a mandatory page needs absent backend data, implement the smallest adequate service/storage extension or identify the precise external decision/dependency. A placeholder or test fixture is not fulfillment of the business capability.

## 3. Re-establish the codebase baseline

Before edits, inspect `git status` and preserve unrelated local changes. Read the relevant implementation in full, including its tests and DTOs, rather than relying on names or comments. Record the initial implementation/gap matrix in the implementation record.

| Area | Source to inspect | Verified baseline and implication |
|---|---|---|
| Frontend platform | `frontend/package.json`, `angular.json`, `src/app/app.config.ts` | Angular 22, standalone components, signals, RxJS/HttpClient, Chart.js, Angular unit-test builder with Vitest dependencies; retain these patterns. |
| Browser routes | `frontend/src/app/app.routes.ts` | `/login`, `/signup`, `/onboarding`, `/`, `/profile`, `/trades`, `/trade/:symbol`. The authenticated shell wraps the last four; the wildcard redirects to `/`. No separate staff route groups or permission guard exist. |
| Authentication | `frontend/src/app/core/auth/*`, `login.ts`, `signup.ts`, `user.service.ts` | Session/profile data is stored locally. No role array is retained in the frontend session. Login always fetches `/api/users/me/profile`, which only permits `CLIENT`; staff login can therefore fail after token issuance. Login also accepts email only, while the backend supports username identifiers. |
| Guards/navigation | `core/auth/auth.guard.ts`, `layout/authenticated-shell.component.ts`, `shared/top-nav/*` | Guards check authentication and onboarding, not roles. The shared top bar always exposes client-oriented ticker search, profile and trade history. |
| Client dashboard/history | `dashboard.ts`, `dashboard.html`, `trades.ts`, `trades.service.ts` | Dashboard balances/holdings/charts and trade history use hardcoded sample data. Dashboard order submission only displays an alert. These are UI scaffolding, not booked portfolio data or real order placement. |
| Market detail | `features/trade/*`, `core/api/market-data.service.ts` | `/trade/:symbol` fetches real backend quote/candle responses, handles errors and tears down subscriptions. It is a market-data screen, not an implemented buy/sell ticket. Reuse this work. |
| Rendering/styles | `app.routes.server.ts`, `src/styles.css`, `app.css`, `scripts/check-qof-styles.mjs` | Only the existing symbol route explicitly uses client rendering; wildcard rendering is prerender. Styles use green/bronze tokens, square corners, no gradients, and a circular shared loading spinner exception. |
| Backend layering | `backend/src/main/java/com/neueda/leap/{controller,dto,service,service/impl,mapper,domain,exception}` | Java 17, Spring Boot 3.3.5, constructor injection, interface/implementation services, Java record DTOs, annotation-based MyBatis mappers, centralized `ApiErrorResponse`. Preserve this structure. |
| Identity and roles | `config/SecurityConfig.java`, `controller/SecurityRoleSupport.java`, `service/impl/AuthServiceImpl.java`, `AppUserServiceImpl.java`, `UserServiceImpl.java` | JWT uses a `roles` collection mapped to `ROLE_` authorities. `/api/users/me` already returns roles. Login DTO has no roles array; signup returns a single `CLIENT` role. Role assignment tables support multiple roles. |
| Trading | `ClientTradeController`, `ClientTradeServiceImpl`, `OrderFillServiceImpl`, associated DTOs/mappers | Existing create/read/update/fill operations use `PENDING`, `APPROVED`, `REJECTED`, `EXECUTED`. Fill uses a transaction and row locks to update trade, cash and holding. No complete durable lifecycle/event/attempt-key contract exists. |
| Evidence/reporting | `AuditLogController`, `AuditLogMapper`, `AuditLogResponseDto`, controller inventory | Audit listing exists, but its DTO omits old/new JSON values. The inspected audit mapper is read-only; complete lifecycle/access auditing is not implemented. No operations, compliance evidence, finance reconciliation, or analytics controller exists. |
| Database | `database/schema/001_tadpoles_schema.sql`, `002_tadpoles_test_data.sql`, `docker-compose.yml` | PostgreSQL with users/roles/user_roles, clients/profiles, instruments, client_trades, dated client_holdings, refresh_tokens and audit_logs. Cash is one `clients.cash_balance` scalar without account currency/reservations/ledger. No reporting store or reconciliation schema exists. |
| Test topology | `backend/src/test`, `testing/src/test`, frontend `*.spec.ts` | Backend JUnit/Mockito/MockMvc and H2 mapper tests; separate PostgreSQL Testcontainers module. Do not mistake passing H2 tests for PostgreSQL/concurrency verification. |

Existing seeded roles are `ADMIN`, `AUDITOR`, `ANALYST`, `ADVISOR`, `CLIENT`, `COMPLIANCE`, `SUPPORT`, `OPERATIONS`, `REPORTING`, `GUEST`. `TRADING_OPS` and `FINANCE` are not seeded. `UserServiceImpl.isValidRole` contains a corresponding hardcoded role allowlist that also needs reconciliation if role keys change.

Important baseline risks to verify and fix in scope:

- Many client, holding, trade and instrument endpoints only require `isAuthenticated()`. `requireClientOwnership` restricts identities carrying `CLIENT` but returns without checking scope for other roles. New staff accounts would otherwise inherit broad access, including writes.
- Trade creation accepts caller-supplied actor/approver, price, status and date. Generic trade PATCH can set execution state. The fill endpoint accepts caller-supplied execution values. These are not safe self-service order semantics merely because an ownership check succeeds.
- Current fills overwrite a trade's price, do not preserve a complete quote/decision timeline, and do not expose durable rejected-attempt history or an idempotent acceptance receipt.
- Existing `ANALYST` permissions on advisor/subscription/suggestion APIs must be reviewed against aggregate-only access; changing only the new analytics routes leaves alternate data paths open.
- Local logout clears browser state; it does not revoke an issued access token. Token expiry is not validated by merely finding a stored session. Refresh/revocation APIs exist but are not connected to this login flow.
- `docs/api.yaml` includes paths such as analytics/global trades/dashboard that have no matching current controller, and uses server/path conventions that need reconciliation. Treat controller mappings as evidence of current availability; update this YAML when contracts change.
- `testing/src/test/java/com/neueda/leap/db/AbstractPostgresIntegrationTest.java` currently searches for `database/schema/tadpoles_schema.sql`, while the checked-in initialization schema is named `001_tadpoles_schema.sql`. Establish the baseline failure and fix the relevant test setup before claiming database regression coverage.

## 4. Current endpoint inventory: reuse accurately

Paths below are backend paths, not Angular routes. Angular `buildApiUrl` currently targets port 8082; retain the shared URL builder and inspect environment/deployment configuration rather than introducing page-specific hosts. There is no existing `/api/v1` prefix. Existing lists generally return named wrappers, not bare arrays or pagination envelopes.

| Existing endpoint | Current contract/use | Current authorization/caveat |
|---|---|---|
| `POST /auth/login` | `{username,password}` → `{token,tokenType,expiresIn,userId,email,displayName,clientId,onboardingComplete}` | Public; JWT includes roles but response has no role array. |
| `POST /auth/signup` | `{email,password,displayName}` → identity/session plus `role: CLIENT` | Public self-registration; preserve client-only assignment. |
| `POST /auth/register/client` | Alternative client-registration DTO/workflow | Public; inspect DTO before using, do not substitute for signup blindly. |
| `POST /auth/register` | Controlled staff/user creation with roleType | `ADMIN`; extend validated roles only as necessary. |
| `GET /api/users/me` | `{userId,username,email,displayName,enabled,roles,advisorId,clientId}` | Authenticated; preferred existing identity endpoint. No onboarding status in this DTO. |
| `GET /api/users/me/profile`, `PUT /api/users/me/onboarding` | Client profile/onboarding DTOs | `CLIENT`; never fetch these unconditionally for staff. |
| `GET /api/users`, `GET/PATCH /api/users/{userId}`, `PUT /api/users/{userId}/roles` | User inspection/update and role replacement | `ADMIN`; do not expose in the requested workspace navigation. |
| `GET /api/roles`, `GET /api/roles/{roleId}` | Role catalog | `ADMIN`; not the endpoint for discovering one's own permissions. |
| `POST /api/auth/refresh` | `{refreshToken}` → `{accessToken,refreshToken,tokenType,expiresInSeconds}` | Public token-exchange endpoint. Its response differs from login. |
| `POST /api/auth/logout` | `{refreshToken}` → 204 | Authenticated; revokes refresh token, not automatically an access JWT. Login does not currently issue a refresh token. |
| `GET/POST /api/users/{userId}/refresh-tokens`, `GET /api/refresh-tokens/{refreshTokenId}` | Token administration | `ADMIN`; not a workaround for staff login. |
| `GET /api/clients` | `{clients:[...]}` | `ADMIN`; do not fetch all clients in a browser to perform staff search. |
| `POST /api/clients`, `GET/PATCH /api/clients/{clientId}` | Client creation/details/update | Authenticated; existing ownership check applies on GET/PATCH only for `CLIENT`. |
| `GET /api/clients/{clientId}/balance` | `{clientId,cashBalance}` | Authenticated + current ownership helper; no currency or posted/available split. |
| `GET/POST /api/clients/{clientId}/holdings`, `GET/PATCH /api/clients/{clientId}/holdings/{holdingId}` | List wrapper `{holdings:[...]}` and holding CRUD | Authenticated + current ownership helper; close write bypasses. |
| `GET/POST /api/clients/{clientId}/trades`, `GET/PATCH /api/clients/{clientId}/trades/{tradeId}` | List wrapper `{trades:[...]}`; fields include tradeId/clientId/instrumentId/actors/tradeType/quantity/price/tradeDate/status/executedAt/reason | Authenticated + current ownership helper; no existing server pagination/filter query contract. |
| `POST /api/clients/{clientId}/trades/{tradeId}/fill` | Optional fill request → `{clientId,cashBalance,holdingId,holdingQuantity,tradeId,tradeStatus,executedAt}` | Authenticated + current ownership helper; transactional booking exists, browser-controlled execution must be addressed. |
| `GET/POST /api/instruments`, `GET/PATCH /api/instruments/{instrumentId}` | List `{instruments:[...]}`; instrumentId/instrumentName/ticker/currency/assetClass/securityType/isActive | Authenticated, including writes today; restrict administrative mutation separately. |
| `GET /quotes/{symbol}` or `/api/quotes/{symbol}` | Existing quote `{data,meta}` with bid/ask/price/currency/marketState/asOf/source/staleness metadata | Authenticated by global security. Quote availability does not establish tradability. |
| `GET /candles/{symbol}` or `/api/candles/{symbol}` | `{data,meta}`; from/to dates and interval parameters | Authenticated; reuse existing service/chart. |
| `GET /api/audit-logs` | `{auditLogs:[...]}`; metadata including entity/action/actor/timestamp | `ADMIN` or `AUDITOR`; not a complete evidence response or a scoped search API. |

Other existing controller families must stay in the authorization review even though no new pages are requested for them: `/api/advisors` and `/{advisorId}/clients`; `/api/model-portfolios` and their holdings; client subscriptions; advisor/client trade-suggestion creation and client/suggestion reads/updates. Inspect each `@PreAuthorize` and ownership path. Preserve unrelated legitimate behavior where compatible with the required boundary; document and test any intentional restriction of a legacy permission.

## 5. Identity, authorization and landing-page rules

### 5.1 Role policy

Use these canonical workspace roles: `CLIENT`, `TRADING_OPS`, `COMPLIANCE`, `ANALYST`, `FINANCE`. Store roles as a collection, not a single role string. Do not assume `ADMIN`, `AUDITOR`, `ADVISOR`, `REPORTING` or `OPERATIONS` automatically means one of the new roles.

For consistency, prefer adding `TRADING_OPS` and `FINANCE` to the existing role catalog and using current role-assignment mechanisms. Keep `OPERATIONS` intact for legacy identities until an explicit migration maps appropriate accounts. A centralized, tested alias can be used if existing deployments require it, but document its exact effect and apply it consistently in JWT issuance, backend policy and frontend normalization. Do not scatter string aliases across components or silently grant new permissions to all legacy staff.

| Workspace role | Landing route | Allowed default capability |
|---|---|---|
| `CLIENT` | `/app/overview` | Own account, market browsing, own order submission/history, own balances and holdings. |
| `TRADING_OPS` | `/operations/orders` | Scoped read-only order monitoring and investigation. |
| `COMPLIANCE` | `/compliance/investigations` | Scoped read-only evidence investigation; sensitive access recorded. |
| `ANALYST` | `/analytics/overview` | Aggregates from reporting storage; no identifiable transactional histories. |
| `FINANCE` | `/finance/overview` | Scoped booked totals and reconciliation exceptions, read-only. |

Conditional access in the business requirements is not automatic permission. Ops/Compliance may receive scoped client records for investigation; Finance receives only reconciliation-relevant records. Cross-workspace reporting summaries, evidence downloads, exports, and client-identifiable fields require explicit permissions and purpose policies; deny by default until those are configured. Do not add trade approval, trading halt, correction, cash credit, journal rewrite, or deletion actions to any staff workspace.

Support multiple assigned roles deliberately. Navigation may expose the union of explicitly granted workspace entries, with each route/action enforcing its own capability and resource scope. For deterministic default routing, use `CLIENT`, then `TRADING_OPS`, `COMPLIANCE`, `ANALYST`, `FINANCE`, unless a persisted authorized workspace preference exists. A valid authorized internal return URL takes precedence. Users with no recognized workspace get `/unauthorized`, not a client dashboard. A staff workspace must not require client onboarding, even when the account also has `CLIENT`; onboarding is required when entering that account's client workspace.

### 5.2 Session initialization and navigation

1. After token issuance, call `/api/users/me` and load authoritative identity/roles before resolving workspace routes. Load `/api/users/me/profile` only for client-context needs. Reuse this endpoint rather than changing login DTOs solely to supply roles; an additive login change is optional only if justified.
2. Model initialization explicitly (`loading`, authenticated identity, unauthenticated, recoverable failure). Guards must await identity resolution and fail closed on invalid/unknown roles. A failed profile/identity bootstrap must not leave a half-authenticated staff session or stale previous-user profile.
3. Revalidate a restored session before protected data renders. Handle old storage objects lacking roles, malformed data and expired tokens. Locally decoded claims may aid presentation/expiry scheduling, but they do not authorize the server. Use current server-side membership/disabled-state checks or a tested revocation/version mechanism where permissions must take effect before JWT expiry.
4. Separate authentication, workspace permission, and client onboarding guards. Protect child navigation (`canActivateChild` or equivalent per-route checks); guarding the shell alone is insufficient after it has mounted. Use lazy-loaded standalone components and return `UrlTree` results rather than navigation side effects inside guards.
5. Validate `redirectTo` as an internal, supported, role-authorized route. Reject external/protocol-relative URLs, login redirect loops and unauthorized staff paths. Preserve harmless filter/detail context where authorized; fall back to the permitted landing page.
6. Update login to support the backend's username-or-email semantics, preserving email normalization without lowercasing arbitrary case-sensitive usernames. Do not reuse signup password-strength rules to reject an otherwise valid existing login password.
7. Distinguish 401 from 403: clear an invalid/expired session and request sign-in for 401; render access denied for 403 without repeatedly logging out a valid identity. A temporary network error must show retry, not grant access or masquerade as an empty result. Restrict credential attachment to intended backend requests.
8. Clear all account-sensitive signals, cached responses, filters containing private references, in-flight requests, polls and downloads on logout/account change. Ensure late responses cannot repopulate another user's state. Use a session generation or equivalent cancellation mechanism.
9. Do not invent a refresh token to call logout. If integrating server revocation, extend issuance/storage/refresh/logout coherently, verify token ownership, and explain what is revoked. Expiry and role-change denial must be enforced by the backend; browser cleanup alone is insufficient.
10. Keep authenticated dynamic pages client-rendered unless authenticated SSR is deliberately designed. Update `app.routes.server.ts` for new routes so wildcard prerender does not build personal pages, fail on dynamic parameters, or leak user data into shared caches. Verify hydration and direct URL loading.

### 5.3 Enforce permissions on the server

Create a small centralized authorization policy within existing Spring Security/service conventions. Require a positive role/capability check and resource scope for every relevant API. Derive the current user/client association from authenticated identity and persisted relationships. A submitted clientId, submittedByUserId, role, price or status is never proof of permission.

For client endpoints, bind access to the user's own client record even for mixed client/staff identities. Use explicitly scoped staff read endpoints for cross-client investigations instead of a universal non-client bypass. Scope search SQL and count results before pagination; fetching everything then filtering in Angular is unacceptable. Apply the same checks to detail IDs, related records, exports/downloads and any status subscriptions. Unauthorized requests must not mutate data or disclose another client's existence through unscoped error details.

Close alternate mutation routes: ordinary clients and these staff roles must not directly patch booked cash/holdings, forge executed trades, set approval/actor fields or mutate instrument configuration. The client's only trade mutation is its own validated submission through the supported order workflow. Any retained legacy operational write endpoint needs a separately justified restricted authority; do not grant it to the new staff roles. Do not remove financial invariants to retain a legacy permissive test.

## 6. Page inventory and required behavior

Use the route plan below unless a small compatibility improvement is necessary; record any deviation. Reuse existing components where they fit and extract focused shared pieces. Retain `/login`, `/signup`, `/onboarding` and `/profile` where appropriate. Add `/register` as an alias to `/signup` if useful. Make `/` resolve by authorized role; redirect `/trades` to `/app/orders`. Preserve old `/trade/:symbol` links through a guarded catalog lookup to the new instrument details/ticket, with an explicit unsupported-symbol state. A ticker string is not an instrumentId.

Every data page needs loading, empty, retryable failure, validation, 401/403, and narrow-screen behavior. Use readable headings, explicit currency/time zone, accessible labels, keyboard focus, status text independent of color, and pagination where lists may grow. Avoid showing zero when a metric is unavailable. Disabled features need user-oriented explanations; keep implementation details in the implementation record.

### 6.1 Public/shared pages

- **Register `/signup` (optional `/register` alias):** client account creation, validation, duplicate-account feedback and confirmation, then existing onboarding. Never expose staff role selection or accept public role escalation.
- **Login `/login`:** credentials, useful errors, initialization feedback, safe redirect and authorized landing. Password reset/MFA depend on a real configured provider; do not ship dead links or claim they work.
- **Sign out:** shared identity-menu action; clear state and show reauthentication feedback on expiry/revocation.
- **Access denied `/unauthorized`:** plain-language message and a safe link to an available workspace or sign-in. Must remain reachable without redirect loops.
- **Not found `/not-found`:** helpful invalid-route state and safe back/home action. Replace indiscriminate wildcard-to-dashboard behavior.

### 6.2 Retail client pages

Client navigation: Overview, Markets, Portfolio, Orders, identity/profile and Sign Out.

| Page/route | Implementation requirements |
|---|---|
| Overview `/app/overview` | Server-backed cash summary by currency, holdings summary, recent orders, pending indicators and data-as-of. Reuse dashboard layout, remove production sample balances/charts. Only chart historical values if real history exists. |
| Markets `/app/markets` | Approved instrument catalog search/filter by symbol/name/asset/market, active/tradable state, currency and detail links. Use IDs from the catalog. Add backend search/pagination if required; label any temporary bounded in-memory catalog filtering honestly. |
| Instrument details `/app/instruments/:id` | Symbol/name, asset class/market/currency, indicative bid/ask, source/time/freshness and market availability; existing candle chart; links to Buy/Sell. Do not fetch before route/identity authorization. |
| Ticket `/app/trade/:instrumentId` | Side, supported quantity, estimated cost, authoritative available balance or sellable holdings, validation, preview/confirmation, single submission, durable receipt and subsequent outcome. Unsupported order types must not be offered. |
| Portfolio `/app/portfolio` | Cash posted/available by currency, owned quantity/available-to-sell, last booked update, instrument links and context-appropriate Sell navigation. Do not infer reserved values from an incomplete list of pending orders. |
| My orders `/app/orders` | Server-backed chronological paginated history, instrument/side/quantity/state/time filters and detail links, including rejected outcomes. Persist safe list state in query parameters. |
| Order details `/app/orders/:id` | Stable order reference, ordered submitted/accepted/executing/filled/rejected events where recorded, actual fill price/quantity, rejection reason, relevant fills and booking references. Never manufacture timestamps or past events for legacy records. |

Trading correctness rules:

- Display indicative prices and estimates separately from confirmed execution prices/booked results. Frontend checks are helpful feedback; the backend decides validity, pricing, funds and holdings availability.
- Show `ACCEPTED` only after durable acceptance and expose its stable order ID. Current `PENDING`/`APPROVED` states are not automatically proof of that contract. `EXECUTED` may display as Filled only when authoritative booking confirms it. If lifecycle semantics change, update DTOs, SQL constraints, fixtures and tests together; define legacy-state mapping explicitly.
- Disable repeated clicks and use a stable attempt identifier across timeout/retry/reload recovery. Server-side uniqueness must bind the key to the authenticated client and request payload. Same key/same payload returns the existing receipt; same key/different payload is a conflict. Do not automatically resubmit with a new key when the first result is unknown.
- Do not chain a browser-supplied create request to an unrestricted `/fill` request. Reuse the transactional booking service behind an authorized, server-controlled execution path and obtain execution-time pricing from the configured service. Label a simulated execution mode truthfully; do not imply venue execution.
- Authoritative funds/holdings checks, instrument restrictions, precision and price availability must survive concurrent submissions. Pending reservations and their release need backend support before available values can be claimed. Reflect balances only from booked results, with pending changes shown separately.
- Poll authorized order status with bounded backoff if no stream exists; cancel on navigation/logout and reconnect safely. No WebSocket/SSE system is required solely to split pages. If one is added, authorize subscriptions and replay just like REST reads.
- Show understandable insufficient-cash/holdings, invalid quantity, closed/unsupported instrument and pricing-unavailable errors. Do not present an indeterminate network timeout as a definitive rejection. Retain durable business rejections in authorized history where an order/attempt was recorded; validation errors before an order exists must say so.

### 6.3 Trading Operations

Navigation: Orders & Monitoring, investigation context/back navigation, Sign Out.

- **`/operations/orders`:** scoped order search by order ID, permitted client reference, instrument, date/time and status; pending/accepted/rejected/failed queues only where those states exist in the server contract. Server pagination and stable sorting are required.
- **`/operations/orders/:id`:** authorized lifecycle, checks/status transitions, execution quote, fill/rejection, exception indicators and related cash/position effects, all read-only. Use recorded timestamps and explain missing legacy evidence. No engineering-log reconstruction should be required for supported records.
- Mask identifying client data by default. Record sensitive reads with a purpose policy. Exports and tradability controls are not enabled by default.

### 6.4 Risk & Compliance

Navigation: Investigations, Evidence / Exports, Sign Out.

- **`/compliance/investigations`:** authorized search by order/client reference, dates, state and instrument.
- **`/compliance/investigations/:id`:** original instruction, actor/timestamps, validation/rule decisions, quote source/time, execution/rejection, cash/holding outcome and ordered audit events. Display evidence completeness and any retrieval failures distinctly.
- **`/compliance/evidence`:** authorized export request/result history and access purpose, with protected downloads/manifests only when a configured export policy grants access. If exports are not approved/configured, provide an explicit unavailable state without an active download action; record the unresolved capability rather than claiming exports complete.
- Never edit/delete source orders, fills, quotes or audit evidence. Audit sensitive reads and every permitted export/download. A generic audit metadata list is not a complete investigation bundle. No external regulator login is required.

### 6.5 Business Analyst

Navigation: Analytics Overview, Activity Trends, Instrument Analysis, Sign Out.

- **`/analytics/overview`:** aggregate submitted/accepted/filled/rejected counts and traded volumes, period selection, currency grouping and `data_as_of`.
- **`/analytics/trends`:** historical day/week/month activity by market or permitted segment, chart and accessible table, filters and freshness.
- **`/analytics/instruments`:** most-active instruments, fill counts, asset/market breakdown and permitted aggregate export only when configured.
- All metrics must come from an authorized reporting API backed by separate OLAP storage/compute, with explicit metric definitions, freshness and completeness. Do not query the live trading database on report requests, grant transactional DB access, or aggregate identifiable client histories in the browser. Do not add monetary values across currencies without a defined conversion policy. Order count and fill count are separate metrics.
- If reporting infrastructure is unavailable, implement and test the typed API/UI boundary and show unavailability; record the missing deployment/data dependency. Fixture-backed charts do not satisfy isolated analytics acceptance. Do not build an unrelated ETL platform under this page task.

### 6.6 Finance / Reconciliation

Navigation: Finance Overview, Reconciliation, Sign Out.

- **`/finance/overview`:** authorized booked-fill/cash-movement totals by currency and period, data-as-of, fees only where actually recorded/configured.
- **`/finance/reconciliation`:** matching status between fills, cash and positions, exception queue, filters, related order/posting references and authorized exports where configured. Detail can be an accessible panel or subordinate route while retaining list context.
- Read-only records; no balance edits, credits, write-offs or journal rewrites. Current cash plus current holdings cannot reconstruct a complete reconciliation: require persisted booking/posting evidence and explicit matching rules. Unrecorded fees are unavailable, not zero. Corrections remain outside this feature.

## 7. API and database gap strategy

### 7.1 Minimal changes first

Reusing `/api/users/me`, existing identity tables, the shared shell, market-data components and transactional fill service avoids unnecessary rewrites. Tightening backend authorization is mandatory because UI guards cannot close the existing alternate API paths. Seeding missing roles is ordinarily data evolution, not a reason to replace the role schema.

Before adding a contract, record its consumer, unavailable fields, validation, authorization, resource scope, error behavior, compatibility, and test. Prefer existing `/api/...` naming and DTO wrappers. Use additive fields/endpoints where possible. Do not break an existing consumer accidentally, but do not preserve unsafe writes as a compatibility shortcut.

Suggested **new** contracts below are implementation proposals, not existing endpoints. Finalize exact request/response schemas in `docs/api.yaml` and typed Java/TypeScript models before wiring a page:

| New or extended contract | Purpose and minimum contract requirements |
|---|---|
| Extend scoped client trade list/detail, or add `/api/orders` and `/api/orders/{orderId}` | Identity-bound submission and reads; stable orderId/attempt key, canonical state, instrument/side/quantity, timestamps, rejection, recorded fill(s), booking references and supported status polling. Explicitly map any existing tradeId; do not invent an unrelated ID in Angular. |
| Order event endpoint, e.g. `GET /api/orders/{orderId}/events` | Ordered durable events with eventId, occurredAt, type/state and authorized detail; indicate legacy incompleteness. |
| `GET /api/operations/orders`, `GET /api/operations/orders/{orderId}` | Scoped read-only staff search/detail; filters and counts enforced in SQL/service before returning data. |
| `GET /api/compliance/investigations`, `GET /api/compliance/orders/{orderId}/evidence` | Redacted investigation search and correlated evidence/completeness; recorded sensitive-access purpose. |
| Evidence export endpoints, only when policy enables them | Request/result metadata, approved scope, purpose, expiry and access-controlled download; no public object URLs or browser scraping of unrestricted audit records. |
| `GET /api/analytics/summary`, `/trends`, `/instruments`, `/freshness` | Reporting-only aggregate DTOs with units, filters, data_as_of, completeness and source freshness; separate datasource/credentials. |
| `GET /api/finance/summary`, `/reconciliations` and scoped detail if needed | Currency/period totals, reconciliation run/as-of, explicit matched/unmatched/unknown state, posting/order references and allowed exception detail. |
| Extended balance/holding read DTOs or a scoped portfolio view | Actual account currency, posted/available/reserved amounts, quantities/sellable quantity and authoritative as-of, once supported by persisted data. |

For new paginated lists, prefer `{items, page, pageSize, total}` with documented defaults, maximum page size, stable timestamp-plus-ID ordering, allowlisted sort fields, validated date range and time zone. Retain existing named list wrappers for unchanged endpoints; use a typed adapter or documented additive pagination for a changed existing list. Parameterize all MyBatis queries. Return the existing error envelope (`timestamp,status,error,message,path`); add stable error codes only if needed and keep it backward-compatible. Test 400/401/403/404 and conflicts explicitly. Do not silently convert 403 or transport errors into empty lists.

### 7.2 Data changes must reflect real semantics

Potentially necessary additions include role seeds, order acceptance/attempt uniqueness, immutable order events, execution quote/fill evidence, booking/posting references, reservations/currency-aware balances, scoped audit-access records and reconciliation results. Choose only what the implemented capability requires; every table/column/index must have a stated consumer and invariant. Do not create a parallel trading model simply to avoid adapting existing services.

The scalar cash balance has no currency metadata. Do not infer account currency from the first holding or assume USD for every account. Either implement a properly defined currency balance model and migration or explicitly document a configured single-currency transitional limitation; the latter does not pass multi-currency acceptance. Do not mix posted balances with available balances until reservations exist.

Likewise, dated holdings can contain multiple snapshots. Read a well-defined current position per instrument instead of summing snapshots or selecting an arbitrary row. Preserve booking atomicity and the current zero-position deletion behavior or document/test an intentional change. Use Java `BigDecimal` and explicit rounding for monetary calculations; avoid making JavaScript arithmetic authoritative.

Prefer append-only evidence and financial postings with durable correlation IDs. Persist success/rejection events at the correct transaction boundary; an exception that rolls back the whole transaction must not silently erase a required rejection record. Do not backfill invented quotes, events, prices or timestamps for legacy trades. Mark missing provenance explicitly.

PostgreSQL initialization files under `database/schema` run only when the data directory is empty. Editing a seed/init file does not upgrade an existing volume. Supply a reviewed, repeatable forward migration for existing databases and keep clean initialization equivalent. Use role names rather than assumed numeric IDs, preserve data/foreign keys, validate constraints/indexes, and document rollback/recovery. Do not reset a populated volume to make a migration appear successful. No migration runner is currently declared in the backend POM; do not assume Flyway/Liquibase exists. Introduce tooling only if necessary and justified.

Update affected H2 fixtures under `backend/src/test/resources`, PostgreSQL integration setup and initialization seeds together. Identify which fixture each test actually loads; the repository has multiple schema variants. Run real PostgreSQL tests for database-specific features and concurrent/idempotent booking. Keep OLAP schema/credentials separate from trading storage and verify reporting calls do not use the transactional datasource.

## 8. Frontend design and organization

Keep the existing authenticated shell and top-nav identity menu; extend them with role-filtered navigation and page context. Show ticker search only in a workspace where it is useful and permitted. Use a collapsible role-specific sidebar or an equivalent compact navigation consistent with the current header. On narrow screens provide a keyboard-accessible menu and horizontally scrollable tables.

Recommended organization follows existing `features/trade`: `features/client`, `features/operations`, `features/compliance`, `features/analytics`, `features/finance`, plus focused shared UI under `shared/` and identity/API helpers under `core/`. Prefer small feature services and typed DTO adapters. Do not build a general-purpose permission engine or introduce a second state-management/UI/chart library for this feature.

Extract reusable status, money, empty/error state, date filter, orders table, timeline and evidence/reconciliation presentation only where there is real reuse. Keep permission rules centralized; templates should consume computed navigation/capabilities rather than repeating role strings everywhere. Reuse `LoadingComponent`, `CandleChartComponent`, `MarketDataService`, `buildApiUrl` and existing HttpClient registration.

Match `styles.css` tokens: primary green `#76A923`, dark green `#006044`, bronze `#AF8A49`, existing surfaces, typography, spacing and focus styles. Square corners and no gradients are enforced by the style script. Use monospaced numeric values where the existing UI does. Keep color contrast, labels, accessible errors, table headings/captions, focus after navigation and chart data tables suitable for a WCAG 2.2 AA target; do not claim certification from automated tests alone.

## 9. Implementation order

Complete tested vertical slices. Keep a checklist covering every page and backend dependency, and distinguish implemented, verified, partial and externally blocked items.

1. **Baseline and contracts:** read all relevant code/tests; capture current state, API map, permissions and test baseline; write failing tests for the first concrete gap. Resolve safe technical defaults now and identify business-policy dependencies.
2. **Authorization foundation:** role seed/provisioning compatibility, server role/resource checks, mutation restrictions and direct API denial tests. Do this before exposing staff pages. Ensure mixed roles cannot bypass ownership or inherit administrative mutations.
3. **Identity and shell:** authenticated `/me` bootstrap, client-only onboarding, role landing, safe return URLs, child route guards, state cleanup, unauthorized/not-found views, role navigation and server render configuration.
4. **Client read pages:** connect real catalog, overview, portfolio and order reads; preserve working quote/candle functionality and legacy links. Eliminate production sample financial data.
5. **Client order workflow:** implement missing acceptance/attempt/recovery and server-controlled booking contracts with focused transaction tests; build preview/ticket/receipt/details and polling. Clearly separate any external provider limitations.
6. **Operations and Compliance:** add scoped read/search/evidence contracts and immutable/access auditing, then pages. Enable export actions only when their purpose, redaction, access and retention rules are resolved.
7. **Analytics and Finance:** connect isolated reporting and real booking/reconciliation evidence; build typed pages, freshness and unavailable states. Do not mark unsupported backend capabilities complete.
8. **Regression and handoff:** run the focused and impacted checks, validate browser flows/permissions, update API/schema documentation, finish the implementation record and report any unmet acceptance items accurately.

Do not stop after building navigation or an empty route scaffold. Continue through all executable slices. If an external decision blocks a specific capability, complete independent work, keep that capability explicitly disabled/unavailable, and list exactly what remains necessary.

## 10. TDD and regression procedure

### 10.1 Red → green → refactor

For each behavior change:

1. State an observable acceptance example, including the role, resource owner, action and expected outcome. Example: a Finance user calling the trade-fill endpoint receives 403 and cash/holdings remain unchanged.
2. Add the smallest meaningful test at the right boundary. Run it before implementation and verify it fails for the missing behavior, not compilation, broken fixtures, missing Docker or a bad mock.
3. Implement the minimum cohesive change, following existing layers. Run the focused test to green, including the paired authorized case so an indiscriminate deny-all implementation cannot pass.
4. Add relevant boundary/abuse cases, then refactor while green. Test observable outcomes, not private methods or duplicate copies of the implementation logic.
5. Run impacted regressions and record actual commands/results. Broaden to the full relevant suite at integration points and before handoff; avoid rerunning unrelated suites repeatedly without a reason.

Use Angular TestBed/HttpTestingController for typed requests, failures and state; router-level tests for guards, child navigation, redirects and role-specific pages. Use Spring MockMvc with security enabled for access control, Mockito service tests for rules, mapper tests for query scoping, and PostgreSQL integration tests for persistence/concurrency. Existing `TestSecurityUtils` injects both claims and authorities; add converter or real-token tests so role-claim mapping itself is tested rather than bypassed by the helper.

### 10.2 Required behavioral test matrix

- Anonymous, own `CLIENT`, another client, each staff role, unsupported legacy role, missing/unknown/malformed roles and mixed client/staff roles; test both allowed routes/APIs and denied direct requests.
- Staff login does not request the client profile; incomplete client onboarding affects client routes only. Role-aware defaults, authorized return URLs, malicious redirect values, direct deep links and navigation between already-mounted child routes behave correctly.
- Public signup cannot assign staff roles. Roles removed or accounts disabled cannot keep privileged access under the selected session policy. Expired/revoked credentials are rejected; valid 403 does not trigger a logout loop.
- Account switch/logout cancels requests and polls; a delayed response, persisted role or old cache cannot expose the previous user's data. Restored sessions and SSR/prerender do not flash protected content.
- APIs scope list results, total counts, details, evidence and exports; guessing client/order/posting/download IDs never bypasses policy. Staff cannot mutate trades, cash, holdings or audit evidence through old or new endpoints. `ANALYST` cannot obtain identifiable transaction histories through alternate legacy APIs.
- Quote/candle behavior, signup/profile/onboarding, existing approved legacy behavior, loading/error states and style constraints remain correct after extraction/route changes.
- Orders: valid buy/sell, invalid quantity/precision, insufficient cash/holdings, inactive/closed/unsupported instruments, unavailable/stale price policy, durable accepted receipt, real rejection, quote versus execution price, duplicate click, timeout recovery, same-key payload conflict, concurrent duplicate attempts, concurrent funds/position contention and atomic rollback. A repeat must not double-book.
- Portfolio: authoritative post-booking updates, reservation/available distinctions, full sell-to-zero, currency grouping and current versus historical holdings snapshots.
- Evidence: filled and rejected timelines, deterministic event ordering, incomplete legacy evidence, audit of sensitive reads, export purpose/redaction/download authorization if enabled. No fabricated historical data.
- Analytics: order versus fill counts, date boundaries, empty periods, freshness/lag, currency separation, aggregate privacy and evidence that report requests use only the reporting datasource.
- Finance: actual matched/unmatched/unknown fixtures, known mismatch detection, linked order/posting references, scoped detail and no mutation controls/API access.
- UI: loading, empty, validation, 401, 403, network failure, inaccessible dependency, retry, keyboard/focus behavior and narrow viewport for each page group.

### 10.3 When tests or implementation go in the wrong direction

Stop extending the affected slice and reproduce the smallest failing case. Preserve the failing output and compare it to the pre-change baseline and intended contract. Classify the failure before modifying tests:

| Failure type | Required response |
|---|---|
| Implementation regression | Keep the acceptance assertion, locate the first changed behavior, fix or revert only your faulty slice, and add a focused regression case. Do not undo unrelated user work. |
| Intentionally changed contract | Write the old/new behavior and requirement justification in the implementation record. Update DTOs, fixtures, API docs, callers and tests together. Replace an unsafe legacy expectation with explicit allow/deny coverage; never just delete the failing test. |
| Incorrect test/mock/fixture | Prove the test contradicts the contract or production setup, correct that specific issue, and explain why. Keep security filters and realistic role/ownership data; do not mock away the boundary being tested. |
| Pre-existing failure | Reproduce against the baseline or demonstrate it is unrelated, record it separately, and fix it when it blocks required verification. Do not report the whole suite as passed. |
| Environment/tool/dependency failure | Record the exact missing prerequisite and command failure. Repair safe local setup if possible. Mark checks not run/blocked, not passed; do not weaken assertions, reset real data, disable security or skip required suites to obtain green output. |
| Flaky/asynchronous test | Replace arbitrary sleeps with controlled clocks, awaited router/HTTP completion and deterministic data. Investigate cancellation/races; do not repeatedly rerun until a lucky pass. |
| Architecture expanding beyond the need | Revisit the smallest contract/data gap, extract a smaller vertical slice and remove unnecessary abstractions from your changes. Preserve mandatory correctness and security invariants. |

If a fix creates new regressions, return to the last verified slice, trace shared contracts and retry with a smaller change. Ask for a business decision only when competing interpretations materially change permission, financial behavior, export policy or externally supplied data; continue independent work. Never change expected results merely to match broken code, fabricate evidence, or claim a required test ran when it did not.

### 10.4 Commands and verification evidence

From the repository root, use the existing tools/configuration:

```sh
# Install locked frontend dependencies if needed.
npm --prefix frontend ci

# Angular tests (use installed CLI --help for supported focused-test flags).
npm --prefix frontend test -- --watch=false
npm --prefix frontend run test:qof-styles
npm --prefix frontend run build

# Focused example; adjust test class names to the slice.
mvn -f backend/pom.xml -Dtest=AppUserControllerTest,ClientTradeControllerTest,AuthServiceImplTest test

# Backend regression suite.
mvn -f backend/pom.xml test

# PostgreSQL tests; requires Docker and corrected schema resolution.
mvn -f testing/pom.xml test
```

Inspect configured Java/Node requirements and installed tooling before diagnosing version-related failures. Use `mvn ... verify` when build/static-analysis validation is required by the changed area or repository CI; distinguish non-failing/disabled checks from genuine evidence of success. Frontend router/HttpClient tests do not establish real backend enforcement, and MockMvc tests with mocked services do not establish database atomicity. Test clean initialization and upgrade from an existing schema for any migration; PostgreSQL test schema drops must stay inside isolated test containers.

Perform a browser walkthrough with separate test accounts for the five roles and at least two clients: sign in, reload/deep-link, use role navigation, exercise representative success/error/empty states, attempt forbidden URLs, and sign out/switch accounts. Verify actual HTTP calls and absence of unauthorized data. Use the existing browser test setup if available; otherwise record a repeatable manual walkthrough and its real outcomes. Do not introduce a large test framework for cosmetic checks alone.

## 11. Decisions and safe defaults

The requested implementation includes separate staff workspaces, though their deployment/provisioning policy must be documented. Use the existing JWT identity and controlled administrative provisioning mechanisms for local development; public registration remains client-only. Do not introduce an external identity provider, staff MFA system or production accounts without a concrete requirement.

Use read-only staff behavior, minimum scoped/redacted data and exports disabled until a policy is supplied. Do not silently alias legacy roles, invent client-purpose approvals, claim live execution, configure unknown venue rules, select an account currency arbitrarily, or fabricate OLAP/reconciliation datasets. A pre-trade estimated impact preview may improve the ticket, but do not declare an optional sponsor-selected capability approved merely because an estimate is shown.

Record outstanding choices: exact launch instruments/markets, provider/simulation mode, quantity/price rules, currency migration, client-identifiable fields and purpose policy, exports/retention, reporting metrics/segments/refresh target, reconciliation matching rules, session lifetime/revocation and staff provisioning. Choose ordinary route/component/layout details autonomously. When a business choice blocks a data-dependent capability, identify its owner/input and continue all independent implementation; accurately report the remaining acceptance gap.

## 12. Implementation record and completion criteria

Maintain **`impDocs/Frontend/Features/SepratePages.MD`** during execution. Create its parent directories if needed. Do not substitute `impDocs/FrontendFeatures`, change the filename spelling, or write a retrospective containing invented test runs. Preserve existing entries if the file already exists.

Include:

1. Initial checkout/date, relevant local changes, inspected source, existing routes/endpoints, implementation/gap matrix and real baseline checks.
2. A numbered entry for each meaningful implementation step: requirement, files, before/after behavior, why the change is needed, how the request/data flow works, and actual red/green/regression evidence.
3. Every backend/database change with consumer, alternatives, selected rationale, authorization/invariants, migration/compatibility and rollback/recovery. Explain why existing functionality was insufficient and why the chosen approach best fits current project patterns.
4. Failure investigations: exact symptom/check, root cause/classification, correction, intentional test/contract changes and verification. Distinguish pre-existing failures, blocked checks and new regressions.
5. Final page/route/API/role matrix; reusable components; status/identifier mapping; known legacy limitations; reporting source and freshness; purpose/export policy and unresolved decisions.
6. Test summary with commands, real results, manual browser evidence and remaining risks. Include setup/demo steps using non-sensitive test accounts; never include real passwords, tokens or personal records.
7. A useful Mermaid diagram of identity bootstrap → role guard → workspace → API → server permission/resource scope → service/mapper/storage, plus an order acceptance/booking or reporting flow if it clarifies actual implementation. Label unimplemented dependencies explicitly.

Completion requires evidence that:

- Each listed public/shared, client, operations, compliance, analyst and finance page has its own usable route and role-correct navigation, with tested direct-link/refresh/back behavior.
- Clients can register, log in/out, revisit their own account and complete existing basic onboarding; staff can log in without client-profile dependencies.
- Client isolation and staff read-only boundaries hold through both frontend navigation and direct old/new API calls, including multi-role identities and stale sessions.
- Approved instruments, own buy/sell submission, durable acceptance, duplicate recovery and confirmed execution/rejection are supported without presenting estimates as booked outcomes.
- Portfolio/history use real authoritative data; pagination, currencies, available versus posted/owned values, timestamps and legacy evidence limitations are truthful.
- Operations can investigate outcomes; Compliance can reconstruct supported filled/rejected orders and see evidence completeness; any enabled exports are authorized and audited.
- Analyst pages use isolated reporting data and disclose freshness; Finance shows genuine reconciliation results and exceptions without granting write access.
- Shared design/accessibility conventions and loading/empty/error/recovery states are preserved; tests validate both allowed and denied behavior, migrations and affected regressions.
- API documentation and the implementation record accurately describe the finished code. Every incomplete dependency or unverified check is listed explicitly, with no placeholder counted as a completed requirement.

Finish by reporting the concrete implemented behavior, necessary backend/database changes and their rationale, tests actually run, the implementation-record path, and any remaining acceptance gaps. Do not present an unimplemented plan as completed functionality.
