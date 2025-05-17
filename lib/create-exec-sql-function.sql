-- Create a function to execute SQL scripts
CREATE OR REPLACE FUNCTION exec_sql(sql text) RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to create the UUID extension
CREATE OR REPLACE FUNCTION create_uuid_extension() RETURNS void AS $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
