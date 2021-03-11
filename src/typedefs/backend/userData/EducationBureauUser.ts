import { ClientTypes } from "./ClientTypes";
import { TimestampedObject } from "../common/TimestampedObject";
import { User } from "./User";

export interface EducationalBureauGrade extends TimestampedObject {
  id: number,
  user_id: number,
  grade: string
}

export interface EducationalBureauEducationalInstitution extends TimestampedObject {
  id: number,
  user_id: number,
  educational_institution: string
}

export interface EducationBureauClientConfigData {
  educationalInstitutions: EducationalBureauEducationalInstitution[],
  grades: EducationalBureauGrade[]
}

export interface EducationBureauUser extends User<ClientTypes.EducationBureau> {
  clientTypeConfig: EducationBureauClientConfigData
}