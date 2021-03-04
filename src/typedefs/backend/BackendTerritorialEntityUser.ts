import { BackendClientTypes } from "./BackendClientTypes";
import { BackendTimestamps } from "./BackendTimestamps";
import { BackendUser } from "./BackendUser";

interface BackendCommuneNeighborhood extends BackendTimestamps {
  id: number,
  commune_id: number,
  neighborhood: string
}

interface BackendZoneCommunes extends BackendTimestamps {
  id: number,
  zone_id: number,
  commune: string,
  neighborhoods: BackendCommuneNeighborhood[]
}

interface BackendCompanyZone extends BackendTimestamps {
  id: number,
  user_id: number,
  zone: string,
  communes: BackendZoneCommunes[]
}

export interface BackendTerritorialEntityUser extends BackendUser<BackendClientTypes.TerritorialEntity> {
  zones: BackendCompanyZone[]
}