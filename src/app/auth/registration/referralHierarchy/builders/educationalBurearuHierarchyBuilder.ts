import { BackendEducationalInstitution, BackendEducationalInstitutionGrade, BackendEducationBureauUser } from "@typedefs/backend/BackendEducationBureauUser";
import { HierarchyNode } from "../HierarchyNode";

function buildGradesHierarchy(grades: BackendEducationalInstitutionGrade[]): HierarchyNode {
  return {
    label: "Grado",
    depth: 3,
    choices: grades.map(grade => ({ 
      key: grade.id.toString(), 
      value: grade.grade
    })),
    descendants: {}
  };
}

function buildEducationalInstitutionsHierarchy(institutions: BackendEducationalInstitution[]): HierarchyNode {
  return {
    label: "Institución Educativa",
    depth: 2,
    choices: institutions.map(institution => ({ 
      key: institution.id.toString(), 
      value: institution.educational_institution
    })),
    descendants: institutions.reduce((map, institution) => {
      const hierarchy = buildGradesHierarchy(institution.grades);
      map[institution.id.toString()] = hierarchy;
      return map;
    }, {})
  };
}

export function buildEducationalBureausHierarchy(users: BackendEducationBureauUser[]): HierarchyNode {
  return {
    label: "Secretaría de Educación",
    depth: 1,
    choices: users.map(bureau => ({ 
      key: bureau.id.toString(), 
      value: `${bureau.profile.first_names} ${bureau.profile.last_names}` 
    })),
    descendants: users.reduce((map, bureau) => {
      const hierarchy = buildEducationalInstitutionsHierarchy(bureau.educational_institutions);
      map[bureau.id.toString()] = hierarchy;
      return map;
    }, {})
  };
}
