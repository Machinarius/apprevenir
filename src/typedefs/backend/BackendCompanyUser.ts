import { BackendClientTypes } from "./BackendClientTypes";
import { BackendTimestamps } from "./BackendTimestamps";
import { BackendUser } from "./BackendUser";

export interface BackendAreaSchedule extends BackendTimestamps {
  id: number,
  area_id: number,
  schedul: string // Typo comes from back-end
}

export interface BackendLocationArea extends BackendTimestamps {
  id: number,
  location_id: number,
  area: string,
  schedules: BackendAreaSchedule[]
}

export interface BackendCompanyLocation extends BackendTimestamps {
  id: number,
  user_id: number,
  location: string,
  areas: BackendLocationArea[]
}

export interface BackendCompanyUser extends BackendUser<BackendClientTypes.Company> {
  locations: BackendCompanyLocation[];
}