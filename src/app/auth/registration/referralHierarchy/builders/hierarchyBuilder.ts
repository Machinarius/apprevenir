import { BackendClientTypes, BackendCompanyUser, BackendEducationalInstitutionUser, BackendEducationBureauUser, BackendTerritorialEntityUser, BackendUniversityUser } from "@typedefs/backend";
import { HierarchyNode } from "../HierarchyNode";
import { getClients } from "@services/user/usersDataSource";
import { buildUniversitiesHierarchy } from "./universityHierarchyBuilder";
import { buildCompaniesHierarchy } from "./companyHierarchyBuilder";
import { buildTerritorialEntitiesHierarchy } from "./territorialEntityHierarchyBuilder";
import { buildEducationalInstitutionsHierarchy } from "./educationalInstitutionHierarchyBuilder";
import { buildEducationalBureausHierarchy } from "./educationalBurearuHierarchyBuilder";

export async function buildRootHierarchy(clientType: BackendClientTypes): Promise<HierarchyNode> {
  const clients = await getClients(clientType);
  switch (clientType) {
    case BackendClientTypes.University:
      return buildUniversitiesHierarchy(clients as unknown as BackendUniversityUser[]);
    case BackendClientTypes.Company:
      return buildCompaniesHierarchy(clients as unknown as BackendCompanyUser[]);
    case BackendClientTypes.TerritorialEntity:
      return buildTerritorialEntitiesHierarchy(clients as unknown as BackendTerritorialEntityUser[]);
    case BackendClientTypes.EducationalInstitution:
      return buildEducationalInstitutionsHierarchy(clients as unknown as BackendEducationalInstitutionUser[]);
    case BackendClientTypes.EducationBureau:
      return buildEducationalBureausHierarchy(clients as unknown as BackendEducationBureauUser[]);
  }

  throw new Error(`A builder for the ${clientType} has not been implemented`);
}