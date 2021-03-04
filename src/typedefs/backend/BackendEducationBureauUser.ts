import { BackendClientTypes } from "./BackendClientTypes";
import { BackendTimestamps } from "./BackendTimestamps";
import { BackendUser } from "./BackendUser";

interface BackendEducationalInstitutionGrade extends BackendTimestamps {
  id: number,
  educational_institution_id: number,
  grade: string
}

interface BackendEducationalInstitution extends BackendTimestamps {
  id: number,
  user_id: number,
  educational_institution: string,
  grades: BackendEducationalInstitutionGrade[]
}

export interface BackendEducationBureauUser extends BackendUser<BackendClientTypes.EducationBureau> {
  educational_institutions: BackendEducationalInstitution[]
}