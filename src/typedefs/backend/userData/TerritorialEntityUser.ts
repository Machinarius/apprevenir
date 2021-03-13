import { ClientTypes } from "./ClientTypes";
import { TimestampedObject } from "../common/TimestampedObject";
import { User } from "./User";

export enum CommuneType {
  Urban = "urbana",
  Rural = "rural"
}

export interface TerritorialEntityNeighborhood extends TimestampedObject {
  id: number,
  commune_id: number,
  neighborhood: string
}

export interface TerritorialEntityCommune extends TimestampedObject {
  id: number,
  user_id: number,
  commune: string,
  zone_type: CommuneType,
  neighborhoods: TerritorialEntityNeighborhood[]
}

export type TerritorialEntityClientConfigData = {
  [type in CommuneType]: TerritorialEntityCommune[]
}

export interface TerritorialEntityUser extends User<ClientTypes.TerritorialEntity> {
  clientTypeConfig: TerritorialEntityClientConfigData
}