import { BackendClientTypes, BackendResponse, BackendUser } from "@typedefs/backend";
import { environment } from "@environments/environment";
import { ensureResponseIsSuccessful } from "@services/common";

export function getClients(clientType: BackendClientTypes): Promise<BackendUser[]> {
  return ensureResponseIsSuccessful<BackendUser[]>(fetch(`${environment.url}/api/v1/clients?client=${clientType}`));
}