import { TerritorialEntityNeighborhood, TerritorialEntityUser, TerritorialEntityCommune, TerritorialEntityClientConfigData, ZoneType } from "@typedefs/backend/userData/TerritorialEntityUser";
import { HierarchyNode } from "../HierarchyNode";

const NeighborhoodTypeLabels: { [key in ZoneType]: string } = {
  [ZoneType.Rural]: "Vereda",
  [ZoneType.Urban]: "Barrio"
};

function buildNeighborhoodsHierarchy(neighborhoods: TerritorialEntityNeighborhood[], zoneType: ZoneType): HierarchyNode {
  return {
    label: NeighborhoodTypeLabels[zoneType],
    depth: 4,
    choices: neighborhoods.map(neighborhood => ({ 
      key: neighborhood.id.toString(), 
      value: neighborhood.neighborhood
    })),
    descendants: { }
  };
}

const CommuneTypeLabels: { [key in ZoneType]: string } = {
  [ZoneType.Rural]: "Corregimiento",
  [ZoneType.Urban]: "Comuna"
};

function buildCommunesHierarchy(communes: TerritorialEntityCommune[], zoneType: ZoneType): HierarchyNode {
  return {
    label: CommuneTypeLabels[zoneType],
    depth: 3,
    choices: communes.map(commune => ({ 
      key: commune.id.toString(), 
      value: commune.commune
    })),
    descendants: communes.reduce((map, commune) => {
      const hierarchy = buildNeighborhoodsHierarchy(commune.neighborhoods, zoneType);
      map[commune.id.toString()] = hierarchy;
      return map;
    }, {})
  };
}

const ZoneTypeLabels: { [key in ZoneType]: string } = {
  [ZoneType.Rural]: "Casco Rural",
  [ZoneType.Urban]: "Casco Urbano"
};

function buildZonesHierarchy(configData: TerritorialEntityClientConfigData): HierarchyNode {
  const zoneKvps: { key: ZoneType, label: string }[] = 
    Object.keys(ZoneTypeLabels)
      .map(key => ({ key: key as ZoneType, label: ZoneTypeLabels[key] }));

  return {
    label: "Zona",
    depth: 2,
    choices: zoneKvps.map(kvp => ({ 
      key: kvp.key, 
      value: kvp.label
    })),
    descendants: zoneKvps.reduce((map, zone) => {
      const hierarchy = buildCommunesHierarchy(configData[zone.key], zone.key);
      map[zone.key] = hierarchy;
      return map;
    }, {})
  };
}

export function buildTerritorialEntitiesHierarchy(users: TerritorialEntityUser[]): HierarchyNode {
  return {
    label: "Entidad Territorial",
    depth: 1,
    choices: users.map(entity => ({ 
      key: entity.id.toString(), 
      value: `${entity.profile.first_names} ${entity.profile.last_names}` 
    })),
    descendants: users.reduce((map, entity) => {
      const hierarchy = buildZonesHierarchy(entity.clientTypeConfig);
      map[entity.id.toString()] = hierarchy;
      return map;
    }, {})
  };
}