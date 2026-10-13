# Trading Platform — Required Roles & Frontend Page Requirements

> **Project:** Direct-to-Consumer Trading Platform  
> **Scope:** Focused subset of `HailMary.md` covering the required user-facing roles, Angular pages, shared frontend features, access controls, and essential acceptance criteria.  
> **Technology context:** Angular frontend with Java/Spring Boot APIs.  
> **Status:** Working frontend specification. Routes, navigation, and screen layouts are **proposals**, not route names mandated by the business brief.

## 1. Scope and Requirement Labels

The platform must allow a retail client to register, sign in, place their own buy/sell orders, and view cash, holdings, and order outcomes. Internal users need operational investigation, compliance evidence, finance reconciliation, and historical trading analysis.

- **MUST / SHOULD:** Priority taken from the referenced `BR-01`–`BR-18` requirements in `HailMary.md`.
- **Required business capability:** Necessary to satisfy project objectives. A standalone application login for some staff roles is **proposed**, not expressly mandated by the original brief.
- **Proposed frontend design:** Suggested pages, URLs, navigation, components, and workflows; subject to team/stakeholder approval.

**Not in this subset:** full order-matching/backend architecture, database schemas, ETL implementation details, deployment pipelines, native mobile apps, banking/deposit integrations, and advised/discretionary trading.

## 2. Roles Required for the Frontend

| Role / suggested role key | Requirement status | What the user needs | Frontend area |
|---|---|---|---|
| **Retail Client** (`CLIENT`) | **Required application user** | Self-service registration, trading, holdings, cash, order history | `/app/*` |
| **Trading Operations** (`TRADING_OPS`) | **Required business capability; staff login proposed** | Monitor orders, investigate trade outcomes and operational exceptions | `/operations/*` |
| **Risk & Compliance** (`COMPLIANCE`) | **Required business capability; staff login proposed** | Reconstruct a complete trade timeline and inspect/export authorised audit evidence | `/compliance/*` |
| **Commercial / Business Analyst** (`ANALYST`) | **Required business capability; staff login proposed** | View historical aggregated trading metrics without affecting live trading | `/analytics/*` |
| **Finance / Reconciliation Analyst** (`FINANCE`) | **Required business capability; staff login proposed** | Review trade-linked cash activity, reconciliation results and exceptions | `/finance/*` |

**Role boundaries:**

- Clients can trade and access **only their own** accounts, cash, positions, and orders.
- Staff pages are **read-only by default** for trade, cash, and historical records; limited authorised exports are allowed where approved.
- Neither Trading Operations nor Compliance nor Finance can silently place, rewrite, or approve client trades.
- Analysts receive aggregate reporting access, **not** direct access to transactional databases or arbitrary client details.
- **Not required as separate frontend roles in phase 1:** advisor/relationship manager, programme sponsor, customer support, and platform administrator. User/role provisioning may be handled by an identity provider or controlled operational process. A separate `/admin` portal is an optional later enhancement, not part of the required pages below.

## 3. Frontend Page Inventory

The following are **individual pages/routes**, not a requirement to place everything on one dashboard. Routes are illustrative. Every page requires authenticated, role-appropriate API access where relevant.

### 3.1 Public / Shared Authentication Pages

| Page | Proposed route | Required elements | Linked requirement |
|---|---|---|---|
| **Register** | `/register` | New client account fields, validation, duplicate-account feedback, registration confirmation | **BR-01 MUST** |
| **Log In** | `/login` | Credentials or identity-provider sign-in, errors, redirect to authorised landing page | **BR-01 MUST** |
| **Session / Sign Out** | Shared action/view | Sign out, reauthentication on expiry, session-revocation feedback | **BR-03 SHOULD** |
| **Access Denied** | `/unauthorized` | Plain-language permission error and safe navigation | Proposed security necessity |
| **Not Found** | `/not-found` | Helpful invalid-route message and safe back navigation | Proposed UX necessity |

A client registration page is required; **full regulated KYC/onboarding is out of scope**. Staff accounts should be provisioned through an approved internal process, not the open client registration form. Password-reset flows depend on the selected identity provider.

### 3.2 Retail Client Pages — `CLIENT`

**Navigation:** Overview · Markets · Portfolio · Orders · Sign Out. The order ticket should be reachable from the market/instrument pages and, where appropriate, owned holdings.

| Page | Proposed route | Content and interactions | Requirement mapping |
|---|---|---|---|
| **Client Overview** | `/app/overview` | Cash summary by currency, holdings summary, recent orders, pending-order indicators, data-as-of time | **BR-10 MUST**, **BR-11 MUST** |
| **Markets / Instrument Search** | `/app/markets` | Search/filter supported instruments by symbol, name, asset/market; market availability and tradability state | **BR-04 MUST**, **BR-12 MUST** |
| **Instrument Details** | `/app/instruments/:id` | Symbol/name, asset class, market, indicative bid/ask, currency, quote timestamp/freshness, Buy/Sell navigation | **BR-12 MUST**, **BR-13 SHOULD** |
| **Order Ticket & Confirmation** | `/app/trade/:instrumentId` | Choose Buy/Sell, enter quantity, display estimate/available balance or holdings, validate, preview, confirm, submit once, show order ID/accepted or rejected message | **BR-04–06 MUST**, **BR-13 SHOULD**, **BR-18 SHOULD** if chosen |
| **Portfolio / Balances & Holdings** | `/app/portfolio` | Cash by currency (posted vs available), owned holdings (quantity vs available-to-sell), last booked update, links to instruments | **BR-10 MUST** |
| **My Orders / Blotter** | `/app/orders` | Chronological paginated history; side, instrument, quantity, state, timestamps, filters and detail links | **BR-11 MUST** |
| **Order Details / Timeline** | `/app/orders/:id` | Submitted/accepted/executing/filled/rejected timeline, actual fill price and quantity, reasons for rejection, related fill(s) and order reference | **BR-07 SHOULD**, **BR-11 MUST** |

**Client trading UX rules:**

1. Display **indicative** quote and estimated cost separately from **actual execution** price and booked result; the quote may change before execution (**BR-08 MUST**).
2. After durable acceptance, provide a visible **order ID and `ACCEPTED` receipt**. Never claim `FILLED` until an actual fill is confirmed (**BR-06 MUST**).
3. Validate input and show clear errors for insufficient cash, insufficient holdings, unsupported/closed instruments, invalid quantity, or unavailable pricing. The **server** makes final decisions (**BR-05 MUST**).
4. Keep order status up to date without manual refresh where supported; reconnect/poll after network loss (**BR-07 SHOULD**).
5. On double-clicks or submission timeouts, reuse the same attempt identifier and **check existing status** rather than unintentionally generating another order (proposed safety measure supporting **BR-06/09**).
6. Only show cash/holdings changes after authoritative backend booking; pending orders may reduce *available* funds or shares without implying a fill (**BR-09/10 MUST**).
7. Supported launch categories include **UK equities, US equities, Indian equities, FX, and crypto assets**; exact instrument lists and provider behaviour remain business decisions (**BR-12 MUST**).

### 3.3 Trading Operations Pages — `TRADING_OPS`

**Navigation:** Orders & Monitoring · Order Investigation · Sign Out.

| Page | Proposed route | Content and interactions | Requirement mapping |
|---|---|---|---|
| **Operations Dashboard / Order Search** | `/operations/orders` | Search by order ID, permitted client reference, instrument, date/time and status; show accepted/pending/failed/rejected queues | **BR-14/15 MUST** |
| **Operational Order Details** | `/operations/orders/:id` | Full authorised lifecycle, checks, status transitions, execution-time quote, fill/rejection, related references and exception indicators | **BR-14/15 MUST** |

**Necessities:** searchable history without engineering-only log reconstruction, explicit audit timestamps, approved redaction of client data, read-only cash/position effects, and evidence export only where policy permits. A trading halt/tradability control is **not** granted by default.

### 3.4 Risk & Compliance Pages — `COMPLIANCE`

**Navigation:** Investigations · Evidence / Exports · Sign Out.

| Page | Proposed route | Content and interactions | Requirement mapping |
|---|---|---|---|
| **Investigation Search** | `/compliance/investigations` | Find records by order ID, authorised client reference, dates, status or instrument | **BR-14/15 MUST** |
| **Investigation Details** | `/compliance/investigations/:id` | Original instruction; actor and timestamps; validation/rules; quote source/time; execution decision; cash/holding outcome; ordered audit history | **BR-14/15 MUST** |
| **Evidence Export / Access Record** | `/compliance/evidence` | View authorised evidence export requests/results and access purpose; protected download/manifest if approved | Proposed means of satisfying **BR-14/15** |

**Necessities:** no edit/delete of orders, fills, pricing decisions, or audit evidence; audit every sensitive access/export; show evidentiary completeness and failures. An external regulator does **not** automatically receive a separate login.

### 3.5 Business Analyst Pages — `ANALYST`

**Navigation:** Analytics Overview · Activity Trends · Instrument Analysis · Sign Out.

| Page | Proposed route | Content and interactions | Requirement mapping |
|---|---|---|---|
| **Analytics Overview** | `/analytics/overview` | Aggregate submitted/accepted/filled/rejected metrics, traded volumes, period selector, data freshness | **BR-16 MUST**, **BR-17 SHOULD** |
| **Activity Trends** | `/analytics/trends` | Historical trading activity by day/week/month, market or approved segment; charts and tables | **BR-16 MUST**, **BR-17 SHOULD** |
| **Instrument Analysis** | `/analytics/instruments` | Most-active instruments, fill counts, asset/market breakdowns, filterable summaries and permitted export | **BR-16 MUST**, **BR-17 SHOULD** |

**Necessities:** analytical data must come via an authorised reporting API backed by **separate OLAP storage/compute**, not queries against the live trading database (**BR-16 MUST**). Display `data_as_of`; distinguish order counts from fill counts and currencies from notional values. Default to aggregate/pseudonymised data, not identifiable client trade histories.

### 3.6 Finance / Reconciliation Pages — `FINANCE`

**Navigation:** Finance Overview · Reconciliation · Sign Out.

| Page | Proposed route | Content and interactions | Requirement mapping |
|---|---|---|---|
| **Finance Overview** | `/finance/overview` | Authorised totals of booked fills and cash movements by currency/period, available fee totals if configured, data-as-of indicator | Supports **BR-09/14 MUST** and reporting |
| **Reconciliation & Exceptions** | `/finance/reconciliation` | Cash/position/fill matching status, exception queue, filters, related posting and order references, authorised export | Proposed means of assuring **BR-09/14 MUST** |

**Necessities:** read-only posted records by default; no unrestricted balance edits, credits, write-offs, or journal rewrites. Any future correction workflow requires separate business approval, segregation of duties, and a durable audit trail.

## 4. Role-Based Navigation and Access

| Capability | Client | Trading Ops | Compliance | Analyst | Finance |
|---|:---:|:---:|:---:|:---:|:---:|
| Register / submit own buy or sell | **Own** | — | — | — | — |
| View client balances, holdings and blotter | **Own** | Conditional read | Conditional read | — | Conditional read |
| Search operational order status | — | Read | Read | — | Limited read |
| View detailed execution/audit evidence | Own summary | Authorised read | Authorised read | — | Relevant read |
| View historical aggregate analytics | — | Approved summary | Approved summary | **Read** | Approved summary |
| Review financial reconciliation | — | Exceptions read | Exceptions read | — | **Read** |
| Modify prior fills, cash postings or audit records | — | — | — | — | — |

**Enforcement requirements:**

- Upon login, send each person to their permitted landing page and render **only navigation available to that role**.
- Protect routes with Angular guards, but enforce **every permission again in Spring Boot**. Hiding a page or button does not protect its endpoint.
- Derive client ownership from authenticated identity; never trust a browser-supplied client/account ID as proof of access (**BR-02 MUST**).
- Verify resource-level access for path IDs, search results, downloads, WebSocket/SSE subscriptions, and cached data.
- Clear role-sensitive state on logout/account switch, and reject expired/revoked sessions (**BR-03 SHOULD**).
- Use the fewest necessary staff permissions. Sensitive cross-client access and exports require a documented business purpose and logging.

## 5. Additional Frontend Necessities

| Area | Minimum implementation expectation | Priority / context |
|---|---|---|
| **Shared app shell** | Top bar, role-specific side navigation, page title, identity/sign-out menu, breadcrumbs or reliable back navigation | Proposed UX necessity |
| **Responsive desktop-first layout** | Readable desktop screens and sensible narrow layouts; no native mobile app | Source scope + proposed UX |
| **Loading / empty / error states** | Skeleton/spinner, no holdings/orders/quotes states, field-level validation, retry/recovery messages | Proposed UX necessity |
| **Accessible interaction** | Labels, logical focus, keyboard navigation, accessible errors, statuses not conveyed only by color | Source usability + proposed WCAG 2.2 AA target |
| **Session handling** | Secure authentication, staff MFA if approved, expiry, revocation, redirect preserving safe user context | **BR-01 MUST**, **BR-03 SHOULD** |
| **Order feedback & recovery** | Receipt, stable order ID, live/polled status, duplicate-submit protection, reconnect recovery | **BR-06 MUST**, **BR-07 SHOULD** |
| **Data correctness presentation** | Currency units, time zone, quote age, indicative vs actual price, reserved vs owned values, timestamp/freshness | **BR-08/10/13** |
| **Lists / tables** | Filters, sort, pagination and meaningful detail links for order history and staff review | Supports **BR-11/15/17** |
| **Security & privacy** | No secrets in Angular bundle; no unauthorised PII in error logs; standard 401/403 handling; avoid stale cross-user caches | **BR-02 MUST**, source security expectations |
| **API integration** | Typed Angular API services/models, consistent server error codes, no client-side imitation of authoritative trading rules | Proposed implementation necessity |

### Suggested reusable Angular components

`AppShell`, `RoleNavigation`, `AuthGuard`, `PermissionGuard`, `StatusBadge`, `MoneyDisplay`, `InstrumentSearch`, `QuotePanel`, `OrderForm`, `OrderConfirmation`, `OrderTimeline`, `HoldingsTable`, `OrdersTable`, `DateRangeFilter`, `AnalyticsChart`, `AuditEventList`, `ReconciliationTable`, `LoadingState`, `EmptyState`, and `ErrorState`.

### Proposed API dependencies by page group

| Page group | Example required data / service endpoints |
|---|---|
| Authentication | Registration/identity provider, `GET /api/v1/me`, session/logout handling |
| Client overview & portfolio | `GET /api/v1/me/balances`, `GET /api/v1/me/positions` |
| Markets & trade | `GET /api/v1/instruments`, quote endpoint, `POST /api/v1/orders`, optional `POST /api/v1/orders/preflight` |
| Client orders | `GET /api/v1/orders`, `GET /api/v1/orders/{id}`, events/timeline and authenticated status stream |
| Trading operations | `GET /api/v1/operations/orders` and authorised order detail/evidence service |
| Compliance | `GET /api/v1/compliance/orders/{id}/evidence` and authorised investigation search/export service |
| Analytics | `GET /api/v1/analytics/summary`, `GET /api/v1/analytics/freshness`, reporting endpoints for trends/instruments |
| Finance | `GET /api/v1/finance/reconciliations` and authorised finance totals/detail service |

These are **illustrative contracts**. New detail and export endpoints must be agreed with backend developers; routes listed here do not imply they already exist.

## 6. Minimum Frontend Acceptance Checklist

- [ ] A client can register, sign in, sign out, and revisit the same account (**BR-01**).
- [ ] A client cannot access another client's pages or data, even by changing URLs or IDs (**BR-02**).
- [ ] The client can search an approved instrument and submit valid buy/sell orders (**BR-04/05/12**).
- [ ] Acceptance shows a durable order ID; pending vs filled vs rejected is always distinguishable (**BR-06/07**).
- [ ] Portfolio and blotter reflect authoritative booked outcomes, not an estimated quote (**BR-08/09/10/11**).
- [ ] A rejected/failed order has understandable explanation and is represented in authorised history (**BR-11/14**).
- [ ] Trading Operations can inspect an order's outcome without editing it (**BR-14/15**).
- [ ] Compliance can reconstruct a filled and rejected order from evidence (**BR-14/15**).
- [ ] Analyst pages display aggregates from isolated OLAP and identify reporting freshness (**BR-16/17**).
- [ ] Finance can view reconciliation exceptions without being able to modify booked history (**BR-09/14**, proposed workflow).
- [ ] Unauthorised roles cannot see staff-only navigation or call staff-only endpoints; backend tests enforce the same policies (**BR-02**, source security).
- [ ] Pages handle loading, empty data, validation errors, session expiry, and network failure accessibly.

## 7. Decisions to Confirm Before Implementation

1. Will Trading Ops, Compliance, Analytics and Finance each have an individual staff login, or will certain functions be handled through existing internal tools? The **capabilities** are required; these specific portals are proposed.
2. What identity-provider/fixture, staff provisioning, MFA, session lifetime and revocation rules will be used?
3. Which markets/instruments, order types, quantity rules and execution providers are approved? Is the demonstration **simulated** or actually venue-connected?
4. Which internal roles may see client-identifiable detail, and under what purpose, redaction and export policies?
5. Which reporting metrics, client segments and reconciliation views are approved? What data-refresh target should be displayed?
6. Will **pre-trade impact preview** be the team's selected additional capability under **BR-18 SHOULD**, or will the sponsor choose something else?

---

**Source:** Adapted from `HailMary.md`, particularly §§1–2 (scope, roles and screens), §4 (`BR-01`–`BR-18`), §9 (security/usability), and §10 (proposed APIs/Angular guidance). This is a **frontend-focused extraction**, not a replacement for the comprehensive requirements or unresolved business decisions.
