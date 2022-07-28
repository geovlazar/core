import {
  path,
  rflSQLa as SQLa,
  rflSqlDiagram as sqlD,
  rflSqlOsQuery as osQ,
} from "./deps.ts";
import * as govn from "./governance.ts";
import { enumTableDefnOptions, tableName } from "./governance.ts";

// TODO:
// - [ ] increase number of enums for proper typing of lookups
// - [ ] strongly type all text to ints/date/etc. where necessary
// - [ ] convert relevant legacy Opsfolio Drupal CTVs to SQLa entities
// - [ ] convert relevant legacy IGS Operations Portfolio Specification (OPS) repo models to SQLa entities
// - [ ] need to enhance all enums and models as per UDM

export enum ExecutionContext {
  DEVELOPMENT,
  TEST,
  PRODUCTION,
}

export enum OrganizationRoleType {
  PROJECT_MANAGER_TECHNOLOGY = "Project Manager Technology",
  PROJECT_MANAGER_QUALITY = "Project Manager Quality",
  PROJECT_MANAGER_DEVOPS = "Project Manager DevOps",
  ASSOCIATE_MANAGER_TECHNOLOGY = "Associated Manager Technology",
  ASSOCIATE_MANAGER_QUALITY = "Associated Manager Technology",
  ASSOCIATE_MANAGER_DEVOPS = "Associate Manager DevOps",
  SENIOR_LEAD_SOFTWARE_ENGINEER_ARCHITECT =
    "Senior Lead Software Engineer Architect",
  LEAD_SOFTWARE_ENGINEER_ARCHITECT = "Lead Software Engineer Architect",
  SENIOR_LEAD_SOFTWARE_QUALITY_ENGINEER =
    "Senior Lead Software Quality Engineer",
  SENIOR_LEAD_SOFTWARE_DEVOPS_ENGINEER = "Senior Lead Software DevOps Engineer",
  LEAD_SOFTWARE_ENGINEER = "Lead Software Engineer",
  LEAD_SOFTWARE_QUALITY_ENGINEER = "Lead Software Quality Engineer",
  LEAD_SOFTWARE_DEVOPS_ENGINEER = "Lead Software DevOps Engineer",
  LEAD_SYSTEM_NETWORK_ENGINEER = "Lead System Network Engineer",
  SENIOR_SOFTWARE_ENGINEER = "Senior Software Engineer",
  SENIOR_SOFTWARE_QUALITY_ENGINEER = "Senior Software Quality Engineer",
  SOFTWARE_QUALITY_ENGINEER = "Software Quality Engineer",
  SECURITY_ENGINEER = "Security Engineer",
}

export enum PartyType {
  PERSON = "Person",
  ORGANIZATION = "Organization",
}

/**
 * Reference URL: https://docs.oracle.com/cd/E29633_01/CDMRF/GUID-F52E49F4-AE6F-4FF5-8EEB-8366A66AF7E9.htm
 */

export enum PartyRole {
  CUSTOMER = "Customer",
  VENDOR = "Vendor",
}

/**
 * Reference URL: https://docs.oracle.com/cd/E63029_01/books/Secur/secur_accesscontrol022.htm
 */

export enum PartyRelationType {
  PERSON_TO_PERSON = "Person To Person",
  ORGANIZATION_TO_PERSON = "Organization To Person",
  ORGANIZATION_TO_ORGANIZATION = "Organization To Organization",
}

export enum PartyIdentifierType {
  UUID = "UUID",
  DRIVING_LICENSE = "Driving License",
  PASSPORT = "Passport",
}

export enum PersonType {
  INDIVIDUAL = "Individual",
  PROFESSIONAL = "Professional",
}

export enum ContactType {
  HOME_ADDRESS = "Home Address",
  OFFICIAL_ADDRESS = "Official Address",
  MOBILE_PHONE_NUMBER = "Mobile Phone Number",
  LAND_PHONE_NUMBER = "Land Phone Number",
  OFFICIAL_EMAIL = "Official Email",
  PERSONAL_EMAIL = "Personal Email",
}

export enum TrainingSubject {
  HIPPA = "HIPPA",
}

export enum StatusValues {
  YES = "Yes",
  NO = "No",
}

/**
 * Reference URL: https://schema.org/ratingValue
 */

export enum RatingValue {
  ONE = "1",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
}

export enum ContractType {
  GENERAL_CONTRACT_FOR_SERVICES = "General Contract for Services",
  EMPLOYMENT_AGREEMENT = "Employment Agreement",
  NONCOMPETE_AGREEMENT = "Noncompete Agreement",
  VENDOR_SLA = "Vendor SLA",
  VENDOR_NDA = "Vendor NDA",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/enum_project_risk_type_enum.html
 */

export enum RiskType {
  BUDGET = "Budget",
  QUALITY = "Quality",
  SCHEDULE = "Schedule",
  SCHEDULE_AND_BUDGET = "Schedule And Budget",
}

export enum SeverityType {
  CRITICAL = "Critical",
  MAJOR = "Major",
  MINOR = "Minor",
  LOW = "Low",
}

export enum PriorityType {
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */

export enum IncidentCategory {
  ACCESS = "Access",
  DATA = "Data",
  FACILITIES = "Facilities",
  FAILURE = "Failure",
  GENERAL_INFORMATION = "General Information",
  HARDWARE = "Hardware",
  HOW_TO = "How To",
  OTHER = "Other",
  PERFORMANCE = "Performance",
  SECURITY = "Security",
  SERVICE_DELIVERY = "Service Delivery",
  SERVICE_PORTFOLIO = "Service Portfolio",
  STATUS = "Status",
  SUPPORT = "Support",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */
export enum IncidentSubCategory {
  AUTHORIZATION_ERROR = "Authorization Error",
  AVAILABILITY = "Availability",
  DATA_OR_FILE_CORRUPTED = "Data Or File Corrupted",
  DATA_OR_FILE_INCORRECT = "Data Or File Incorrect",
  DATA_OR_FILE_MISSING = "Data Or File Missing",
  ERROR_MESSAGE = "Error Message",
  FUNCTION_OR_FEATURE_NOT_WORKING = "Function Or Feature Not Working",
  FUNCTIONALITY = "Functionality",
  GENERAL_INFORMATION = "General Information",
  HARDWARE_FAILURE = "Hardware Failure",
  HOW_TO = "How To",
  INCIDENT_RESOLUTION_QUALITY = "Incident Resolution Quality",
  INCIDENT_RESOLUTION_TIME = "Incident Resolution Time",
  JOB_FAILED = "Job Failed",
  LOGIN_FAILURE = "Login Failure",
  MISSING_OR_STOLEN = "Missing Or Stolen",
  NEW_SERVICE = "New Service",
  PERFORMANCE = "Performance",
  PERFORMANCE_DEGRADATION = "Performance Degradation",
  PERSON = "Person",
  SECURITY_BREACH = "Security Breach",
  SECURITY_EVENT = "Security Event/Message",
  STATUS = "Status",
  STORAGE_LIMIT_EXCEEDED = "Storage Limit Exceeded",
  SYSTEM_DOWN = "System Down",
  SYSTEM_OR_APPLICATION_HANGS = "System Or Application Hangs",
  UPGRADE_NEW_RELEASE = "Upgrade/New Release",
  VIRUS_ALERT = "Virus Alert",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */
export enum IncidentType {
  COMPLAINT = "Complaint",
  INCIDENT = "Incident",
  REQUEST_FOR_INFORMATION = "Request For Information",
}

/**
 * Reference URL:https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */
export enum IncidentStatus {
  ACCEPTED = "Accepted",
  ASSIGNED = "Assigned",
  CANCELLED = "Cancelled",
  CATEGORIZE = "Categorize",
  CLOSED = "Closed",
  OPEN = "Open",
  PENDING_CHANGE = "Pending Change",
  PENDING_CUSTOMER = "Pending Customer",
  PENDING_EVIDENCE = "Pending Evidence",
  PENDING_OTHER = "Pending Other",
  PENDING_VENDOR = "Pending Vendor",
  REFERRED = "Referred",
  REJECTED = "Rejected",
  REOPENED = "Reopened",
  REPLACED_PROBLEM = "Replaced Problem",
  RESOLVED = "Resolved",
  SUSPENDED = "Suspended",
  WORK_IN_PROGRESS = "Work In Progress",
}

export enum RiskSubject {
  TECHNICAL_RISK = "Technical Risk",
}

export enum AssetRiskType {
  TYPE1 = "asset risk type 1",
  TYPE2 = "asset risk type 2",
}

export enum GraphNature {
  SERVICE = "Service",
  APP = "Application",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/enum_contract_status_enum.html
 */

export enum ContractStatus {
  ACTIVE = "Active",
  AWAITING_APPROVAL = "Awaiting Approval",
  AWAITING_APPROVAL_FOR_RENEWAL = "Awaiting Approval For Renewal",
  CANCELED = "Canceled",
  DENIED = "Denied",
  FINISHED = "Finished",
  IN_PREPARATION = "In Preparation",
  QUOTE_REQUESTED = "Quote Requested",
  QUOTED = "Quoted",
  STANDARD_CONTRACT = "Standard Contract",
  SUSPENDED = "Suspended",
  VALIDATED = "Validated",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/enum_payment_type_enum.html
 */

export enum PaymentType {
  BOTH = "Both",
  LOANS = "Loans",
  NONE = "None",
  RENTS = "Rents",
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */

export enum Periodicity {
  ANNUAL = "Annual",
  BI_MONTHLY = "Bi Monthly",
  BI_WEEKLY = "Bi Weekly",
  DAILY = "Daily",
  MONTHLY = "Monthly",
  OTHER = "Other",
  QUARTERLY = "Quarterly",
  SEMI_ANNUAL = "Semi Annual",
  SEMI_MONTHLY = "Semi Monthly",
  WEEKLY = "Weekly",
}

export enum BoundaryNature {
  REGULATORY_TAX_ID = "Regulatory Tax ID", // like an "official" company (something with a Tax ID)
}

/**
 * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
 */

export enum TimeEntryCategory {
  MISC_MEETINGS = "Misc Meetings",
  MISC_OTHER = "Misc Other",
  MISC_VACATION = "Misc Vacation",
  MISC_WORK_ITEM = "Misc Work Item",
  PACKAGE = "Package",
  PROJECT = "Project",
  REQUEST = "Request",
  TASK = "Task",
}

export enum RaciMatrixSubject {
  PROJECT_LEADERSHIP = "Project Leadership",
  PROJECT_MANAGEMENT = "Project Management",
  APPLICATION_DEVELOPMENT = "Application Development",
  DEV_OPERATIONS = "Dev Operations",
  QUALITY_ASSURANCE = "Quality Assurance",
  SEARCH_ENGINE_OPTIMIZATION = "Search Engine Optimization",
  USER_INTERFASE_USABILITY = "User Interfase And Usability",
  BUSINESS_ANALYST = "Business Analyst (Abm)",
  CURATION_COORDINATION = "Curation Coordination",
  KNOWLEDGE_REPRESENTATION = "Knowledge Representation",
  MARKETING_OUTREACH = "Marketing Outreach",
  CURATION_WORKS = "Curation Works",
}

/**
 * Reference URL: https://advisera.com/27001academy/blog/2018/11/05/raci-matrix-for-iso-27001-implementation-project/
 */

export enum RaciMatrixAssignmentNature {
  RESPONSIBLE = "Responsible",
  ACCOUNTABLE = "Accountable",
  CONSULTED = "Consulted",
  INFORMED = "Informed",
}

// TODO:
// - [ ] Need to update it to the standard way with the skill registry url

export enum SkillNature {
  SOFTWARE = "Software",
  HARDWARE = "Hardware",
}

export enum Skill {
  ANGULAR = "Angular",
  DENO = "Deno",
  TYPESCRIPT = "Typescript",
  POSTGRESQL = "Postgresql",
  MYSQL = "Mysql",
  HUGO = "Hugo",
  PHP = "Php",
  JAVASCRIPT = "JavaScript",
  PYTHON = "Python",
  DOT_NET = ".Net",
  ORACLE = "Oracle",
  JAVA = "Java",
  JQUERY = "JQuery",
  OSQUERY = "Osquery",
  REACTJS = "ReactJs",
}

export function enumerations<Context extends SQLa.SqlEmitContext>(
  ddlOptions: SQLa.SqlTextSupplierOptions<Context> & {
    readonly sqlNS?: SQLa.SqlNamespaceSupplier;
  },
) {
  const mg = govn.typicalModelsGovn(ddlOptions);
  const execCtx = mg.enumTable(
    tableName("execution_context"),
    ExecutionContext,
    enumTableDefnOptions,
  );

  const graphNature = mg.enumTextTable(
    tableName("graph_nature"),
    GraphNature,
    enumTableDefnOptions,
  );

  const boundaryNature = mg.enumTextTable(
    tableName("boundary_nature"),
    BoundaryNature,
    enumTableDefnOptions,
  );

  const assetRiskType = mg.enumTextTable(
    tableName("asset_risk_type"),
    AssetRiskType,
    enumTableDefnOptions,
  );

  const organizationRoleType = mg.enumTextTable(
    tableName("organization_role_type"),
    OrganizationRoleType,
    enumTableDefnOptions,
  );

  const partyType = mg.enumTextTable(
    tableName("party_type"),
    PartyType,
    enumTableDefnOptions,
  );

  const partyIdentifierType = mg.enumTextTable(
    tableName("party_identifier_type"),
    PartyIdentifierType,
    enumTableDefnOptions,
  );

  const personType = mg.enumTextTable(
    tableName("person_type"),
    PersonType,
    enumTableDefnOptions,
  );

  const contactType = mg.enumTextTable(
    tableName("contact_type"),
    ContactType,
    enumTableDefnOptions,
  );

  const trainingSubject = mg.enumTextTable(
    tableName("training_subject"),
    TrainingSubject,
    enumTableDefnOptions,
  );

  const statusValues = mg.enumTextTable(
    tableName("status_value"),
    StatusValues,
    enumTableDefnOptions,
  );

  const partyRelationType = mg.enumTextTable(
    tableName("party_relation_type"),
    PartyRelationType,
    enumTableDefnOptions,
  );

  const ratingValue = mg.enumTextTable(
    tableName("rating_value"),
    RatingValue,
    enumTableDefnOptions,
  );

  const contractType = mg.enumTextTable(
    tableName("contract_type"),
    ContractType,
    enumTableDefnOptions,
  );

  const riskType = mg.enumTextTable(
    tableName("risk_type"),
    RiskType,
    enumTableDefnOptions,
  );

  const severityType = mg.enumTextTable(
    tableName("severity_type"),
    SeverityType,
    enumTableDefnOptions,
  );

  const priorityType = mg.enumTextTable(
    tableName("priority_type"),
    PriorityType,
    enumTableDefnOptions,
  );

  const incidentType = mg.enumTextTable(
    tableName("incident_type"),
    IncidentType,
    enumTableDefnOptions,
  );

  const incidentStatus = mg.enumTextTable(
    tableName("incident_status"),
    IncidentStatus,
    enumTableDefnOptions,
  );

  const incidentCategory = mg.enumTextTable(
    tableName("incident_category"),
    IncidentCategory,
    enumTableDefnOptions,
  );

  const incidentSubCategory = mg.enumTextTable(
    tableName("incident_sub_category"),
    IncidentSubCategory,
    enumTableDefnOptions,
  );

  const riskSubject = mg.enumTextTable(
    tableName("risk_subject"),
    RiskSubject,
    enumTableDefnOptions,
  );

  const partyRole = mg.enumTextTable(
    tableName("party_role_type"),
    PartyRole,
    enumTableDefnOptions,
  );

  const contractStatus = mg.enumTextTable(
    tableName("contract_status"),
    ContractStatus,
    enumTableDefnOptions,
  );

  const paymentType = mg.enumTextTable(
    tableName("payment_type"),
    PaymentType,
    enumTableDefnOptions,
  );

  const periodicity = mg.enumTextTable(
    tableName("periodicity"),
    Periodicity,
    enumTableDefnOptions,
  );

  const timeEntryCategory = mg.enumTextTable(
    tableName("time_entry_category"),
    TimeEntryCategory,
    enumTableDefnOptions,
  );

  const raciMatrixSubject = mg.enumTextTable(
    tableName("raci_matrix_subject"),
    RaciMatrixSubject,
    enumTableDefnOptions,
  );

  const raciMatrixAssignmentNature = mg.enumTextTable(
    tableName("raci_matrix_assignment_nature"),
    RaciMatrixAssignmentNature,
    enumTableDefnOptions,
  );

  const skillNature = mg.enumTextTable(
    tableName("skill_nature"),
    SkillNature,
    enumTableDefnOptions,
  );

  const skill = mg.enumTextTable(
    tableName("skill"),
    Skill,
    enumTableDefnOptions,
  );

  // deno-fmt-ignore
  const seedDDL = mg.prepareSeedDDL`
      ${execCtx}

      ${graphNature}

      ${boundaryNature}

      ${assetRiskType}

      ${organizationRoleType}

      ${partyType}

      ${partyIdentifierType}

      ${personType}

      ${contactType}

      ${trainingSubject}

      ${statusValues}

      ${partyRelationType}

      ${govn.recordStatus}

      ${ratingValue}

      ${contractType}

      ${riskType}

      ${severityType}

      ${priorityType}

      ${incidentType}

      ${incidentStatus}

      ${incidentCategory}

      ${incidentSubCategory}

      ${riskSubject}

      ${partyRole}

      ${contractStatus}

      ${paymentType}

      ${periodicity}

      ${timeEntryCategory}

      ${raciMatrixSubject}

      ${raciMatrixAssignmentNature}

      ${skill}

      ${skillNature}

      ${execCtx.seedDML}

      ${graphNature.seedDML}

      ${boundaryNature.seedDML}

      ${assetRiskType.seedDML}

      ${organizationRoleType.seedDML}

      ${partyType.seedDML}

      ${personType.seedDML}

      ${partyIdentifierType.seedDML}

      ${contactType.seedDML}

      ${trainingSubject.seedDML}

      ${statusValues.seedDML}

      ${partyRelationType.seedDML}

      ${govn.recordStatus.seedDML}

      ${ratingValue.seedDML}

      ${contractType.seedDML}

      ${riskType.seedDML}

      ${severityType.seedDML}

      ${priorityType.seedDML}

      ${incidentType.seedDML}

      ${incidentStatus.seedDML}

      ${incidentCategory.seedDML}

      ${incidentSubCategory.seedDML}

      ${riskSubject.seedDML}

      ${partyRole.seedDML}

      ${contractStatus.seedDML}

      ${paymentType.seedDML}

      ${periodicity.seedDML}

      ${timeEntryCategory.seedDML}

      ${raciMatrixSubject.seedDML}

      ${raciMatrixAssignmentNature.seedDML}

      ${skill.seedDML}

      ${skillNature.seedDML}`;

  return {
    modelsGovn: mg,
    execCtx,
    graphNature,
    boundaryNature,
    assetRiskType,
    organizationRoleType,
    partyType,
    partyIdentifierType,
    personType,
    contactType,
    partyRelationType,
    recordStatus: govn.recordStatus,
    trainingSubject,
    statusValues,
    ratingValue,
    contractType,
    riskType,
    severityType,
    priorityType,
    incidentType,
    incidentStatus,
    incidentCategory,
    incidentSubCategory,
    riskSubject,
    partyRole,
    contractStatus,
    paymentType,
    periodicity,
    timeEntryCategory,
    raciMatrixSubject,
    raciMatrixAssignmentNature,
    skill,
    skillNature,
    seedDDL,
    exposeATC: [
      execCtx,
      assetRiskType,
      organizationRoleType,
      partyType,
      partyIdentifierType,
      personType,
      contactType,
      partyRelationType,
      govn.recordStatus,
      trainingSubject,
      statusValues,
      ratingValue,
      contractType,
      riskType,
      severityType,
      priorityType,
      incidentType,
      incidentStatus,
      incidentCategory,
      incidentSubCategory,
      riskSubject,
      partyRole,
      contractStatus,
      paymentType,
      periodicity,
      timeEntryCategory,
      raciMatrixSubject,
      raciMatrixAssignmentNature,
      skillNature,
      skill,
    ],
  };
}

export function entities<Context extends SQLa.SqlEmitContext>(
  ddlOptions: SQLa.SqlTextSupplierOptions<Context> & {
    readonly sqlNS?: SQLa.SqlNamespaceSupplier;
  },
) {
  const mg = govn.typicalModelsGovn(ddlOptions);
  const mgd = mg.domains;
  const enums = enumerations(ddlOptions);

  const graph = mg.table(tableName("graph"), {
    graph_id: mg.primaryKey(),
    graph_nature_id: enums.graphNature.foreignKeyRef.code(),
    name: mgd.text(),
    description: mgd.textNullable(),
    ...mg.housekeeping(),
  });

  const boundaryId = mg.primaryKey();
  const boundary = mg.table(tableName("boundary"), {
    boundary_id: boundaryId,
    parent_boundary_id: SQLa.selfRefForeignKeyNullable(boundaryId),
    graph_id: graph.foreignKeyRef.graph_id(),
    boundary_nature_id: enums.boundaryNature.foreignKeyRef.code(),
    name: mgd.text(),
    ...mg.housekeeping(),
  });

  const host = mg.table(tableName("host"), {
    host_id: mg.primaryKey(),
    host_name: { ...mgd.text(), isUnique: true },
    ...mg.housekeeping(),
  });

  const hostBoundary = mg.table(tableName("host_boundary"), {
    host_boundary_id: mg.primaryKey(),
    host_id: host.foreignKeyRef.host_id(),
    boundary_id: boundary.foreignKeyRef.boundary_id(),
    ...mg.housekeeping(),
  });

  const raciMatrix = mg.table(tableName("raci_matrix"), {
    raci_matrix_id: mg.primaryKey(),
    asset: mgd.text(),
    responsible: mgd.text(),
    accountable: mgd.text(),
    consulted: mgd.text(),
    informed: mgd.text(),
    ...mg.housekeeping(),
  });

  const raciMatrixSubjectBoundary = mg.table(
    tableName("raci_matrix_subject_boundary"),
    {
      raci_matrix_subject_boundary_id: mg.primaryKey(),
      boundary_id: boundary.foreignKeyRef.boundary_id(),
      raci_matrix_subject_id: enums.raciMatrixSubject.foreignKeyRef.code(),
      ...mg.housekeeping(),
    },
  );

  const raciMatrixActivity = mg.table(
    tableName("raci_matrix_activity"),
    {
      raci_matrix_activity_id: mg.primaryKey(),
      activity: mgd.text(),
      ...mg.housekeeping(),
    },
  );

  const assetRisk = mg.table(tableName("asset_risk"), {
    asset_risk_id: mg.primaryKey(),
    asset_risk_type_id: enums.assetRiskType.foreignKeyRef.code(),
    asset: mgd.text(),
    threat_event: mgd.text(),
    relevance: mgd.text(),
    likelihood: mgd.text(),
    impact: mgd.text(),
    ...mg.housekeeping(),
  });

  const vulnerability = mg.table(tableName("vulnerability"), {
    vulnerability_id: mg.primaryKey(),
    short_name: mgd.text(),
    source: mgd.text(),
    affected_software: mgd.text(),
    reference: mgd.text(),
    status: mgd.text(),
    patch_availability: mgd.text(),
    severity: mgd.text(),
    solutions: mgd.text(),
    tags: mgd.text(),
    description: mgd.text(),
    ...mg.housekeeping(),
  });

  const threatSource = mg.table(tableName("threat_source"), {
    threat_source_id: mg.primaryKey(),
    threat_source: mgd.text(),
    identifier: mgd.text(),
    threat_source_type: mgd.text(),
    source_of_information: mgd.text(),
    capability: mgd.text(),
    intent: mgd.text(),
    targeting: mgd.text(),
    description: mgd.text(),
    ...mg.housekeeping(),
  });

  const threatEvent = mg.table(tableName("threat_event"), {
    threat_event_id: mg.primaryKey(),
    threat_event: mgd.text(),
    identifier: mgd.text(),
    threat_event_type: mgd.integer(),
    event_classification: mgd.text(),
    source_of_information: mgd.text(),
    description: mgd.text(),
    ...mg.housekeeping(),
  });

  const billing = mg.table(tableName("billing"), {
    billing_id: mg.primaryKey(),
    purpose: mgd.text(),
    bill_rate: mgd.text(),
    period: mgd.text(),
    effective_from_date: mgd.dateTime(),
    effective_to_date: mgd.text(),
    prorate: mgd.integer(),
    ...mg.housekeeping(),
  });

  const scheduledTask = mg.table(tableName("scheduled_task"), {
    scheduled_task_id: mg.primaryKey(),
    description: mgd.text(),
    task_date: mgd.dateTime(),
    reminder_date: mgd.dateTime(),
    assigned_to: mgd.text(),
    reminder_to: mgd.text(),
    ...mg.housekeeping(),
  });

  /**
   * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
   */
  const timesheet = mg.table(tableName("timesheet"), {
    timesheet_id: mg.primaryKey(),
    date_of_work: mgd.dateTime(),
    is_billable_id: enums.statusValues.foreignKeyRef.code(),
    number_of_hours: mgd.integer(),
    time_entry_category_id: enums.timeEntryCategory.foreignKeyRef.code(),
    timesheet_summary: mgd.text(),
    ...mg.housekeeping(),
  });

  const certificate = mg.table(tableName("certificate"), {
    certificate_id: mg.primaryKey(),
    certificate_name: mgd.text(),
    short_name: mgd.text(),
    certificate_category: mgd.text(),
    certificate_type: mgd.text(),
    certificate_authority: mgd.text(),
    validity: mgd.text(),
    expiration_date: mgd.dateTime(),
    domain_name: mgd.text(),
    key_size: mgd.integer(),
    path: mgd.text(),
    ...mg.housekeeping(),
  });

  const device = mg.table(tableName("device"), {
    device_id: mg.primaryKey(),
    device_name: mgd.text(),
    short_name: mgd.text(),
    barcode: mgd.text(),
    model: mgd.text(),
    serial_number: mgd.text(),
    firmware: mgd.text(),
    data_center: mgd.text(),
    location: mgd.text(),
    purpose: mgd.text(),
    description: mgd.text(),
    ...mg.housekeeping(),
  });

  const party = mg.table(tableName("party"), {
    party_id: mg.primaryKey(),
    party_type_id: enums.partyType.foreignKeyRef.code(),
    party_name: mgd.text(),
    ...mg.housekeeping(),
  });

  /**
   * Reference URL: https://help.salesforce.com/s/articleView?id=sf.c360_a_partyidentification_object.htm&type=5
   */
  const partyIdentifier = mg.table(tableName("party_identifier"), {
    party_identifier_id: mg.primaryKey(),
    identifier_number: mgd.text(),
    party_identifier_type_id: enums.partyIdentifierType.foreignKeyRef.code(),
    party_id: party.foreignKeyRef.party_id(),
    ...mg.housekeeping(),
  });

  const person = mg.table(tableName("person"), {
    person_id: mg.primaryKey(),
    party_id: party.foreignKeyRef.party_id(),
    person_type_id: enums.personType.foreignKeyRef.code(),
    person_first_name: mgd.text(),
    person_last_name: mgd.text(),
    ...mg.housekeeping(),
  });

  /**
   * Reference URL: https://docs.oracle.com/cd/E29633_01/CDMRF/GUID-F52E49F4-AE6F-4FF5-8EEB-8366A66AF7E9.htm
   */
  const partyRelation = mg.table(tableName("party_relation"), {
    party_relation_id: mg.primaryKey(),
    party_id: party.foreignKeyRef.party_id(),
    related_party_id: party.foreignKeyRef.party_id(),
    relation_type_id: enums.partyRelationType.foreignKeyRef.code(),
    party_role_id: enums.partyRole.foreignKeyRef.code(),
    ...mg.housekeeping(),
  });

  const organization = mg.table(tableName("organization"), {
    organization_id: mg.primaryKey(),
    party_id: party.foreignKeyRef.party_id(),
    name: mgd.text(),
    license: mgd.text(),
    registration_date: mgd.date(),
    ...mg.housekeeping(),
  });

  const organizationRole = mg.table(tableName("organization_role"), {
    organization_role_id: mg.primaryKey(),
    person_party_id: party.foreignKeyRef.party_id(),
    organization_party_id: party.foreignKeyRef.party_id(),
    organization_role_type_id: enums.organizationRoleType.foreignKeyRef.code(),
    ...mg.housekeeping(),
  });

  const contactElectronic = mg.table(tableName("contact_electronic"), {
    contact_electronic_id: mg.primaryKey(),
    contact_type_id: enums.contactType.foreignKeyRef.code(),
    party_id: party.foreignKeyRef.party_id(),
    electronics_details: mgd.text(),
    ...mg.housekeeping(),
  });

  const contactLand = mg.table(tableName("contact_land"), {
    contact_land_id: mg.primaryKey(),
    contact_type_id: enums.contactType.foreignKeyRef.code(),
    party_id: party.foreignKeyRef.party_id(),
    address_line1: mgd.text(),
    address_line2: mgd.text(),
    address_zip: mgd.text(),
    address_city: mgd.text(),
    address_state: mgd.text(),
    address_country: mgd.text(),
    ...mg.housekeeping(),
  });

  const securityIncidentResponseTeam = mg.table(
    tableName("security_incident_response_team"),
    {
      security_incident_response_team_id: mg.primaryKey(),
      person_id: person.foreignKeyRef.person_id(),
      organization_id: organization.foreignKeyRef.organization_id(),
      ...mg.housekeeping(),
    },
  );

  const awarenessTraining = mg.table(
    tableName("awareness_training"),
    {
      awareness_training_id: mg.primaryKey(),
      training_subject_id: enums.trainingSubject.foreignKeyRef.code(),
      person_id: person.foreignKeyRef.person_id(),
      organization_id: organization.foreignKeyRef.organization_id(),
      training_status_id: enums.statusValues.foreignKeyRef.code(),
      ...mg.housekeeping(),
    },
  );

  /**
   * Reference URL: https://schema.org/Rating
   */
  const rating = mg.table(
    tableName("rating"),
    {
      rating_id: mg.primaryKey(),
      author_id: party.foreignKeyRef.party_id(),
      rating_given_to_id: party.foreignKeyRef.party_id(),
      rating_value_id: enums.ratingValue.foreignKeyRef.code(),
      best_rating_id: enums.ratingValue.foreignKeyRef.code(),
      rating_explanation: mgd.text(),
      review_aspect: mgd.text(),
      worst_rating_id: enums.ratingValue.foreignKeyRef.code(),
      ...mg.housekeeping(),
    },
  );

  const notes = mg.table(
    tableName("note"),
    {
      note_id: mg.primaryKey(),
      party_id: party.foreignKeyRef.party_id(),
      note: mgd.text(),
      ...mg.housekeeping(),
    },
  );

  /**
   * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
   */
  const contract = mg.table(
    tableName("contract"),
    {
      contract_id: mg.primaryKey(),
      organization_id: organization.foreignKeyRef.organization_id(),
      contract_status_id: enums.contractStatus.foreignKeyRef.code(),
      document_reference: mgd.text(),
      payment_type_id: enums.paymentType.foreignKeyRef.code(),
      periodicity_id: enums.periodicity.foreignKeyRef.code(),
      start_date: mgd.dateTime(),
      end_date: mgd.dateTime(),
      contract_type_id: enums.contractType.foreignKeyRef.code(),
      date_of_last_review: mgd.dateTime(),
      date_of_next_review: mgd.dateTime(),
      date_of_contract_review: mgd.dateTime(),
      date_of_contract_approval: mgd.dateTime(),
      ...mg.housekeeping(),
    },
  );

  const riskRegister = mg.table(
    tableName("risk_register"),
    {
      risk_register_id: mg.primaryKey(),
      description: mgd.text(),
      risk_subject_id: enums.riskSubject.foreignKeyRef.code(),
      risk_type_id: enums.riskType.foreignKeyRef.code(),
      impact_to_the_organization: mgd.text(),
      rating_likelihood_id: enums.ratingValue.foreignKeyRef.code(),
      rating_impact_id: enums.ratingValue.foreignKeyRef.code(),
      rating_overall_risk_id: enums.ratingValue.foreignKeyRef.code(),
      control_effectivenes_controls_in_place: mgd.text(),
      control_effectivenes_control_effectiveness: mgd.integer(),
      control_effectivenes_over_all_residual_risk_rating_id: enums.ratingValue
        .foreignKeyRef.code(),
      mitigation_further_actions: mgd.text(),
      control_monitor_mitigation_actions_tracking_strategy: mgd.text(),
      control_monitor_action_due_date: mgd.date(),
      control_monitor_risk_owner_id: party.foreignKeyRef.party_id(),
      ...mg.housekeeping(),
    },
  );

  /**
   * Reference URL: https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html
   */
  const incident = mg.table(
    tableName("incident"),
    {
      incident_id: mg.primaryKey(),
      title: mgd.text(),
      incident_date: mgd.date(),
      time_and_time_zone: mgd.dateTime(),
      category_id: enums.incidentCategory.foreignKeyRef.code(),
      sub_category_id: enums.incidentSubCategory.foreignKeyRef.code(),
      severity_id: enums.severityType.foreignKeyRef.code(),
      priority_id: enums.priorityType.foreignKeyRef.code(),
      internal_or_external_id: enums.incidentType.foreignKeyRef.code(),
      location: mgd.text(),
      it_service_impacted: mgd.text(),
      impacted_modules: mgd.text(),
      impacted_dept: mgd.text(),
      reported_by_id: person.foreignKeyRef.person_id(),
      reported_to_id: person.foreignKeyRef.person_id(),
      brief_description: mgd.text(),
      detailed_description: mgd.text(),
      assigned_to_id: person.foreignKeyRef.person_id(),
      assigned_date: mgd.date(),
      investigation_details: mgd.text(),
      containment_details: mgd.text(),
      eradication_details: mgd.text(),
      bussiness_impact: mgd.text(),
      lessons_learned: mgd.text(),
      status_id: enums.incidentStatus.foreignKeyRef.code(),
      closed_date: mgd.date(),
      reopened_time: mgd.dateTime(),
      feedback_from_business: mgd.text(),
      reported_to_regulatory: mgd.text(),
      report_date: mgd.date(),
      report_time: mgd.dateTime(),
      ...mg.housekeeping(),
    },
  );

  const raciMatrixAssignment = mg.table(
    tableName("raci_matrix_assignment"),
    {
      raci_matrix_assignment_id: mg.primaryKey(),
      person_id: person.foreignKeyRef.person_id(),
      subject_id: enums.raciMatrixSubject.foreignKeyRef.code(),
      activity_id: raciMatrixActivity.foreignKeyRef.raci_matrix_activity_id(),
      raci_matrix_assignment_nature_id: enums.raciMatrixAssignmentNature
        .foreignKeyRef.code(),
      ...mg.housekeeping(),
    },
  );

  const personSkill = mg.table(tableName("person_skill"), {
    person_skill_id: mg.primaryKey(),
    person_id: person.foreignKeyRef.person_id(),
    skill_nature_id: enums.skillNature.foreignKeyRef.code(),
    skill_id: enums.skill.foreignKeyRef.code(),
    ...mg.housekeeping(),
  });

  const keyPerformance = mg.table(tableName("key_performance"), {
    key_performance_id: mg.primaryKey(),
    title: mgd.text(),
    description: mgd.text(),
    ...mg.housekeeping(),
  });

  const keyPerformanceIndicator = mg.table(
    tableName("key_performance_indicator"),
    {
      key_performance_indicator_id: mg.primaryKey(),
      key_performance_id: keyPerformance.foreignKeyRef.key_performance_id(),
      base_value: mgd.integer(),
      date: mgd.date(),
      ...mg.housekeeping(),
    },
  );

  // deno-fmt-ignore
  const seedDDL = mg.prepareSeedDDL`
      ${host}

      ${graph}

      ${boundary}

      ${hostBoundary}

      ${raciMatrix}

      ${assetRisk}

      ${vulnerability}

      ${threatSource}

      ${threatEvent}

      ${billing}

      ${scheduledTask}

      ${timesheet}

      ${certificate}

      ${device}

      ${party}

      ${partyIdentifier}

      ${person}

      ${organization}

      ${contactElectronic}

      ${contactLand}

      ${partyRelation}

      ${organizationRole}

      ${securityIncidentResponseTeam}

      ${awarenessTraining}

      ${rating}

      ${contract}

      ${notes}

      ${riskRegister}

      ${incident}

      ${raciMatrixSubjectBoundary}

      ${raciMatrixActivity}

      ${raciMatrixAssignment}

      ${personSkill}

      ${keyPerformance}

      ${keyPerformanceIndicator}`;

  return {
    modelsGovn: mg,
    host,
    graph,
    boundary,
    hostBoundary,
    raciMatrix,
    assetRisk,
    vulnerability,
    threatSource,
    threatEvent,
    billing,
    scheduledTask,
    timesheet,
    certificate,
    device,
    party,
    person,
    organization,
    partyRelation,
    contactElectronic,
    contactLand,
    organizationRole,
    securityIncidentResponseTeam,
    awarenessTraining,
    rating,
    contract,
    notes,
    riskRegister,
    incident,
    partyIdentifier,
    raciMatrixSubjectBoundary,
    raciMatrixActivity,
    raciMatrixAssignment,
    personSkill,
    keyPerformance,
    keyPerformanceIndicator,
    seedDDL,
    exposeATC: [
      host,
      graph,
      boundary,
      hostBoundary,
      raciMatrix,
      party,
      person,
      partyRelation,
      organization,
      contactElectronic,
      contactLand,
      organizationRole,
      securityIncidentResponseTeam,
      awarenessTraining,
      rating,
      contract,
      notes,
      riskRegister,
      incident,
      partyIdentifier,
      raciMatrixSubjectBoundary,
      raciMatrixActivity,
      raciMatrixAssignment,
      personSkill,
      keyPerformance,
      keyPerformanceIndicator,
    ],
  };
}

export function models<Context extends SQLa.SqlEmitContext>(
  ddlOptions: SQLa.SqlTextSupplierOptions<Context> & {
    readonly sqlNS?: SQLa.SqlNamespaceSupplier;
  },
) {
  const enums = enumerations(ddlOptions);
  const ents = entities(ddlOptions);

  // deno-fmt-ignore
  const seedDDL = ents.modelsGovn.prepareSeedDDL`
      -- Generated by ${path.basename(import.meta.url)}. DO NOT EDIT.

      PRAGMA foreign_keys = ON;

      ${ents.modelsGovn.sqlTextLintSummary}

      -- enumeration tables
      ${enums.seedDDL}

      -- content tables
      ${ents.seedDDL}

      ${ents.modelsGovn.sqlTmplEngineLintSummary}`;

  const atcCS = osQ.osQueryATCConfigSupplier(
    [...enums.exposeATC, ...ents.exposeATC].map((t) => ({
      tableName: t.tableName,
      columns: t.domains.map((d) => ({ columnName: d.identity })),
    })),
  );

  const osQueryATCConfig = (
    sqliteDbPath: string,
    _ctx: Context,
    osQueryTableName: (tableName: string) => string = (tableName) =>
      `opsfolio_${tableName}`,
  ) => {
    return atcCS((tableName, atcPartial) => {
      return {
        osQueryTableName: osQueryTableName(tableName),
        atcRec: { ...atcPartial, path: sqliteDbPath },
      };
    });
  };

  return {
    enumerations: enums,
    entities: ents,
    seedDDL,
    osQueryATCConfig,
    osQueryATCConfigJsonText: (
      sqliteDbPath: string,
      ctx: Context,
      osQueryTableName?: (tableName: string) => string,
    ) => {
      return JSON.stringify(
        osQueryATCConfig(sqliteDbPath, ctx, osQueryTableName),
      );
    },
    plantUmlIE: (ctx: Context, diagramName: string) =>
      sqlD.plantUmlIE(
        ctx,
        function* () {
          for (const e of Object.values(enums)) {
            if (SQLa.isEnumTableDefn(e)) {
              yield e;
            }
          }
          for (const e of Object.values(ents)) {
            if (SQLa.isTableDefinition(e)) {
              yield e;
            }
          }
        },
        sqlD.typicalPlantUmlIeOptions({
          ...ents.modelsGovn.erdConfig,
          diagramName,
          // because showing enum relationships can get "noisy", don't add enum
          // entities or edge connections for enums
          includeEntity: (entity) =>
            SQLa.isEnumTableDefn(entity) ? false : true,
          relationshipIndicator: (edge) => {
            const refIsEnum = SQLa.isEnumTableDefn(edge.ref.entity);
            // Relationship types ref: https://plantuml.com/es/ie-diagram
            return refIsEnum ? false : "|o..o{";
          },
        }),
      ),
  };
}

if (import.meta.main) {
  // if we're being called as a CLI, just emit the DDL SQL:
  //    deno run -A models.ts > opsfolio.auto.sql
  //    deno run -A models.ts | sqlite3 opsfolio.sqlite.db
  const m = models(SQLa.typicalSqlTextSupplierOptions());
  console.log(m.seedDDL.SQL(SQLa.typicalSqlEmitContext()));
}
