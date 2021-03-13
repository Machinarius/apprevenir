import { BackendEducationalGrade, BackendEducationalInstitutionUser } from "@typedefs/backend/BackendEducationalInstitutionUser";
import { HierarchyNode } from "../HierarchyNode";

function buildGradesHierarchy(grades: BackendEducationalGrade[]): HierarchyNode {
  return {
    label: "Grado",
    depth: 2,
    choices: grades.map(grade => ({ 
      key: grade.id.toString(), 
      value: grade.grade
    })),
    descendants: {}
  };
}

export function buildEducationalInstitutionsHierarchy(users: BackendEducationalInstitutionUser[]): HierarchyNode {
  return {
    label: "Institución Educativa",
    depth: 1,
    choices: users.map(institution => ({ 
      key: institution.id.toString(), 
      value: `${institution.profile.first_names} ${institution.profile.last_names}` 
    })),
    descendants: users.reduce((map, institution) => {
      const hierarchy = buildGradesHierarchy(institution.educational_grades);
      map[institution.id.toString()] = hierarchy;
      return map;
    }, {})
  };
}