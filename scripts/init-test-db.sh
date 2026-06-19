#!/bin/bash
# Runs once on the first start of the Postgres container (docker-entrypoint-initdb.d).
# Creates the test database that the integration tests run against.
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE DATABASE app_test;
  GRANT ALL PRIVILEGES ON DATABASE app_test TO app;
EOSQL
