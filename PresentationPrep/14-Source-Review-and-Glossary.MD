# Source review, evidence map and glossary

## High-level explanation

This preparation explains the project found in the repository, rather than treating every historical plan as a completed feature. When an older diagram or guide disagrees with the active code, the presentation uses current source and tests and records the difference below.

Diagrams in this folder are newly written, trimmed explanations. They are not exhaustive class diagrams, actual database dumps, measured performance results or screenshots of a running deployment. Worked prices and balances are explicitly illustrative.

## Technical explanation

### Review scope and provenance

- Review date: **28 October 2026**; repository baseline: **`f09366d`**, plus the existing working tree.
- Source inspection covered component/build/deployment configuration, Angular route/auth/feature APIs and state, Spring controllers/security/services, trading rules/transactions/worker, MyBatis SQL, current/historical database paths and migrations, reporting service/schema/queries, test fixtures/assertions and script harnesses.
- Documentation review included the root/database/analytics guides, deployment/operations notes, conceptual ERD/UML explanations and API contract, backend implementation/TDD records, and feature handoffs/crash courses for Client, Advisor, Operations, Compliance, Finance and Analytics. The broader documentation inventory was also scanned to identify historical plans and verification records.
- Existing modifications to `backend/src/test/java/com/neueda/leap/support/SupportWorkflowPostgresTest.java` and `backend/src/test/java/com/neueda/leap/trading/TradingPostgresTest.java` were present when review began. They were inspected as working-tree evidence and were not changed by this documentation task.
- No credentials/private `.env` values were copied into these documents. No application code, existing documentation, database records or deployment state was intentionally changed.
- Preparation verification checks Markdown structure, source/file references and test inventory completeness. Application tests, Docker startup, actual browser journeys and a real provider trade were **not rerun**. Historical verification records support discussion of development history, not a new passing-test claim.

### Reading and evidence map

| Subject | Primary current source | Supporting documentation / tests |
| --- | --- | --- |
| Runtime topology | [Compose](../docker-compose.yml), [proxy](../nginx/nginx.conf), [frontend routes](../frontend/src/app/app.routes.ts) | [Root README](../README.md), [container guide](../docs/docker-containerization-guide.md). |
| Identity | [SecurityConfig](../backend/src/main/java/com/neueda/leap/config/SecurityConfig.java), [sessions](../backend/src/main/java/com/neueda/leap/service/SessionService.java), [Angular auth](../frontend/src/app/core/auth/auth.service.ts) | [Identity validator tests](../backend/src/test/java/com/neueda/leap/config/LiveIdentityValidatorTest.java), [auth service specs](../frontend/src/app/core/auth/auth.service.spec.ts). |
| Client trading | [Owned controller](../backend/src/main/java/com/neueda/leap/controller/WorkspaceClientController.java), [transactions](../backend/src/main/java/com/neueda/leap/trading/TradingTransactions.java), [rules](../backend/src/main/java/com/neueda/leap/trading/TradingRules.java) | [Current client guide](../ImplementationDocumentation/Frontend/ClientPageImplementation/ClientRefactorCrashCourse.MD), [trading integration](../backend/src/test/java/com/neueda/leap/trading/TradingPostgresTest.java). |
| Account/banking | [Onboarding](../backend/src/main/java/com/neueda/leap/service/impl/ClientOnboardingServiceImpl.java), [banking](../backend/src/main/java/com/neueda/leap/service/impl/BankingServiceImpl.java), [assignment SQL](../backend/src/main/java/com/neueda/leap/mapper/AdvisorMapper.java) | [Banking UI specs](../frontend/src/app/features/client/banking-page.component.spec.ts), [banking migration test](../testing/src/test/java/com/neueda/leap/db/ClientBankingMigrationTest.java). |
| Persistence | [Fresh schema](../database/fresh/001_schema.sql), [runner](../database/migrate.sh), [runtime grants](../database/runtime-grants.sql) | [Database guide](../database/README.md), [fresh parity test](../testing/src/test/java/com/neueda/leap/db/FreshTradingSchemaTest.java). |
| Roles | [Reference roles](../database/fresh/002_reference.sql), [workspace policy](../frontend/src/app/core/auth/workspace-policy.ts) | [Authorization matrix tests](../backend/src/test/java/com/neueda/leap/controller/WorkspaceAuthorizationTest.java). |
| Operations evidence | [Access service](../backend/src/main/java/com/neueda/leap/service/OperationsAccessService.java), [orders](../backend/src/main/java/com/neueda/leap/service/OperationsOrderService.java), [exports](../backend/src/main/java/com/neueda/leap/service/OperationsExportService.java) | [Operations guide](../ImplementationDocumentation/Frontend/OperationsPageImplementation/OperationsRoleCrashCourse.MD), [runbook](../docs/operations-runbook.md). |
| Support/Compliance | [Private workflow](../backend/src/main/java/com/neueda/leap/service/SupportWorkflowService.java), [reviews](../backend/src/main/java/com/neueda/leap/service/ComplianceCaseService.java), [Compliance access](../backend/src/main/java/com/neueda/leap/service/ComplianceAccessService.java) | [Managed Support guide](../ImplementationDocumentation/Frontend/OperationsPageImplementation/OperationsRefactorCrashCourse.MD), [workflow tests](../backend/src/test/java/com/neueda/leap/support/SupportWorkflowPostgresTest.java), [Compliance journey](../backend/src/test/java/com/neueda/leap/compliance/ComplianceHttpJourneyTest.java). |
| Advice | [Advisor service](../backend/src/main/java/com/neueda/leap/service/impl/AdvisorWorkspaceServiceImpl.java), [advisory migration](../database/migrations/018_advisor_workspace.sql) | [Advisor handoff](../ImplementationDocumentation/Frontend/AdvisorPageImplementation/AdvisorRoleBackendImplementation.MD), [Advisor integration](../backend/src/test/java/com/neueda/leap/advisor/AdvisorWorkspacePostgresTest.java). |
| Valuation/Finance | [Valuation](../backend/src/main/java/com/neueda/leap/service/impl/PortfolioValuationService.java), [Finance summary](../backend/src/main/java/com/neueda/leap/service/impl/FinanceSummaryServiceImpl.java), [reconciliation](../backend/src/main/java/com/neueda/leap/service/impl/ReconciliationService.java) | [Finance handoff](../ImplementationDocumentation/Frontend/FinancePageImplementation/plan_backend.md), [shared change proposal](../SharedChangeProposal/README.MD). |
| Analyst reporting | [FastAPI routes](../analytics-service/app/api.py), [report queries](../analytics-service/app/reporting.py), [reporting DDL](../analytics-service/migrations/001_reporting_schema.sql) | [Analytics README](../analytics-service/README.md), [visualization guide](../ImplementationDocumentation/Frontend/AnalyticsPage/AnalyticsVisualizationCrashCourse.MD), [Python API tests](../analytics-service/tests/test_api.py). |
| Development/testing | [Jenkinsfile](../Jenkinsfile), [container suite harness](../scripts/test-role-workspaces.sh), [test inventory](13-Test-Suite-Inventory.MD) | [Portfolio TDD record](../ImplementationDocumentation/Backend/HoldingPortfolioAndModel.MD), [quote implementation](../ImplementationDocumentation/Fauxnance/Quotes.md), [client commentary](../ImplementationDocumentation/Frontend/ClientPageImplementation/ClientRefactorCommentary.MD). |

### Historical-document discrepancies relevant to the talk

| Older description | Current evidence and presentation wording |
| --- | --- |
| Conceptual UML assumes future controllers, JPA repositories and a RebalancingService | Current backend has controllers/services/MyBatis mappers. Do not present assumed JPA/rebalancing classes as deployed components. |
| Original portfolio SQL describes a smaller/partly incompatible schema | Normal Compose initializes `database/fresh`, then runs missing migrations. The root `schema/portfolio_schema.sql` is not the runtime DDL. |
| Older role lists include AUDITOR or OPERATIONS and assume broad ADMIN access | Current fresh reference list contains seven roles; Angular has six workspaces. Actual endpoint authorization controls ADMIN/mixed-role behavior. |
| Early buy/sell notes describe unavailable or synthetic-only execution | Current SELF_DIRECTED orders use provider quotes and durable internal booking. Historical fixture instruments/prices remain in upgrade/test assets. |
| Older auth notes imply a fully stateless token, automatic refresh or an auth-stub dependency | Current Java requests check persisted sessions/live identity; refresh returns 503; current Compose has no auth-stub service. |
| Old market-data notes describe 1,200-second maximum quote age | Migration 021, fresh SQL, startup and current rules support 1,800 seconds. Provider-marked stale quotes still reject. |
| Database guide portions describe the fresh snapshot through 019 | Current fresh SQL includes trade-access fields/events and records versions 020/021. |
| Early Advisor handoff says automatic assignment is absent | Current onboarding/AdvisorMapper assigns eligible unassigned clients under a lock, with real-staff preference and demo fallback; no eligible Advisor means pending. |
| Earlier Finance UI plan treats summary as unavailable | Current Java summary service/controller/SQL are implemented. Handoff notes still leave production sign-off, performance review and deployment verification open. |
| Older analytics notes say all reports are unavailable | Local Compose now seeds explicit demonstration data in a separate reporting database. Authoritative publication/loader remains absent. |
| Historical CI evaluation describes missing frontend stages, fixed frontend API ports and includes merge-conflict markers | Read the current Jenkinsfile, API URL builder and Compose. The evaluation is historical planning material, not a reliable current pipeline diagram. |
| Earlier test totals or temporary logs describe a successful run | Date and scope those results. No current suite run was performed as part of preparing this folder. |

Existing documents are preserved. This folder supplies a coherent current presentation rather than silently rewriting the historical implementation record.

### Glossary for mixed audiences

| Term | Plain-language meaning | Technical precision |
| --- | --- | --- |
| Authentication | Establishing who signed in | Credential verification and token/session identity checks. |
| Authorization | Deciding what that person may do | Role, owner/assignment/grant, context and action checks. |
| JWT | Signed time-limited identity pass | Claims are signed, not encrypted; do not put secrets in claims. |
| Session | A particular sign-in | Java's `auth_sessions` stores owner, expiry and revocation. |
| Schema | Database blueprint | Tables, types, constraints, indexes, functions and relationships. |
| Migration | An ordered database change | Preserves older data while advancing schema version. |
| Projection | Current useful view of state | Posted/reserved balances or workflow state backed by retained facts. |
| Reservation / hold | Resources set aside for a pending action | Reduces available resources without being a fill. |
| Posted cash | Committed internal cash balance | Distinct from available cash, valuation and declared net worth. |
| Owned units | Committed position quantity | Includes reserved units; available units subtract reservations. |
| Bid / ask | Prices applicable to selling / buying | Current internal SELL uses bid; BUY uses ask. |
| Fill | Recorded completed execution | Here an internal booking, not an exchange execution report. |
| Journal | Retained signed financial change | Project cash/position journals are not a complete double-entry general ledger. |
| Idempotency key | Stable reference for one intended action | Same owned key and same canonical instruction replay the result. |
| Lease / fencing token | Temporary processing claim | Expiry permits recovery; token prevents stale claimant booking. |
| Outbox | Event fact retained with the business transaction | External notification/reporting delivery is not configured. |
| Reconciliation | Comparing expected internal relationships | Does not prove external custody, bank balance or legal settlement. |
| Purpose context | Recorded reason for sensitive access | Expiring actor/policy/case binding; it does not itself grant permission. |
| Watermark | Reporting progress marker | Identifies source/load freshness, not a bank or trading balance. |
| Digest | Fingerprint of bytes | Detects changes relative to a trusted expected hash; not independent truth. |
| TDD | Specify expected behavior before implementing it | Red → green → refactor; tests added later are regression evidence. |

## Keeping this preparation current

Before a later presentation, compare changes in security/roles, order rules, schema versions, reporting modes and Compose/Jenkins configuration. Recheck source links and the test-file inventory, run the relevant rehearsals, and attach actual dated results. Update current explanations while preserving the distinction between implementation, test evidence and deployment status.
