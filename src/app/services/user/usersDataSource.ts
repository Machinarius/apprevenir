import { BackendClientTypes, BackendResponse, BackendUser } from "@typedefs/backend";
import { environment } from "@environments/environment";
import { ensureResponseIsSuccessful, getAuthHeaders } from "@services/common";

export function getClients(clientType: BackendClientTypes): Promise<BackendUser[]> {
  return ensureResponseIsSuccessful<BackendUser[]>(fetch(`${environment.url}/api/v1/clients?client=${clientType}`));
}

export function getUserData(userId: string | number): Promise<BackendUser> {
  return ensureResponseIsSuccessful<BackendUser>(fetch(`${environment.url}/api/v1/users/${userId}`, {
    headers: getAuthHeaders()
  }));
}

export function getAllUsers(): Promise<BackendUser[]> {
  return ensureResponseIsSuccessful<BackendUser[]>(fetch(`${environment.url}/api/v1/users`, {
    headers: getAuthHeaders()
  }));
}