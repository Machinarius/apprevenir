import { BackendModality, BackendProgram, BackendSemester, BackendUniversityUser } from "@typedefs/backend/BackendUniversityUser";
import { HierarchyNode } from "../HierarchyNode";

function buildSemestersHierarchy(semesters: BackendSemester[]): HierarchyNode {
  return {
    label: "Semestre",
    depth: 4,
    choices: semesters.map(semester => ({
      key: semester.id.toString(),
      value: semester.semester
    })),
    descendants: {}
  }
}

function buildModalitiesHierarchy(modalities: BackendModality[]): HierarchyNode {
  return {
    label: "Modalidad",
    depth: 3,
    choices: modalities.map(modality => ({
      key: modality.id.toString(),
      value: modality.modality
    })),
    descendants: modalities.reduce((map, modality) => {
      const hierarchy = buildSemestersHierarchy(modality.semesters);
      map[modality.id.toString()] = hierarchy;
      return map;
    }, {})
  }
}

function buildProgramsHierarchy(programs: BackendProgram[]): HierarchyNode {
  return {
    label: "Programa",
    depth: 2,
    choices: programs.map(program => ({
      key: program.id.toString(),
      value: program.program
    })),
    descendants: programs.reduce((map, program) => {
      const hierarchy = buildModalitiesHierarchy(program.modalities);
      map[program.id.toString()] = hierarchy;
      return map;
    }, {})
  };
}

export function buildUniversitiesHierarchy(users: BackendUniversityUser[]): HierarchyNode {
  return {
    label: "Universidad",
    depth: 1,
    choices: users.map(university => ({ 
      key: university.id.toString(), 
      value: `${university.profile.first_names} ${university.profile.last_names}` 
    })),
    descendants: users.reduce((map, university) => {
      const hierarchy = buildProgramsHierarchy(university.programs);
      map[university.id.toString()] = hierarchy;
      return map;
    }, {})
  };
}