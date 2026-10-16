-- Internal demo quotes may follow the provider's ten-minute cache cadence.
-- This widens the policy ceiling only; existing per-instrument limits are preserved.
BEGIN;
ALTER TABLE instrument_trading_policies
    DROP CONSTRAINT instrument_trading_policies_quote_max_age_seconds_check;
ALTER TABLE instrument_trading_policies
    ADD CONSTRAINT instrument_trading_policies_quote_max_age_seconds_check
    CHECK (quote_max_age_seconds BETWEEN 1 AND 600);
INSERT INTO schema_migrations(version) VALUES(9);
COMMIT;
