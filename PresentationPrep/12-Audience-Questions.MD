# Audience questions for the presenter

## High-level explanation

Use these questions to rehearse with three audiences: people considering the product, stakeholders considering its value and delivery, and senior developers inspecting the design. Questions include implemented behavior, difficult scenarios, team decisions and work that remains open.

This is a question bank, not a claim that the team has already agreed on all answers. For technical answers, cite a current implementation/test; for business or teamwork answers, confirm the facts with the actual team. Good answers identify a concrete example, the evidence and its limits.

## General public

### Purpose, usability and trust

1. What problem does Tadpoles solve, and who would use it?
2. What does a client do here that they could not do with a simple portfolio spreadsheet?
3. Is the money real, and does clicking Buy send anything to a stock exchange?
4. Where do the prices come from, and how old can they be?
5. Why can I browse an instrument that I cannot buy?
6. What is the difference between cash balance, available cash, Investing value and the net worth I entered?
7. Why do I need to complete onboarding and save a bank reference?
8. Does saving a bank account verify that I own it? Can the project withdraw real money?
9. What does it cost to use the demonstrated buy/sell feature? Are the displayed project fees the same as real-world broker fees?
10. Does an Advisor recommendation automatically buy something for me?
11. What can an Advisor see about me, and can any Advisor access my account?
12. How do I tell which dashboard information is demonstration data?
13. Can I use the app on a narrow screen, with a keyboard or with a screen reader? What has actually been verified?

### Everyday and failure scenarios

14. I clicked Buy but my connection dropped. How do I know whether the order was received?
15. What happens if I click Confirm twice?
16. Why can an accepted order later be rejected?
17. Can the final cost be higher than the estimate? Can I set a maximum price in this version?
18. Why can't I withdraw my entire displayed cash balance while an order is pending?
19. Can I sell more units than I own, or buy fractions of a share?
20. What happens when the market is closed or the price provider stops responding?
21. Why might Investing value be unavailable while my cash balance still displays?
22. If I switch the display currency, does my actual cash change?
23. Who sees my Support message? Can I see private staff notes or Compliance findings?
24. How do I ask about an order, follow the response and reopen the issue?
25. If I sign out while an order is processing, does processing stop?

Useful preparation: [account lifecycle](07-Banking-and-Account-Lifecycle.MD), [trading](03-Buy-and-Sell-Lifecycle.MD), [Support](08-Support-Compliance-and-Evidence.MD), [data meanings](09-Advisory-Valuation-and-Reporting.MD).

## Stakeholders

### Value, scope and delivery

1. What is the core end-to-end outcome delivered by the project?
2. Which capabilities are implemented, which rely on fictitious demo data, and which remain unavailable?
3. Which original requirements are partially delivered, particularly international markets, FX/crypto execution and reporting?
4. Why was the initial execution scope limited to validated USD instruments?
5. Why build separate staff workspaces rather than one administrative dashboard?
6. Which implementation choices reduce financial or privacy mistakes, and what evidence supports those choices?
7. What would have to change before any real bank transfer, exchange order routing or custody integration?
8. What differentiates the delivered Advisor workflow from an order-entry workflow?
9. Which decisions require Finance, data, security or operational owners before production release?
10. What performance, availability and recovery objectives have actually been measured? Which are still undefined?
11. What metrics would indicate a useful product: successful journeys, explained rejections, resolution times, or something else? Which metrics can the project currently produce reliably?
12. How would you prioritize the next release if budget allowed only two improvements?

### Operational scenarios and governance

13. A provider outage occurs during a busy period. Who owns the response, and how are pending orders preserved?
14. An operator applies a full halt. What happens to client exits and already accepted orders?
15. Who may restore a client's trade access, and what attribution is retained?
16. Does assigning a case to a staff member automatically grant access to its evidence?
17. How are private investigation details kept out of public client messages?
18. A mandatory Compliance referral remains undecided. Can Operations resolve the Support case anyway?
19. What exactly does a clean reconciliation report prove, and what does it leave unverified?
20. How would you handle a verified accounting defect without editing immutable records?
21. What is the retention/deletion policy for personal data, cases, exports and financial evidence? Is it implemented or still a policy decision?
22. What happens if a permission is revoked while someone has a page open or an export link saved?
23. How much data could be lost after a backup restore? Does the fixture rehearsal establish a production RPO/RTO?
24. Can we deploy an older application after an upgrade? What is the compatibility and rollback plan?
25. How do we know the presentation environment is running the same artifact described in the documentation?

### Teamwork and project decisions

26. Who owned each feature, and what concrete contributions can each teammate demonstrate?
27. The README says Git-Flow was chosen. How did the team actually use branches, reviews and releases?
28. How were shared contracts and migration numbers coordinated across frontend, backend and database work?
29. Describe a disagreement about architecture or scope. What evidence changed the decision?
30. Which feature changed most after feedback or testing, and why?
31. Where did TDD help the team, and where were regression tests added afterward?
32. How did you avoid one person's UI or schema change breaking another person's work?
33. How were outdated documentation and implementation plans identified and reconciled?
34. What would the team do differently with another iteration?
35. If a key teammate left, which documents, tests and runbooks would enable someone else to operate or extend the project?

Useful preparation: [architecture](01-Project-Architecture.MD), [tests/TDD](04-Test-Suites-and-TDD.MD), [operations and limits](10-Deployment-Operations-and-Limitations.MD). Contribution, budget, ownership and process answers require actual team input; no fabricated answer is supplied here.

## Technical explanation: senior-developer questions

### Architecture and contracts

1. Why MyBatis and explicit SQL rather than JPA? Which tradeoffs are supported by the current implementation?
2. Which modules are separate deployed services, and which are components inside Spring?
3. The frontend uses SSR tooling, but all server routes select client rendering. What is actually rendered on the server?
4. Why does Nginx route `/api/analytics` to Python while Java retains similarly named placeholder routes?
5. How do DTOs, exact decimal strings, `BigDecimal` and PostgreSQL numeric types prevent precision loss? Where do legacy shapes differ?
6. How are UI display rounding and authoritative quantity/price arithmetic kept distinct?
7. Which endpoints are legacy read/administrative paths and which form the current scoped workspace contract?

### Identity and authorization

8. What do “stateless HTTP security” and persisted `auth_sessions` mean together?
9. How are JWT signature, expiry, issuer, audience, role membership, user identity and session revocation checked?
10. What happens to an existing token after the user is disabled or their persisted roles change?
11. What does Angular verify through `/api/users/me`, and when is that verification refreshed?
12. What risks follow from storing access tokens in `localStorage`, and what deployment defenses remain to be reviewed?
13. Why does the refresh route exist while refresh returns `503`? What would a complete rotation/session design require?
14. Python validates tokens independently. Why does Java logout not currently guarantee immediate Analyst API revocation?
15. Which issuer/audience checks are optional in Python, and which variables are actually passed by Compose?
16. How are ADMIN-only, CLIENT+TRADING_OPS and CLIENT+FINANCE identities handled across menus and APIs?
17. Which authorization tests use mocked principals, and which exercise signed tokens and the real decoder?
18. Are assignment restrictions equally enforced by old Advisor APIs and dedicated workspace APIs?

### Trading, transactions and concurrency

19. What exactly does preview commit? Why is preview not a price lock?
20. Why are provider calls outside the client lock? How is a policy change during that call handled?
21. What is the lock order across orders, cash movements and advisory eligibility, and what races does it prevent?
22. How is the request hash canonicalized? Does quantity `2.0` replay the same instruction as `2`?
23. Why does replay look for a retained receipt before quote-fetch/admission-switch checks?
24. What database constraint stops two same-key submissions from producing two accepted orders?
25. How can an execution price exceed the admission reservation without spending another order's hold?
26. Which checks use the accepted policy snapshot and which use current controls at execution?
27. How does a lease's fencing token stop a stale worker from committing after another worker reclaims the job?
28. What happens if the process dies after cash update but before fill/journal/event creation?
29. What if booking commits but the worker loses the response—can retry post again?
30. How are transport retries bounded, and how do they differ from a business-rule rejection?
31. What guarantees do immutable events, unique fills and deferred lifecycle checks provide? What remains application-enforced or reconciliation-checked?
32. Why is the order “stream” polling? How are duplicate versions, cursor gaps, resets, stale connections and exhaustion handled?
33. Does the design support partial fills, cancellations, limit orders or delayed settlement today?
34. How would per-account serialization and polling behave at representative load? Has that been measured?

### Provider and account edge cases

35. Which timestamps and freshness flags must be valid? Why isn't `stale: false` sufficient?
36. How did migration 021 change quote age, and which custom values survive it?
37. What does provider market state `unknown` mean to this code? What happens in 2027 or during an unscheduled closure?
38. Why do quotes use ask for buys/bid for sells while valuation uses provider `price`?
39. Why does current valuation include posted cash and owned units even when they are reserved?
40. How are bank references encrypted and bound to ownership? How would key rotation be implemented and rehearsed?
41. How do deposit caps and concurrent buy/withdrawal requests share the same cash lock?
42. Does the trade-access revocation gate also affect internal funding? Is that intended product behavior?

### Schemas, evidence and workflows

43. Why preserve `client_holdings` and scalar cash metadata when the current writer uses new projections/journals?
44. How are unknown historical balances quarantined instead of being reinterpreted as valid USD?
45. How do fresh snapshots mark represented migrations, and how does the upgrade runner avoid duplicate application?
46. Is the whole migration chain atomic? What happens after a failure partway through it?
47. What does `FreshTradingSchemaTest` compare, and which forms of functional/data parity need other tests?
48. Which protections depend on a restricted runtime login, and what can a privileged database owner still change?
49. Why are journal entries not a complete double-entry general ledger?
50. How do Operations and Compliance scope rows **and counts** before pagination?
51. What invalidates a managed Compliance context after reviewer/version changes?
52. How does required audit failure affect a protected read, workflow command or export?
53. Why are public case version and private workflow version separate?
54. How is checklist evidence revalidated at resolution, and how do mandatory referrals block it?
55. How are advisory history snapshots appended without giving the runtime direct history INSERT permission?
56. Why does recommendation eligibility use posted ownership rather than unreserved units?
57. What does a SHA-256 export digest prove, and what would independently anchored integrity require?

### Reporting and verification

58. What is the authoritative reporting publication/loader design, and which parts are still absent?
59. Which Finance metrics use `recorded_at` and which use `booked_at`? How are inclusive UTC dates converted into SQL bounds?
60. What is the difference between Finance's transaction snapshot timestamp and provider/reporting watermarks?
61. How do report queries avoid adding incompatible currencies or quantity units?
62. What does performance normalized to 100 mean, and why isn't it a verified client return calculation?
63. Why are H2 mapper tests insufficient for PostgreSQL locks, triggers and migrations?
64. How are failure injection, same-key races, stale claims and restricted-runtime mutation denial tested?
65. Which Python tests execute populated report SQL against PostgreSQL? Where is the present coverage gap?
66. Which checks run in Jenkins, and which require explicit separate rehearsal?
67. Are coverage/style/static-analysis checks blocking gates or merely reports/configured tools?
68. What evidence supports a TDD claim beyond the existence of tests?
69. Which production security, performance, accessibility and recovery claims remain unmeasured?

## Cross-audience scenario rehearsal

| Scenario | Public question | Stakeholder question | Senior-developer follow-up |
| --- | --- | --- | --- |
| Lost buy response | “Did I buy it twice?” | “Can we explain and resolve this reliably?” | “Show request-key scope, command hash, uniqueness, replay ordering and recovery tests.” |
| Pending buy then sell-only halt | “Why did my accepted buy fail?” | “Who controlled the change and was it attributable?” | “Show current-side checks at execution, retained policy/audit and reservation release.” |
| Staff access revoked | “Can they still see my details?” | “What is the access-revocation commitment?” | “Compare Java live identity/session/grants, cached browser state, downloads and Python token-only checks.” |
| Required Compliance review unresolved | “Why hasn't my case closed?” | “Who is accountable for the review?” | “Show independent grants, managed binding and resolution preconditions.” |
| Missing provider price | “Where did my Investing total go?” | “Are we displaying misleading wealth?” | “Show UNAVAILABLE/null total, unpriced list and separate committed cash.” |
| Restore from yesterday's backup | “Is my order still there?” | “What data-loss window did we agree to?” | “Separate captured snapshot recovery, post-snapshot writes, immutable archive bytes and PITR infrastructure.” |

For every answer, prepare a short public explanation first, then one concrete technical detail and its source. Use [the evidence map](14-Source-Review-and-Glossary.MD) to find the right file quickly.
