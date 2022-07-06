-- Generated by models.ts. DO NOT EDIT.

PRAGMA foreign_keys = ON;

-- no SQL lint issues

-- enumeration tables
CREATE TABLE IF NOT EXISTS "execution_context" (
    "code" INTEGER PRIMARY KEY,
    "value" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "graph_nature" (
    "code" TEXT PRIMARY KEY,
    "value" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "boundary_nature" (
    "code" TEXT PRIMARY KEY,
    "value" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "asset_risk_type" (
    "code" TEXT PRIMARY KEY,
    "value" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "security_incident_role" (
    "code" TEXT PRIMARY KEY,
    "value" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "party_type" (
    "code" TEXT PRIMARY KEY,
    "value" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "person_type" (
    "code" TEXT PRIMARY KEY,
    "value" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "execution_context" ("code", "value") VALUES (0, 'DEVELOPMENT');
INSERT INTO "execution_context" ("code", "value") VALUES (1, 'TEST');
INSERT INTO "execution_context" ("code", "value") VALUES (2, 'PRODUCTION');

INSERT INTO "graph_nature" ("code", "value") VALUES ('SERVICE', 'Service');
INSERT INTO "graph_nature" ("code", "value") VALUES ('APP', 'Application');

INSERT INTO "boundary_nature" ("code", "value") VALUES ('REGULATORY_TAX_ID', 'Regulatory Tax ID');

INSERT INTO "asset_risk_type" ("code", "value") VALUES ('TYPE1', 'asset risk type 1');
INSERT INTO "asset_risk_type" ("code", "value") VALUES ('TYPE2', 'asset risk type 2');

INSERT INTO "security_incident_role" ("code", "value") VALUES ('PROJECT_MANAGER_TECHNOLOGY', 'Project Manager Technology');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('PROJECT_MANAGER_QUALITY', 'Project Manager Quality');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('PROJECT_MANAGER_DEVOPS', 'Project Manager DevOps');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('ASSOCIATE_MANAGER_TECHNOLOGY', 'Associated Manager Technology');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('ASSOCIATE_MANAGER_QUALITY', 'Associated Manager Technology');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('ASSOCIATE_MANAGER_DEVOPS', 'Associate Manager DevOps');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('SENIOR_LEAD_SOFTWARE_ENGINEER_ARCHITECT', 'Senior Lead Software Engineer Architect');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('LEAD_SOFTWARE_ENGINEER_ARCHITECT', 'Lead Software Engineer Architect');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('SENIOR_LEAD_SOFTWARE_QUALITY_ENGINEER', 'Senior Lead Software Quality Engineer');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('SENIOR_LEAD_SOFTWARE_DEVOPS_ENGINEER', 'Senior Lead Software DevOps Engineer');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('LEAD_SOFTWARE_ENGINEER', 'Lead Software Engineer');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('LEAD_SOFTWARE_QUALITY_ENGINEER', 'Lead Software Quality Engineer');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('LEAD_SOFTWARE_DEVOPS_ENGINEER', 'Lead Software DevOps Engineer');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('LEAD_SYSTEM_NETWORK_ENGINEER', 'Lead System Network Engineer');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('SENIOR_SOFTWARE_ENGINEER', 'Senior Software Engineer');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('SENIOR_SOFTWARE_QUALITY_ENGINEER', 'Senior Software Quality Engineer');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('SOFTWARE_QUALITY_ENGINEER', 'Software Quality Engineer');
INSERT INTO "security_incident_role" ("code", "value") VALUES ('SECURITY_ENGINEER', 'Security Engineer');

INSERT INTO "party_type" ("code", "value") VALUES ('PERSON', 'Person');
INSERT INTO "party_type" ("code", "value") VALUES ('POSITION', 'Position');
INSERT INTO "party_type" ("code", "value") VALUES ('ORGANIZATION', 'Organization');
INSERT INTO "party_type" ("code", "value") VALUES ('USER_LIST', 'User List');
INSERT INTO "party_type" ("code", "value") VALUES ('ACCESS_GROUP', 'Access Group');

INSERT INTO "person_type" ("code", "value") VALUES ('INDIVIDUAL', 'Individual');
INSERT INTO "person_type" ("code", "value") VALUES ('PROFESSIONAL', 'Professional');

-- content tables
CREATE TABLE IF NOT EXISTS "host" (
    "host_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "host_name" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("host_name")
);

CREATE TABLE IF NOT EXISTS "graph" (
    "graph_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "graph_nature_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY("graph_nature_id") REFERENCES "graph_nature"("code")
);

CREATE TABLE IF NOT EXISTS "boundary" (
    "boundary_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "parent_boundary_id" INTEGER,
    "graph_id" INTEGER NOT NULL,
    "boundary_nature_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY("parent_boundary_id") REFERENCES "boundary"("boundary_id"),
    FOREIGN KEY("graph_id") REFERENCES "graph"("graph_id"),
    FOREIGN KEY("boundary_nature_id") REFERENCES "boundary_nature"("code")
);

CREATE TABLE IF NOT EXISTS "host_boundary" (
    "host_boundary_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "host_id" INTEGER NOT NULL,
    "boundary_id" INTEGER NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY("host_id") REFERENCES "host"("host_id"),
    FOREIGN KEY("boundary_id") REFERENCES "boundary"("boundary_id")
);

CREATE TABLE IF NOT EXISTS "raci_matrix" (
    "raci_matrix_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "asset" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "accountable" TEXT NOT NULL,
    "consulted" TEXT NOT NULL,
    "informed" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "asset_risk" (
    "asset_risk_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "asset_risk_type_id" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "threat_event" TEXT NOT NULL,
    "relevance" TEXT NOT NULL,
    "likelihood" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY("asset_risk_type_id") REFERENCES "asset_risk_type"("code")
);

CREATE TABLE IF NOT EXISTS "vulnerability" (
    "vulnerability_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "short_name" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "affected_software" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "patch_availability" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "solutions" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "threat_source" (
    "threat_source_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "threat_source" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "threat_source_type" TEXT NOT NULL,
    "source_of_information" TEXT NOT NULL,
    "capability" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "targeting" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "threat_event" (
    "threat_event_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "threat_event" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "threat_event_type" INTEGER NOT NULL,
    "event_classification" TEXT NOT NULL,
    "source_of_information" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "billing" (
    "billing_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "purpose" TEXT NOT NULL,
    "bill_rate" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "effective_from_date" DATETIME NOT NULL,
    "effective_to_date" TEXT NOT NULL,
    "prorate" INTEGER NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "scheduled_task" (
    "scheduled_task_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "task_date" DATETIME NOT NULL,
    "reminder_date" DATETIME NOT NULL,
    "assigned_to" TEXT NOT NULL,
    "reminder_to" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "timesheet" (
    "timesheet_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "time_hour" INTEGER NOT NULL,
    "timesheet_summary" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "certificate" (
    "certificate_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "certificate_name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "certificate_category" TEXT NOT NULL,
    "certificate_type" TEXT NOT NULL,
    "certificate_authority" TEXT NOT NULL,
    "validity" TEXT NOT NULL,
    "expiration_date" DATETIME NOT NULL,
    "domain_name" TEXT NOT NULL,
    "key_size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "device" (
    "device_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "device_name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "serial_number" TEXT NOT NULL,
    "firmware" TEXT NOT NULL,
    "data_center" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "party" (
    "party_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "party_type" TEXT NOT NULL,
    "party_name" TEXT NOT NULL,
    "record_status_id" INTEGER NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY("party_type") REFERENCES "party_type"("code")
);

CREATE TABLE IF NOT EXISTS "person" (
    "person_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "party_id" INTEGER NOT NULL,
    "person_type" TEXT NOT NULL,
    "person_first_name" TEXT NOT NULL,
    "person_last_name" TEXT NOT NULL,
    "record_status_id" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY("party_id") REFERENCES "party"("party_id"),
    FOREIGN KEY("person_type") REFERENCES "person_type"("code")
);

CREATE TABLE IF NOT EXISTS "organization" (
    "organization_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "party_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "registration_date" DATE NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY("party_id") REFERENCES "party"("party_id")
);

-- no template engine lint issues