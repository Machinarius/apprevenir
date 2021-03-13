import { BackendCompanyUser, BackendCompanyLocation, BackendLocationArea, BackendAreaSchedule } from "@typedefs/backend/BackendCompanyUser";
import { HierarchyNode } from "../HierarchyNode";

function buildSchedulesHierarchy(schedules: BackendAreaSchedule[]): HierarchyNode {
  return {
    label: "Horario de Trabajo",
    depth: 4,
    choices: schedules.map(schedule => ({
      key: schedule.id.toString(),
      value: schedule.schedul
    })),
    descendants: {}
  }
}

function buildAreasHierarchy(areas: BackendLocationArea[]): HierarchyNode {
  return {
    label: "Área",
    depth: 3,
    choices: areas.map(area => ({
      key: area.id.toString(),
      value: area.area
    })),
    descendants: areas.reduce((map, area) => {
      const hierarchy = buildSchedulesHierarchy(area.schedules);
      map[area.id.toString()] = hierarchy;
      return map;
    }, { })
  }
}

function buildLocationsHierarchy(locations: BackendCompanyLocation[]): HierarchyNode {
  return {
    label: "Ubicación",
    depth: 2,
    choices: locations.map(location => ({
      key: location.id.toString(),
      value: location.location
    })),
    descendants: locations.reduce((map, location) => {
      const hierarchy = buildAreasHierarchy(location.areas);
      map[location.id.toString()] = hierarchy;
      return map;
    }, {})
  }
}

export function buildCompaniesHierarchy(users: BackendCompanyUser[]): HierarchyNode {
  return {
    label: "Empresa",
    depth: 1,
    choices: users.map(company => ({ 
      key: company.id.toString(), 
      value: `${company.profile.first_names} ${company.profile.last_names}` 
    })),
    descendants: users.reduce((map, company) => {
      const hierarchy = buildLocationsHierarchy(company.locations);
      map[company.id.toString()] = hierarchy;
      return map;
    }, {})
  };
}