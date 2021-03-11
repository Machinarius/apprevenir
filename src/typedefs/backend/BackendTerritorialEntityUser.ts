import { BackendClientTypes } from "./BackendClientTypes";
import { BackendTimestamps } from "./BackendTimestamps";
import { BackendUser } from "./BackendUser";

export interface BackendCommuneNeighborhood extends BackendTimestamps {
  id: number,
  user_id: number,
  neighborhood: string
}

export interface BackendZoneCommune extends BackendTimestamps {
  id: number,
  user_id: number,
  commune: string
}

export interface BackendTerritorialEntityZone extends BackendTimestamps {
  id: number,
  user_id: number,
  zone: string
}

export interface BackendTerritorialEntityClientConfigData {
  zones: BackendTerritorialEntityZone[],
  communes: BackendZoneCommune[],
  neighborhoods: BackendCommuneNeighborhood[]
}

export interface BackendTerritorialEntityUser extends BackendUser<BackendClientTypes.TerritorialEntity> {
  clientTypeConfig: BackendTerritorialEntityClientConfigData
}