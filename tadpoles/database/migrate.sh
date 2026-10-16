#!/bin/sh
set -eu
# One psql session owns the deployment lock across every migration.
script=$(mktemp)
trap 'rm -f "$script"' EXIT
cat > "$script" <<'SQL'
\set ON_ERROR_STOP on
SELECT pg_advisory_lock(7414014);
CREATE TABLE IF NOT EXISTS schema_migrations(version integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
SQL
for migration in /migrations/*.sql; do
 version=$(basename "$migration" | cut -d_ -f1 | sed 's/^0*//')
 printf 'SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version=%s) AS applied \\gset\n\\if :applied\n\\else\n\\i %s\nINSERT INTO schema_migrations(version) VALUES(%s) ON CONFLICT DO NOTHING;\n\\endif\n' "$version" "$migration" "$version" >> "$script"
done
printf 'SELECT pg_advisory_unlock(7414014);\n' >> "$script"
psql -f "$script"
