import { BackendClientTypes } from "./BackendClientTypes";
import { BackendTimestamps } from "./BackendTimestamps";
import { BackendUser } from "./BackendUser";

export interface BackendSemester extends BackendTimestamps {
  id: number,
  modality_id: number,
  semester: string
}

export interface BackendModality extends BackendTimestamps {
  id: number,
  program_id: number,
  modality: string,
  semesters: BackendSemester[]
}

export interface BackendProgram extends BackendTimestamps {
  id: number,
  user_id: number,
  program: string,
  modalities: BackendModality[]
}

export interface BackendUniversityUser extends BackendUser<BackendClientTypes.University> {
  programs: BackendProgram[]
}