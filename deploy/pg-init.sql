-- Runs once on first Postgres init (docker-entrypoint-initdb.d).
-- anchordb is created by POSTGRES_DB; add the other three databases the connected
-- platform needs. Owner = the POSTGRES_USER ('anchor').
CREATE DATABASE controldb;
CREATE DATABASE platformdb;
CREATE DATABASE aggregatordb;
