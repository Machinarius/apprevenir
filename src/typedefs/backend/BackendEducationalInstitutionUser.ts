import { BackendClientTypes } from "./BackendClientTypes";
import { BackendTimestamps } from "./BackendTimestamps";
import { BackendUser } from "./BackendUser";

export interface BackendEducationalGrade extends BackendTimestamps {
  id: number,
  user_id: number,
  grade: string
}

export interface BackendEducationalInstitutionUser extends BackendUser<BackendClientTypes.EducationalInstitution> {
  educational_grades: BackendEducationalGrade[]
}