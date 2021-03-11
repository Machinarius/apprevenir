import { BackendCommuneNeighborhood, BackendTerritorialEntityUser, BackendTerritorialEntityZone, BackendZoneCommune } from "@typedefs/backend/BackendTerritorialEntityUser";
import { HierarchyNode } from "../HierarchyNode";

function buildNeighborhoodsHierarchy(neighborhoods: BackendCommuneNeighborhood[]) {
  return {
    label: "Barrio",
    depth: 4,
    choices: neighborhoods.map(neighborhood => ({ 
      key: neighborhood.id.toString(), 
      value: neighborhood.neighborhood
    })),
    descendants: { }
  };
}

function buildCommunesHierarchy(communes: BackendZoneCommune[]): HierarchyNode {
  return {
    label: "Comuna",
    depth: 3,
    choices: communes.map(commune => ({ 
      key: commune.id.toString(), 
      value: commune.commune
    })),
    descendants: communes.reduce((map, commune) => {
      const hierarchy = buildNeighborhoodsHierarchy(commune.neighborhoods);
      map[commune.id.toString()] = hierarchy;
      return map;
    }, {})
  };
}

function buildZonesHierarchy(zones: BackendTerritorialEntityZone[]): HierarchyNode {
  return {
    label: "Zona",
    depth: 2,
    choices: zones.map(zone => ({ 
      key: zone.id.toString(), 
      value: zone.zone
    })),
    descendants: zones.reduce((map, zone) => {
      const hierarchy = buildCommunesHierarchy(zone.communes);
      map[zone.id.toString()] = hierarchy;
      return map;
    }, {})
  };
}

export function buildTerritorialEntitiesHierarchy(users: BackendTerritorialEntityUser[]): HierarchyNode {
  return {
    label: "Entidad Territorial",
    depth: 1,
    choices: users.map(entity => ({ 
      key: entity.id.toString(), 
      value: `${entity.profile.first_names} ${entity.profile.last_names}` 
    })),
    descendants: users.reduce((map, entity) => {
      const hierarchy = buildZonesHierarchy(entity.zones);
      map[entity.id.toString()] = hierarchy;
      return map;
    }, {})
  };
}