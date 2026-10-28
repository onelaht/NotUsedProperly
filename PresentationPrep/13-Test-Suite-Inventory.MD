# Test-suite file inventory

## High-level explanation

This is the presentation lookup sheet: find a feature, open its tests, and show one meaningful assertion. A file listed here is evidence of intended checks, not evidence that it passed in this preparation.

The reviewed tree contains **82 backend Java test files**, **7 concrete schema test files plus one shared base**, **59 frontend spec files**, and **1 analytics test file**. These are source-file counts, not executed test-case totals. Helper fixtures and scripts are described separately.

## Technical explanation

Java rows identify the test style and representative assertions. Angular rows use the declared suite title and representative spec descriptions. These examples describe each fixture's checks; a mocked response or disabled-service fixture is not the full production behavior. All entries link to current source. For commands, TDD evidence and limitations, see [the test guide](04-Test-Suites-and-TDD.MD).

### Backend — config

| Test file | Execution style / checked behavior |
| --- | --- |
| [LiveIdentityValidatorTest.java](../backend/src/test/java/com/neueda/leap/config/LiveIdentityValidatorTest.java) | Unit plus real signed-token decoder checks; persisted enablement/membership invalidate stale identity claims. |
| [SecurityConfigTest.java](../backend/src/test/java/com/neueda/leap/config/SecurityConfigTest.java) | JUnit configuration checks: signing secrets below 32 bytes reject, sufficient secrets are accepted, and CORS permits only explicit origins. |

### Backend — controller

| Test file | Execution style / checked behavior |
| --- | --- |
| [AdvisorControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/AdvisorControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: List Advisors Returns Json Response; Create Advisor Returns Created Response. |
| [AdvisorWorkspaceControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/AdvisorWorkspaceControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: Advisor Clients Route Exists; Anonymous And Wrong Role Are Rejected Across All Advisor Routes. |
| [AppUserControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/AppUserControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: Get Current User Returns Json Response; List Users Returns Json Response For Admin. |
| [AuditLogControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/AuditLogControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: List Audit Logs Returns Json Response For Auditor; List Audit Logs Returns Unauthorized When Missing Token. |
| [AuthControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/AuthControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: Signup Allows Anonymous Registration; Register Client Allows Anonymous Registration. |
| [ClientControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/ClientControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: List Clients Returns Json Response; Create Client Returns Created Response. |
| [ClientHoldingControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/ClientHoldingControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: List Holdings Returns Json Response; Create Holding Route Is Removed. |
| [ClientSubscriptionControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/ClientSubscriptionControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: List Client Subscriptions Returns Json Response; Create Client Subscription Returns Created Response. |
| [ClientTradeControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/ClientTradeControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: List Trades Returns Json Response; Create Trade Route Is Removed. |
| [ComplianceControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/ComplianceControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: Policy And Context Use Compliance Boundary; Protected Reads Carry Opaque Context And Return No Store. |
| [FauxnanceDailyCandleControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/FauxnanceDailyCandleControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: Get Candles Returns Json Response; Get Candles Returns Bad Request For Invalid Range. |
| [FauxnanceQuoteControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/FauxnanceQuoteControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: Get Quote Returns Json Response; Get Quote Returns Bad Request For Blank Symbol. |
| [InstrumentControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/InstrumentControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: List Instruments Returns Json Response; Create Instrument Route Is Removed. |
| [ModelPortfolioControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/ModelPortfolioControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: List Model Portfolios Returns Json Response; Create Model Portfolio Returns Created Response. |
| [ModelPortfolioHoldingControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/ModelPortfolioHoldingControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: List Model Portfolio Holdings Returns Json Response; Create Model Portfolio Holding Returns Created Response. |
| [OperationsUsersControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/OperationsUsersControllerTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Lists Users Using Search Text; Revokes Indefinitely And Restores Access. |
| [PortfolioValuationControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/PortfolioValuationControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: Values Only The Persisted Clients Account; Rejects Staff And Unauthenticated Access. |
| [RefreshTokenControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/RefreshTokenControllerTest.java) | Spring MVC slice with mocked refresh service; public refresh routing, authenticated logout and ADMIN token-management gates. Its mocked successful refresh does not override the real service's deliberate 503 behavior. |
| [RoleControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/RoleControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: List Roles Returns Json Response For Admin; Get Role Returns Json Response For Admin. |
| [StaffWorkspaceControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/StaffWorkspaceControllerTest.java) | Spring MVC slice: Finance exact-string aggregate contract and required UTC dates; denies wrong/mixed roles before service access. Parameterized checks keep Java's Analyst placeholders unavailable and role-protected. |
| [TradeSuggestionControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/TradeSuggestionControllerTest.java) | Spring MVC slice with controlled service dependencies. Representative checks: Create Trade Suggestion Returns Created Response For Advisor; List Client Trade Suggestions Returns Json Response For Authorized Admin. |
| [WorkspaceAuthorizationTest.java](../backend/src/test/java/com/neueda/leap/controller/WorkspaceAuthorizationTest.java) | MockMvc/security boundary matrix for current roles and owned workspace routes. |
| [WorkspaceClientControllerTest.java](../backend/src/test/java/com/neueda/leap/controller/WorkspaceClientControllerTest.java) | Spring MVC slice: derives history owner from persisted identity, denies staff/anonymous client-workspace reads, and checks the disabled-admission fixture. Enabled trading is covered by PostgreSQL integration. |

### Backend — service

| Test file | Execution style / checked behavior |
| --- | --- |
| [ComplianceEvidenceServiceTest.java](../backend/src/test/java/com/neueda/leap/service/ComplianceEvidenceServiceTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Rejects Unknown Filters Before Querying Database; Searches With Scope Count Before Page Rows. |
| [ComplianceExportServiceTest.java](../backend/src/test/java/com/neueda/leap/service/ComplianceExportServiceTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Actual Archive Bytes Accept Exact Limit And Reject The Next Byte; Replay Requires Read And Create On The Same Account. |
| [ProviderHealthServiceTest.java](../backend/src/test/java/com/neueda/leap/service/ProviderHealthServiceTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Observation Expires And Does Not Confuse Transport With Quote Eligibility; Failures Expose Safe Categories And Recover Without Retaining Provider Messages. |
| [SessionServiceTest.java](../backend/src/test/java/com/neueda/leap/service/SessionServiceTest.java) | Session issue/validation/revocation tests using controlled dependencies; see signed HTTP PostgreSQL coverage too. |
| [SupportInputTest.java](../backend/src/test/java/com/neueda/leap/service/SupportInputTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Prohibited Controls Cannot Be Hidden By Trimming. |

### Backend — service/impl

| Test file | Execution style / checked behavior |
| --- | --- |
| [AdvisorServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/AdvisorServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Get Advisor Returns Advisor When Found; List Advisors Returns Advisors. |
| [AdvisorWorkspaceServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/AdvisorWorkspaceServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Persisted Scope Is Resolved Every Call And Missing Role Or Link Never Falls Back; List Is Scoped And Search Is Literal Trimmed And Bounded. |
| [AppUserServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/AppUserServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Get User Returns User When Found; Get User By Username Returns User When Found. |
| [AuditLogServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/AuditLogServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: List Audit Logs Returns Audit Logs; Get Audit Log Returns Audit Log When Found. |
| [AuthServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/AuthServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Login Returns Token And Onboarding State; Login Rejects Invalid Password. |
| [ClientHoldingServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/ClientHoldingServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: List Client Holdings Returns Holdings; Get Holding Returns Holding When Found. |
| [ClientOnboardingServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/ClientOnboardingServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Complete Onboarding Creates Client And Stores Profile; New Onboarded Client Is Assigned To The Least Loaded Advisor. |
| [ClientServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/ClientServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Scalar Funding Cannot Be Created Or Edited Through Client Metadata; Get Client Returns Client When Found. |
| [ClientSubscriptionServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/ClientSubscriptionServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: List Client Subscriptions Returns Subscriptions; Get Client Subscription Returns Subscription When Found. |
| [ClientTradeServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/ClientTradeServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: List Client Trades Returns Trades; Get Trade Returns Trade When Found. |
| [FauxnanceDailyCandleServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/FauxnanceDailyCandleServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Missing Synthetic Provenance Remains Unknown; Get Candles Returns Mapped Response And Forwards Parameters. |
| [FauxnanceQuoteServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/FauxnanceQuoteServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Get Quote Returns Mapped Response And Forwards Symbol; Get Quote Normalizes Lower Case Symbols. |
| [FinanceSummaryServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/FinanceSummaryServiceImplTest.java) | Mockito/fixed-clock summary rules; exact amounts, inclusive UTC windows, 366-day bounds and source-unavailable behavior. |
| [InstrumentServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/InstrumentServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Get Instrument Returns Instrument When Found; List Instruments Returns Instruments. |
| [ModelPortfolioHoldingServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/ModelPortfolioHoldingServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: List Model Portfolio Holdings Returns Holdings; Get Model Portfolio Holding Returns Holding When Found. |
| [ModelPortfolioServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/ModelPortfolioServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Get Model Portfolio Returns Portfolio When Found; List Model Portfolios Returns Portfolios. |
| [OrderFillServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/OrderFillServiceImplTest.java) | Mockito tests for the legacy fill service; old cash/dated-holding calculations and rejection conditions. The current fill HTTP path is removed. |
| [OrderFillServiceIntegrationTest.java](../backend/src/test/java/com/neueda/leap/service/impl/OrderFillServiceIntegrationTest.java) | Spring + H2 historical fixture; old fill-service commit/rollback behavior. This is legacy service coverage, not the current SELF_DIRECTED writer. |
| [PortfolioValuationServiceTest.java](../backend/src/test/java/com/neueda/leap/service/impl/PortfolioValuationServiceTest.java) | Snapshot/provider fixtures; owned value, exact products, missing-source states, price provenance, age limits and trading-halt separation. |
| [RefreshTokenServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/RefreshTokenServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Get Refresh Token Returns Token When Found; List User Refresh Tokens Returns Tokens. |
| [RoleServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/RoleServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Get Role Returns Role When Found; List Roles Returns Roles. |
| [TradeSuggestionServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/TradeSuggestionServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: List Client Trade Suggestions Returns Suggestions; Get Trade Suggestion Returns Suggestion When Found. |
| [UserServiceImplTest.java](../backend/src/test/java/com/neueda/leap/service/impl/UserServiceImplTest.java) | JUnit with controlled/mocked dependencies. Representative checks: Register Client Creates User Role And Client Link; Register Client Rejects Duplicate Email. |

### Backend — mapper

| Test file | Execution style / checked behavior |
| --- | --- |
| [AdvisorMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/AdvisorMapperTest.java) | MyBatis/H2 fixture. Representative checks: Get Advisor Returns Advisor; List Advisors Returns Rows. |
| [AdvisorWorkspaceMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/AdvisorWorkspaceMapperTest.java) | JUnit SQL-contract inspection: Advisor queries include enabled role/assignment checks; writes use compare-and-set scope and avoid financial/history tables. Real execution is covered by AdvisorWorkspacePostgresTest. |
| [AppUserMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/AppUserMapperTest.java) | MyBatis/H2 fixture. Representative checks: Get User Returns User With Advisor Id; Get User Returns Client Id When Linked. |
| [AuditLogMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/AuditLogMapperTest.java) | MyBatis/H2 fixture. Representative checks: List Audit Logs Returns Rows Ordered Newest First; Get Audit Log Returns Row. |
| [ClientHoldingMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/ClientHoldingMapperTest.java) | MyBatis/H2 fixture. Representative checks: List Client Holdings Returns Rows; Get Client Holding Returns Holding. |
| [ClientMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/ClientMapperTest.java) | MyBatis/H2 fixture. Representative checks: Get Client Returns Client With Balance; Get Client By User Id Returns Linked Client. |
| [ClientProfileMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/ClientProfileMapperTest.java) | MyBatis/H2 fixture. Representative checks: Find By User Id Returns Stored Profile; Insert Client Profile Creates New Row With Generated Id. |
| [ClientSubscriptionMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/ClientSubscriptionMapperTest.java) | MyBatis/H2 fixture. Representative checks: List Client Subscriptions Returns Rows; Get Client Subscription Returns Subscription. |
| [ClientTradeMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/ClientTradeMapperTest.java) | MyBatis/H2 fixture. Representative checks: List Client Trades Returns Rows; Get Client Trade Returns Trade. |
| [InstrumentMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/InstrumentMapperTest.java) | MyBatis/H2 fixture. Representative checks: Get Instrument Returns Instrument; List Instruments Returns Rows. |
| [ModelPortfolioHoldingMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/ModelPortfolioHoldingMapperTest.java) | MyBatis/H2 fixture. Representative checks: List Model Portfolio Holdings Returns Rows; Get Model Portfolio Holding Returns Holding. |
| [ModelPortfolioMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/ModelPortfolioMapperTest.java) | MyBatis/H2 fixture. Representative checks: List Model Portfolios Returns Rows; Get Model Portfolio Returns Portfolio. |
| [OperationsUserMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/OperationsUserMapperTest.java) | MyBatis/H2 fixture. Representative checks: Lists Client Accounts Alphabetically With Cash And Access State; Filters Clients By Email Or Name. |
| [RefreshTokenMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/RefreshTokenMapperTest.java) | MyBatis/H2 fixture. Representative checks: Get Refresh Token Returns Token; List User Refresh Tokens Returns Rows. |
| [RoleMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/RoleMapperTest.java) | MyBatis/H2 fixture. Representative checks: Get Role Returns Role; List Roles Returns Rows Ordered By Role Id. |
| [TradeSuggestionMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/TradeSuggestionMapperTest.java) | MyBatis/H2 fixture. Representative checks: List Client Trade Suggestions Returns Rows; Get Trade Suggestion Returns Suggestion. |
| [WorkspaceReadMapperTest.java](../backend/src/test/java/com/neueda/leap/mapper/WorkspaceReadMapperTest.java) | MyBatis/H2 fixture. Representative checks: Scoped Count And Page Use The Same Filters; Current Snapshot Is Not Summed With History. |

### Backend — trading

| Test file | Execution style / checked behavior |
| --- | --- |
| [CatalogSetupTest.java](../backend/src/test/java/com/neueda/leap/trading/CatalogSetupTest.java) | Mocked startup setup; checks all active USD catalog instruments instead of assuming a fixed old manifest. |
| [DisplayRatesTest.java](../backend/src/test/java/com/neueda/leap/trading/DisplayRatesTest.java) | Fixture reference-rate XML; conversion direction/final rounding and stale/future/missing/unsafe XML rejection. |
| [FauxnanceTradingQuotesTest.java](../backend/src/test/java/com/neueda/leap/trading/FauxnanceTradingQuotesTest.java) | Production quote adapter with mocked provider; exact metadata mapping, stale/unknown handling and no fixture-price substitution. |
| [TradingPostgresTest.java](../backend/src/test/java/com/neueda/leap/trading/TradingPostgresTest.java) | Real PostgreSQL/Spring; exercises admission/booking, duplicate and cash races, claim fencing, rollback, banking, policy, Finance, scope, Support and archives. Provider/clock/probe are mocked; setup rebuilds the historical-to-current chain. |
| [TradingResourcesTest.java](../backend/src/test/java/com/neueda/leap/trading/TradingResourcesTest.java) | Service/resource checks; missing timestamps return an ineligible preview and both sides require an active owned bank. |
| [TradingRulesTest.java](../backend/src/test/java/com/neueda/leap/trading/TradingRulesTest.java) | Pure exact-decimal policy and quote validation, including 30-minute timestamp boundaries and unknown-session behavior. |
| [TradingSessionTest.java](../backend/src/test/java/com/neueda/leap/trading/TradingSessionTest.java) | Pure calendar tests for Eastern-time boundaries, DST, weekends, holidays, early closes and supported venue/year requirements. |

### Backend — advisor

| Test file | Execution style / checked behavior |
| --- | --- |
| [AdvisorWorkspacePostgresTest.java](../backend/src/test/java/com/neueda/leap/advisor/AdvisorWorkspacePostgresTest.java) | Real PostgreSQL/Spring; assigned-client reads, guidance/versioned clears, recommendations, immutable attributed history, trading-lock races and non-owner privilege denial. |

### Backend — support

| Test file | Execution style / checked behavior |
| --- | --- |
| [SupportWorkflowPostgresTest.java](../backend/src/test/java/com/neueda/leap/support/SupportWorkflowPostgresTest.java) | Real PostgreSQL/Spring/MockMvc; public/private projections, original-key commands, intake/checklists/referrals, managed scope, audit rollback and unchanged financial facts. Optional dedicated restricted runtime fixture. |

### Backend — compliance

| Test file | Execution style / checked behavior |
| --- | --- |
| [ComplianceEvidenceQueryTest.java](../backend/src/test/java/com/neueda/leap/compliance/ComplianceEvidenceQueryTest.java) | Real PostgreSQL and MyBatis; every evidence section/count/page plus historical qualified-alias SQL regression. |
| [ComplianceHttpJourneyTest.java](../backend/src/test/java/com/neueda/leap/compliance/ComplianceHttpJourneyTest.java) | Real HTTP fixture journey with PostgreSQL; scoped search/detail/section pagination, export recovery, receipt and exact archive bytes. |
| [CompliancePostgresTest.java](../backend/src/test/java/com/neueda/leap/compliance/CompliancePostgresTest.java) | Real PostgreSQL; current Compliance schema and immutable guards. |

### Dedicated schema module

| Test file | Execution style / checked behavior |
| --- | --- |
| [AbstractPostgresIntegrationTest.java](../testing/src/test/java/com/neueda/leap/db/AbstractPostgresIntegrationTest.java) | Shared fixture, not a concrete suite: starts PostgreSQL 15 or validates an isolated external URL; drops/recreates public and loads historical base SQL before each test. |
| [ClientBankingMigrationTest.java](../testing/src/test/java/com/neueda/leap/db/ClientBankingMigrationTest.java) | Real PostgreSQL DDL: owned bank references, precise immutable movement receipts and required relationships. |
| [ClientSimulationMigrationTest.java](../testing/src/test/java/com/neueda/leap/db/ClientSimulationMigrationTest.java) | Real PostgreSQL historical upgrade: preserves legacy records, rejects negative availability and keeps optional setup idempotent. |
| [FreshTradingSchemaTest.java](../testing/src/test/java/com/neueda/leap/db/FreshTradingSchemaTest.java) | Real PostgreSQL: compares fresh and migrated columns/defaults, constraints and guards. Structural parity is bounded, not exhaustive functional proof. |
| [ProviderCutoverMigrationTest.java](../testing/src/test/java/com/neueda/leap/db/ProviderCutoverMigrationTest.java) | Real PostgreSQL historical provider cutover: uncertain balances preserved/quarantined without creating spendable cash or retaining legacy writers. |
| [SchemaBusinessFlowQueryTest.java](../testing/src/test/java/com/neueda/leap/db/SchemaBusinessFlowQueryTest.java) | Real PostgreSQL historical business data: client/Advisor/model joins, holdings aggregation and trade totals. |
| [SchemaConstraintValidationTest.java](../testing/src/test/java/com/neueda/leap/db/SchemaConstraintValidationTest.java) | Real PostgreSQL historical base constraints across Advisor/model/client/instrument/allocation/subscription/holding/trade tables. |
| [WorkspaceMigrationTest.java](../testing/src/test/java/com/neueda/leap/db/WorkspaceMigrationTest.java) | Real PostgreSQL migration 003: repeatability, preserved legacy assignments and absence of accidental demo-identity creation. |

These tests inherit a destructive disposable-schema fixture. Never supply a retained application database. Newer workflow/Compliance/Advisor correctness also lives in backend PostgreSQL suites and standalone migration rehearsals; the historical constraint tests alone do not cover the complete current schema.

### Frontend — App, identity and shared UI

All rows use the Angular unit-test builder / Vitest. HTTP and service dependencies are controlled by their spec fixtures; these are not full real-browser E2E runs.

| Spec file | Declared suite / representative assertions |
| --- | --- |
| [app.spec.ts](../frontend/src/app/app.spec.ts) | App routing and shell; redirects unauthenticated visitors from the dashboard to login; renders the authenticated shell for signed-in visitors. |
| [analytics-api.service.spec.ts](../frontend/src/app/core/api/analytics-api.service.spec.ts) | AnalyticsApiService; builds bounded query parameters for the analytics origin; requests the portfolio visualization contracts with explicit filters. |
| [catalog-refresh.service.spec.ts](../frontend/src/app/core/api/catalog-refresh.service.spec.ts) | visible catalog refresh; refreshes on a timer and focus, pauses when hidden, and stops on session change. |
| [market-data.service.spec.ts](../frontend/src/app/core/api/market-data.service.spec.ts) | MarketDataService with application HTTP configuration; requests an inclusive UTC date range and authenticates the candle request; encodes special symbols into a single path segment and authenticates quotes. |
| [operations-api.service.spec.ts](../frontend/src/app/core/api/operations-api.service.spec.ts) | Operations purpose and evidence access; sends only the opaque context in protected request headers and clears it on session change; clears purpose on revoked access and retains it on transport failure. |
| [order-status.service.spec.ts](../frontend/src/app/core/api/order-status.service.spec.ts) | resumable order status polling; converges after disconnect and does not notify again for duplicate versions; requests a full reload on a reset and stops on identity change. |
| [auth.interceptor.spec.ts](../frontend/src/app/core/auth/auth.interceptor.spec.ts) | credential boundary; never attaches credentials to another origin; attaches only intended backend credentials and keeps a valid 403 session. |
| [auth.service.spec.ts](../frontend/src/app/core/auth/auth.service.spec.ts) | AuthService authoritative initialization; starts unauthenticated without a session; bootstraps staff identity without a client profile. |
| [workspace-policy.spec.ts](../frontend/src/app/core/auth/workspace-policy.spec.ts) | workspace routing policy; recognizes exact role collections only; uses documented multi-role priority. |
| [workspace-router.spec.ts](../frontend/src/app/core/auth/workspace-router.spec.ts) | workspace router guards; allows staff deep link without client profile; checks a forbidden child after shell already mounted. |
| [idempotency-key.spec.ts](../frontend/src/app/core/idempotency-key.spec.ts) | createIdempotencyKey; uses randomUUID when the secure-context API is available; falls back to getRandomValues when randomUUID is unavailable. |
| [theme.service.spec.ts](../frontend/src/app/core/theme.service.spec.ts) | persistent application theme; initializes the saved theme before any account menu is rendered. |
| [dashboard.spec.ts](../frontend/src/app/dashboard.spec.ts) | Dashboard placeholder disclosure; labels the portfolio overview as a placeholder in parentheses. |
| [authenticated-shell.component.spec.ts](../frontend/src/app/layout/authenticated-shell.component.spec.ts) | shared workspace navigation; exposes the Add route to Operations, hides management for mixed client roles, and observes header height. |
| [onboarding.spec.ts](../frontend/src/app/onboarding.spec.ts) | Onboarding dropdowns; keeps the risk tolerance field compact without redundant explanatory copy; formats phone input, limits phone and postal code to digits, and omits preference checkboxes. |
| [profile.spec.ts](../frontend/src/app/profile.spec.ts) | Profile advisor assignment; shows an assigned advisor independently of cached profile data; distinguishes pending assignment from unavailable assignment. |
| [display-code.pipe.spec.ts](../frontend/src/app/shared/display-code.pipe.spec.ts) | DisplayCodePipe; renders enum codes in sentence case while retaining their values elsewhere. |
| [loading.component.spec.ts](../frontend/src/app/shared/loading/loading.component.spec.ts) | LoadingComponent; renders a circular spinner; announces the loading label while keeping the decorative spinner hidden. |
| [top-nav.component.spec.ts](../frontend/src/app/shared/top-nav/top-nav.component.spec.ts) | TopNavComponent; renders the clickable frog brand, ticker search, and account button; offers a text-only theme action and updates its label after toggling. |
| [two-decimals.pipe.spec.ts](../frontend/src/app/shared/two-decimals.pipe.spec.ts) | two decimal display; does not change the original financial values; formats nested evidence amounts and preserves references and integer counts. |
| [page-resource.spec.ts](../frontend/src/app/shared/workspace/page-resource.spec.ts) | clears protected cached data on denied access even during a background refresh. |
| [private-command.spec.ts](../frontend/src/app/shared/workspace/private-command.spec.ts) | private workflow original-key recovery; persists only opaque metadata and retains exactly the original payload and key; fails closed on corrupt metadata instead of silently replacing an uncertain key. |
| [reconciliation-page.component.spec.ts](../frontend/src/app/shared/workspace/reconciliation-page.component.spec.ts) | finance reconciliation; shows a persisted snapshot and explicitly runs a new reconciliation. |
| [trade-access-notice.component.spec.ts](../frontend/src/app/shared/workspace/trade-access-notice.component.spec.ts) | client trade access notice; shows a persistent contact-support message for an indefinite revocation; shows the scheduled end date for a timed revocation. |
| [utc-filter.spec.ts](../frontend/src/app/shared/workspace/utc-filter.spec.ts) | UTC filter controls; uses UTC, including DST gaps and seconds precision; permits optional bounds and exactly 31 days but rejects one millisecond beyond. |
| [signup.spec.ts](../frontend/src/app/signup.spec.ts) | Signup form UI; shows missing-field and password validation next to the form action; submits normalized email and navigates to onboarding for valid credentials. |

### Frontend — Client

All rows use the Angular unit-test builder / Vitest. HTTP and service dependencies are controlled by their spec fixtures; these are not full real-browser E2E runs.

| Spec file | Declared suite / representative assertions |
| --- | --- |
| [account-page.component.spec.ts](../frontend/src/app/features/client/account-page.component.spec.ts) | independent account resources; displays explicit NONE guidance as N/A rather than the wire enum; keeps confirmed balances useful when recent orders fail. |
| [client-advisory-api.service.spec.ts](../frontend/src/app/features/client/advisory/client-advisory-api.service.spec.ts) | ClientAdvisoryApi; uses session-owned assignment and advisory paths without a client ID. |
| [client-recommendations.component.spec.ts](../frontend/src/app/features/client/advisory/client-recommendations.component.spec.ts) | ClientRecommendationsComponent; omits exact positive holdings but keeps zero holdings and escapes rationale. |
| [banking-page.component.spec.ts](../frontend/src/app/features/client/banking-page.component.spec.ts) | BankingPageComponent; explains internal funding and provides labelled bank and amount controls; restricts number fields to digits and formats movement amounts as grouped USD decimals. |
| [display-currency.component.spec.ts](../frontend/src/app/features/client/display-currency.component.spec.ts) | display currency estimates; cancels obsolete requests and clears estimates on session changes without changing USD; shows rate errors with retry and never substitutes a made-up estimate. |
| [markets-page.component.spec.ts](../frontend/src/app/features/client/markets-page.component.spec.ts) | market catalog page; sends filters and pagination to the server and displays actual empty results; does not disguise forbidden reads as an empty catalog. |
| [order-detail.component.spec.ts](../frontend/src/app/features/client/order-detail.component.spec.ts) | committed order evidence; does not label retained internal evidence as incomplete historical evidence; shows retained execution quotes and pages beyond the first 100 events. |
| [support-intake.spec.ts](../frontend/src/app/features/client/support-intake.spec.ts) | versioned category intake. |
| [support-journey.spec.ts](../frontend/src/app/features/client/support-journey.spec.ts) | owned support journey; places new before reference and recovers the same key after an uncertain response and missing lookup; renders public prose inert and clears protected detail when identity changes. |

### Frontend — Trading and charts

All rows use the Angular unit-test builder / Vitest. HTTP and service dependencies are controlled by their spec fixtures; these are not full real-browser E2E runs.

| Spec file | Declared suite / representative assertions |
| --- | --- |
| [candle-chart.component.spec.ts](../frontend/src/app/features/trade/candle-chart.component.spec.ts) | Daily candle chart; keeps flat prices finite and provides accessible OHLC data; keeps exact daily OHLC values accessible independently of canvas rendering. |
| [daily-candles.spec.ts](../frontend/src/app/features/trade/daily-candles.spec.ts) | daily provider candle validation; deduplicates identical dates and preserves unadjusted OHLC and session dates; rejects conflicting duplicates and another symbol. |
| [order-ticket.component.spec.ts](../frontend/src/app/features/trade/order-ticket.component.spec.ts) | Internal order ticket; requires a preview and invalidates it when the instruction changes; blocks duplicate clicks and preserves exact decimal input. |
| [trade.component.spec.ts](../frontend/src/app/features/trade/trade.component.spec.ts) | Trade page; shows reusable loading indicators while both requests are pending; renders 30 chronological OHLC candles and the quote fields. |

### Frontend — Operations

All rows use the Angular unit-test builder / Vitest. HTTP and service dependencies are controlled by their spec fixtures; these are not full real-browser E2E runs.

| Spec file | Declared suite / representative assertions |
| --- | --- |
| [create-account.component.spec.ts](../frontend/src/app/features/operations/create-account.component.spec.ts) | Operations create account UI; creates the selected supported staff role and resets the form; requires valid email, strong password, and advisor name without calling the API. |
| [instrument-policy-editor.component.spec.ts](../frontend/src/app/features/operations/instrument-policy-editor.component.spec.ts) | Operations instrument controls; shows provider-test progress and failures next to the symbol instead of the save button; provides a symbol test beside the input and invalidates results when the symbol changes. |
| [instruments-page.component.spec.ts](../frontend/src/app/features/operations/instruments-page.component.spec.ts) | Operations catalog navigation; opens Add instrument as a route instead of embedding an off-screen editor; updates saved policies without replacing the table, changing draft filters, or clearing rows on failure. |
| [orders-page.utc.spec.ts](../frontend/src/app/features/operations/orders-page.utc.spec.ts) | Operations UTC filter integration; preserves seconds, interprets labels as UTC and refuses impossible dates without sending a request. |
| [support-workbench.spec.ts](../frontend/src/app/features/operations/support-workbench.spec.ts) | private Operations workbench; uses the opaque current case reference for independently authorized account evidence; retains the original command after unknown outcome and missing recovery receipt. |
| [user-access.component.spec.ts](../frontend/src/app/features/operations/user-access.component.spec.ts) | Operations user access UI; shows alphabetical client rows with balance and onboarding state, without account tabs; places bulk revoke controls before the account list and keeps the reason field aligned. |

### Frontend — Compliance

All rows use the Angular unit-test builder / Vitest. HTTP and service dependencies are controlled by their spec fixtures; these are not full real-browser E2E runs.

| Spec file | Declared suite / representative assertions |
| --- | --- |
| [compliance-api.service.spec.ts](../frontend/src/app/features/compliance/compliance-api.service.spec.ts) | ComplianceApi; does not issue a protected request without a server-issued context; uses the exact investigation path and opaque context header. |
| [compliance-correctness.spec.ts](../frontend/src/app/features/compliance/compliance-correctness.spec.ts) | Compliance correctness; applies validated UTC values and keeps draft edits out of pagination and URLs; restores safe refresh filters and page, rejecting malformed saved state. |
| [compliance-feature.spec.ts](../frontend/src/app/features/compliance/compliance-feature.spec.ts) | Compliance investigations workspace; renders a dedicated purpose-aware investigation screen. |
| [compliance-screens.spec.ts](../frontend/src/app/features/compliance/compliance-screens.spec.ts) | Compliance screen states; renders scoped search results without deriving a fill from rejection state; rejects invalid positive-ID filters before making a search call. |
| [review-cases.spec.ts](../frontend/src/app/features/compliance/review-cases.spec.ts) | private Compliance review cases; retains decisions privately, invalidates the prior purpose and never calls public Support APIs; retains the original key across unknown outcome and an unconfirmed recovery lookup. |

### Frontend — Advisor

All rows use the Angular unit-test builder / Vitest. HTTP and service dependencies are controlled by their spec fixtures; these are not full real-browser E2E runs.

| Spec file | Declared suite / representative assertions |
| --- | --- |
| [advisor-api.service.spec.ts](../frontend/src/app/features/advisor/advisor-api.service.spec.ts) | AdvisorApi; rejects unsafe or non-positive numeric IDs before issuing requests; requests assigned clients with bounded pagination and search. |
| [advisor-client-detail-page.component.spec.ts](../frontend/src/app/features/advisor/advisor-client-detail-page.component.spec.ts) | AdvisorClientDetailPageComponent; preserves a conflicted guidance draft and explicitly rebases before a NONE clear; validates recommendation drafts, preserves conflicts, and saves confirmed versions. |
| [advisor-clients-page.component.spec.ts](../frontend/src/app/features/advisor/advisor-clients-page.component.spec.ts) | AdvisorClientsPageComponent; clears a sensitive search draft when the verified session changes; searches with bounded pagination and cancels an obsolete search. |
| [advisor-routing.spec.ts](../frontend/src/app/features/advisor/advisor-routing.spec.ts) | Advisor route integration with existing guards; opens the exact lazy home and detail deep links; denies a client-only session and an unauthenticated deep link. |
| [advisor-utils.spec.ts](../frontend/src/app/features/advisor/advisor-utils.spec.ts) | Advisor eligibility helpers; bounds trimmed recommendation reasoning. |

### Frontend — Finance

All rows use the Angular unit-test builder / Vitest. HTTP and service dependencies are controlled by their spec fixtures; these are not full real-browser E2E runs.

| Spec file | Declared suite / representative assertions |
| --- | --- |
| [finance-api.service.spec.ts](../frontend/src/app/features/finance/api/finance-api.service.spec.ts) | FinanceApi; requests a typed summary with the selected UTC calendar scope; rejects a valid summary whose returned period differs from the requested dates. |
| [finance-overview.component.spec.ts](../frontend/src/app/features/finance/overview/finance-overview.component.spec.ts) | Finance overview; keeps reconciliation usable when summary reporting returns 503; renders only authoritative populated values and source timestamps. |
| [finance-reconciliation.component.spec.ts](../frontend/src/app/features/finance/reconciliation/finance-reconciliation.component.spec.ts) | Finance reconciliation; distinguishes no stored report from a matched run and historical exceptions; posts once on rapid repeat activation and renders current findings separately. |

### Frontend — Analytics

All rows use the Angular unit-test builder / Vitest. HTTP and service dependencies are controlled by their spec fixtures; these are not full real-browser E2E runs.

| Spec file | Declared suite / representative assertions |
| --- | --- |
| [analytics-page.component.spec.ts](../frontend/src/app/features/analytics/analytics-page.component.spec.ts) | AnalyticsPageComponent; keeps filters visible and labels an unavailable report without invented values; exposes all approved benchmark periods without inventing a chart result. |

### Analytics Python

| Test file | Execution style / checked behavior |
| --- | --- |
| [test_api.py](../analytics-service/tests/test_api.py) | Pytest + FastAPI TestClient; liveness/readiness, missing/wrong-role authentication, Analyst unavailable behavior, date/measure validation, and unavailable performance/holdings routes. No populated PostgreSQL reporting-query fixture is provided here. |
| [conftest.py](../analytics-service/tests/conftest.py) | Autouse local signing-secret setup for token tests; helper fixture, not an independent test suite. |

### Scripted checks and demonstration helpers

Run scripts from the repository root after reviewing their dependencies. A script can change its disposable environment; the role smoke helpers can connect to an existing configured local demo. Their scope and mutation behavior differ.

| Script | Purpose / important prerequisite |
| --- | --- |
| [test-role-workspaces.sh](../scripts/test-role-workspaces.sh) | Disposable PostgreSQL plus Maven/Node containers: backend, schema, frontend tests/style/build. Needs Docker and cached/pullable images/dependencies. Excludes Pytest and the standalone HTTP/recovery scripts. |
| [test-client-compose.py](../scripts/test-client-compose.py) | Isolated Compose startup/repeat/upgrade rehearsal using an explicit HTTP provider fixture. Needs current build artifacts/images and available fixture ports. |
| [test-operations-demo.py](../scripts/test-operations-demo.py) | Isolated standard Operations startup/HTTP journey with explicit market fixture and local grants. |
| [test-client-recovery.py](../scripts/test-client-recovery.py) | Process restart, backup/restore, retained requests/evidence/archives and restricted-runtime booking/mutation checks. Requires packaged backend and Docker images. |
| [test-hardened-config.py](../scripts/test-hardened-config.py) | Read-only resolved Compose contract checks using non-secret fixture variables; no service startup. Requires Compose override-tag support. |
| [test-compliance-migrations.py](../scripts/test-compliance-migrations.py) | Disposable actual-runner Compliance upgrade/compatibility rehearsal; separate from the normal schema module. |
| [test-advisor-seed.py](../scripts/test-advisor-seed.py) | Disposable PostgreSQL Advisor demo-provisioning checks, including repeatability and assignment behavior. |
| [smoke-role-workspaces.py](../scripts/smoke-role-workspaces.py) | HTTP smoke against the local role demo; inspect its configured base URL and calls before use. |
| [smoke-advisor-workspace.py](../scripts/smoke-advisor-workspace.py) | Read-only by default against a selected local URL. Its explicit --verify-demo-mutations option creates/edits/archives a demo recommendation and leaves attributed history. |
| [verify-operations-export.py](../scripts/verify-operations-export.py) | Offline verification of an Operations ZIP, expected filenames and SHA-256/manifest digests. Needs a real exported archive; not a generic Compliance archive verifier. |
| [check-qof-styles.mjs](../frontend/scripts/check-qof-styles.mjs) | Source-level design/style regression check, with a documented loading-spinner exception. It is not a visual accessibility audit. |
| [start-client-review.sh](../scripts/start-client-review.sh) / [stop-client-review.sh](../scripts/stop-client-review.sh) | Disposable browser-review environment and cleanup helpers, not assertions by themselves. --http-fixture is explicit; default mode uses configured provider settings. |
| [fauxnance-http.mjs](../scripts/fixtures/fauxnance-http.mjs) | Test-only HTTP market provider used for repeatable rehearsals; not a production feed. |

### What to show during Q&A

Choose one pure rule test, one meaningful HTTP role/ownership test, one PostgreSQL concurrency/rollback assertion and one same-key UI recovery spec. Explain the controlled dependencies for each. Add an actual fresh result from rehearsal before saying the chosen checks pass.
