import { ClientTypes } from "./ClientTypes";
import { TimestampedObject } from "../common/TimestampedObject";
import { User } from "./User";

export interface Semester extends TimestampedObject {
  id: number,
  user_id: number,
  semester: string
}

export interface Modality extends TimestampedObject {
  id: number,
  user_id: number,
  modality: string
}

export interface Program extends TimestampedObject {
  id: number,
  user_id: number,
  program: string
}

export interface UniversityClientConfigData {
  programs: Program[],
  modalities: Modality[],
  semesters: Semester[]
}

export interface UniversityUser extends User<ClientTypes.University> {
  clientTypeConfig: UniversityClientConfigData
}