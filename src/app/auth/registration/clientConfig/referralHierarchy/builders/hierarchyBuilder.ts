import { ClientTypes, TerritorialEntityUser } from "@typedefs/backend";
import { HierarchyNode } from "../HierarchyNode";
import { getClientsOfType } from "@services/user/usersDataSource";
import { buildTerritorialEntitiesHierarchy } from "./territorialEntityHierarchyBuilder";

export async function buildRootHierarchy(clientType: ClientTypes): Promise<HierarchyNode> {
  const clients = await getClientsOfType(clientType);
  switch (clientType) {
    case ClientTypes.TerritorialEntity:
      return buildTerritorialEntitiesHierarchy(clients as unknown as TerritorialEntityUser[]);
  }

  throw new Error(`A builder for the ${clientType} client type has not been implemented`);
}