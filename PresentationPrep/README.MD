# Tadpoles presentation preparation

Prepared from the repository working tree on **28 October 2026**, based on commit `f09366d`. See [the review notes](14-Source-Review-and-Glossary.MD) for scope and evidence. This folder explains the implementation found in source; it does not certify the state of a running deployment.

## High-level explanation

Tadpoles is an investing workspace for clients and the staff who support them. Clients can explore markets, manage an internal USD account, submit buy/sell instructions, see outcomes, and ask for help. Advisors record guidance; Operations investigates and controls availability; Compliance reviews evidence; Finance checks internal totals; Analysts explore a separate demonstration reporting dataset.

**Opening statement:** “We built a role-based investing application that follows an instruction from the client screen to a durable outcome and an explainable record. Prices come from a market-data provider. Trades and funding are recorded inside our application; this project does not route orders to an exchange or transfer money through a bank.”

## Technical explanation

The system combines Angular, a Spring Boot API using MyBatis, PostgreSQL transactional storage, and a FastAPI analytics service with a separate PostgreSQL reporting database. A scheduled worker inside Spring processes durable order jobs. Nginx routes browser requests to the appropriate service.

Read each topic's high-level section for public-facing language; use its technical section, diagrams, examples, and source links for developer discussion. Diagrams use Mermaid fenced blocks and display in Markdown viewers with Mermaid support; other viewers retain their readable diagram source.

| Document | Purpose | Suggested audience |
| --- | --- | --- |
| [01 — Architecture](01-Project-Architecture.MD) | Components, boundaries, request flow, design tradeoffs | Everyone |
| [02 — Authentication](02-Authentication-and-Authorization.MD) | Sign-in, JWTs, revocation, ownership, permission checks | Everyone; technical Q&A |
| [03 — Buy and sell](03-Buy-and-Sell-Lifecycle.MD) | Preview, reservations, execution, recovery, accounting example | Everyone |
| [04 — Tests and TDD](04-Test-Suites-and-TDD.MD) | What each test layer proves, how to run it, supported TDD claims | Stakeholders and developers |
| [05 — Schemas](05-Schemas-and-Data-Integrity.MD) | ERDs, table responsibilities, constraints, migrations | Developers; stakeholder overview |
| [06 — Roles](06-Roles-and-Permissions.MD) | Role matrix, scope, mixed-role behavior, legacy labels | Everyone |
| [07 — Banking and onboarding](07-Banking-and-Account-Lifecycle.MD) | Account creation, saved references, internal cash movements | Everyone |
| [08 — Support and evidence](08-Support-Compliance-and-Evidence.MD) | Public conversations, private work, reviews, exports | Everyone |
| [09 — Advice and reporting](09-Advisory-Valuation-and-Reporting.MD) | Guidance, valuation, display currencies, Finance and Analyst data | Everyone |
| [10 — Deployment and limits](10-Deployment-Operations-and-Limitations.MD) | Startup, CI, recovery, failure modes, remaining work | Stakeholders and developers |
| [11 — Presentation walkthrough](11-Presentation-Walkthrough.MD) | A timed talk, demo sequence, fallback and rehearsal checklist | Presenter |
| [12 — Audience questions](12-Audience-Questions.MD) | Public, stakeholder and senior-developer questions, including scenarios and teamwork | Presenter and panel |
| [13 — Test inventory](13-Test-Suite-Inventory.MD) | Individual Java, Angular and Python test files and harnesses | Developers |
| [14 — Review notes and glossary](14-Source-Review-and-Glossary.MD) | Evidence map, documentation discrepancies, terminology | Presenter and developers |

## Presentation rules

- Say **internally booked trade**, **provider quote**, and **internal funding**. A stored bank reference does not prove bank ownership or connectivity.
- Say **accepted** when an instruction is committed for processing and **filled** only after booking commits.
- Distinguish current ledger balances, estimated market value, declared profile net worth, and demonstration analytics.
- Explain that browsing a crypto/FX instrument does not establish that it can be traded. Current execution is restricted to validated USD instruments.
- Treat prior test totals and screenshots in older documents as historical evidence. This preparation did not rerun the application suites or a live-provider demonstration.
- Discuss team decisions as questions to verify with the actual contributors. Code and documentation cannot establish everyone's individual contribution or meeting history.

Start with [the walkthrough](11-Presentation-Walkthrough.MD) for a 20-minute presentation, or read 01 → 06 → 03 → 04 → 10 for a shorter technical introduction.
