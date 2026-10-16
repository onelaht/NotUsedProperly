-- Reference roles and migration bookkeeping, separate from schema and local demo data.
BEGIN;
INSERT INTO roles(role_name) VALUES('ADMIN'),('ADVISOR'),('CLIENT'),('TRADING_OPS'),('COMPLIANCE'),('ANALYST'),('FINANCE') ON CONFLICT DO NOTHING;
INSERT INTO schema_migrations(version) VALUES(3),(4),(5),(6),(7),(8),(9) ON CONFLICT DO NOTHING;
COMMIT;
