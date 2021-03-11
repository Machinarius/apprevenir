import { ClientTypes } from "./ClientTypes";
import { TimestampedObject } from "../common/TimestampedObject";
import { User } from "./User";

export interface EducationalInstitutionGrade extends TimestampedObject {
  id: number,
  user_id: number,
  grade: string
}

export interface EducationalInstitutionClientConfigData {
  grades: EducationalInstitutionGrade[]
}

export interface EducationalInstitutionUser extends User<ClientTypes.EducationalInstitution> {
  clientTypeConfig: EducationalInstitutionClientConfigData
}