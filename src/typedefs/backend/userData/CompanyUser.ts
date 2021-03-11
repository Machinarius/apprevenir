import { ClientTypes } from "./ClientTypes";
import { TimestampedObject } from "../common/TimestampedObject";
import { User } from "./User";

export interface CompanySchedule extends TimestampedObject {
  id: number,
  user_id: number,
  schedul: string // Typo comes from back-end
}

export interface CompanyLocationArea extends TimestampedObject {
  id: number,
  user_id: number,
  area: string
}

export interface CompanyLocation extends TimestampedObject {
  id: number,
  user_id: number,
  location: string
}

export interface CompanyClientConfigData {
  locations: CompanyLocation[],
  areas: CompanyLocationArea[],
  schedules: CompanySchedule[]
}

export interface CompanyUser extends User<ClientTypes.Company> {
  clientTypeConfig: CompanyClientConfigData
}