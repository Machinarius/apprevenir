import { ClientTypes } from "@typedefs/backend";

export const ReferralSources = [{
  key: ClientTypes.Company,
  label: "Empresa"
}, {
  key: ClientTypes.TerritorialEntity,
  label: "Entidad Territorial"
}, {
  key: ClientTypes.EducationalInstitution,
  label: "Institución Educativa"
}, {
  key: ClientTypes.NaturalPerson,
  label: "Ninguno"
}, {
  key: ClientTypes.EducationBureau,
  label: "Secretaría de Educación"
}, {
  key: ClientTypes.University,
  label: "Universidad"
}];