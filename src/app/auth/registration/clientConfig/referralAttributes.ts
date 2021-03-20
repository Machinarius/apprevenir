import { getClientsOfType } from "@services/user/usersDataSource";
import { ClientTypes, CompanyUser, EducationalInstitutionUser, EducationBureauUser, UniversityUser } from "@typedefs/backend";
import { ReferralHierarchyKeys } from "../forms/FormKeys";

export const ReferralConfigRootKey: ReferralHierarchyKeys = "referralHierarchy1";

export interface ReferralConfigDataSource {
  label: string,
  options: {
    key: string,
    label: string,
    attributes: ReferralConfigAttribute[]
  }[],
  formKey: "referralHierarchy1"
}

export interface ReferralConfigAttribute {
  label: string,
  options: {
    key: string,
    label: string
  }[],
  formKey: ReferralHierarchyKeys
}

function buildCompanyReferralConfigDS(clients: CompanyUser[]): ReferralConfigDataSource {
  return {
    label: "Empresa",
    formKey: "referralHierarchy1",
    options: clients.map(client => ({
      key: client.id.toString(),
      label: `${client.profile.first_names} ${client.profile.last_names}`,
      attributes: [{
        label: "Sede",
        formKey: "referralHierarchy2",
        options: client.clientTypeConfig.locations.map(location => ({
          key: location.id.toString(),
          label: location.location
        }))
      }, {
        label: "Área",
        formKey: "referralHierarchy3",
        options: client.clientTypeConfig.areas.map(area => ({
          key: area.id.toString(),
          label: area.area
        }))
      }, {
        label: "Turno",
        formKey: "referralHierarchy4",
        options: client.clientTypeConfig.schedules.map(schedule => ({
          key: schedule.id.toString(),
          label: schedule.schedul
        }))
      }]
    }))
  }
}

function buildEducationBureauConfigDS(clients: EducationBureauUser[]): ReferralConfigDataSource {
  return {
    label: "Secretaría de Educación",
    formKey: "referralHierarchy1",
    options: clients.map(client => ({
      key: client.id.toString(),
      label: `${client.profile.first_names} ${client.profile.last_names}`,
      attributes: [{
        label: "Institución Educativa",
        formKey: "referralHierarchy2",
        options: client.clientTypeConfig.educationalInstitutions.map(school => ({
          key: school.id.toString(),
          label: school.educational_institution
        }))
      }, {
        label: "Grado",
        formKey: "referralHierarchy3",
        options: client.clientTypeConfig.grades.map(grade => ({
          key: grade.id.toString(),
          label: grade.grade
        }))
      }]
    }))
  }
}

function buildEducationalInstitutionConfigDS(clients: EducationalInstitutionUser[]): ReferralConfigDataSource {
  return {
    label: "Secretaría de Educación",
    formKey: "referralHierarchy1",
    options: clients.map(client => ({
      key: client.id.toString(),
      label: `${client.profile.first_names} ${client.profile.last_names}`,
      attributes: [{
        label: "Grado",
        formKey: "referralHierarchy2",
        options: client.clientTypeConfig.educationalGrades.map(grade => ({
          key: grade.id.toString(),
          label: grade.grade
        }))
      }]
    }))
  }
}

function buildUniversityReferralConfigDS(clients: UniversityUser[]): ReferralConfigDataSource {
  return {
    label: "Universidad",
    formKey: "referralHierarchy1",
    options: clients.map(client => ({
      key: client.id.toString(),
      label: `${client.profile.first_names} ${client.profile.last_names}`,
      attributes: [{
        label: "Programa",
        formKey: "referralHierarchy2",
        options: client.clientTypeConfig.programs.map(program => ({
          key: program.id.toString(),
          label: program.program
        }))
      }, {
        label: "Modalidad",
        formKey: "referralHierarchy3",
        options: client.clientTypeConfig.modalities.map(modality => ({
          key: modality.id.toString(),
          label: modality.modality
        }))
      }, {
        label: "Semestre",
        formKey: "referralHierarchy4",
        options: client.clientTypeConfig.semesters.map(semester => ({
          key: semester.id.toString(),
          label: semester.semester
        }))
      }]
    }))
  }
}

export async function buildReferralConfigDataSource(clientType: ClientTypes): Promise<ReferralConfigDataSource> {
  const clients = await getClientsOfType(clientType);
  switch(clientType) {
    case ClientTypes.Company: 
      return buildCompanyReferralConfigDS(clients as unknown as CompanyUser[]);
    case ClientTypes.EducationBureau:
      return buildEducationBureauConfigDS(clients as unknown as EducationBureauUser[]);
    case ClientTypes.EducationalInstitution:
      return buildEducationalInstitutionConfigDS(clients as unknown as EducationalInstitutionUser[]);
    case ClientTypes.University:
      return buildUniversityReferralConfigDS(clients as unknown as UniversityUser[]);
  }

  throw new Error(`A DataSource provider for referral source '${clientType}' has not been built yet`);
}