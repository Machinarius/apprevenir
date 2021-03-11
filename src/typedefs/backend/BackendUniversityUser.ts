import { BackendClientTypes } from "./BackendClientTypes";
import { BackendTimestamps } from "./BackendTimestamps";
import { BackendUser } from "./BackendUser";

export interface BackendSemester extends BackendTimestamps {
  id: number,
  user_id: number,
  semester: string
}

export interface BackendModality extends BackendTimestamps {
  id: number,
  user_id: number,
  modality: string
}

export interface BackendProgram extends BackendTimestamps {
  id: number,
  user_id: number,
  program: string
}

export interface BackendUniversityClientConfigData {
  programs: BackendProgram[],
  modalities: BackendModality[],
  semesters: BackendSemester[]
}

export interface BackendUniversityUser extends BackendUser<BackendClientTypes.University> {
  clientTypeConfig: BackendUniversityClientConfigData
}