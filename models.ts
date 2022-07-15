import {
  path,
  rflSQLa as SQLa,
  rflSqlDiagram as sqlD,
  rflSqlOsQuery as osQ,
  rflSqlTypical as SQLaTyp,
} from "./deps.ts";

// TODO:
// - [ ] increase number of enums for proper typing of lookups
// - [ ] strongly type all text to ints/date/etc. where necessary
// - [ ] convert relevant legacy Opsfolio Drupal CTVs to SQLa entities
// - [ ] convert relevant legacy IGS Operations Portfolio Specification (OPS) repo models to SQLa entities

// TODO: introduce Party, Person, etc. "typical" tables so in case "graph",
// "boundary", etc. are not as useful. Better to leave data models general
// instead of using Party or other universal models?

/**
 * All our table names should be strongly typed and consistent. Generics are
 * used so that they are passed into Axiom, SQLa domain, etc. properly typed.
 * @param name the name of the table
 * @returns the transformed table name (e.g. in case prefixes should be added)
 */
export function tableName<Name extends string, Qualified extends string = Name>(
  name: Name,
): Qualified {
  // for now we're not doing anything special but that could change in future
  return name as unknown as Qualified;
}

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

// Reference URL: https://docs.oracle.com/cd/E29633_01/CDMRF/GUID-F52E49F4-AE6F-4FF5-8EEB-8366A66AF7E9.htm
// TODO:- [ ] increase number of entries by refering more examples

export enum PartyRole {
  CUSTOMER = "Customer",
  VENDOR = "Vendor",
}

// Reference URL: https://docs.oracle.com/cd/E63029_01/books/Secur/secur_accesscontrol022.htm
// TODO:- [ ] increase number of entries by refering more examples

export enum PartyRelationType {
  PERSON_TO_PERSON = "Person To Person",
  ORGANIZATION_TO_PERSON = "Organization To Person",
  ORGANIZATION_TO_ORGANIZATION = "Organization To Organization",
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

// TODO:- [ ] Enhance by referring UDM

export enum TrainingSubject {
  HIPPA = "HIPPA",
}

// TODO:- [ ] Enhance by referring UDM

export enum StatusValues {
  YES = "Yes",
  NO = "No",
}

// TODO:- [ ] Enhance by referring UDM

export enum RecordStatus {
  ACTIVE = "Active",
  PENDING = "Pending",
  ARCHIVED = "Archived",
  DELETED = "Deleted",
}

// TODO:- [ ] Enhance by referring UDM
// TODO:- [ ] Need to change RatingScore to  RatingValue if no other UDM found other than Schema.org
// https://schema.org/ratingValue

export enum RatingScore {
  ONE = "1",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
}

// TODO:- [ ] Enhance by referring UDM

export enum ContractType {
  GENERAL_CONTRACT_FOR_SERVICES = "General Contract for Services",
  EMPLOYMENT_AGREEMENT = "Employment Agreement",
  NONCOMPETE_AGREEMENT = "Noncompete Agreement",
}

// TODO:- [ ] Enhance by referring UDM

export enum RiskType {
  TECHNICAL_RISK = "Technical Risk",
}

// TODO:- [ ] Enhance by referring UDM

export enum SeverityType {
  CRITICAL = "Critical",
  MAJOR = "Major",
  MINOR = "Minor",
  LOW = "Low",
}

// TODO:- [ ] Enhance by referring UDM

export enum PriorityType {
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}

// TODO:- [ ] Enhance by referring UDM

export enum IncidentCategoryType {
  TECHNICAL_RISK = "Technical Risk",
}

// TODO:- [ ] Enhance by referring UDM

export enum IncidentType {
  INTERNAL = "Server Issue",
  EXTERNAL = "Out of Memory",
}

// TODO:- [ ] Enhance by referring UDM

export enum IncidentStatus {
  CLOSED = "Closed",
  OPEN = "Open",
  RE_OPEN = "Reopen",
}

// TODO:- [ ] Enhance by referring UDM

export enum AgreementType {
  VENDOR_SLA = "Vendor SLA",
  VENDOR_NDA = "Vendor NDA",
}

// TODO:- [ ] Enhance by referring UDM

export enum RiskSubject {
  TECHNICAL_RISK = "Technical Risk",
}

// TODO:- [ ] Enhance by referring UDM

export enum AssetRiskType {
  TYPE1 = "asset risk type 1",
  TYPE2 = "asset risk type 2",
}

export enum GraphNature {
  SERVICE = "Service",
  APP = "Application",
}

export enum BoundaryNature {
  REGULATORY_TAX_ID = "Regulatory Tax ID", // like an "official" company (something with a Tax ID)
}

export function enumerations<Context extends SQLa.SqlEmitContext>(
  ddlOptions?: SQLa.SqlTextSupplierOptions<Context> & {
    readonly sqlNS?: SQLa.SqlNamespaceSupplier;
  },
) {
  const mg = SQLaTyp.typicalModelsGovn(ddlOptions);
  const enumTableDefnOptions = { isIdempotent: true };
  const execCtx = SQLa.enumTable(
    tableName("execution_context"),
    ExecutionContext,
    enumTableDefnOptions,
  );

  const graphNature = SQLa.enumTextTable(
    tableName("graph_nature"),
    GraphNature,
    enumTableDefnOptions,
  );

  const boundaryNature = SQLa.enumTextTable(
    tableName("boundary_nature"),
    BoundaryNature,
    enumTableDefnOptions,
  );

  const assetRiskType = SQLa.enumTextTable(
    tableName("asset_risk_type"),
    AssetRiskType,
    enumTableDefnOptions,
  );

  const organizationRoleType = SQLa.enumTextTable(
    tableName("organization_role_type"),
    OrganizationRoleType,
    enumTableDefnOptions,
  );

  const partyType = SQLa.enumTextTable(
    tableName("party_type"),
    PartyType,
    enumTableDefnOptions,
  );

  const personType = SQLa.enumTextTable(
    tableName("person_type"),
    PersonType,
    enumTableDefnOptions,
  );

  const contactType = SQLa.enumTextTable(
    tableName("contact_type"),
    ContactType,
    enumTableDefnOptions,
  );

  const trainingSubject = SQLa.enumTextTable(
    tableName("training_subject"),
    TrainingSubject,
    enumTableDefnOptions,
  );

  const statusValues = SQLa.enumTextTable(
    tableName("status_value"),
    StatusValues,
    enumTableDefnOptions,
  );

  const partyRelationType = SQLa.enumTextTable(
    tableName("party_relation_type"),
    PartyRelationType,
    enumTableDefnOptions,
  );

  const recordStatus = SQLa.enumTextTable(
    tableName("record_status"),
    RecordStatus,
    enumTableDefnOptions,
  );

  const ratingScore = SQLa.enumTextTable(
    tableName("rating_value"),
    RatingScore,
    enumTableDefnOptions,
  );

  const contractType = SQLa.enumTextTable(
    tableName("contract_type"),
    ContractType,
    enumTableDefnOptions,
  );

  const agreementType = SQLa.enumTextTable(
    tableName("agreement_type"),
    AgreementType,
    enumTableDefnOptions,
  );

  const riskType = SQLa.enumTextTable(
    tableName("risk_type"),
    RiskType,
    enumTableDefnOptions,
  );

  const severityType = SQLa.enumTextTable(
    tableName("severity_type"),
    SeverityType,
    enumTableDefnOptions,
  );

  const priorityType = SQLa.enumTextTable(
    tableName("priority_type"),
    PriorityType,
    enumTableDefnOptions,
  );

  const incidentType = SQLa.enumTextTable(
    tableName("incident_type"),
    IncidentType,
    enumTableDefnOptions,
  );

  const incidentStatus = SQLa.enumTextTable(
    tableName("incident_status"),
    IncidentStatus,
    enumTableDefnOptions,
  );

  const incidentCategoryType = SQLa.enumTextTable(
    tableName("incident_category_type"),
    IncidentCategoryType,
    enumTableDefnOptions,
  );

  const riskSubject = SQLa.enumTextTable(
    tableName("risk_subject"),
    RiskSubject,
    enumTableDefnOptions,
  );

  const partyRole = SQLa.enumTextTable(
    tableName("party_role_type"),
    PartyRole,
    enumTableDefnOptions,
  );
  // deno-fmt-ignore
  const seedDDL = SQLa.SQL<Context>(ddlOptions)`
      ${execCtx}

      ${graphNature}

      ${boundaryNature}

      ${assetRiskType}

      ${organizationRoleType}

      ${partyType}

      ${personType}

      ${contactType}

      ${trainingSubject}

      ${statusValues}

      ${partyRelationType}

      ${recordStatus}

      ${ratingScore}

      ${contractType}

      ${agreementType}

      ${riskType}

      ${severityType}

      ${priorityType}

      ${incidentType}

      ${incidentStatus}

      ${incidentCategoryType}

      ${riskSubject}

      ${partyRole}

      ${execCtx.seedDML}

      ${graphNature.seedDML}

      ${boundaryNature.seedDML}

      ${assetRiskType.seedDML}

      ${organizationRoleType.seedDML}

      ${partyType.seedDML}

      ${personType.seedDML}

      ${contactType.seedDML}

      ${trainingSubject.seedDML}

      ${statusValues.seedDML}

      ${partyRelationType.seedDML}

      ${recordStatus.seedDML}

      ${ratingScore.seedDML}

      ${contractType.seedDML}

      ${agreementType.seedDML}

      ${riskType.seedDML}

      ${severityType.seedDML}

      ${priorityType.seedDML}

      ${incidentType.seedDML}

      ${incidentStatus.seedDML}

      ${incidentCategoryType.seedDML}

      ${riskSubject.seedDML}

      ${partyRole.seedDML}`;

  return {
    modelsGovn: mg,
    execCtx,
    graphNature,
    boundaryNature,
    assetRiskType,
    organizationRoleType,
    partyType,
    personType,
    contactType,
    partyRelationType,
    recordStatus,
    trainingSubject,
    statusValues,
    ratingScore,
    contractType,
    agreementType,
    riskType,
    severityType,
    priorityType,
    incidentType,
    incidentStatus,
    incidentCategoryType,
    riskSubject,
    partyRole,
    seedDDL,
    exposeATC: [
      execCtx,
      assetRiskType,
      organizationRoleType,
      partyType,
      personType,
      contactType,
      partyRelationType,
      recordStatus,
      trainingSubject,
      statusValues,
      ratingScore,
      contractType,
      agreementType,
      riskType,
      severityType,
      priorityType,
      incidentType,
      incidentStatus,
      incidentCategoryType,
      riskSubject,
      partyRole,
    ],
  };
}

export function entities<Context extends SQLa.SqlEmitContext>(
  ddlOptions?: SQLa.SqlTextSupplierOptions<Context> & {
    readonly sqlNS?: SQLa.SqlNamespaceSupplier;
  },
) {
  const mg = SQLaTyp.typicalModelsGovn(ddlOptions);
  const enums = enumerations(ddlOptions);

  const graph = mg.table(tableName("graph"), {
    graph_id: mg.primaryKey(),
    graph_nature_id: enums.graphNature.foreignKeyRef.code(),
    name: SQLa.text(),
    description: SQLa.textNullable(),
    ...mg.housekeeping(),
  });

  const boundaryId = mg.primaryKey();
  const boundary = mg.table(tableName("boundary"), {
    boundary_id: boundaryId,
    parent_boundary_id: SQLa.selfRefForeignKeyNullable(boundaryId),
    graph_id: graph.foreignKeyRef.graph_id(),
    boundary_nature_id: enums.boundaryNature.foreignKeyRef.code(),
    name: SQLa.text(),
    ...mg.housekeeping(),
  });

  const host = mg.table(tableName("host"), {
    host_id: mg.primaryKey(),
    host_name: SQLa.unique(SQLa.text()),
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
    asset: SQLa.text(),
    responsible: SQLa.text(),
    accountable: SQLa.text(),
    consulted: SQLa.text(),
    informed: SQLa.text(),
    ...mg.housekeeping(),
  });

  const assetRisk = mg.table(tableName("asset_risk"), {
    asset_risk_id: mg.primaryKey(),
    asset_risk_type_id: enums.assetRiskType.foreignKeyRef.code(),
    asset: SQLa.text(),
    threat_event: SQLa.text(),
    relevance: SQLa.text(),
    likelihood: SQLa.text(),
    impact: SQLa.text(),
    ...mg.housekeeping(),
  });

  const vulnerability = mg.table(tableName("vulnerability"), {
    vulnerability_id: mg.primaryKey(),
    short_name: SQLa.text(),
    source: SQLa.text(),
    affected_software: SQLa.text(),
    reference: SQLa.text(),
    status: SQLa.text(),
    patch_availability: SQLa.text(),
    severity: SQLa.text(),
    solutions: SQLa.text(),
    tags: SQLa.text(),
    description: SQLa.text(),
    ...mg.housekeeping(),
  });

  const threatSource = mg.table(tableName("threat_source"), {
    threat_source_id: mg.primaryKey(),
    threat_source: SQLa.text(),
    identifier: SQLa.text(),
    threat_source_type: SQLa.text(),
    source_of_information: SQLa.text(),
    capability: SQLa.text(),
    intent: SQLa.text(),
    targeting: SQLa.text(),
    description: SQLa.text(),
    ...mg.housekeeping(),
  });

  const threatEvent = mg.table(tableName("threat_event"), {
    threat_event_id: mg.primaryKey(),
    threat_event: SQLa.text(),
    identifier: SQLa.text(),
    threat_event_type: SQLa.integer(),
    event_classification: SQLa.text(),
    source_of_information: SQLa.text(),
    description: SQLa.text(),
    ...mg.housekeeping(),
  });

  const billing = mg.table(tableName("billing"), {
    billing_id: mg.primaryKey(),
    purpose: SQLa.text(),
    bill_rate: SQLa.text(),
    period: SQLa.text(),
    effective_from_date: SQLa.dateTime(),
    effective_to_date: SQLa.text(),
    prorate: SQLa.integer(),
    ...mg.housekeeping(),
  });

  const scheduledTask = mg.table(tableName("scheduled_task"), {
    scheduled_task_id: mg.primaryKey(),
    description: SQLa.text(),
    task_date: SQLa.dateTime(),
    reminder_date: SQLa.dateTime(),
    assigned_to: SQLa.text(),
    reminder_to: SQLa.text(),
    ...mg.housekeeping(),
  });

  // TODO:- [ ] Enhance by referring UDM
  // Found another model in UDM as TimeEntry
  // https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html

  const timesheet = mg.table(tableName("timesheet"), {
    timesheet_id: mg.primaryKey(),
    time_hour: SQLa.integer(),
    timesheet_summary: SQLa.text(),
    start_time: SQLa.text(),
    end_time: SQLa.text(),
    ...mg.housekeeping(),
  });

  // TODO:- [ ] Enhance by referring UDM
  // Found another model in UDM as DigitalCertificate
  // https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html

  const certificate = mg.table(tableName("certificate"), {
    certificate_id: mg.primaryKey(),
    certificate_name: SQLa.text(),
    short_name: SQLa.text(),
    certificate_category: SQLa.text(),
    certificate_type: SQLa.text(),
    certificate_authority: SQLa.text(),
    validity: SQLa.text(),
    expiration_date: SQLa.dateTime(),
    domain_name: SQLa.text(),
    key_size: SQLa.integer(),
    path: SQLa.text(),
    ...mg.housekeeping(),
  });

  const device = mg.table(tableName("device"), {
    device_id: mg.primaryKey(),
    device_name: SQLa.text(),
    short_name: SQLa.text(),
    barcode: SQLa.text(),
    model: SQLa.text(),
    serial_number: SQLa.text(),
    firmware: SQLa.text(),
    data_center: SQLa.text(),
    location: SQLa.text(),
    purpose: SQLa.text(),
    description: SQLa.text(),
    ...mg.housekeeping(),
  });

  const party = mg.table(tableName("party"), {
    party_id: mg.primaryKey(),
    party_type_id: enums.partyType.foreignKeyRef.code(),
    party_name: SQLa.text(),
    record_status_id: enums.recordStatus.foreignKeyRef.code(),
    ...mg.housekeeping(),
  });

  const person = mg.table(tableName("person"), {
    person_id: mg.primaryKey(),
    party_id: party.foreignKeyRef.party_id(),
    person_type_id: enums.personType.foreignKeyRef.code(),
    person_first_name: SQLa.text(),
    person_last_name: SQLa.text(),
    record_status_id: enums.recordStatus.foreignKeyRef.code(),
    ...mg.housekeeping(),
  });

  // Reference URL:  https://docs.oracle.com/cd/E29633_01/CDMRF/GUID-F52E49F4-AE6F-4FF5-8EEB-8366A66AF7E9.htm

  const partyRelation = mg.table(tableName("party_relation"), {
    party_relation_id: mg.primaryKey(),
    party_id: party.foreignKeyRef.party_id(),
    related_party_id: party.foreignKeyRef.party_id(),
    relation_type_id: enums.partyRelationType.foreignKeyRef.code(),
    party_role_id: enums.partyRole.foreignKeyRef.code(),
    record_status_id: enums.recordStatus.foreignKeyRef.code(),
    ...mg.housekeeping(),
  });

  const organization = mg.table(tableName("organization"), {
    organization_id: mg.primaryKey(),
    party_id: party.foreignKeyRef.party_id(),
    name: SQLa.text(),
    license: SQLa.text(),
    registration_date: SQLa.date(),
    record_status_id: enums.recordStatus.foreignKeyRef.code(),
    ...mg.housekeeping(),
  });

  const organizationRole = mg.table(tableName("organization_role"), {
    organization_role_id: mg.primaryKey(),
    person_party_id: party.foreignKeyRef.party_id(),
    organization_party_id: party.foreignKeyRef.party_id(),
    organization_role_type_id: enums.organizationRoleType.foreignKeyRef.code(),
    record_status_id: enums.recordStatus.foreignKeyRef.code(),
    ...mg.housekeeping(),
  });

  const contactElectronics = mg.table(tableName("contact_electronics"), {
    contact_electronics_id: mg.primaryKey(),
    contact_type_id: enums.contactType.foreignKeyRef.code(),
    party_id: party.foreignKeyRef.party_id(),
    electronics_details: SQLa.text(),
    record_status_id: enums.recordStatus.foreignKeyRef.code(),
    ...mg.housekeeping(),
  });

  const contactLand = mg.table(tableName("contact_land"), {
    contact_land_id: mg.primaryKey(),
    contact_type_id: enums.contactType.foreignKeyRef.code(),
    party_id: party.foreignKeyRef.party_id(),
    address_line1: SQLa.text(),
    address_line2: SQLa.text(),
    address_zip: SQLa.text(),
    address_city: SQLa.text(),
    address_state: SQLa.text(),
    address_country: SQLa.text(),
    record_status_id: enums.recordStatus.foreignKeyRef.code(),
    ...mg.housekeeping(),
  });

  const securityIncidentResponseTeam = mg.table(
    tableName("security_incident_response_team"),
    {
      security_incident_response_team_id: mg.primaryKey(),
      person_party_id: party.foreignKeyRef.party_id(),
      organization_party_id: party.foreignKeyRef.party_id(),
      record_status_id: enums.recordStatus.foreignKeyRef.code(),
      ...mg.housekeeping(),
    },
  );

  const awarenessTraining = mg.table(
    tableName("awareness_training"),
    {
      awareness_training_id: mg.primaryKey(),
      training_subject_id: enums.trainingSubject.foreignKeyRef.code(),
      person_party_id: party.foreignKeyRef.party_id(),
      organization_party_id: party.foreignKeyRef.party_id(),
      training_status_id: enums.statusValues.foreignKeyRef.code(),
      record_status_id: enums.recordStatus.foreignKeyRef.code(),
      ...mg.housekeeping(),
    },
  );

  // TODO:- [ ] Need to enhance this model from UDM or https://schema.org/Rating

  const rating = mg.table(
    tableName("rating"),
    {
      rating_id: mg.primaryKey(),
      party_id: party.foreignKeyRef.party_id(),
      score_id: enums.ratingScore.foreignKeyRef.code(),
      record_status_id: enums.recordStatus.foreignKeyRef.code(),
      ...mg.housekeeping(),
    },
  );

  const notes = mg.table(
    tableName("note"),
    {
      note_id: mg.primaryKey(),
      party_id: party.foreignKeyRef.party_id(),
      note: SQLa.text(),
      record_status_id: enums.recordStatus.foreignKeyRef.code(),
      ...mg.housekeeping(),
    },
  );

  // TODO: Need to enhance this model from https://docs.microfocus.com/UCMDB/11.0/cp-docs/docs/eng/class_model/html/index.html

  const contract = mg.table(
    tableName("contract"),
    {
      contract_id: mg.primaryKey(),
      party_id: party.foreignKeyRef.party_id(),
      contract_type_id: enums.contractType.foreignKeyRef.code(),
      date_contract_signed: SQLa.dateTime(),
      date_contract_expires: SQLa.dateTime(),
      date_of_last_review: SQLa.dateTime(),
      date_of_next_review: SQLa.dateTime(),
      date_of_contract_review: SQLa.dateTime(),
      date_of_contract_approval: SQLa.dateTime(),
      record_status_id: enums.recordStatus.foreignKeyRef.code(),
      ...mg.housekeeping(),
    },
  );

  // TODO: Need to combine this model with contract model (According to UDM agreement is similar to contract)

  const agreement = mg.table(
    tableName("agreement"),
    {
      agreement_id: mg.primaryKey(),
      party_id: party.foreignKeyRef.party_id(),
      agreement_type_id: enums.agreementType.foreignKeyRef.code(),
      signed_status_id: enums.statusValues.foreignKeyRef.code(),
      document_path: SQLa.text(),
      record_status_id: enums.recordStatus.foreignKeyRef.code(),
      ...mg.housekeeping(),
    },
  );

  const riskRegister = mg.table(
    tableName("risk_register"),
    {
      risk_register_id: mg.primaryKey(),
      description: SQLa.text(),
      risk_subject_id: enums.riskSubject.foreignKeyRef.code(),
      risk_type_id: enums.riskType.foreignKeyRef.code(),
      impact_to_the_organization: SQLa.text(),
      rating_likelihood_id: enums.ratingScore.foreignKeyRef.code(),
      rating_impact_id: enums.ratingScore.foreignKeyRef.code(),
      rating_overall_risk_id: enums.ratingScore.foreignKeyRef.code(),
      control_effectivenes_controls_in_place: SQLa.text(),
      control_effectivenes_control_effectiveness_id: enums.ratingScore
        .foreignKeyRef.code(),
      control_effectivenes_over_all_residual_risk_rating_id: enums.ratingScore
        .foreignKeyRef.code(),
      mitigation_further_actions: SQLa.text(),
      control_monitor_mitigation_actions_tracking_strategy: SQLa.text(),
      control_monitor_action_due_date: SQLa.date(),
      control_monitor_risk_owner_id: party.foreignKeyRef.party_id(),
      record_status_id: enums.recordStatus.foreignKeyRef.code(),
      ...mg.housekeeping(),
    },
  );

  const incident = mg.table(
    tableName("incident"),
    {
      incident_id: mg.primaryKey(),
      title: SQLa.text(),
      incident_date: SQLa.date(),
      time_and_time_zone: SQLa.dateTime(),
      category_id: enums.incidentCategoryType.foreignKeyRef.code(),
      severity_id: enums.severityType.foreignKeyRef.code(),
      priority_id: enums.priorityType.foreignKeyRef.code(),
      internal_or_external_id: enums.incidentType.foreignKeyRef.code(),
      location: SQLa.text(),
      it_service_impacted: SQLa.text(),
      impacted_modules: SQLa.text(),
      impacted_dept: SQLa.text(),
      reported_by_id: party.foreignKeyRef.party_id(),
      reported_to_id: party.foreignKeyRef.party_id(),
      brief_description: SQLa.text(),
      detailed_description: SQLa.text(),
      assigned_to_id: party.foreignKeyRef.party_id(),
      assigned_date: SQLa.date(),
      investigation_details: SQLa.text(),
      containment_details: SQLa.text(),
      eradication_details: SQLa.text(),
      bussiness_impact: SQLa.text(),
      lessons_learned: SQLa.text(),
      status_id: enums.incidentStatus.foreignKeyRef.code(),
      closed_date: SQLa.date(),
      feedback_from_business: SQLa.text(),
      reported_to_regulatory: SQLa.text(),
      report_date: SQLa.date(),
      report_time: SQLa.dateTime(),
      record_status_id: enums.recordStatus.foreignKeyRef.code(),
      ...mg.housekeeping(),
    },
  );

  // deno-fmt-ignore
  const seedDDL = SQLa.SQL<Context>(ddlOptions)`
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

      ${person}

      ${organization}

      ${contactElectronics}

      ${contactLand}

      ${partyRelation}

      ${organizationRole}

      ${securityIncidentResponseTeam}

      ${awarenessTraining}

      ${rating}

      ${contract}

      ${notes}

      ${agreement}

      ${riskRegister}

      ${incident}`;

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
    contactElectronics,
    contactLand,
    organizationRole,
    rating,
    contract,
    notes,
    agreement,
    riskRegister,
    incident,
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
      contactElectronics,
      contactLand,
      organizationRole,
      rating,
      contract,
      notes,
      agreement,
      riskRegister,
      incident,
    ],
  };
}

export function models<Context extends SQLa.SqlEmitContext>(
  ddlOptions?: SQLa.SqlTextSupplierOptions<Context> & {
    readonly sqlNS?: SQLa.SqlNamespaceSupplier;
  },
) {
  const enums = enumerations(ddlOptions);
  const ents = entities(ddlOptions);

  // deno-fmt-ignore
  const seedDDL = SQLa.SQL<Context>(ddlOptions)`
      -- Generated by ${path.basename(import.meta.url)}. DO NOT EDIT.

      PRAGMA foreign_keys = ON;

      ${SQLa.typicalSqlTextLintSummary}

      -- enumeration tables
      ${enums.seedDDL}

      -- content tables
      ${ents.seedDDL}

      ${SQLa.typicalSqlTmplEngineLintSummary}`;

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
  const m = models();
  console.log(m.seedDDL.SQL(SQLa.typicalSqlEmitContext()));
}
