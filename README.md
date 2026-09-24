# Task and Responsibility

## Goal

When an order is filled, these three things must update as one unit:

1. the client's holding
2. the client's cash balance
3. the permanent trade record

If one fails, all must fail together.

That means this is not just a "save trade" feature. It is one business action that touches multiple pieces of client state and must be wrapped in a single transaction.

---

## What already exists

You said the team has already implemented the Client entity ingress/egress and the related service/controller/repo work.

The current `backend/src/main/java/com/neueda/leap/domain` folder already includes these relevant classes:

- `Client`
- `ClientHolding`
- `ClientTrade`
- `Instrument`
- `AppUser`
- `AuditLog`

There are also other domain classes in the folder, but most of them are not required for this specific requirement.

---

## Short answer: which domain classes are needed

### Must-have domain classes
These are the minimum domain classes needed to fully describe the requirement:

1. `Client`
2. `ClientHolding`
3. `ClientTrade`

### Very likely needed
This one is needed if the order is for a real security, which it almost certainly is:

4. `Instrument`

### Needed only if you want "who executed it" or approval trail in the same flow
These are useful, but not strictly required to satisfy the core business rule:

5. `AppUser`
6. `AuditLog`

---

## Important gap: cash balance is not represented right now

The requirement says the client's **cash balance** must update together with holding and trade record.

But the current `Client` domain object does **not** contain a cash balance field.

File reference:
- `backend/src/main/java/com/neueda/leap/domain/Client.java`

Current fields on `Client`:
- `clientId`
- `clientName`
- `advisorId`
- `modelPortfolioId`
- `createdByUserId`
- `createdAt`

So the current model does **not yet have a place to store cash balance**.

### Minimal way to satisfy the requirement
The smallest change is:

- add a `cashBalance` field to `Client`
- persist it in the `clients` table
- update it in the same transaction as holding and trade status

### Why this is the minimal option
You could create a separate cash ledger table, but that is more work and more moving parts.

Since the requirement only says the cash balance must update together with the holding and trade record, the simplest solution is:

- keep cash on `Client`
- treat `Client` as the source of truth for available cash

That is the smallest design that still satisfies the requirement.

---

## Minimal class set to support the requirement

## 1. `Client`
File:
- `backend/src/main/java/com/neueda/leap/domain/Client.java`

### Why it is needed
This class should hold the client's cash balance.

### Responsibility in this feature
- identify which client the order belongs to
- store the updated cash amount after the fill
- act as the parent business record for the trade and holding updates

### Change needed
Add a field like:
- `cashBalance`

### Dependency notes
`Client` is the root record for the whole flow. Both holding and trade are tied to it by `clientId`.

---

## 2. `ClientHolding`
File:
- `backend/src/main/java/com/neueda/leap/domain/ClientHolding.java`

### Why it is needed
This is where the client's position in the traded instrument is stored.

### Responsibility in this feature
- increase quantity on a buy fill
- decrease quantity on a sell fill
- create a new holding row if the client did not previously hold that instrument
- update `asOfDate` for the new state

### Dependency notes
`ClientHolding` depends on:
- `Client` through `clientId`
- `Instrument` through `instrumentId`

This class represents the "what the client owns" part of the requirement.

---

## 3. `ClientTrade`
File:
- `backend/src/main/java/com/neueda/leap/domain/ClientTrade.java`

### Why it is needed
This is the permanent trade record mentioned in the business requirement.

### Responsibility in this feature
- store the order/trade details
- track whether the trade is pending, approved, rejected, or executed
- record `executedAt` when the fill happens
- preserve the final historical record even after holdings and cash move

### Dependency notes
`ClientTrade` depends on:
- `Client` through `clientId`
- `Instrument` through `instrumentId`
- optionally `AppUser` through `submittedByUserId` and `approvedByUserId`

This class is the "proof that the fill happened" record.

---

## 4. `Instrument`
File:
- `backend/src/main/java/com/neueda/leap/domain/Instrument.java`

### Why it is needed
A trade and a holding both point to an instrument.

### Responsibility in this feature
- identify which security was traded
- connect holding updates and trade history to the same instrument
- help validate whether the instrument is active and tradable

### Dependency notes
This is a reference class, not the main state-changing class in the flow.

It is needed because both:
- `ClientHolding.instrumentId`
- `ClientTrade.instrumentId`

must refer to the same thing.

---

## Optional but useful classes

## 5. `AppUser`
File:
- `backend/src/main/java/com/neueda/leap/domain/AppUser.java`

### Why it may be needed
If you want to capture who submitted, approved, or executed the trade, this class matters.

### Responsibility in this feature
- identify the user behind `submittedByUserId`
- identify the user behind `approvedByUserId`
- support permission rules around execution

### Is it required for the core requirement?
No, not for the all-or-nothing update itself.

It is only needed if the workflow includes:
- approval
- execution by a staff user
- audit trail tied to a user

---

## 6. `AuditLog`
File:
- `backend/src/main/java/com/neueda/leap/domain/AuditLog.java`

### Why it may be needed
If the team wants a trace showing that a trade fill changed cash, holdings, and trade status, this is useful.

### Responsibility in this feature
- record that a fill event happened
- record old and new values if needed
- support later investigation

### Is it required for the core requirement?
No.

It helps observability and traceability, but the business requirement can still be satisfied without it.

If it is added, it should be saved inside the same transaction as the other updates.

---

## Classes that are not needed for this requirement

These classes are not part of the minimal solution for "filled order updates holding + cash + trade record together":

- `Advisor`
- `ClientSubscription`
- `ModelPortfolio`
- `ModelPortfolioHolding`
- `TradeSuggestion`
- `RefreshToken`
- `Role`

### Why they are out of scope
They support:
- advisor assignment
- model portfolio setup
- suggested trades
- login/security/session handling

They do not directly control the three-way update required when an order is filled.

---

## Dependency chain

Here is the cleanest dependency chain for this feature.

### Core chain
`ClientTrade` -> `Client`  
`ClientTrade` -> `Instrument`  
`ClientHolding` -> `Client`  
`ClientHolding` -> `Instrument`

### Business update chain during a fill
1. Start from a trade to be filled
2. Read the `ClientTrade`
3. Use `clientId` to load the `Client`
4. Use `instrumentId` to load or create the matching `ClientHolding`
5. Apply these updates together:
   - update trade status to executed
   - update client cash balance
   - update client holding quantity
6. commit once

### Plain-English dependency view
- `ClientTrade` tells us **what happened**
- `ClientHolding` shows **what the client owns after it happened**
- `Client` holds **the client's cash after it happened**
- `Instrument` ties the trade and holding to the same asset

---

## The missing business object: cash balance

Right now there is no separate domain object for cash and no cash field shown on `Client`.

That creates a design decision.

## Recommended minimal decision
Keep cash balance on `Client`.

### Why this is best for now
- smallest code change
- lowest team overlap
- no extra table needed
- simple transaction boundary
- directly supports the requirement

## Alternative, but bigger, design
Create something like:
- `ClientCashBalance`
- or `CashLedger`

That would be better for future accounting detail, but it is **not minimal**.

---

## Recommended implementation shape

To satisfy the business rule safely, the real unit of work should not live inside the plain domain classes.

It should live in a transaction-based service, something like:

- `TradeExecutionService`
- or `OrderFillService`

### That service should do all three updates together
1. validate the trade can be filled
2. load client
3. load holding
4. calculate cash impact
5. calculate quantity impact
6. update trade record
7. update holding
8. update client cash balance
9. save all in one transaction

### Important note
The domain classes alone do not enforce all-or-nothing behavior.

The all-or-nothing behavior comes from:
- one application service
- one database transaction
- one commit at the end

So the domain classes define the data, but the service layer enforces the rule.

---

## Suggested work split for multiple developers

The goal is low overlap.

## Dev 1 - Client cash balance
### Owns
- `Client`
- client mapper/repo updates
- database change to support cash balance

### Tasks
- add `cashBalance` to `Client`
- update SQL schema / mapper definitions
- make sure the client read/write path includes cash

### Overlap risk
Low, as long as this dev only touches client cash fields.

---

## Dev 2 - Holdings update logic
### Owns
- `ClientHolding`
- holding mapper/repo
- holding quantity adjustment logic

### Tasks
- load current holding by `clientId + instrumentId`
- create holding if none exists for a buy
- increase or decrease quantity correctly
- prevent invalid negative holdings

### Overlap risk
Low, because this is isolated to holdings data and calculations.

---

## Dev 3 - Trade execution record
### Owns
- `ClientTrade`
- trade mapper/repo
- trade status transition rules

### Tasks
- define allowed state changes like:
  - `PENDING -> APPROVED`
  - `APPROVED -> EXECUTED`
- set `executedAt`
- preserve permanent trade history

### Overlap risk
Low, because this focuses on trade record behavior only.

---

## Dev 4 - Transaction orchestration service
### Owns
- the fill/execution service
- transaction boundary
- coordination between client, holdings, and trade writes

### Tasks
- call client, holding, and trade data access in one transaction
- ensure partial update cannot commit
- centralize fill logic
- return a clear success/failure result

### Overlap risk
Medium if others also change service logic.

### How to reduce overlap
Make this dev the only person responsible for the orchestration service.

---

## Dev 5 - Validation and tests
### Owns
- integration tests
- failure tests
- rollback tests

### Tasks
- verify a successful fill updates all 3 pieces
- verify a failure in holding update prevents cash/trade commit
- verify a failure in cash update prevents holding/trade commit
- verify a failure in trade save prevents holding/cash commit

### Overlap risk
Very low.

This is a strong standalone ownership area.

---

## Lowest-overlap team split

If you want the cleanest split, use this:

1. **Data model owner**
   - `Client` cash balance field
   - schema and mapper updates

2. **Holdings owner**
   - `ClientHolding`
   - quantity update rules

3. **Trade owner**
   - `ClientTrade`
   - execution status rules

4. **Execution-flow owner**
   - transaction service
   - one business method that ties all writes together

5. **Test owner**
   - rollback tests
   - integration tests

This gives each person a narrow area and avoids many merge conflicts.

---

## Minimal final answer

To fully specify the stated requirement with the smallest possible scope, the domain classes you need are:

### Required
- `Client`
- `ClientHolding`
- `ClientTrade`
- `Instrument`

### Optional but useful
- `AppUser`
- `AuditLog`

### Not currently represented but required by the business rule
- a **cash balance field**, best added to `Client`

---

## Final recommendation

If the goal is the smallest implementation that still honestly satisfies the requirement:

1. add `cashBalance` to `Client`
2. use `ClientHolding` for position updates
3. use `ClientTrade` as the permanent trade record
4. use `Instrument` as the shared trade/holding reference
5. implement one transaction-based service that updates all three together

That is the minimal design that matches the requirement without pulling unrelated classes into the work.

---
