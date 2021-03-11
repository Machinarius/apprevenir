import { ClientTypes, User } from "@typedefs/backend";
import { environment } from "@environments/environment";
import { ensureResponseIsSuccessful, getAuthHeaders } from "@services/common";

export function getClients(clientType: ClientTypes): Promise<User[]> {
  return ensureResponseIsSuccessful<User[]>(fetch(`${environment.url}/api/v1/clients?client=${clientType}`));
}

export function getUserData(userId: string | number): Promise<User> {
  return ensureResponseIsSuccessful<User>(fetch(`${environment.url}/api/v1/users/${userId}`, {
    headers: getAuthHeaders()
  }));
}

export function getAllUsers(): Promise<User[]> {
  return ensureResponseIsSuccessful<User[]>(fetch(`${environment.url}/api/v1/users`, {
    headers: getAuthHeaders()
  }));
}