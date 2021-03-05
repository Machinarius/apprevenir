import { BackendClientTypes } from "./BackendClientTypes";
import { BackendTimestamps } from "./BackendTimestamps";
import { BackendUser } from "./BackendUser";

export interface BackendCommuneNeighborhood extends BackendTimestamps {
  id: number,
  commune_id: number,
  neighborhood: string
}

export interface BackendZoneCommunes extends BackendTimestamps {
  id: number,
  zone_id: number,
  commune: string,
  neighborhoods: BackendCommuneNeighborhood[]
}

export interface BackendTerritorialEntityZone extends BackendTimestamps {
  id: number,
  user_id: number,
  zone: string,
  communes: BackendZoneCommunes[]
}

export interface BackendTerritorialEntityUser extends BackendUser<BackendClientTypes.TerritorialEntity> {
  zones: BackendTerritorialEntityZone[]
}