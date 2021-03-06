import { BackendClientTypes, BackendResponse, BackendUser } from "@typedefs/backend";
import { environment } from "@environments/environment";
import { ensureResponseIsSuccessful } from "@services/common";
import { getAuthToken } from "@services/auth/authStore";

export function getClients(clientType: BackendClientTypes): Promise<BackendUser[]> {
  return ensureResponseIsSuccessful<BackendUser[]>(fetch(`${environment.url}/api/v1/clients?client=${clientType}`));
}

export function getUserData(userId: number): Promise<BackendUser> {
  return ensureResponseIsSuccessful<BackendUser>(fetch(`${environment.url}/api/v1/users/${userId}`, {
    headers: {
      "Authorization": `Bearer ${getAuthToken()}`
    }
  }));
}