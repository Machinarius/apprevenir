import { BackendClientTypes } from "./BackendClientTypes";
import { BackendTimestamps } from "./BackendTimestamps";
import { BackendUser } from "./BackendUser";

export interface BackendAreaSchedule extends BackendTimestamps {
  id: number,
  user_id: number,
  schedul: string // Typo comes from back-end
}

export interface BackendLocationArea extends BackendTimestamps {
  id: number,
  user_id: number,
  area: string
}

export interface BackendCompanyLocation extends BackendTimestamps {
  id: number,
  user_id: number,
  location: string
}

export interface BackendCompanyUserClientConfigData {
  locations: BackendCompanyLocation[],
  areas: BackendLocationArea[],
  schedules: BackendAreaSchedule[]
}

export interface BackendCompanyUser extends BackendUser<BackendClientTypes.Company> {
  clientTypeConfig: BackendCompanyUserClientConfigData
}