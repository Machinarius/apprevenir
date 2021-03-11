import { BackendClientTypes } from "./BackendClientTypes";
import { BackendTimestamps } from "./BackendTimestamps";
import { BackendUser } from "./BackendUser";

export interface BackendEducationalInstitutionGrade extends BackendTimestamps {
  id: number,
  user_id: number,
  grade: string
}

export interface BackendEducationalInstitution extends BackendTimestamps {
  id: number,
  user_id: number,
  educational_institution: string
}

export interface BackendEducationBureauClientConfigData {
  educationalInstitutions: BackendEducationalInstitution[],
  grades: BackendEducationalInstitutionGrade[]
}

export interface BackendEducationBureauUser extends BackendUser<BackendClientTypes.EducationBureau> {
  clientTypeConfig: BackendEducationBureauClientConfigData
}