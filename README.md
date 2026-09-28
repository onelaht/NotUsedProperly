# Implementation Status

## What has been done

- Added full backend support for `ClientHolding`.
- Added full backend support for `ClientTrade`.
- Followed the same project pattern already used by `Client` and `Instrument`:
  - controller
  - service interface
  - service implementation
  - mapper
  - DTOs
  - exceptions
  - tests
- Added holdings endpoints under `/api/clients/{clientId}/holdings`.
- Added trades endpoints under `/api/clients/{clientId}/trades`.
- Added `OrderFillService` to handle trade execution.
- Made order filling transactional so these updates happen together:
  - client holding
  - client cash balance
  - permanent trade record
- Updated `ClientMapper` to support order fill operations like client row locking and cash balance updates.
- Updated `GlobalExceptionHandler` to cover the new holdings and trades not-found cases.
- Added unit tests for controllers, services, and mappers.
- Added an integration test for order fill rollback and commit behavior.
- Added project documentation for:
  - implementation notes
  - high-level backend flow
  - trade POST flow and sequence diagrams
  - high-level architecture diagram

## What should be done next

- Update `docs/api.yaml` so the new holdings, trades, and fill endpoints are fully documented.
- Review database migration handling so schema changes are easier to apply across environments.
- Add stronger business rules where needed, such as:
  - duplicate trade checks
  - trade status transition rules
  - extra validation around dates and prices
- Add audit logging for order fill actions.
- Add authorization checks so only allowed users can create, update, approve, or fill trades.
- Add more integration tests for edge cases, especially:
  - concurrent fills
  - repeat fill attempts
  - inactive instruments
  - invalid client and trade combinations
- Decide whether frontend screens will now consume the new holdings and trades endpoints.
- If needed later, separate cash handling into a dedicated ledger model instead of keeping balance updates only on `Client`.
- Add operational docs for how to run and verify the full flow locally.

## Suggested immediate next step

- First, update `docs/api.yaml` and align the endpoint documentation with the implemented backend behavior.
- Then, add authorization and more transaction edge-case tests around `OrderFillService`.

