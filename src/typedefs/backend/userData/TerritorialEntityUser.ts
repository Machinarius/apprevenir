import { ClientTypes } from "./ClientTypes";
import { TimestampedObject } from "../common/TimestampedObject";
import { User } from "./User";

export interface TerritorialEntityNeighborhood extends TimestampedObject {
  id: number,
  user_id: number,
  neighborhood: string
}

export interface TerritorialEntityCommune extends TimestampedObject {
  id: number,
  user_id: number,
  commune: string
}

export interface TerritorialEntityZone extends TimestampedObject {
  id: number,
  user_id: number,
  zone: string
}

export interface TerritorialEntityClientConfigData {
  zones: TerritorialEntityZone[],
  communes: TerritorialEntityCommune[],
  neighborhoods: TerritorialEntityNeighborhood[]
}

export interface TerritorialEntityUser extends User<ClientTypes.TerritorialEntity> {
  clientTypeConfig: TerritorialEntityClientConfigData
}