import { BackendClientTypes } from "./BackendClientTypes";
import { BackendTimestamps } from "./BackendTimestamps";
import { BackendUser } from "./BackendUser";

export interface BackendEducationalGrade extends BackendTimestamps {
  id: number,
  user_id: number,
  grade: string
}

export interface BackendEducationalGradeClientConfigData {
  grades: BackendEducationalGrade[]
}

export interface BackendEducationalInstitutionUser extends BackendUser<BackendClientTypes.EducationalInstitution> {
  clientTypeConfig: BackendEducationalGradeClientConfigData
}