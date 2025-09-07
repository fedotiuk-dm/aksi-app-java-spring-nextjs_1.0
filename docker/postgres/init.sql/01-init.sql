-- PostgreSQL Initialization Script for VPS
-- This script runs on first startup of PostgreSQL container

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create extension for better text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create extension for JSON operations
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create monitoring user for health checks
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'healthcheck') THEN
      CREATE ROLE healthcheck WITH LOGIN PASSWORD 'healthcheck_pass' NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT;
      GRANT CONNECT ON DATABASE aksi_cleaners_db_v5 TO healthcheck;
   END IF;
END
$$;

-- Grant necessary permissions for healthcheck user
GRANT pg_monitor TO healthcheck;

-- Create indexes for better performance
-- Note: Actual table creation is handled by Liquibase migrations

-- Log initialization completion
DO $$
BEGIN
   RAISE NOTICE 'PostgreSQL initialization completed successfully at %', now();
END
$$;
